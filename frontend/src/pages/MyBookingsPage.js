import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

function MyBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    api.get('/bookings/my')
      .then((res) => setBookings(res.data))
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">My Bookings</h1>
          <p className="page-subtitle">Events you have registered for.</p>
        </div>

        {loading ? (
          <p className="loading">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"></div>
            <h3>No bookings yet</h3>
            <p>You have not booked any events.</p>
            <Link to="/events" className="btn btn-sm">Browse Events</Link>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div className="booking-row" key={booking.id}>
                <div className="booking-row-info">
                  <h3>{booking.event.name}</h3>
                  <div className="booking-row-meta">
                    <span>{booking.event.date}</span>
                    <span>{booking.event.location}</span>
                  </div>
                </div>
                <div className="booking-date">
                  <span className="booking-date-label">Booked</span>
                  <span className="booking-date-value">
                    {new Date(booking.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MyBookingsPage;
