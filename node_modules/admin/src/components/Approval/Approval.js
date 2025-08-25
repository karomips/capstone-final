import React, { useEffect, useState } from 'react';
import './Approval.css';

function Approve() {
  const [uploads, setUploads] = useState([]);
  const [users, setUsers] = useState([]);
  const [adminRegisters, setAdminRegisters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [view, setView] = useState('users'); // 'users' | 'uploads' | 'adminregisters'

  useEffect(() => {
    // Fetch user registrations
    fetch('http://localhost:5000/api/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data.success ? data.users : []);
      })
      .catch(() => setActionMsg('Error fetching users'));

    // Fetch admin registrations
    fetch('http://localhost:5000/api/admin/registrations')
      .then(res => res.json())
      .then(data => {
        setAdminRegisters(data.success ? data.requests : []);
      })
      .catch(() => setActionMsg('Error fetching admin registers'));

    // Fetch uploads
    fetch('http://localhost:5000/api/uploads/pending')
      .then(res => res.json())
      .then(data => {
        setUploads(data.success ? data.uploads : []);
      })
      .catch(() => setActionMsg('Error fetching uploads'))
      .finally(() => setLoading(false));
  }, []);

  const handleUserAction = async (userId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/user/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        setUsers(prev => prev.filter(user => user._id !== userId));
        setActionMsg(`User ${status === 'approved' ? 'approved' : 'rejected'}!`);
      } else {
        setActionMsg(data.message || 'Error updating user status');
      }
    } catch (error) {
      setActionMsg('Error updating user status');
    }
    setTimeout(() => setActionMsg(''), 2000);
  };

  const handleUploadAction = async (uploadId, status) => {
    try {
      const upload = uploads.find(u => u.id === uploadId);
      const response = await fetch(`http://localhost:5000/api/upload/${uploadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status,
          userId: upload?.user?.id 
        }),
      });
      const data = await response.json();
      if (data.success) {
        setUploads(prev => prev.filter(upload => upload.id !== uploadId));
        setActionMsg(`Upload ${status === 'approved' ? 'approved' : 'rejected'}!`);
      } else {
        setActionMsg(data.message || 'Error updating upload status');
      }
    } catch (error) {
      setActionMsg('Error updating upload status');
    }
    setTimeout(() => setActionMsg(''), 2000);
  };

  const handleAdminAction = async (registerId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/registration/${registerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        setAdminRegisters(prev => prev.filter(reg => reg._id !== registerId));
        setActionMsg(
          status === 'approved'
            ? 'Admin approved and moved to users!'
            : `Admin registration ${status}!`
        );
      } else {
        setActionMsg(data.message || 'Error updating status');
      }
    } catch (error) {
      setActionMsg('Error updating status');
    }
    setTimeout(() => setActionMsg(''), 2000);
  };

  const downloadFile = (uploadId, filename) => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000/api/upload/download/${uploadId}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Background Animation */}
      <div className="approval-bg-animated">
        <div className="approval-bg-bubble b1"></div>
        <div className="approval-bg-bubble b2"></div>
        <div className="approval-bg-bubble b3"></div>
        <div className="approval-bg-bubble b4"></div>
      </div>

      <div className="approval-main-content">
        {/* Welcome Section */}
        <section className="approval-welcome-section">
          <div className="welcome-header">
            <img 
              src="/barangay_logo.png" 
              alt="Barangay Mangan-vaca Logo" 
              className="welcome-logo"
            />
            <div className="welcome-text">
              <h1>Admin Approval Panel</h1>
              <p>Manage user registrations, uploads, and admin requests</p>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="approval-stats-grid">
          <div className="approval-stats-container">
            <h2>Pending Users</h2>
            <p className="stats-count">{users.length}</p>
          </div>
          
          <div className="approval-stats-container">
            <h2>Pending Uploads</h2>
            <p className="stats-count">{uploads.length}</p>
          </div>
          
          <div className="approval-stats-container">
            <h2>Admin Requests</h2>
            <p className="stats-count">{adminRegisters.length}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="approval-nav-tabs">
          <button
            className={`approval-tab ${view === 'users' ? 'active' : ''}`}
            onClick={() => setView('users')}
          >
            User Registrations ({users.length})
          </button>
          <button
            className={`approval-tab ${view === 'uploads' ? 'active' : ''}`}
            onClick={() => setView('uploads')}
          >
            File Uploads ({uploads.length})
          </button>
          <button
            className={`approval-tab ${view === 'adminregisters' ? 'active' : ''}`}
            onClick={() => setView('adminregisters')}
          >
            Admin Requests ({adminRegisters.length})
          </button>
        </div>

        {/* Action Message */}
        {actionMsg && (
          <div className="approval-action-msg">
            {actionMsg}
          </div>
        )}

        {/* Content Area */}
        <div className="approval-content-area">
          {loading ? (
            <div className="approval-loading">
              <div className="spinner">
                <div className="lds-dual-ring"></div>
              </div>
              <p>Loading data...</p>
            </div>
          ) : (
            <>
              {view === 'users' && (
                <div className="approval-section">
                  <h3>User Registrations</h3>
                  {users.length === 0 ? (
                    <div className="no-data">
                      <p>No pending user registrations.</p>
                    </div>
                  ) : (
                    <div className="approval-grid">
                      {users.map(user => (
                        <div key={user._id} className="approval-card">
                          <div className="card-header">
                            <h4>{user.name || 'N/A'}</h4>
                            <span className={`status-badge ${user.status || 'pending'}`}>
                              {user.status || 'pending'}
                            </span>
                          </div>
                          <div className="card-content">
                            <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                          </div>
                          <div className="card-actions">
                            <button
                              onClick={() => handleUserAction(user._id, 'approved')}
                              className="action-btn approve"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUserAction(user._id, 'rejected')}
                              className="action-btn reject"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {view === 'uploads' && (
                <div className="approval-section">
                  <h3>File Uploads</h3>
                  {uploads.length === 0 ? (
                    <div className="no-data">
                      <p>No pending file uploads.</p>
                    </div>
                  ) : (
                    <div className="approval-grid">
                      {uploads.map(upload => (
                        <div key={upload.id} className="approval-card">
                          <div className="card-header">
                            <h4>{upload.filename || 'N/A'}</h4>
                            <span className={`status-badge ${upload.status || 'pending'}`}>
                              {upload.status || 'pending'}
                            </span>
                          </div>
                          <div className="card-content">
                            <p><strong>User:</strong> {upload.user?.email || 'N/A'}</p>
                            <p><strong>Upload Date:</strong> {upload.uploadDate ? new Date(upload.uploadDate).toLocaleDateString() : 'N/A'}</p>
                            <button
                              onClick={() => downloadFile(upload.id, upload.filename)}
                              className="download-btn"
                            >
                              📄 Download File
                            </button>
                          </div>
                          <div className="card-actions">
                            <button
                              onClick={() => handleUploadAction(upload.id, 'approved')}
                              className="action-btn approve"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUploadAction(upload.id, 'rejected')}
                              className="action-btn reject"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {view === 'adminregisters' && (
                <div className="approval-section">
                  <h3>Admin Registration Requests</h3>
                  {adminRegisters.length === 0 ? (
                    <div className="no-data">
                      <p>No pending admin registration requests.</p>
                    </div>
                  ) : (
                    <div className="approval-grid">
                      {adminRegisters.map(reg => (
                        <div key={reg._id} className="approval-card">
                          <div className="card-header">
                            <h4>{reg.name || 'N/A'}</h4>
                            <span className={`status-badge ${reg.status || 'pending'}`}>
                              {reg.status || 'pending'}
                            </span>
                          </div>
                          <div className="card-content">
                            <p><strong>Email:</strong> {reg.email || 'N/A'}</p>
                          </div>
                          <div className="card-actions">
                            <button
                              onClick={() => handleAdminAction(reg._id, 'approved')}
                              className="action-btn approve"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAdminAction(reg._id, 'rejected')}
                              className="action-btn reject"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Approve;
