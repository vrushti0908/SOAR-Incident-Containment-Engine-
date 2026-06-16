import requests
import os
import sys
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("ABUSEIPDB_API_KEY")

def check_ip(ip_address: str) -> dict:
    try:
        url = "https://api.abuseipdb.com/api/v2/check"

        headers = {
            "Accept": "application/json",
            "Key": API_KEY
        }

        params = {
            "ipAddress": ip_address,
            "maxAgeInDays": 90
        }

        response = requests.get(url, headers=headers, params=params, timeout=10)
        response.raise_for_status()
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

    except requests.exceptions.Timeout:
        print(f"[AbuseIPDB] Error: Request timed out for {ip_address}")
        return {"ip": ip_address, "abuse_score": 0, "total_reports": 0,
                "country": "Unknown", "isp": "Unknown", "error": "timeout"}

    except requests.exceptions.ConnectionError:
        print(f"[AbuseIPDB] Error: No internet connection")
        return {"ip": ip_address, "abuse_score": 0, "total_reports": 0,
                "country": "Unknown", "isp": "Unknown", "error": "connection_error"}

    except Exception as e:
        print(f"[AbuseIPDB] Error: {str(e)}")
        return {"ip": ip_address, "abuse_score": 0, "total_reports": 0,
                "country": "Unknown", "isp": "Unknown", "error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) > 1:
        ip = sys.argv[1]
    else:
        ip = "118.25.6.39"
    check_ip(ip)