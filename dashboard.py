import sqlite3

conn = sqlite3.connect("soar.db")
cursor = conn.cursor()

# Dashboard Counts
cursor.execute("SELECT COUNT(*) FROM alerts")
total_alerts = cursor.fetchone()[0]

cursor.execute(
    "SELECT COUNT(*) FROM alerts WHERE severity='High'"
)
high_risk = cursor.fetchone()[0]

cursor.execute(
    "SELECT COUNT(*) FROM alerts WHERE status='Closed'"
)
blocked_ips = cursor.fetchone()[0]

print("=" * 40)
print("      SOAR INCIDENT DASHBOARD")
print("=" * 40)

print(f"Total Alerts      : {total_alerts}")
print(f"High Risk Alerts  : {high_risk}")
print(f"Closed Alerts     : {blocked_ips}")

print("\nRecent Incidents")
print("-" * 40)

cursor.execute("""
SELECT id, source_ip, severity
FROM alerts
ORDER BY id DESC
LIMIT 5
""")

incidents = cursor.fetchall()

for incident in incidents:
    print(
        f"ID: {incident[0]} | "
        f"IP: {incident[1]} | "
        f"Severity: {incident[2]}"
    )

conn.close()