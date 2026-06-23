def handle_bruteforce(alert):
    risk = alert.get("risk_score", 0)

    if risk > 80:
      return "Block IP"
    elif risk > 50:
        return "Create Case"
    else:
        return "Log Event"