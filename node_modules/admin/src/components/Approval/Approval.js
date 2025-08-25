import React, { useEffect, useState } from 'react';
import './Approve.css';

function Approve() {
  const [uploads, setUploads] = useState([]);
  const [users, setUsers] = useState([]);
  const [adminRegisters, setAdminRegisters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [view, setView] = useState('users'); // 'users' | 'uploads' | 'adminregisters'

  useEffect(() => {
    // Fetch user registrations
fetch('http://localhost:5000/api/admin/registrations')
  .then(res => res.json())
  .then(data => {
    setAdminRegisters(data.success ? data.requests : []);
  })
  .catch(() => setActionMsg('Error fetching admin registers'))
  .finally(() => setLoading(false));

    // Fetch uploads
    fetch('http://localhost:5000/api/admin/uploads')
      .then(res => res.json())
      .then(data => {
        setUploads(data.success ? data.uploads : []);
      })
      .catch(() => setActionMsg('Error fetching uploads'));

    // Fetch admin registers
    fetch('http://localhost:5000/api/adminregisters')
      .then(res => res.json())
      .then(data => {
        setAdminRegisters(data.success ? data.adminregisters : []);
      })
      .catch(() => setActionMsg('Error fetching admin registers'))
      .finally(() => setLoading(false));
  }, []);

  const handleUserAction = async (userId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/registration/${userId}`, {
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
      const response = await fetch(`http://localhost:5000/api/admin/upload/${uploadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        setUploads(prev => prev.filter(upload => upload._id !== uploadId));
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

  return (
    <div className="approve-container">
      <h2>Admin Approval Panel</h2>
      <div style={{ marginBottom: '16px' }}>
        <button
          className={view === 'users' ? 'approve-btn active' : 'approve-btn'}
          onClick={() => setView('users')}
        >
          User Registrations
        </button>
        <button
          className={view === 'uploads' ? 'approve-btn active' : 'approve-btn'}
          onClick={() => setView('uploads')}
          style={{ marginLeft: '8px' }}
        >
          Uploads
        </button>
        <button
          className={view === 'adminregisters' ? 'approve-btn active' : 'approve-btn'}
          onClick={() => setView('adminregisters')}
          style={{ marginLeft: '8px' }}
        >
          Admin Registers
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {actionMsg && <div className="approve-msg">{actionMsg}</div>}

      {!loading && view === 'users' && (
        <>
          {users.length === 0 ? (
            <div>No pending users.</div>
          ) : (
            <table className="approve-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.name || 'N/A'}</td>
                    <td>{user.email || 'N/A'}</td>
                    <td>{user.status || 'pending'}</td>
                    <td className="approve-actions">
                      <button
                        onClick={() => handleUserAction(user._id, 'approved')}
                        className="approve-btn approve"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUserAction(user._id, 'rejected')}
                        className="approve-btn reject"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {!loading && view === 'uploads' && (
        <>
          {uploads.length === 0 ? (
            <div>No pending uploads.</div>
          ) : (
            <table className="approve-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Uploader</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map(upload => (
                  <tr key={upload._id}>
                    <td>{upload.title || 'N/A'}</td>
                    <td>{upload.uploader || 'N/A'}</td>
                    <td>{upload.status || 'pending'}</td>
                    <td className="approve-actions">
                      <button
                        onClick={() => handleUploadAction(upload._id, 'approved')}
                        className="approve-btn approve"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUploadAction(upload._id, 'rejected')}
                        className="approve-btn reject"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {!loading && view === 'adminregisters' && (
        <>
          {adminRegisters.length === 0 ? (
            <div>No pending admin registrations.</div>
          ) : (
            <table className="approve-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminRegisters.map(reg => (
                  <tr key={reg._id}>
                    <td>{reg.name || 'N/A'}</td>
                    <td>{reg.email || 'N/A'}</td>
                    <td>{reg.status || 'pending'}</td>
                    <td className="approve-actions">
                      <button
                        onClick={() => handleAdminAction(reg._id, 'approved')}
                        className="approve-btn approve"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAdminAction(reg._id, 'rejected')}
                        className="approve-btn reject"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default Approve;
