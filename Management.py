

incidents = []

def add_incident():
    incident_id = input("Enter Incident ID: ")
    severity = input("Enter Severity (Low/Medium/High): ")

    incident = {
        "id": incident_id,
        "severity": severity,
        "status": "Open"
    }

    incidents.append(incident)
    print("Incident Added Successfully!")


def view_incidents():
    if len(incidents) == 0:
        print("No Incidents Found")
        return

    print("\n----- INCIDENTS -----")

    for incident in incidents:
        print(f"ID: {incident['id']}")
        print(f"Severity: {incident['severity']}")
        print(f"Status: {incident['status']}")
        print("--------------------")


def close_incident():
    incident_id = input("Enter Incident ID to Close: ")

    for incident in incidents:
        if incident["id"] == incident_id:
            incident["status"] = "Closed"
            print("Incident Closed")
            return

    print("Incident Not Found")


def dashboard():
    total = len(incidents)

    open_count = 0
    closed_count = 0

    for incident in incidents:
        if incident["status"] == "Open":
            open_count += 1
        else:
            closed_count += 1

    print("\n===== DASHBOARD =====")
    print("Total Incidents :", total)
    print("Open Incidents  :", open_count)
    print("Closed Incidents:", closed_count)
    print("=====================")


while True:

    print("""
===== SOAR MENU =====

1. Dashboard
2. Add Incident
3. View Incidents
4. Close Incident
5. Exit

=====================
""")

    choice = input("Choose Option: ")

    if choice == "1":
        dashboard()

    elif choice == "2":
        add_incident()

    elif choice == "3":
        view_incidents()

    elif choice == "4":
        close_incident()

    elif choice == "5":
        print("Exiting Program...")
        break

    else:
        print("Invalid Choice")