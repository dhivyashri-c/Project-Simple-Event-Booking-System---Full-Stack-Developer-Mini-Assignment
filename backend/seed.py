"""Run this once to create the initial admin user."""
from database import SessionLocal, engine
import models
from auth import hash_password

models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

existing = db.query(models.User).filter(models.User.email == "admin@eventbook.com").first()
if existing:
    print("Admin user already exists.")
else:
    admin = models.User(
        name="Admin",
        email="admin@eventbook.com",
        password=hash_password("admin123"),
        role="admin",
    )
    db.add(admin)
    db.commit()
    print("Admin user created: admin@eventbook.com / admin123")

db.close()
