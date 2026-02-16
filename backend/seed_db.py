import os
import sys
from dotenv import load_dotenv

sys.path.append(os.getcwd())
load_dotenv()

from database import SessionLocal
from main import fetch_and_store_threats

def seed():
    print("Seeding database with AbuseIPDB data...")
    db = SessionLocal()
    try:
        fetch_and_store_threats(db)
        print("Seeding complete.")
    except Exception as e:
        print(f"Error seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
