import requests
import os
import sys
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("VIRUSTOTAL_API_KEY")

def check_ip(ip_address: str) -> dict:
    url = f"https://www.virustotal.com/api/v3/ip_addresses/{ip_address}"

    headers = {
        "accept": "application/json",
        "x-apikey": API_KEY
    }

    response = requests.get(url, headers=headers)
    data = response.json()

    stats = data["data"]["attributes"]["last_analysis_stats"]

    result = {
        "ip": ip_address,
        "malicious": stats["malicious"],
        "suspicious": stats["suspicious"],
        "harmless": stats["harmless"],
        "undetected": stats["undetected"]
    }

    print(f"[VirusTotal] IP         : {result['ip']}")
    print(f"[VirusTotal] Malicious  : {result['malicious']}")
    print(f"[VirusTotal] Suspicious : {result['suspicious']}")
    print(f"[VirusTotal] Harmless   : {result['harmless']}")

    return result

if __name__ == "__main__":
    if len(sys.argv) > 1:
        ip = sys.argv[1]
    else:
        ip = "118.25.6.39"
    
    check_ip(ip)