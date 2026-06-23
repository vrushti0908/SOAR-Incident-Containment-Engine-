def execute(alert):
    failed_attempts = alert["failed_attempts"]

    actions = []

    if failed_attempts > 20:
        actions.append("BLOCK_IP")
        actions.append("CREATE_CASE")

    elif failed_attempts > 10:
        actions.append("CREATE_CASE")

    else:
        actions.append("LOG_EVENT")

    return actions
alert = {
    "alert_type": "bruteforce",
    "failed_attempts": 25
}

print(execute(alert))