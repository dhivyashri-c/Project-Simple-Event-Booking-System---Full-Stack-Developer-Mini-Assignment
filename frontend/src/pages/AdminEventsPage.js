import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

function AdminEventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ name: '', date: '', location: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token') || localStorage.getItem('role') !== 'admin') {
      navigate('/events');
      return;
    }
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events/');
      setEvents(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/events/${editingId}`, form);
        setMessage('Event updated.');
      } else {
        await api.post('/events/', form);
        setMessage('Event created.');
      }
      setForm({ name: '', date: '', location: '' });
      setEditingId(null);
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event) => {
    setEditingId(event.id);
    setForm({ name: event.name, date: event.date, location: event.location });
    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event? All related bookings will also be removed.')) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter((e) => e.id !== id));
      setMessage('Event deleted.');
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not delete event.');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: '', date: '', location: '' });
    setMessage('');
    setError('');
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">Manage Events</h1>
          <p className="page-subtitle">Create, edit, or delete events.</p>
        </div>

        <div className="admin-layout">
          {/* Form */}
          <div className="admin-form-card">
            <h2>{editingId ? 'Edit Event' : 'New Event'}</h2>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Event Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="e.g. Tech Conference 2026"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  name="location"
                  type="text"
                  placeholder="e.g. Dubai, UAE"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="admin-form-actions">
                <button className="btn btn-sm" type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Create Event'}
                </button>
                {editingId && (
                  <button type="button" className="btn-outline" onClick={handleCancel}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Events list */}
          <div>
            <div className="admin-list-header">
              <h2>All Events</h2>
              <span className="admin-count">{events.length}</span>
            </div>
            {loading ? (
              <p className="loading">Loading...</p>
            ) : events.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"></div>
                <h3>No events yet</h3>
                <p>Use the form to create your first event.</p>
              </div>
            ) : (
              <div className="admin-events-list">
                {events.map((event) => (
                  <div className="admin-event-row" key={event.id}>
                    <div>
                      <strong>{event.name}</strong>
                      <p className="event-meta">
                        {event.date} · {event.location}
                      </p>
                    </div>
                    <div className="admin-event-actions">
                      <button className="btn-edit" onClick={() => handleEdit(event)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(event.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminEventsPage;
