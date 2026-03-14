from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
import models
import schemas
from typing import List

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("/", status_code=201)
def book_event(payload: schemas.BookingCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Check event exists
    event = db.query(models.Event).filter(models.Event.id == payload.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Prevent duplicate booking
    existing = db.query(models.Booking).filter(
        models.Booking.user_id == current_user.id,
        models.Booking.event_id == payload.event_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already booked this event")

    booking = models.Booking(user_id=current_user.id, event_id=payload.event_id)
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return {"message": "Event booked successfully"}


@router.get("/my", response_model=List[schemas.BookingOut])
def my_bookings(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Booking).filter(models.Booking.user_id == current_user.id).all()
