from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user, get_current_admin
import models
import schemas
from typing import List

router = APIRouter(prefix="/events", tags=["Events"])


@router.get("/", response_model=List[schemas.EventOut])
def get_events(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Event).all()


@router.post("/", response_model=schemas.EventOut, status_code=201)
def create_event(payload: schemas.EventCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin)):
    event = models.Event(**payload.dict())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.put("/{event_id}", response_model=schemas.EventOut)
def update_event(event_id: int, payload: schemas.EventCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    event.name = payload.name
    event.date = payload.date
    event.location = payload.location
    db.commit()
    db.refresh(event)
    return event


@router.delete("/{event_id}", status_code=204)
def delete_event(event_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
