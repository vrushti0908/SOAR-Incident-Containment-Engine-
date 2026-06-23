from playbooks.bruteforce import handle_bruteforce

print(handle_bruteforce({"risk_score": 90}))  # Block IP
print(handle_bruteforce({"risk_score": 60}))  # Create Case
print(handle_bruteforce({"risk_score": 30}))  # Log Event