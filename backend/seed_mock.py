import os
import sys
from datetime import datetime
from dotenv import load_dotenv

sys.path.append(os.getcwd())
load_dotenv()

from database import SessionLocal, engine
import models

def seed_mock():
    print("Seeding database with MOCK data (API Rate Limit Hit)...")
    # Ensure tables exist
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if feed exists
        feed_id = "mock-data-001"
        if db.query(models.ThreatFeed).filter_by(id=feed_id).first():
            print("Mock data already exists.")
            return

        # Create Mock Feed
        feed = models.ThreatFeed(
            id=feed_id,
            name="Mock Threat Feed (API Limited)",
            description="Generated mock data because AbuseIPDB API rate limit was reached.",
            author_name="System",
            created=datetime.now(),
            lat=37.7749,
            lon=-122.4194
        )
        db.add(feed)

        # Create Mock Indicators
        indicators = [
            models.Indicator(
                indicator="192.168.1.100", type="IPv4", feed_id=feed_id,
                country="US", city="San Francisco", lat=37.7749, lon=-122.4194, 
                isp="Google LLC", severity="critical"
            ),
            models.Indicator(
                indicator="10.0.0.55", type="IPv4", feed_id=feed_id,
                country="CN", city="Beijing", lat=39.9042, lon=116.4074, 
                isp="China Telecom", severity="high"
            ),
            models.Indicator(
                indicator="172.16.0.23", type="IPv4", feed_id=feed_id,
                country="RU", city="Moscow", lat=55.7558, lon=37.6173, 
                isp="Rostelecom", severity="medium"
            ),
             models.Indicator(
                indicator="123.45.67.89", type="IPv4", feed_id=feed_id,
                country="DE", city="Berlin", lat=52.5200, lon=13.4050, 
                isp="Deutsche Telekom", severity="low"
            ),
        ]
        
        db.add_all(indicators)
        db.commit()
        print(f"Added {len(indicators)} mock indicators. Please restart backend.")
        
    except Exception as e:
        print(f"Error seeding mock: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_mock()
