import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("ABUSEIPDB_API_KEY")


def classify_risk(score):
    if score >= 80:
        return "Critical"
    elif score >= 50:
        return "High"
    elif score >= 20:
        return "Medium"
    return "Low"


def check_ip(ip_address: str):

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

        score = data.get("abuseConfidenceScore", 0)

        return {
            "source_ip": ip_address,
            "risk_score": score,
            "risk_level": classify_risk(score),
            "country": data.get("countryCode") or "Unknown",
            "isp": data.get("isp") or "Unknown"
        }

    except Exception as e:

        return {
            "source_ip": ip_address,
            "risk_score": 0,
            "risk_level": "Low",
            "country": "Unknown",
            "isp": "Unknown",
            "error": str(e)
        }


def enrich_alert(alert: dict):

    enrichment = check_ip(alert["source_ip"])

    alert["risk_score"] = enrichment["risk_score"]
    alert["risk_level"] = enrichment["risk_level"]
    alert["country"] = enrichment["country"]
    alert["isp"] = enrichment["isp"]

    return alert