from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import auth_router, events_router, bookings_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Event Booking API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(events_router.router)
app.include_router(bookings_router.router)


@app.get("/")
def root():
    return {"message": "Event Booking API is running"}
