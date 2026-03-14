import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [bookedIds, setBookedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        api.get('/events/'),
        api.get('/bookings/my'),
      ]);
      setEvents(eventsRes.data);
      setBookedIds(new Set(bookingsRes.data.map((b) => b.event_id)));
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (eventId) => {
    setBookingId(eventId);
    setMessage('');
    try {
      await api.post('/bookings/', { event_id: eventId });
      setBookedIds((prev) => new Set([...prev, eventId]));
      setMessage('Booking confirmed.');
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Booking failed. Please try again.');
    } finally {
      setBookingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">Available Events</h1>
          <p className="page-subtitle">Browse and book events below.</p>
        </div>

        {message && (
          <div className={`alert alert-banner ${message === 'Booking confirmed.' ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        {loading ? (
          <p className="loading">Loading events...</p>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"></div>
            <h3>No events available</h3>
            <p>Check back later for upcoming events.</p>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div className="event-card" key={event.id}>
                <div className="event-card-body">
                  <h3>{event.name}</h3>
                  <p className="event-meta">Date: {event.date}</p>
                  <p className="event-meta">Location: {event.location}</p>
                </div>
                <div className="event-card-footer">
                  {bookedIds.has(event.id) ? (
                    <div className="booked-badge">Booked</div>
                  ) : (
                    <button
                      className="book-btn"
                      onClick={() => handleBook(event.id)}
                      disabled={bookingId === event.id}
                    >
                      {bookingId === event.id ? 'Booking...' : 'Book Now'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default EventsPage;
