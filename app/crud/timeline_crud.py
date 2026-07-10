from sqlalchemy.orm import Session
from app.models.timeline import TimelineEvent


def add_event(
    db: Session,
    incident_id: str,
    event_type: str,
    title: str,
    description: str = ""
):
    event = TimelineEvent(
        incident_id=incident_id,
        event_type=event_type,
        title=title,
        description=description,
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return event


def get_events(db: Session):

    return (
        db.query(TimelineEvent)
        .order_by(TimelineEvent.timestamp.desc())
        .all()
    )