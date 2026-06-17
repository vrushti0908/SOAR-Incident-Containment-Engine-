import requests
from datetime import datetime

alert = {
    "alert_type": "Bruteforce",
    "source_ip": "192.168.1.100",
    "hostname": "Server01",
    "severity": "high",
    "timestamp": datetime.now().isoformat()
}

response = requests.post(
    "http://127.0.0.1:8000/alerts",
    json=alert
)

print("Status Code:", response.status_code)
print("Response Text:", response.text)