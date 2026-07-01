timeline = [
    {
        "time": "10:00 AM",
        "event": "Alert Received",
        "status": "Completed"
    },
    {
        "time": "10:01 AM",
        "event": "Threat Intelligence Check",
        "status": "Completed"
    },
    {
        "time": "10:02 AM",
        "event": "Risk Score Generated",
        "status": "Completed"
    },
    {
        "time": "10:03 AM",
        "event": "Firewall IP Blocked",
        "status": "Completed"
    },
    {
        "time": "10:04 AM",
        "event": "Host Isolated",
        "status": "Completed"
    },
    {
        "time": "10:05 AM",
        "event": "Dashboard Updated",
        "status": "Completed"
    }
]

print("=" * 60)
print("SOAR INCIDENT TIMELINE")
print("=" * 60)

for step in timeline:
    print(f"Time   : {step['time']}")
    print(f"Event  : {step['event']}")
    print(f"Status : {step['status']}")
    print("-" * 60)

print("Timeline View Generated Successfully")
print("=" * 60)