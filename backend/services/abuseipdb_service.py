import requests
import os
from datetime import datetime
from dotenv import load_dotenv
from utils.geo_utils import get_lat_lon

load_dotenv()

class AbuseIPDBService:
    BASE_URL = "https://api.abuseipdb.com/api/v2"
    
    def __init__(self):
        self.api_key = os.getenv("ABUSEIPDB_API_KEY")
        self.headers = {
            "Key": self.api_key,
            "Accept": "application/json"
        }

    def get_blacklist(self, limit=50):
        """Fetch high-confidence blacklist IPs from AbuseIPDB."""
        if not self.api_key:
            print("ABUSEIPDB_API_KEY not set.")
            return None
            
        try:
            url = f"{self.BASE_URL}/blacklist"
            params = {"limit": limit}
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching blacklist from AbuseIPDB: {e}")
            return None

    def check_ip(self, ip_address):
        """Check details for a specific IP (optional, mostly for enrichment)."""
        if not self.api_key:
            return None

        try:
            url = f"{self.BASE_URL}/check"
            params = {
                "ipAddress": ip_address,
                "maxAgeInDays": 90
            }
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error checking IP {ip_address}: {e}")
            return None
