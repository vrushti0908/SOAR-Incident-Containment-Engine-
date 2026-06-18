from app.models.alert import AlertDB


def create_alert(db, alert_data):

    alert = AlertDB(
        alert_type=alert_data["alert_type"],
        source_ip=alert_data["source_ip"],
        severity=alert_data["severity"],
        timestamp=alert_data["timestamp"],
        status=alert_data["status"],

        # Week 2 Fields

        risk_score=alert_data.get(
            "risk_score", 0
        ),

        abuse_confidence_score=alert_data.get(
            "abuse_confidence_score", 0
        ),

        total_reports=alert_data.get(
            "total_reports", 0
        ),

        country=alert_data.get(
            "country", "Unknown"
        ),

        isp=alert_data.get(
            "isp", "Unknown"
        )
    )

    db.add(alert)
    db.commit()
    db.refresh(alert)

    return alert


def get_all_alerts(db):

    return db.query(AlertDB).all()


def get_alert_by_id(db, alert_id):

    return db.query(AlertDB).filter(
        AlertDB.id == alert_id
    ).first()


def update_alert_status(
    db,
    alert_id,
    status
):

    alert = db.query(AlertDB).filter(
        AlertDB.id == alert_id
    ).first()

    if alert:
        alert.status = status

        db.commit()
        db.refresh(alert)

    return alert