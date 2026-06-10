def normalize_alert(data):

    source_ip = (
        data.get("source_ip")
        or data.get("src_ip")
        or data.get("ip")
    )

    if not source_ip:
        raise ValueError("IP Address Missing")

    return {
        "alert_type": data.get("alert_type"),
        "source_ip": source_ip,
        "severity": data.get("severity"),
        "timestamp": data.get("timestamp")
    }