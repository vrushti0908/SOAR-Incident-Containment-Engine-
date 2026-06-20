import sys
from threat_intelligence_service import analyze_ip

def calculate_risk_score(ip_address: str) -> dict:
    print(f"\n[Risk Scorer] Starting risk analysis for: {ip_address}")

    threat_data = analyze_ip(ip_address)

    abuse_score = threat_data.get("abuse_score", 0)
    vt_malicious = threat_data.get("vt_malicious", 0)
    total_reports = threat_data.get("total_reports", 0)

    # Risk score calculate karo — weighted formula
    # AbuseIPDB score = 50% weight
    # VirusTotal malicious = 35% weight  
    # Total reports = 15% weight

    abuse_contribution = (abuse_score / 100) * 50
    vt_contribution = min(vt_malicious * 3, 35)
    reports_contribution = min(total_reports / 100, 15)

    final_score = round(
        abuse_contribution + vt_contribution + reports_contribution
    )

    # Risk level decide karo
    if final_score >= 75:
        risk_level = "CRITICAL"
    elif final_score >= 50:
        risk_level = "HIGH"
    elif final_score >= 25:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    result = {
        "ip": ip_address,
        "final_risk_score": final_score,
        "risk_level": risk_level,
        "abuse_score": abuse_score,
        "vt_malicious": vt_malicious,
        "total_reports": total_reports,
        "location": f"{threat_data.get('city')}, {threat_data.get('country')}",
        "org": threat_data.get("org", "Unknown")
    }

    print(f"\n{'='*50}")
    print(f"  FINAL RISK ASSESSMENT")
    print(f"{'='*50}")
    print(f"  IP Address     : {result['ip']}")
    print(f"  Final Score    : {result['final_risk_score']}/100")
    print(f"  Risk Level     : {result['risk_level']}")
    print(f"  Location       : {result['location']}")
    print(f"  Organization   : {result['org']}")
    print(f"{'='*50}\n")

    return result

if __name__ == "__main__":
    if len(sys.argv) > 1:
        ip = sys.argv[1]
    else:
        ip = "118.25.6.39"

    calculate_risk_score(ip)