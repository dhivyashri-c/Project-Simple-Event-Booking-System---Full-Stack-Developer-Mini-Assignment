import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name') || '';
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/events" className="navbar-brand">EventBook</Link>
      <div className="navbar-links">
        {token ? (
          <>
            <Link to="/events">Events</Link>
            {role === 'admin' ? (
              <Link to="/admin/events">Manage Events</Link>
            ) : (
              <Link to="/my-bookings">My Bookings</Link>
            )}
            <div className="navbar-user">
              <div className="user-avatar">{initials || '?'}</div>
              <span className="user-name">{name.split(' ')[0]}</span>
            </div>
            <button onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login">Sign In</Link>
            <Link to="/register" className="nav-register-btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
