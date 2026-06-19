import sqlite3

incident_id = int(input("Enter Incident ID: "))

conn = sqlite3.connect("soar.db")
cursor = conn.cursor()

cursor.execute("""
SELECT
alert_type,
source_ip,
risk_score,
status
FROM alerts
WHERE id = ?
""", (incident_id,))

incident = cursor.fetchone()

if incident:


    alert_type = incident[0]
    source_ip = incident[1]
    risk_score = incident[2]
    status = incident[3]

    print("=" * 60)
    print("SOAR INCIDENT TIMELINE")
    print("=" * 60)

    print(f"• Alert Received ({alert_type})")
    print(f"• Source IP Identified ({source_ip})")
    print("• Threat Intelligence Check Started")
    print(f"• Risk Score Generated ({risk_score})")
    print("• Alert Stored in Database")
    print(f"• Status Updated ({status})")

    print("=" * 60)
    print("Timeline Complete")


else:
    print("Incident not found")

conn.close()
