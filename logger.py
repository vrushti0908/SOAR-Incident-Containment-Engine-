from datetime import datetime

def log_action(action):
    with open("action.log", "a") as f:
        f.write(f"{datetime.now()} - {action}\n")
                