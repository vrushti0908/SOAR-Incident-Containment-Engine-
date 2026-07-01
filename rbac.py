users = {
    "Samruddhi": "Admin",
    "Riya": "Senior Analyst",
    "Ushvi": "Analyst"
}

permissions = {
    "Admin": [
        "View Dashboard",
        "Manage Users",
        "Block IP",
        "Isolate Host",
        "View Reports"
    ],
    "Senior Analyst": [
        "View Dashboard",
        "Block IP",
        "View Reports"
    ],
    "Analyst": [
        "View Dashboard"
    ]
}

print("=" * 50)
print("SOAR ROLE-BASED ACCESS CONTROL")
print("=" * 50)

for user, role in users.items():
    print(f"\nUser : {user}")
    print(f"Role : {role}")
    print("Permissions:")

    for permission in permissions[role]:
        print("-", permission)

print("\nRBAC Check Completed")
print("=" * 50)