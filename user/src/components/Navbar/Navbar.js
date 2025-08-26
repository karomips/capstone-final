// Navbar.js
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const handleSignOut = () => {
    // Clear all user data and role information
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    alert('Signed out!');
    window.location.href = '/login';
  };

  return (
    <aside className="sidenav">
      <div className="sidenav-brand">
        <div className="brand-container">
          <img 
            src="/barangay_logo.png" 
            alt="Barangay Mangan-vaca Logo"
            className="sidenav-logo"
          />
          <h1 className="brand-text">Mangan-vaca Job Portal</h1>
        </div>
      </div>

      <ul className="sidenav-links">
        <li><NavLink to="/home" activeClassName="active">Home</NavLink></li>
        <li><NavLink to="/jobs" activeClassName="active">Jobs</NavLink></li>
        <li><NavLink to="/post-job" activeClassName="active">Post a Job</NavLink></li>
        <li><NavLink to="/contact" activeClassName="active">Contact</NavLink></li>
        <li><NavLink to="/messages" activeClassName="active">Messages</NavLink></li>
      </ul>

      <div className="sidenav-actions">
        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Navbar;
