import React, { useState, useEffect } from 'react';
import './UserManagement.css';
import '../../../shared/styles/unified-design-system.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // New states for modals and user management
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Use the all users endpoint instead of debug
      const response = await fetch('http://localhost:5000/api/admin/users/all');
      const data = await response.json();
      setUsers(data.success ? data.users : []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = ['all', 'approved', 'pending', 'rejected'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'var(--success-color)';
      case 'pending': return 'var(--warning-color)';
      case 'rejected': return 'var(--danger-color)';
      default: return 'var(--secondary-color)';
    }
  };

  const getUserTypeIcon = (isAdmin) => {
    return isAdmin ? '👑' : '👤';
  };

  // User management functions
  const handleViewProfile = async (user) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/user/${user._id}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedUser(data.user);
        setShowViewModal(true);
      } else {
        alert('Error fetching user details: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('Error fetching user details. Please try again.');
    }
  };

  const handleEditUser = async (user) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/user/${user._id}`);
      const data = await response.json();
      
      if (data.success) {
        setEditingUser({ ...data.user });
        setShowEditModal(true);
      } else {
        alert('Error fetching user details: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('Error fetching user details. Please try again.');
    }
  };

  const handleSuspendUser = (user) => {
    setSelectedUser(user);
    setShowSuspendModal(true);
  };

  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`http://localhost:5000/api/admin/user/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchUsers(); // Refresh the users list
        alert(`User ${newStatus} successfully!`);
      } else {
        alert('Error updating user status: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Error updating user status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch(`http://localhost:5000/api/admin/user/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editingUser.name,
          email: editingUser.email,
          status: editingUser.status,
          isVerified: editingUser.isVerified,
          isAdmin: editingUser.isAdmin
        })
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchUsers(); // Refresh the users list
        setShowEditModal(false);
        setEditingUser(null);
        alert('User updated successfully!');
      } else {
        alert('Error updating user: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmSuspend = async () => {
    if (!selectedUser) return;
    
    const newStatus = selectedUser.status === 'approved' ? 'rejected' : 'approved';
    await handleUpdateUserStatus(selectedUser._id, newStatus);
    setShowSuspendModal(false);
    setSelectedUser(null);
  };

  const handleEditInputChange = (field, value) => {
    setEditingUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="content-wrapper">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="content-wrapper">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title blue-accent">
                <span className="page-icon"></span>
                User Management
              </h1>
              <p className="page-subtitle">Manage all users and their account statuses</p>
            </div>
          </div>
        </div>

        {/* Stats and Controls */}
        <section className="content-section">
          <h2 className="section-title blue-accent">
            <span className="section-icon"></span>
            User Statistics
          </h2>
          <div className="grid-layout grid-4">
            <div className="stat-card">
              <div className="stat-icon blue-icon">👥</div>
              <div className="stat-number">{users.length}</div>
              <div className="stat-label blue-text">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue-icon">✅</div>
              <div className="stat-number">{users.filter(u => u.status === 'approved').length}</div>
              <div className="stat-label blue-text">Approved</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue-icon">⏳</div>
              <div className="stat-number">{users.filter(u => u.status === 'pending').length}</div>
              <div className="stat-label blue-text">Pending</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue-icon">👑</div>
              <div className="stat-number">{users.filter(u => u.isAdmin).length}</div>
              <div className="stat-label blue-text">Admins</div>
            </div>
          </div>
        </section>

        {/* Search and Filter Controls */}
        <section className="content-section">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title blue-accent">Search & Filter</h3>
            </div>
            <div className="card-content">
              <div className="grid-layout grid-2">
                <div className="form-group">
                  <label className="form-label">Search Users</label>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Filter by Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="form-select"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Users Grid */}
        <section className="content-section">
          <div className="section-header">
            <h2 className="section-title blue-accent">
              <span className="section-icon"></span>
              User Accounts ({filteredUsers.length})
            </h2>
          </div>
          
          {filteredUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <h3 className="empty-state-title">No users found</h3>
              <p className="empty-state-description">No users match your current search criteria.</p>
            </div>
          ) : (
            <div className="grid-layout grid-3">
              {filteredUsers.map(user => (
                <div key={user._id} className="card">
                  <div className="card-header">
                    <div className="user-avatar">
                      <span className="avatar-text">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                      <span className="user-type-icon">
                        {getUserTypeIcon(user.isAdmin)}
                      </span>
                    </div>
                    <div className="user-info">
                      <h3 className="card-title blue-text">{user.name || 'Unnamed User'}</h3>
                      <p className="card-text">{user.email}</p>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(user.status) }}
                      >
                        {user.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <div className="user-details">
                      <div className="detail-item">
                        <span className="detail-label">Account Type:</span>
                        <span className="detail-value blue-text">
                          {user.isAdmin ? 'Administrator' : 'Regular User'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Verified:</span>
                        <span className="detail-value">
                          {user.isVerified ? '✅ Yes' : '❌ No'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Status:</span>
                        <span className="detail-value" style={{ color: getStatusColor(user.status) }}>
                          {user.status?.charAt(0).toUpperCase() + user.status?.slice(1) || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="user-actions">
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => handleViewProfile(user)}
                        title="View Profile"
                      >
                        👁️ View
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEditUser(user)}
                        title="Edit User"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className={`btn btn-sm ${user.status === 'approved' ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleSuspendUser(user)}
                        title={user.status === 'approved' ? 'Suspend User' : 'Approve User'}
                      >
                        {user.status === 'approved' ? 'Suspend' : 'Approve'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Modals */}
        {/* View User Modal */}
        {showViewModal && selectedUser && (
          <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>User Profile</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowViewModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="user-profile-view">
                  <div className="profile-avatar">
                    <span className="avatar-text">
                      {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                    <span className="user-type-badge">
                      {selectedUser.isAdmin ? '👑 Admin' : '👤 User'}
                    </span>
                  </div>
                  <div className="profile-details">
                    <div className="detail-row">
                      <label>Name:</label>
                      <span>{selectedUser.name || 'Not provided'}</span>
                    </div>
                    <div className="detail-row">
                      <label>Email:</label>
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="detail-row">
                      <label>Status:</label>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(selectedUser.status) }}
                      >
                        {selectedUser.status?.charAt(0).toUpperCase() + selectedUser.status?.slice(1)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <label>Verified:</label>
                      <span>{selectedUser.isVerified ? '✅ Yes' : '❌ No'}</span>
                    </div>
                    <div className="detail-row">
                      <label>Account Type:</label>
                      <span>{selectedUser.isAdmin ? 'Administrator' : 'Regular User'}</span>
                    </div>
                    <div className="detail-row">
                      <label>Joined:</label>
                      <span>{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && editingUser && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit User</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowEditModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      value={editingUser.name || ''}
                      onChange={(e) => handleEditInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={editingUser.email || ''}
                      onChange={(e) => handleEditInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status:</label>
                    <select
                      value={editingUser.status || 'pending'}
                      onChange={(e) => handleEditInputChange('status', e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={editingUser.isVerified || false}
                        onChange={(e) => handleEditInputChange('isVerified', e.target.checked)}
                      />
                      Verified Account
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={editingUser.isAdmin || false}
                        onChange={(e) => handleEditInputChange('isAdmin', e.target.checked)}
                      />
                      Administrator
                    </label>
                  </div>
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn-cancel"
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn-save"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Suspend/Approve User Modal */}
        {showSuspendModal && selectedUser && (
          <div className="modal-overlay" onClick={() => setShowSuspendModal(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{selectedUser.status === 'approved' ? 'Suspend User Account' : 'Approve User Account'}</h3>
                <button 
                  className="modal-close-btn"
                  onClick={() => setShowSuspendModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-content">
                <div className="modal-icon-admin">
                  <div className={selectedUser.status === 'approved' ? 'suspend-icon' : 'approve-icon'}></div>
                </div>
                <p>
                  Are you sure you want to {selectedUser.status === 'approved' ? 'suspend' : 'approve'} the user <strong>{selectedUser.name}</strong>?
                </p>
                {selectedUser.status === 'approved' ? (
                  <p className="text-muted">This will prevent the user from accessing their account until reactivated.</p>
                ) : (
                  <p className="text-muted">This will grant the user full access to the system.</p>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowSuspendModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className={`btn ${selectedUser.status === 'approved' ? 'btn-warning' : 'btn-success'}`}
                  onClick={handleConfirmSuspend}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : (selectedUser.status === 'approved' ? 'Suspend Account' : 'Approve Account')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
