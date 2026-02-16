from services.otx_service import OTXService
import json

s = OTXService()
print("Fetching pulses...")
pulses = s.get_pulses(limit=5)
print(f"Pulses found: {len(pulses.get('results', []))}")

for p in pulses.get('results', []):
    print(f"Pulse: {p['name']} (ID: {p['id']})")
    print("Fetching indicators...")
    inds = s.get_pulse_indicators(p['id'])
    print(f"Indicators found: {len(inds.get('results', []))}")
    for i in inds.get('results', [])[:3]:
        print(f" - {i['indicator']} ({i['type']})")
