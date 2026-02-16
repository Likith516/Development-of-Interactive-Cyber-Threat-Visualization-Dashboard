from fastapi import FastAPI, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database
from services.otx_service import OTXService
from services.ipinfo_service import IPInfoService
from services.abuseipdb_service import AbuseIPDBService
from utils.mock_data import generate_mock_threats
from utils.geo_utils import get_lat_lon
from database import engine, get_db
from fastapi.middleware.cors import CORSMiddleware
import datetime
import random
import zipper

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Threat Monitor API")

# Register Download Router
app.include_router(zipper.router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

otx_service = OTXService()
ipinfo_service = IPInfoService()
abuse_service = AbuseIPDBService()

def fetch_and_store_threats(db: Session):
    print("Fetching threats from OTX, IPinfo, and AbuseIPDB...")
    total_new_indicators = 0
    try:
        # --- 1. Fetch from AbuseIPDB ---
        print("Fetching from AbuseIPDB...")
        try:
            abuse_data = abuse_service.get_blacklist(limit=25)
            if abuse_data and "data" in abuse_data:
                # Create feed for AbuseIPDB if not exists
                today_str = datetime.datetime.now().strftime("%Y-%m-%d")
                abuse_feed_id = f"abuseipdb-{today_str}"
                abuse_feed = db.query(models.ThreatFeed).filter(models.ThreatFeed.id == abuse_feed_id).first()
                if not abuse_feed:
                    abuse_feed = models.ThreatFeed(
                        id=abuse_feed_id,
                        name=f"AbuseIPDB Feed - {today_str}",
                        description="High confidence IPs from AbuseIPDB.",
                        author_name="AbuseIPDB",
                        created=datetime.datetime.now(),
                        lat=0, lon=0
                    )
                    db.add(abuse_feed)
                    db.commit()
                
                for item in abuse_data["data"]:
                    ip = item.get("ipAddress")
                    country_code = item.get("countryCode")
                    
                    # Check exist
                    if not db.query(models.Indicator).filter(models.Indicator.indicator == ip, models.Indicator.feed_id == abuse_feed_id).first():
                        lat, lon = 0.0, 0.0
                        if country_code:
                            lat, lon = get_lat_lon(country_code)
                        
                        new_ind = models.Indicator(
                            indicator=ip,
                            type="IPv4",
                            feed_id=abuse_feed_id,
                            country=country_code,
                            city="Unknown",
                            lat=lat, lon=lon,
                            isp="Unknown",
                            severity="high"
                        )
                        db.add(new_ind)
                        total_new_indicators += 1
                db.commit()
                print(f"AbuseIPDB data processed. New items: {total_new_indicators}")
        except Exception as e:
            print(f"AbuseIPDB Error: {e}")

        # --- 2. Fetch from OTX ---
        print("Fetching from OTX...")
        try:
            pulses = otx_service.get_pulses(limit=5)
            if pulses and "results" in pulses:
                for pulse in pulses["results"]:
                    feed_id = pulse["id"]
                    existing_feed = db.query(models.ThreatFeed).filter(models.ThreatFeed.id == feed_id).first()
                    if not existing_feed:
                        lat, lon = 0.0, 0.0
                        feed = models.ThreatFeed(
                            id=feed_id,
                            name=pulse["name"],
                            description=pulse.get("description", "No description"),
                            author_name=pulse["author_name"],
                            created=datetime.datetime.strptime(pulse["created"].split(".")[0], "%Y-%m-%dT%H:%M:%S"),
                            lat=lat, lon=lon
                        )
                        db.add(feed)
                        db.commit()
                        print(f"Created OTX feed: {pulse['name']}")
                        
                        # Fetch indicators
                        indicators_data = otx_service.get_pulse_indicators(feed_id)
                        if indicators_data and "results" in indicators_data:
                            count = 0
                            for ind in indicators_data["results"]:
                                if ind["type"] == "IPv4":
                                    ip = ind["indicator"]
                                    
                                    # Enrichment via IPinfo
                                    lat, lon = 0.0, 0.0
                                    city, country, isp = "Unknown", "Unknown", "Unknown"
                                    
                                    try:
                                        ip_details = ipinfo_service.get_ip_details(ip)
                                        if ip_details:
                                            if "loc" in ip_details:
                                                lat, lon = map(float, ip_details["loc"].split(","))
                                            city = ip_details.get("city", "Unknown")
                                            country = ip_details.get("country", "Unknown")
                                            isp = ip_details.get("org", "Unknown")
                                    except Exception as e:
                                        print(f"IPinfo Error for {ip}: {e}")

                                    new_ind = models.Indicator(
                                        indicator=ip,
                                        type="IPv4",
                                        feed_id=feed_id,
                                        country=country,
                                        city=city,
                                        lat=lat, lon=lon,
                                        isp=isp,
                                        severity="critical"
                                    )
                                    db.add(new_ind)
                                    count += 1
                                    total_new_indicators += 1
                                    
                                    if feed.lat == 0 and lat != 0:
                                        feed.lat = lat
                                        feed.lon = lon
                                        db.add(feed)
                            db.commit()
                            print(f"Added {count} OTX indicators.")
        except Exception as e:
            print(f"OTX Error: {e}")

    except Exception as e:
        print(f"General Error in fetch_and_store_threats: {e}")

    # --- 3. Freshness Check & Fallback ---
    # Check if we have any indicators from the last 24h
    one_day_ago = datetime.datetime.now() - datetime.timedelta(days=1)
    recent_count = db.query(models.Indicator).filter(models.Indicator.created_at >= one_day_ago).count()
    
    print(f"Recent indicators found: {recent_count}. New added this run: {total_new_indicators}")

    if recent_count == 0 and total_new_indicators == 0:
        print("No recent data found. Generating FRESH MOCK DATA to ensure liveness...")
        try:
            generate_mock_threats(db)
        except Exception as e:
            print(f"Error generating mock threats: {e}")

@app.on_event("startup")
def startup_event():
    # Initial seed of devices
    db = next(get_db())
    if not db.query(models.Device).first():
        devices = [
            models.Device(name="Router-01", ip_address="192.168.1.1", status="safe"),
            models.Device(name="Workstation-A", ip_address="192.168.1.101", status="safe"),
            models.Device(name="IoT-Camera", ip_address="192.168.1.50", status="unknown"),
        ]
        db.add_all(devices)
        db.add_all(devices)
        db.commit()
    
    # Initial seed of threats if empty
    if not db.query(models.ThreatFeed).first():
        print("No threats found. Seeding initial data...")
        from services.abuseipdb_service import AbuseIPDBService
        # Run synchronously for startup to ensure data appears immediately
        fetch_and_store_threats(db)

@app.get("/threats", response_model=List[schemas.ThreatFeedSchema])
def get_threats(db: Session = Depends(get_db)):
    return db.query(models.ThreatFeed).order_by(models.ThreatFeed.created.desc()).limit(10).all()

@app.get("/indicators", response_model=List[schemas.IndicatorSchema])
def get_indicators(db: Session = Depends(get_db)):
    return db.query(models.Indicator).filter(models.Indicator.lat != None).limit(100).all()

@app.get("/devices", response_model=List[schemas.DeviceSchema])
def get_devices(db: Session = Depends(get_db)):
    return db.query(models.Device).all()

@app.post("/refresh")
def refresh_threats(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    background_tasks.add_task(fetch_and_store_threats, db)
    return {"message": "Refresh started"}

@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    threat_count = db.query(models.ThreatFeed).count()
    indicator_count = db.query(models.Indicator).count()
    device_count = db.query(models.Device).count()
    return {
        "threats": threat_count,
        "indicators": indicator_count,
        "devices": device_count,
        "active_alerts": 0 
    }

@app.on_event("startup")
def startup_event():
    db = database.SessionLocal()
    try:
        fetch_and_store_threats(db)
    finally:
        db.close()
