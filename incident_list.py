import sqlite3

conn = sqlite3.connect("soar.db")
cursor = conn.cursor()

print("\n===== ALL ALERTS IN DATABASE =====\n")

cursor.execute("""
SELECT
id,
alert_type,
source_ip,
risk_score,
status
FROM alerts
ORDER BY id
""")

rows = cursor.fetchall()

for row in rows:
    print(row)

print("\n===============================\n")

incident_id = int(input("Enter Incident ID: "))

cursor.execute("""
SELECT
id,
alert_type,
source_ip,
risk_score,
status,
country,
isp
FROM alerts
WHERE id = ?
""", (incident_id,))

incident = cursor.fetchone()

if incident:


    print("=" * 50)
    print("SOAR INCIDENT DETAILS")
    print("=" * 50)

    print(f"Incident ID   : {incident[0]}")
    print(f"Alert Type    : {incident[1]}")
    print(f"Source IP     : {incident[2]}")
    print(f"Risk Score    : {incident[3]}")
    print(f"Status        : {incident[4]}")
    print(f"Country       : {incident[5]}")
    print(f"ISP           : {incident[6]}")

    print("=" * 50)


else:
    print("Incident not found")

conn.close()
