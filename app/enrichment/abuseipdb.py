import requests
import os
import sys
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("ABUSEIPDB_API_KEY")

def check_ip(ip_address: str) -> dict:
    url = "https://api.abuseipdb.com/api/v2/check"

    headers = {
        "Accept": "application/json",
        "Key": API_KEY
    }

    params = {
        "ipAddress": ip_address,
        "maxAgeInDays": 90
    }

    response = requests.get(url, headers=headers, params=params)
    data = response.json()

    result = {
        "ip": ip_address,
        "abuse_score": data["data"]["abuseConfidenceScore"],
        "total_reports": data["data"]["totalReports"],
        "country": data["data"]["countryCode"],
        "isp": data["data"]["isp"]
    }

    print(f"[AbuseIPDB] IP        : {result['ip']}")
    print(f"[AbuseIPDB] Score     : {result['abuse_score']}")
    print(f"[AbuseIPDB] Reports   : {result['total_reports']}")
    print(f"[AbuseIPDB] Country   : {result['country']}")

    return result

if __name__ == "__main__":
    if len(sys.argv) > 1:
        ip = sys.argv[1]
    else:
        ip = "118.25.6.39"
    
    check_ip(ip)