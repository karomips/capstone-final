import React, { useState, useEffect } from 'react';
import './UserManagement.css';

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
      <div className="user-management-loading">
        <div className="loading-spinner">
          <div className="lds-dual-ring"></div>
        </div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <>
      {/* Background Animation */}
      <div className="user-management-bg-animated">
        <div className="user-management-bg-bubble b1"></div>
        <div className="user-management-bg-bubble b2"></div>
        <div className="user-management-bg-bubble b3"></div>
        <div className="user-management-bg-bubble b4"></div>
      </div>

      <div className="user-management-main-content">
        {/* Welcome Section */}
        <section className="user-management-welcome-section">
          <div className="welcome-header">
            <img 
              src="/favicon.ico" 
              alt="User Management" 
              className="welcome-logo"
            />
            <div className="welcome-text">
              <h1>User Management</h1>
              <p>Manage all users and their account statuses</p>
            </div>
          </div>
        </section>

        {/* Stats and Controls */}
        <div className="user-management-controls">
          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-number">{users.length}</span>
              <span className="stat-label">Total Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{users.filter(u => u.status === 'approved').length}</span>
              <span className="stat-label">Approved</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{users.filter(u => u.status === 'pending').length}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{users.filter(u => u.isAdmin).length}</span>
              <span className="stat-label">Admins</span>
            </div>
          </div>

          <div className="search-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-box">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
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

        {/* Users Grid */}
        <div className="users-grid">
          {filteredUsers.length === 0 ? (
            <div className="no-users">
              <div className="no-users-icon">👥</div>
              <h3>No users found</h3>
              <p>No users match your current search criteria.</p>
            </div>
          ) : (
            filteredUsers.map(user => (
              <div key={user._id} className="user-card">
                <div className="user-header">
                  <div className="user-avatar">
                    <span className="avatar-text">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                    <span className="user-type-icon">
                      {getUserTypeIcon(user.isAdmin)}
                    </span>
                  </div>
                  <div className="user-info">
                    <h3 className="user-name">{user.name || 'Unnamed User'}</h3>
                    <p className="user-email">{user.email}</p>
                    <span 
                      className="user-status"
                      style={{ backgroundColor: getStatusColor(user.status) }}
                    >
                      {user.status || 'Unknown'}
                    </span>
                  </div>
                </div>
                
                <div className="user-details">
                  <div className="detail-item">
                    <span className="detail-label">Account Type:</span>
                    <span className="detail-value">
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

                <div className="user-actions">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => handleViewProfile(user)}
                    title="View Profile"
                  >
                    👁️ View
                  </button>
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEditUser(user)}
                    title="Edit User"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className={`action-btn ${user.status === 'approved' ? 'suspend-btn' : 'approve-btn'}`}
                    onClick={() => handleSuspendUser(user)}
                    title={user.status === 'approved' ? 'Suspend User' : 'Approve User'}
                  >
                    {user.status === 'approved' ? '⚠️ Suspend' : '✅ Approve'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

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
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedUser.status === 'approved' ? 'Suspend User' : 'Approve User'}</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowSuspendModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to {selectedUser.status === 'approved' ? 'suspend' : 'approve'} the user <strong>{selectedUser.name}</strong>?
                </p>
                <div className="form-actions">
                  <button 
                    className="btn-cancel"
                    onClick={() => setShowSuspendModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className={selectedUser.status === 'approved' ? 'btn-danger' : 'btn-success'}
                    onClick={handleConfirmSuspend}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : (selectedUser.status === 'approved' ? 'Suspend' : 'Approve')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default UserManagement;
