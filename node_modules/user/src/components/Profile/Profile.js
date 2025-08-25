import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user'));

        if (!userData || !userData.email) {
          throw new Error('User data not found');
        }

        // Try to fetch fresh data from the database
        try {
          const response = await fetch(`http://localhost:5000/api/user/profile?email=${userData.email}`);
          const data = await response.json();

          if (data.success) {
            setUser(data.user);
            setEditForm({
              name: data.user.name || '',
              email: data.user.email || ''
            });
          } else {
            throw new Error('Failed to fetch from database');
          }
        } catch (dbError) {
          console.warn('Database fetch failed, using localStorage:', dbError);
          // Fallback to localStorage data
          setUser({
            name: userData.name,
            email: userData.email,
            status: userData.status || 'pending'
          });
          setEditForm({
            name: userData.name || '',
            email: userData.email || ''
          });
        }

      } catch (err) {
        console.error('Profile error:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
      const response = await fetch('http://localhost:5000/api/user/profile', {
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
        const userData = JSON.parse(localStorage.getItem('user')) || {};
        userData.name = editForm.name;
        userData.email = editForm.email;
        localStorage.setItem('user', JSON.stringify(userData));
        
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

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should not exceed 2MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload only image files');
      return;
    }

    setProfilePic(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!profilePic) return;

    try {
      const formData = new FormData();
      formData.append('profilePicture', profilePic);

      const response = await axios.post(
        `http://localhost:5000/api/users/profile-picture`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          params: {
            email: user.email
          }
        }
      );

      if (response.data.success) {
        setError(null);
        setProfilePic(null);
        alert('Profile picture updated successfully');
      }
    } catch (err) {
      setError('Failed to update profile picture');
      console.error('Upload error:', err);
    }
  };

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (error && !user) return <div className="profile-error">{error}</div>;
  if (!user) return <div className="profile-error">User not found</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-picture-container">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Profile" 
                className="profile-picture" 
              />
            ) : (
              <div className="profile-picture-placeholder">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <label htmlFor="profile-upload" className="profile-picture-upload">
              <span>📷</span>
              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                onChange={handlePictureChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        <div className="profile-info">
          {isEditing ? (
            <div className="profile-edit-form">
              <h2>Edit Profile</h2>
              
              <div className="profile-field">
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
              
              <div className="profile-field">
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

              <div className="profile-actions">
                <button 
                  className="profile-btn save"
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </button>
                <button 
                  className="profile-btn cancel"
                  onClick={handleEditToggle}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-display">
              <h2>{user.name || 'User'}</h2>
              <p className="profile-email">{user.email}</p>
              
              <div className="profile-details">
                <div className="profile-detail-row">
                  <strong>Account Status:</strong>
                  <span className={`status-badge ${user.status || 'pending'}`}>
                    {user.status || 'Pending'}
                  </span>
                </div>
                
                <div className="profile-detail-row">
                  <strong>Full Name:</strong>
                  <span>{user.name || 'Not provided'}</span>
                </div>
                
                <div className="profile-detail-row">
                  <strong>Email:</strong>
                  <span>{user.email}</span>
                </div>
              </div>

              <div className="profile-actions">
                <button 
                  className="profile-btn edit"
                  onClick={handleEditToggle}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}
          
          {profilePic && (
            <button 
              className="profile-upload-btn"
              onClick={handleUpload}
            >
              Upload New Picture
            </button>
          )}
          
          {error && <div className="profile-error-msg">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default Profile;