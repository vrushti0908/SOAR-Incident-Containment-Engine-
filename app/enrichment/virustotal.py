import os
import sys
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("VIRUSTOTAL_API_KEY")


def check_ip(ip_address: str) -> dict:
    """
    Query VirusTotal and return threat intelligence data.
    """

    try:
        url = f"https://www.virustotal.com/api/v3/ip_addresses/{ip_address}"

        headers = {
            "accept": "application/json",
            "x-apikey": API_KEY
        }

        response = requests.get(
            url,
            headers=headers,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()["data"]["attributes"]

        stats = data["last_analysis_stats"]

        result = {
            "source_ip": ip_address,
            "malicious": stats.get("malicious", 0),
            "suspicious": stats.get("suspicious", 0),
            "harmless": stats.get("harmless", 0),
            "undetected": stats.get("undetected", 0),
            "reputation": data.get("reputation", 0),
            "country": data.get("country", "Unknown"),
            "network": data.get("network", "Unknown"),
            "as_owner": data.get("as_owner", "Unknown")
        }

        print("\n========== VirusTotal Report ==========")
        print(f"IP Address   : {result['source_ip']}")
        print(f"Malicious    : {result['malicious']}")
        print(f"Suspicious   : {result['suspicious']}")
        print(f"Harmless     : {result['harmless']}")
        print(f"Undetected   : {result['undetected']}")
        print(f"Reputation   : {result['reputation']}")
        print(f"Country      : {result['country']}")
        print(f"Network      : {result['network']}")
        print(f"ASN Owner    : {result['as_owner']}")
        print("=======================================\n")

        return result

    except requests.exceptions.Timeout:

        return {
            "source_ip": ip_address,
            "malicious": 0,
            "suspicious": 0,
            "harmless": 0,
            "undetected": 0,
            "reputation": 0,
            "country": "Unknown",
            "network": "Unknown",
            "as_owner": "Unknown",
            "error": "Request timed out"
        }

    except requests.exceptions.ConnectionError:

        return {
            "source_ip": ip_address,
            "malicious": 0,
            "suspicious": 0,
            "harmless": 0,
            "undetected": 0,
            "reputation": 0,
            "country": "Unknown",
            "network": "Unknown",
            "as_owner": "Unknown",
            "error": "No internet connection"
        }

    except Exception as e:

        return {
            "source_ip": ip_address,
            "malicious": 0,
            "suspicious": 0,
            "harmless": 0,
            "undetected": 0,
            "reputation": 0,
            "country": "Unknown",
            "network": "Unknown",
            "as_owner": "Unknown",
            "error": str(e)
        }


def enrich_alert(alert: dict) -> dict:
    """
    Add VirusTotal threat intelligence data to alert.
    """

    vt_data = check_ip(alert["source_ip"])

    alert["vt_malicious"] = vt_data["malicious"]
    alert["vt_suspicious"] = vt_data["suspicious"]
    alert["vt_harmless"] = vt_data["harmless"]
    alert["vt_undetected"] = vt_data["undetected"]
    alert["vt_reputation"] = vt_data["reputation"]

    return alert


if __name__ == "__main__":

    if len(sys.argv) > 1:
        ip = sys.argv[1]
    else:
        ip = "185.220.101.1"

    result = check_ip(ip)

    print(result)