import requests
import os
from dotenv import load_dotenv

load_dotenv()

class IPInfoService:
    BASE_URL = "https://ipinfo.io"

    def __init__(self):
        self.token = os.getenv("IPINFO_TOKEN")
    
    def get_ip_details(self, ip_address):
        """Fetch geolocation and details for an IP."""
        if not self.token:
            print("IPINFO_TOKEN not set.")
            return None
            
        try:
            url = f"{self.BASE_URL}/{ip_address}"
            params = {"token": self.token}
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching IP details for {ip_address}: {e}")
            return None
