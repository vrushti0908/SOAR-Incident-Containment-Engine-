import sys

from app.enrichment.abuseipdb import check_ip as abuseipdb_check
from app.enrichment.virustotal import check_ip as virustotal_check
from app.enrichment.geolocation import get_location


def analyze_ip(ip_address: str) -> dict:
    """
    Collect threat intelligence from multiple sources.
    """

    print(f"\n{'='*60}")
    print(f" Threat Intelligence Analysis : {ip_address}")
    print(f"{'='*60}")

    # AbuseIPDB
    print("\n[*] Checking AbuseIPDB...")
    abuse_data = abuseipdb_check(ip_address)

    # VirusTotal
    print("\n[*] Checking VirusTotal...")
    vt_data = virustotal_check(ip_address)
    print(vt_data)

    # Geolocation
    print("\n[*] Checking Geolocation...")
    geo_data = get_location(ip_address)

    combined_result = {

        "source_ip": ip_address,

        # AbuseIPDB
        "risk_score": abuse_data.get("risk_score", 0),
        "country": abuse_data.get("country", "Unknown"),
        "isp": abuse_data.get("isp", "Unknown"),

        # VirusTotal
        "vt_malicious": vt_data.get("malicious", 0),
        "vt_suspicious": vt_data.get("suspicious", 0),
        "vt_harmless": vt_data.get("harmless", 0),
        "vt_undetected": vt_data.get("undetected", 0),
        "vt_reputation": vt_data.get("reputation", 0),

        # Geolocation
        "city": geo_data.get("city", "Unknown"),
        "timezone": geo_data.get("timezone", "Unknown"),
        "organization": geo_data.get("org", "Unknown")
    }

    print("\n========== Combined Threat Report ==========")
    print(f"IP Address      : {combined_result['source_ip']}")
    print(f"Risk Score      : {combined_result['risk_score']}")
    print(f"Country         : {combined_result['country']}")
    print(f"ISP             : {combined_result['isp']}")
    print(f"VT Malicious    : {combined_result['vt_malicious']}")
    print(f"VT Suspicious   : {combined_result['vt_suspicious']}")
    print(f"VT Reputation   : {combined_result['vt_reputation']}")
    print(f"City            : {combined_result['city']}")
    print(f"Timezone        : {combined_result['timezone']}")
    print(f"Organization    : {combined_result['organization']}")
    print("============================================\n")

    return combined_result

def enrich_alert(alert: dict) -> dict:
    """
    Enrich an alert using all threat intelligence sources.
    """

    threat_data = analyze_ip(alert["source_ip"])

    # AbuseIPDB
    alert["risk_score"] = threat_data.get("risk_score", 0)
    alert["country"] = threat_data.get("country", "Unknown")
    alert["isp"] = threat_data.get("isp", "Unknown")

    # VirusTotal
    alert["vt_malicious"] = threat_data.get("vt_malicious", 0)
    alert["vt_suspicious"] = threat_data.get("vt_suspicious", 0)
    alert["vt_harmless"] = threat_data.get("vt_harmless", 0)
    alert["vt_undetected"] = threat_data.get("vt_undetected", 0)
    alert["vt_reputation"] = threat_data.get("vt_reputation", 0)

    # Geolocation
    alert["city"] = threat_data.get("city", "Unknown")
    alert["timezone"] = threat_data.get("timezone", "Unknown")
    alert["organization"] = threat_data.get("organization", "Unknown")

    return alert


if __name__ == "__main__":

    if len(sys.argv) > 1:
        ip = sys.argv[1]
    else:
        ip = "8.8.8.8"

    analyze_ip(ip)