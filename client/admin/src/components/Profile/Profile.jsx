import React, { useState, useEffect } from 'react';
import './Profile.css';

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
  if (!user) return <div className="admin-profile-error">User not found</div>;

  return (
    <div className="admin-profile-container">
      <div className="admin-profile-card">
        <div className="admin-profile-header">
          <div className="admin-profile-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="admin-profile-title">
            <h1>Admin Profile</h1>
            <p>Manage your administrator account</p>
          </div>
        </div>

        <div className="admin-profile-content">
          {isEditing ? (
            <div className="admin-profile-edit-form">
              <div className="admin-profile-field">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="admin-profile-field">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                />
              </div>

              <div className="admin-profile-actions">
                <button 
                  className="admin-profile-btn save"
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </button>
                <button 
                  className="admin-profile-btn cancel"
                  onClick={handleEditToggle}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="admin-profile-info">
              <div className="admin-profile-info-row">
                <strong>Full Name:</strong>
                <span>{user.name || 'Not provided'}</span>
              </div>
              
              <div className="admin-profile-info-row">
                <strong>Email Address:</strong>
                <span>{user.email || 'Not provided'}</span>
              </div>
              
              <div className="admin-profile-info-row">
                <strong>Role:</strong>
                <span className="admin-profile-role">
                  {user.role || 'Administrator'}
                </span>
              </div>
              
              <div className="admin-profile-info-row">
                <strong>Account Type:</strong>
                <span className="admin-profile-badge">
                  {user.isAdmin ? 'Admin Account' : 'Regular User'}
                </span>
              </div>

              <div className="admin-profile-actions">
                <button 
                  className="admin-profile-btn edit"
                  onClick={handleEditToggle}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;