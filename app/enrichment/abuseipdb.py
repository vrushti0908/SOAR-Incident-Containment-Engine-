import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("ABUSEIPDB_API_KEY")
#print("API KEY =", API_KEY)


def check_ip(ip_address: str) -> dict:
    """
    Query AbuseIPDB and return enrichment data.
    """
    print("Checking IP:", ip_address)
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

        response = requests.get(
            url,
            headers=headers,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()["data"]

        result = {
            "source_ip": ip_address,
            "risk_score": data["abuseConfidenceScore"],
            "abuse_confidence_score": data["abuseConfidenceScore"],
            "total_reports": data["totalReports"],
            "country": data["countryCode"],
            "isp": data["isp"]
        }

        return result

    except requests.exceptions.Timeout:
        return {
            "source_ip": ip_address,
            "risk_score": 0,
            "abuse_confidence_score": 0,
            "total_reports": 0,
            "country": "Unknown",
            "isp": "Unknown",
            "error": "timeout"
        }

    except requests.exceptions.ConnectionError:
        return {
            "source_ip": ip_address,
            "risk_score": 0,
            "abuse_confidence_score": 0,
            "total_reports": 0,
            "country": "Unknown",
            "isp": "Unknown",
            "error": "connection_error"
        }

    except Exception as e:
        return {
            "source_ip": ip_address,
            "risk_score": 0,
            "abuse_confidence_score": 0,
            "total_reports": 0,
            "country": "Unknown",
            "isp": "Unknown",
            "error": str(e)
        }


def enrich_alert(alert: dict) -> dict:
    """
    Add threat intelligence data to alert.
    """
    print("ENRICH ALERT RECEIVED =", alert["source_ip"])
    enrichment = check_ip(alert["source_ip"])

    alert["risk_score"] = enrichment["risk_score"]
    alert["abuse_confidence_score"] = enrichment["abuse_confidence_score"]
    alert["total_reports"] = enrichment["total_reports"]
    alert["country"] = enrichment["country"]
    alert["isp"] = enrichment["isp"]

    return alert


if __name__ == "__main__":

    sample_alert = {
        "alert_type": "Brute Force",
        "source_ip": "8.8.8.8",
        "severity": "High"
    }

    enriched = enrich_alert(sample_alert)

    print("\n===== ENRICHED ALERT =====")
    print(enriched)

