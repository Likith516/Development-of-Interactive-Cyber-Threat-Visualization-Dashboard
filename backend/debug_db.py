import os
import sys
from dotenv import load_dotenv

sys.path.append(os.getcwd())
load_dotenv()

from database import SessionLocal, engine
import models

def check_data():
    print(f"Checking database connected to: {engine.url}")
    db = SessionLocal()
    try:
        threats_count = db.query(models.ThreatFeed).count()
        indicators_count = db.query(models.Indicator).count()
        print(f"ThreatFeeds: {threats_count}")
        print(f"Indicators: {indicators_count}")
        
        if indicators_count > 0:
            print("First 3 Indicators:")
            for i in db.query(models.Indicator).limit(3).all():
                print(f" - {i.indicator} ({i.severity})")
    except Exception as e:
        print(f"Error checking DB: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_data()
