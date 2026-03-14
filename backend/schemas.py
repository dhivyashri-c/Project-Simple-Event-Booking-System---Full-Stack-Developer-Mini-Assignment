from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# Auth
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: str


# Events
class EventCreate(BaseModel):
    name: str
    date: str
    location: str


class EventOut(BaseModel):
    id: int
    name: str
    date: str
    location: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Bookings
class BookingCreate(BaseModel):
    event_id: int


class BookingOut(BaseModel):
    id: int
    event_id: int
    created_at: Optional[datetime] = None
    event: EventOut

    class Config:
        from_attributes = True
