from app.models.alert import AlertDB


def create_alert(db, alert_data):

    alert = AlertDB(**alert_data)

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


def update_alert_status(db, alert_id, status):

    alert = db.query(AlertDB).filter(
        AlertDB.id == alert_id
    ).first()

    if alert:
        alert.status = status
        db.commit()
        db.refresh(alert)

    return alert