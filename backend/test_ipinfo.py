from services.ipinfo_service import IPInfoService
import sys

service = IPInfoService()
print(f"Testing IPInfo with token: {service.token}")

# Test with Google DNS
details = service.get_ip_details("8.8.8.8")
if details:
    print("Success!")
    print(details)
else:
    print("Failed to get details.")
    sys.exit(1)
