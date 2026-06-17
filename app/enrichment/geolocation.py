import requests
import os
import sys
from dotenv import load_dotenv

load_dotenv()

def get_location(ip_address: str) -> dict:
    url = f"http://ip-api.com/json/{ip_address}"

    response = requests.get(url)
    
    if response.status_code != 200:
        print(f"[Geolocation] Error: API call failed with status {response.status_code}")
        return {}

    data = response.json()

    if data.get("status") == "fail":
        print(f"[Geolocation] Error: {data.get('message', 'Unknown error')}")
        return {}

    result = {
        "ip": ip_address,
        "city": data.get("city", "Unknown"),
        "region": data.get("regionName", "Unknown"),
        "country": data.get("country", "Unknown"),
        "country_code": data.get("countryCode", "Unknown"),
        "latitude": data.get("lat", 0),
        "longitude": data.get("lon", 0),
        "org": data.get("org", "Unknown"),
        "timezone": data.get("timezone", "Unknown")
    }

    print(f"[Geolocation] IP        : {result['ip']}")
    print(f"[Geolocation] City      : {result['city']}")
    print(f"[Geolocation] Region    : {result['region']}")
    print(f"[Geolocation] Country   : {result['country']}")
    print(f"[Geolocation] Lat/Long  : {result['latitude']}, {result['longitude']}")
    print(f"[Geolocation] Timezone  : {result['timezone']}")
    print(f"[Geolocation] Org       : {result['org']}")

    return result

if __name__ == "__main__":
    if len(sys.argv) > 1:
        ip = sys.argv[1]
    else:
        ip = "118.25.6.39"

    get_location(ip)