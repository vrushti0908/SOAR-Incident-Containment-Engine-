import sys
from threat_intelligence_service import analyze_ip


def calculate_risk_score(
    ip_address: str,
    failed_attempts: int = 0
) -> dict:

    print(f"\n[Risk Scorer] Starting risk analysis for: {ip_address}")

    threat_data = analyze_ip(ip_address)

    abuse_score = threat_data.get("abuse_score", 0)
    vt_malicious = threat_data.get("vt_malicious", 0)
    total_reports = threat_data.get("total_reports", 0)

    # ----------------------------
    # Threat Intelligence Score
    # ----------------------------

    abuse_contribution = (abuse_score / 100) * 50
    vt_contribution = min(vt_malicious * 3, 35)
    reports_contribution = min(total_reports / 100, 15)

    final_score = round(
        abuse_contribution +
        vt_contribution +
        reports_contribution
    )

    # ----------------------------
    # Brute Force Behaviour Score
    # ----------------------------

    if failed_attempts >= 50:

        final_score = max(final_score, 100)

    elif failed_attempts >= 20:

        final_score = max(final_score, 90)

    elif failed_attempts >= 10:

        final_score = max(final_score, 70)

    elif failed_attempts >= 5:

        final_score = max(final_score, 50)

    elif failed_attempts >= 1:

        final_score = max(final_score, 20)

    # ----------------------------
    # Risk Level
    # ----------------------------

    if final_score >= 80:

        risk_level = "CRITICAL"

    elif final_score >= 60:

        risk_level = "HIGH"

    elif final_score >= 40:

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

        "failed_attempts": failed_attempts,

        "location": f"{threat_data.get('city')}, {threat_data.get('country')}",

        "org": threat_data.get("org", "Unknown")

    }

    print("\n" + "=" * 55)
    print("        FINAL RISK ASSESSMENT")
    print("=" * 55)
    print(f"IP Address       : {result['ip']}")
    print(f"Failed Attempts  : {failed_attempts}")
    print(f"Abuse Score      : {abuse_score}")
    print(f"VT Malicious     : {vt_malicious}")
    print(f"Reports          : {total_reports}")
    print(f"Final Score      : {final_score}/100")
    print(f"Risk Level       : {risk_level}")
    print(f"Location         : {result['location']}")
    print(f"Organization     : {result['org']}")
    print("=" * 55)

    return result


if __name__ == "__main__":

    if len(sys.argv) > 2:

        ip = sys.argv[1]
        failed_attempts = int(sys.argv[2])

    elif len(sys.argv) > 1:

        ip = sys.argv[1]
        failed_attempts = 0

    else:

        ip = "118.25.6.39"
        failed_attempts = 25

    calculate_risk_score(ip, failed_attempts)