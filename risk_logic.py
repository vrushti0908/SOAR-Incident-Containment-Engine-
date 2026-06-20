def risk_decision(risk):
    if risk > 80:
        return "Block IP"
    elif risk > 50:
        return "Create Case"
    else:
        return "Log Event"
    