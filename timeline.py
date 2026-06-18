timeline_events = [
    "10:00 AM - Alert Received",
    "10:01 AM - Threat Intelligence Check Started",
    "10:02 AM - Risk Score Generated (90)",
    "10:03 AM - Malware Playbook Triggered",
    "10:04 AM - IP Blocked",
    "10:05 AM - Incident Added to Dashboard"
]

print("=" * 60)
print("SOAR INCIDENT TIMELINE")
print("=" * 60)

for event in timeline_events:
    print("•", event)

print("=" * 60)
print("Timeline Complete")