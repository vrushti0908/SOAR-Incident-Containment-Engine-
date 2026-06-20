import sqlite3

conn = sqlite3.connect("soar.db")
cursor = conn.cursor()

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

print("TOTAL RECORDS =", len(rows))

for row in rows:
    print(row)

conn.close()
