import React, { useState, useEffect } from 'react';
import './Profile.css';
import '../../../shared/styles/unified-design-system.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Get admin data from localStorage first
        const adminData = JSON.parse(localStorage.getItem('adminUser'));
        
        if (!adminData || !adminData.email) {
          throw new Error('Admin data not found');
        }

        // Fetch fresh data from the database
        const response = await fetch(`http://localhost:5000/api/admin/profile?email=${adminData.email}`);
        const data = await response.json();

        if (data.success) {
          setUser(data.user);
          setEditForm({
            name: data.user.name || '',
            email: data.user.email || ''
          });
        } else {
          // Fallback to localStorage data
          setUser({
            name: adminData.name || 'Admin User',
            email: adminData.email,
            role: 'Administrator',
            isAdmin: true
          });
          setEditForm({
            name: adminData.name || '',
            email: adminData.email
          });
        }

      } catch (err) {
        console.error('Profile error:', err);
        setError('Failed to load profile data');
        
        // Try to use localStorage as fallback
        try {
          const adminData = JSON.parse(localStorage.getItem('adminUser'));
          if (adminData) {
            setUser({
              name: adminData.name || 'Admin User',
              email: adminData.email,
              role: 'Administrator',
              isAdmin: true
            });
            setEditForm({
              name: adminData.name || '',
              email: adminData.email
            });
            setError(null);
          }
        } catch (fallbackErr) {
          console.error('Fallback error:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditForm({
        name: user.name || '',
        email: user.email || ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentEmail: user.email,
          name: editForm.name,
          email: editForm.email
        })
      });

      const data = await response.json();

      if (data.success) {
        setUser(prev => ({
          ...prev,
          name: editForm.name,
          email: editForm.email
        }));
        
        // Update localStorage
        const adminData = JSON.parse(localStorage.getItem('adminUser')) || {};
        adminData.name = editForm.name;
        adminData.email = editForm.email;
        localStorage.setItem('adminUser', JSON.stringify(adminData));
        
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update profile');
    }
  };

  if (loading) return <div className="admin-profile-loading">Loading profile...</div>;
  if (error && !user) return <div className="admin-profile-error">{error}</div>;
  if (!user) return (
    <div className="main-content">
      <div className="content-wrapper">
        <div className="error-state">
          <h2>User not found</h2>
        </div>
      </div>
    </div>
  );

  return (
    <div className="main-content">
      <div className="content-wrapper">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title blue-accent">
                <span className="page-icon"></span>
                Admin Profile
              </h1>
              <p className="page-subtitle">Manage your administrator account settings</p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <section className="content-section">
          <div className="card profile-card">
            <div className="card-header">
              <div className="profile-avatar">
                <span className="avatar-text blue-accent">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
              <div className="profile-info">
                <h2 className="card-title blue-text">{user.name || 'Admin User'}</h2>
                <p className="card-text">{user.email}</p>
                <span className="role-badge blue-accent">Administrator</span>
              </div>
            </div>

            <div className="card-content">
              {isEditing ? (
                <div className="profile-edit-form">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className="form-input"
                    />
                  </div>

                  <div className="form-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={handleSaveProfile}
                    >
                      💾 Save Changes
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={handleEditToggle}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-info">
                  <div className="detail-item">
                    <span className="detail-label">Full Name:</span>
                    <span className="detail-value blue-text">{user.name || 'Not provided'}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Email Address:</span>
                    <span className="detail-value">{user.email || 'Not provided'}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Role:</span>
                    <span className="detail-value role-badge blue-accent">
                      {user.role || 'Administrator'}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Account Type:</span>
                    <span className="detail-value account-badge">
                      {user.isAdmin ? '👑 Admin Account' : '👤 Regular User'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="card-footer">
              {!isEditing && (
                <div className="profile-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={handleEditToggle}
                  >
                    ✏️ Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;