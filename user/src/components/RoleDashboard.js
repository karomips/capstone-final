import React, { useEffect } from 'react';

const RoleDashboard = () => {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user.role || 'user';

    // Redirect based on role
    if (userRole === 'admin') {
      window.location.href = 'http://localhost:3001'; // Admin app
    } else {
      window.location.href = '/home'; // User dashboard
    }
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Redirecting to dashboard...</h2>
      <p>Please wait while we redirect you to the appropriate dashboard.</p>
    </div>
  );
};

export default RoleDashboard;
