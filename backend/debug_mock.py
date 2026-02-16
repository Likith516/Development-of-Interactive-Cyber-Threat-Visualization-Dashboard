from main import fetch_and_store_threats, get_db
import logging

# Setup logging
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

db = next(get_db())
print("Running fetch_and_store_threats...")
try:
    fetch_and_store_threats(db)
    print("Done.")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
