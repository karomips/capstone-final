import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Approval from './components/Approval/Approval';
import Profile from './components/Profile/Profile';
import AdminLogin from './components/AdminLogin/AdminLogin';
import AdminProtectedRoute from './components/AdminProtectedRoute';

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    localStorage.getItem('isAdminLoggedIn') === 'true'
  );

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdminLoggedIn(localStorage.getItem('isAdminLoggedIn') === 'true');
    };

    // Listen for storage events (from other tabs/windows)
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for same-tab changes
    const interval = setInterval(handleStorageChange, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (!isAdminLoggedIn) {
    return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="*" element={<AdminLogin />} />
          </Routes>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="App">
        <AdminProtectedRoute>
          <nav style={{ padding: '20px', background: '#2D6A4F', color: 'white' }}>
            <Link to="/approve" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
              Approval Page
            </Link>
            <Link to="/profile" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
              Profile
            </Link>
            <button 
              onClick={() => {
                localStorage.clear();
                setIsAdminLoggedIn(false);
              }}
              style={{ 
                background: 'transparent', 
                border: '1px solid white', 
                color: 'white', 
                padding: '5px 10px',
                cursor: 'pointer',
                marginLeft: '20px'
              }}
            >
              Logout
            </button>
          </nav>
          <Routes>
            <Route path="/approve" element={<Approval />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Approval />} />
          </Routes>
        </AdminProtectedRoute>
      </div>
    </Router>
  );
}

export default App;
