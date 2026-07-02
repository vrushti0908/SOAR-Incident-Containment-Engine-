import time
import random
import requests

API_URL = "http://127.0.0.1:8000/alerts"

ALERTS = [
    {
        "alert_type": "Brute Force",
        "source_ip": "185.220.101.1",
        "severity": "Critical",
        "failed_attempts": 35
    },
    {
        "alert_type": "Malware",
        "source_ip": "91.23.66.10",
        "severity": "High",
        "failed_attempts": 15
    },
    {
        "alert_type": "Brute Force",
        "source_ip": "198.51.100.25",
        "severity": "Medium",
        "failed_attempts": 7
    },
    {
        "alert_type": "Malware",
        "source_ip": "45.12.56.78",
        "severity": "Critical",
        "failed_attempts": 0
    }
]

print("=" * 60)
print("SOAR SIEM Simulator Started")
print("=" * 60)

while True:

    alert = random.choice(ALERTS)

    try:
        response = requests.post(API_URL, json=alert)

        print(f"\n[{time.strftime('%H:%M:%S')}] Alert Sent")
        print(f"Type      : {alert['alert_type']}")
        print(f"IP        : {alert['source_ip']}")
        print(f"Severity  : {alert['severity']}")
        print(f"Attempts  : {alert['failed_attempts']}")
        print(f"Response  : {response.status_code}")

        if response.ok:
            print(response.json())

    except Exception as e:
        print("Error:", e)

    time.sleep(10)