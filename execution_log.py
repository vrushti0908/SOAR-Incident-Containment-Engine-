from date time import datetime

def log_execution(action):
    with open("actions.log", "a") as f:
        f.write(
            f"{datetime.now()} - {action}\n"
        )
