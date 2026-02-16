import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import models

def generate_mock_threats(db: Session):
    """Generates fresh mock threat data for demonstration."""
    print("Generating fresh MOCK data...")
    
    today_str = datetime.now().strftime("%Y-%m-%d")
    feed_id = f"mock-fresh-{today_str}"
    
    # Check if we already mocked today to avoid duplicates
    if db.query(models.ThreatFeed).filter_by(id=feed_id).first():
        print("Mock data for today already exists.")
        return

    # Create Feed
    feed = models.ThreatFeed(
        id=feed_id,
        name=f"Live Threat Simulator - {today_str}",
        description="Real-time simulated threat feed for system verification.",
        author_name="System AI",
        created=datetime.now(),
        lat=0, lon=0
    )
    db.add(feed)
    
    # Curated list of realistic Mock IPs and Locations
    mock_data_points = [
        ("192.168.45.12", "US", "New York", 40.7128, -74.0060, "DigitalOcean"),
        ("10.0.5.23", "CN", "Shanghai", 31.2304, 121.4737, "China Unicom"),
        ("172.16.89.4", "RU", "Saint Petersburg", 59.9343, 30.3351, "Rostelecom"),
        ("203.0.113.5", "BR", "Sao Paulo", -23.5505, -46.6333, "Telefonica Brasil"),
        ("198.51.100.2", "DE", "Frankfurt", 50.1109, 8.6821, "Deutsche Telekom"),
        ("45.33.22.11", "IN", "Bangalore", 12.9716, 77.5946, "Bharti Airtel"),
        ("185.100.20.50", "FR", "Paris", 48.8566, 2.3522, "Orange"),
        ("91.200.12.4", "GB", "London", 51.5074, -0.1278, "BT Group"),
        ("103.45.12.99", "AU", "Sydney", -33.8688, 151.2093, "Telstra"),
        ("211.55.66.77", "JP", "Tokyo", 35.6895, 139.6917, "NTT Communications"),
        ("5.188.20.10", "NL", "Amsterdam", 52.3676, 4.9041, "KPN"),
        ("77.88.99.00", "TR", "Istanbul", 41.0082, 28.9784, "Turkcell")
    ]
    
    # Randomly select some
    selected_threats = random.sample(mock_data_points, k=random.randint(5, 10))
    
    for i, (ip, cc, city, lat, lon, isp) in enumerate(selected_threats):
        # Add slight random jitter to location so they don't stack perfectly if same city
        lat_jitter = lat + random.uniform(-0.05, 0.05)
        lon_jitter = lon + random.uniform(-0.05, 0.05)
        
        # Randomize severity
        severity = random.choice(["medium", "high", "critical"])
        
        ind = models.Indicator(
            indicator=ip,
            type="IPv4",
            feed_id=feed_id,
            country=cc,
            city=city,
            lat=lat_jitter,
            lon=lon_jitter,
            isp=isp,
            severity=severity,
            created_at=datetime.now() # FRESH timestamp
        )
        db.add(ind)
        
        # Center feed on first item
        if i == 0:
            feed.lat = lat_jitter
            feed.lon = lon_jitter
            db.add(feed)

    db.commit()
    print("Fresh mock data generated successfully.")
