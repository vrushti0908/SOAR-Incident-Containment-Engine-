from dateutil import parser


def normalize_timestamp(timestamp):

    try:
        dt = parser.parse(timestamp)

        return dt.strftime("%Y-%m-%dT%H:%M:%SZ")

    except Exception:
        return timestamp


def normalize_alert(data):

    source_ip = (
        data.get("source_ip")
        or data.get("src_ip")
        or data.get("ip")
    )

    return {
        "alert_type": data.get("alert_type"),
        "source_ip": source_ip,
        "severity": data.get("severity"),
        "timestamp": normalize_timestamp(
            data.get("timestamp")
        ),
        # Playbook-specific fields. failed_attempts in particular was being
        # silently dropped here before -- bruteforce_playbook() always saw 0
        # regardless of what the SIEM/caller actually sent, so blocking
        # never triggered off failed_attempts even when it should have.
        "failed_attempts": data.get("failed_attempts", 0),
        "host_id": data.get("host_id")
    }