import React, { useEffect, useState } from 'react';
import './Approval.css';
import '../../../shared/styles/unified-design-system.css';

function Approve() {
  const [uploads, setUploads] = useState([]);
  const [users, setUsers] = useState([]);
  const [adminRegisters, setAdminRegisters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [view, setView] = useState('users'); // 'users' | 'uploads' | 'adminregisters'
  
  // Modal states
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState(''); // 'approve' | 'reject'
  const [itemType, setItemType] = useState(''); // 'user' | 'upload' | 'admin'

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

  // Modal helper functions
  const openApprovalModal = (item, action, type) => {
    setSelectedItem(item);
    setActionType(action);
    setItemType(type);
    setShowApprovalModal(true);
  };

  const closeApprovalModal = () => {
    setShowApprovalModal(false);
    setSelectedItem(null);
    setActionType('');
    setItemType('');
  };

  const handleConfirmAction = () => {
    if (!selectedItem || !actionType || !itemType) return;

    const actionStatus = actionType === 'approve' ? 'approved' : 'rejected';
    
    if (itemType === 'user') {
      handleUserAction(selectedItem._id, actionStatus);
    } else if (itemType === 'upload') {
      handleUploadAction(selectedItem.id, actionStatus);
    } else if (itemType === 'admin') {
      handleAdminAction(selectedItem._id, actionStatus);
    }
    
    closeApprovalModal();
  };

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
    <div className="main-content">
      <div className="content-wrapper">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title blue-accent">
                <span className="page-icon"></span>
                Admin Approval Panel
              </h1>
              <p className="page-subtitle">Manage user registrations, uploads, and admin requests</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <section className="content-section">
          <h2 className="section-title blue-accent">
            <span className="section-icon"></span>
            Approval Statistics
          </h2>
          <div className="grid-layout grid-3">
            <div className="stat-card">
              <div className="stat-icon blue-icon">👥</div>
              <div className="stat-number">{users.length}</div>
              <div className="stat-label blue-text">Pending Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue-icon">📄</div>
              <div className="stat-number">{uploads.length}</div>
              <div className="stat-label blue-text">Pending Uploads</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue-icon">👑</div>
              <div className="stat-number">{adminRegisters.length}</div>
              <div className="stat-label blue-text">Admin Requests</div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="content-section">
          <div className="tab-navigation">
            <button
              className={`tab-btn ${view === 'users' ? 'active blue-accent' : ''}`}
              onClick={() => setView('users')}
            >
              User Registrations ({users.length})
            </button>
            <button
              className={`tab-btn ${view === 'uploads' ? 'active blue-accent' : ''}`}
              onClick={() => setView('uploads')}
            >
              File Uploads ({uploads.length})
            </button>
            <button
              className={`tab-btn ${view === 'adminregisters' ? 'active blue-accent' : ''}`}
              onClick={() => setView('adminregisters')}
            >
              Admin Requests ({adminRegisters.length})
            </button>
          </div>
        </section>

        {/* Action Message */}
        {actionMsg && (
          <section className="content-section">
            <div className="alert alert-info">
              {actionMsg}
            </div>
          </section>
        )}

        {/* Content Area */}
        <section className="content-section">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading approval data...</p>
            </div>
          ) : (
            <>
              {view === 'users' && (
                <div className="approval-section">
                  <div className="section-header">
                    <h3 className="section-title blue-accent">
                      <span className="section-icon"></span>
                      User Registrations
                    </h3>
                  </div>
                  {users.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">👥</div>
                      <h3 className="empty-state-title">No pending registrations</h3>
                      <p className="empty-state-description">All user registrations have been processed.</p>
                    </div>
                  ) : (
                    <div className="grid-layout grid-3">
                      {users.map(user => (
                        <div key={user._id} className="card">
                          <div className="card-header">
                            <h4 className="card-title blue-text">{user.name || 'N/A'}</h4>
                            <span className={`status-badge status-${user.status || 'pending'}`}>
                              {user.status || 'pending'}
                            </span>
                          </div>
                          <div className="card-content">
                            <div className="detail-item">
                              <span className="detail-label">Email:</span>
                              <span className="detail-value">{user.email || 'N/A'}</span>
                            </div>
                          </div>
                          <div className="card-footer">
                            <div className="card-actions">
                              <button
                                onClick={() => openApprovalModal(user, 'approve', 'user')}
                                className="btn btn-success btn-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => openApprovalModal(user, 'reject', 'user')}
                                className="btn btn-danger btn-sm"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {view === 'uploads' && (
                <div className="approval-section">
                  <div className="section-header">
                    <h3 className="section-title blue-accent">
                      <span className="section-icon">📄</span>
                      File Uploads
                    </h3>
                  </div>
                  {uploads.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">📄</div>
                      <h3 className="empty-state-title">No pending uploads</h3>
                      <p className="empty-state-description">All file uploads have been processed.</p>
                    </div>
                  ) : (
                    <div className="grid-layout grid-2">
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
                              onClick={() => openApprovalModal(upload, 'approved', 'upload')}
                              className="action-btn approve"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openApprovalModal(upload, 'rejected', 'upload')}
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
                          <div className="card-footer">
                            <div className="card-actions">
                              <button
                                onClick={() => openApprovalModal(reg, 'approved', 'admin')}
                                className="btn btn-success btn-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => openApprovalModal(reg, 'rejected', 'admin')}
                                className="btn btn-danger btn-sm"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* Confirmation Modal */}
      {showApprovalModal && (
        <div className="modal-overlay" onClick={closeApprovalModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm {actionType === 'approved' ? 'Approval' : 'Rejection'}</h3>
            </div>
            <div className="modal-body">
              <div className="confirmation-icon">
                {actionType === 'approved' ? (
                  <div className="icon-approve">
                    <div className="check-icon"></div>
                  </div>
                ) : (
                  <div className="icon-reject">
                    <div className="reject-icon"></div>
                  </div>
                )}
              </div>
              <p>
                Are you sure you want to {actionType === 'approved' ? 'approve' : 'reject'} this {itemType}?
              </p>
              {selectedItem && (
                <div className="item-details">
                  <strong>
                    {itemType === 'user' && selectedItem.name}
                    {itemType === 'upload' && selectedItem.filename}
                    {itemType === 'admin' && selectedItem.name}
                  </strong>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={closeApprovalModal} className="btn btn-secondary">
                Cancel
              </button>
              <button 
                onClick={handleConfirmAction} 
                className={`btn ${actionType === 'approved' ? 'btn-success' : 'btn-danger'}`}
              >
                {actionType === 'approved' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Approve;
