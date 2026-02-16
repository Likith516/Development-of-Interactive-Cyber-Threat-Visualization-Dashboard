import requests
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

class OTXService:
    BASE_URL = "https://otx.alienvault.com/api/v1"
    
    def __init__(self):
        self.api_key = os.getenv("OTX_API_KEY")
        self.headers = {
            "X-OTX-API-KEY": self.api_key,
            "Content-Type": "application/json"
        }

    def get_pulses(self, limit=10):
        """Fetch latest threat pulses from OTX."""
        try:
            # Use search/pulses with a generic query to ensure results
            # optimized for freshness
            seven_days_ago = (datetime.now() - datetime.timedelta(days=7)).isoformat()
            url = f"{self.BASE_URL}/search/pulses"
            params = {
                "q": "malware", 
                "limit": limit, 
                "sort": "-modified",
                "modified_since": seven_days_ago
            }
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching pulses: {e}")
            return None

    def get_pulse_indicators(self, pulse_id):
        """Fetch indicators for a specific pulse."""
        try:
            url = f"{self.BASE_URL}/pulses/{pulse_id}/indicators"
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching indicators for pulse {pulse_id}: {e}")
            return None
