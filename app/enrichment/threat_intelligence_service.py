import sys
from abuseipdb import check_ip as abuseipdb_check
from virustotal import check_ip as virustotal_check
from geolocation import get_location

def analyze_ip(ip_address: str) -> dict:
    print(f"\n{'='*50}")
    print(f"  Analyzing IP: {ip_address}")
    print(f"{'='*50}\n")

    print("[*] Checking AbuseIPDB...")
    abuse_data = abuseipdb_check(ip_address)

    print("\n[*] Checking VirusTotal...")
    vt_data = virustotal_check(ip_address)

    print("\n[*] Checking Geolocation...")
    geo_data = get_location(ip_address)

    combined_result = {
        "ip": ip_address,
        "abuse_score": abuse_data.get("abuse_score", 0),
        "total_reports": abuse_data.get("total_reports", 0),
        "vt_malicious": vt_data.get("malicious", 0),
        "vt_suspicious": vt_data.get("suspicious", 0),
        "city": geo_data.get("city", "Unknown"),
        "country": geo_data.get("country", "Unknown"),
        "org": geo_data.get("org", "Unknown"),
        "timezone": geo_data.get("timezone", "Unknown")
    }

    print(f"\n{'='*50}")
    print(f"  COMBINED THREAT REPORT")
    print(f"{'='*50}")
    print(f"  IP Address    : {combined_result['ip']}")
    print(f"  Abuse Score   : {combined_result['abuse_score']}/100")
    print(f"  Total Reports : {combined_result['total_reports']}")
    print(f"  VT Malicious  : {combined_result['vt_malicious']}")
    print(f"  VT Suspicious : {combined_result['vt_suspicious']}")
    print(f"  Location      : {combined_result['city']}, {combined_result['country']}")
    print(f"  Organization  : {combined_result['org']}")
    print(f"  Timezone      : {combined_result['timezone']}")
    print(f"{'='*50}\n")

    return combined_result

if __name__ == "__main__":
    if len(sys.argv) > 1:
        ip = sys.argv[1]
    else:
        ip = "118.25.6.39"

    analyze_ip(ip)