

incidents = [
    {
        "id": 1,
        "severity": "High",
        "status": "Open",
        "timeline": [
            "Alert Generated",
            "Threat Intelligence Completed",
            "Playbook Executed"
        ]
    },
    {
        "id": 2,
        "severity": "Medium",
        "status": "Investigating",
        "timeline": [
            "Alert Generated",
            "Threat Intelligence Running"
        ]
    }
]


def dashboard():
    print("\n===== SOAR INCIDENT DASHBOARD =====")
    print(f"Total Incidents : {len(incidents)}")

    open_count = sum(1 for i in incidents if i["status"] == "Open")

    print(f"Open Incidents  : {open_count}")
    print("==================================\n")


def show_incidents():
    print("\n===== INCIDENT LIST =====")

    for incident in incidents:
        print(f"""
Incident ID : {incident['id']}
Severity    : {incident['severity']}
Status      : {incident['status']}
----------------------------
""")

    print("==========================\n")


def show_timeline():
    incident_id = int(input("Enter Incident ID: "))

    for incident in incidents:
        if incident["id"] == incident_id:

            print(f"\n===== TIMELINE FOR INCIDENT {incident_id} =====")

            for step_no, event in enumerate(incident["timeline"], start=1):
                print(f"{step_no}. {event}")

            print("====================================")
            return

    print("Incident not found.")


def main():

    while True:

        print("""
====== SOAR MENU ======

1. Dashboard
2. View Incidents
3. View Timeline
4. Exit

=======================
""")

        choice = input("Select Option: ")

        if choice == "1":
            dashboard()

        elif choice == "2":
            show_incidents()

        elif choice == "3":
            show_timeline()

        elif choice == "4":
            print("Exiting...")
            break

        else:
            print("Invalid Choice")


if __name__ == "__main__":
    main()