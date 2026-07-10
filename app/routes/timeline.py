from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models.database import SessionLocal
from app.models.timeline import TimelineEvent

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/timeline")
def get_timeline(db: Session = Depends(get_db)):

    events = (
        db.query(TimelineEvent)
        .order_by(TimelineEvent.timestamp.desc())
        .all()
    )

    return [
        {
            "id": e.incident_id,
            "title": e.title,
            "description": e.description,
            "time": e.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "type": e.event_type,
        }
        for e in events
    ]