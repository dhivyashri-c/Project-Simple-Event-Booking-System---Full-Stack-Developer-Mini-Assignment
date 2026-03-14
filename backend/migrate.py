"""Run this once to add the role column to the users table."""
from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user'"))
    conn.commit()
    print("Migration complete: role column added.")
