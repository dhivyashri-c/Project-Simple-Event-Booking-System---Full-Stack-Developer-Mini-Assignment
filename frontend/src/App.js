import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import EventsPage from './pages/EventsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminEventsPage from './pages/AdminEventsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/admin/events" element={<AdminEventsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
