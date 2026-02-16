from services.otx_service import OTXService
import requests

s = OTXService()
print("Fetching pulses with broader query...")

try:
    # Try general text search without date filter
    url = f"{s.BASE_URL}/search/pulses"
    params = {"q": "malware", "limit": 5} 
    print(f"Querying: {url} with params {params}")
    response = requests.get(url, headers=s.headers, params=params)
    print(f"Status Code: {response.status_code}")
    data = response.json()
    results = data.get("results", [])
    print(f"Pulses found: {len(results)}")
    
    if results:
        for p in results[:3]:
            print(f"Pulse: {p['name']} (ID: {p['id']})")
            # Fetch indicators for this pulse
            inds_url = f"{s.BASE_URL}/pulses/{p['id']}/indicators"
            print(f"Fetching indicators from {inds_url}")
            inds_resp = requests.get(inds_url, headers=s.headers)
            inds_data = inds_resp.json()
            ipv4_count = len([i for i in inds_data.get("results", []) if i['type'] == 'IPv4'])
            print(f" - Total Indicators: {len(inds_data.get('results', []))}")
            print(f" - IPv4 Indicators: {ipv4_count}")

except Exception as e:
    print(f"Error: {e}")
