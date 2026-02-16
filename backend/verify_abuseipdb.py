import os
import sys
from dotenv import load_dotenv

# Add current directory to path
sys.path.append(os.getcwd())

from services.abuseipdb_service import AbuseIPDBService

def verify_api():
    load_dotenv()
    api_key = os.getenv("ABUSEIPDB_API_KEY")
    if not api_key:
        print("ERROR: API Key not found in .env")
        return

    print(f"Using API Key: {api_key[:5]}...{api_key[-5:]}")
    
    service = AbuseIPDBService()
    print("Fetching blacklist...")
    try:
        data = service.get_blacklist(limit=5)
        if data and "data" in data:
            print("SUCCESS: API returned data.")
            print(f"Meta: {data.get('meta')}")
            print("Sample Indicators:")
            for item in data["data"]:
                print(f" - IP: {item.get('ipAddress')}, Country: {item.get('countryCode')}, Score: {item.get('abuseConfidenceScore')}")
        else:
            print("FAILURE: API returned no data or unexpected format.")
            print(data)
    except Exception as e:
        print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    verify_api()
