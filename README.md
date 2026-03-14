# EventBook — Simple Event Booking System

A full-stack event booking application built with React and FastAPI.

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 19, React Router, Axios           |
| Backend  | FastAPI, SQLAlchemy, python-jose, bcrypt|
| Database | PostgreSQL                              |
| Auth     | JWT (Bearer token)                      |

## Features

- User registration and login with JWT authentication
- Browse available events (name, date, location)
- Book an event — duplicate bookings are prevented
- View personal bookings in My Bookings page
- Admin panel to create, edit, and delete events

## Database Schema

```
Users:    id, name, email, password, role, created_at
Events:   id, name, date, location, created_at
Bookings: id, user_id, event_id, created_at
```

---

## Setup Instructions

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL running locally

---

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd vpearl
```

---

### 2. Database Setup

Open your PostgreSQL client and create the database:

```sql
CREATE DATABASE event_booking;
```

---

### 3. Backend Setup

Open a terminal and run:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
# macOS / Linux
python -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```env
DATABASE_URL=postgresql+psycopg2://<user>:<password>@localhost:5432/event_booking
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

> Replace `<user>` and `<password>` with your PostgreSQL credentials.

Seed the admin user (run once):

```bash
python seed.py
```

Start the backend server:

```bash
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

---

### 4. Frontend Setup

Open a **new terminal** and run:

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

### 5. Running Both Together

You need **two terminals open at the same time**:

| Terminal | Command                        | URL                       |
|----------|--------------------------------|---------------------------|
| 1        | `cd backend && uvicorn main:app --reload` | http://localhost:8000 |
| 2        | `cd frontend && npm start`     | http://localhost:3000     |

Open `http://localhost:3000` in your browser once both are running.

---

### Default Admin Credentials

After running `seed.py`, use these credentials to log in as admin:

```
Email:    admin@eventbook.com
Password: admin123
```

---

## API Endpoints

| Method | Endpoint           | Description                  | Auth     |
|--------|--------------------|------------------------------|----------|
| POST   | /auth/register     | Register a new user          | No       |
| POST   | /auth/login        | Login and receive JWT token  | No       |
| GET    | /events/           | List all events              | Required |
| POST   | /events/           | Create an event              | Admin    |
| PUT    | /events/{id}       | Update an event              | Admin    |
| DELETE | /events/{id}       | Delete an event              | Admin    |
| POST   | /bookings/         | Book an event                | Required |
| GET    | /bookings/my       | Get current user's bookings  | Required |

---

## Project Structure

```
vpearl/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── auth.py
│   ├── seed.py
│   ├── requirements.txt
│   ├── .env               # not tracked by git
│   └── routers/
│       ├── auth_router.py
│       ├── events_router.py
│       └── bookings_router.py
└── frontend/
    └── src/
        ├── App.js
        ├── api.js
        ├── index.css
        ├── components/
        │   └── Navbar.js
        └── pages/
            ├── LoginPage.js
            ├── RegisterPage.js
            ├── EventsPage.js
            ├── MyBookingsPage.js
            └── AdminEventsPage.js
```
