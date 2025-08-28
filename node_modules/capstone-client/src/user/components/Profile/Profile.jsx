import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../shared/styles/unified-design-system.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentProfilePic, setCurrentProfilePic] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        
        console.log('localStorage user data:', userData); // Debug log

        if (!userData || !userData.email) {
          console.log('No user data in localStorage, redirecting to login');
          setError('Please log in to view your profile');
          setLoading(false);
          return;
        }

        // Try to fetch fresh data from the database
        try {
          console.log('Fetching user profile for email:', userData.email); // Debug log
          
          const response = await fetch(`http://localhost:5000/api/user/profile?email=${userData.email}`);
          const data = await response.json();

          console.log('API response:', data); // Debug log

          if (data.success && data.user) {
            setUser(data.user);
            setEditForm({
              name: data.user.name || '',
              email: data.user.email || ''
            });

            // Load profile picture if exists
            if (data.user.hasProfilePicture) {
              const profilePicUrl = `http://localhost:5000/api/users/profile-picture/${userData.email}?t=${Date.now()}`;
              console.log('Loading profile picture:', profilePicUrl); // Debug log
              setCurrentProfilePic(profilePicUrl);
            }
          } else {
            console.log('API call failed or returned no user, using localStorage fallback');
            // Fallback to localStorage data
            setUser({
              name: userData.name || 'User',
              email: userData.email,
              status: userData.status || 'pending',
              isVerified: userData.isVerified || false
            });
            setEditForm({
              name: userData.name || '',
              email: userData.email || ''
            });
          }
        } catch (dbError) {
          console.warn('Database fetch failed, using localStorage:', dbError);
          // Fallback to localStorage data
          setUser({
            name: userData.name || 'User',
            email: userData.email,
            status: userData.status || 'pending',
            isVerified: userData.isVerified || false
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
    if (!user?.email) {
      alert('Unable to save profile: user email not found');
      return;
    }

    try {
      console.log('Saving profile for:', user.email, 'New data:', editForm); // Debug log
      
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
      console.log('Save profile response:', data); // Debug log

      if (data.success) {
        // Update user state
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
        console.error('Profile update failed:', data);
        alert(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update profile. Please check your connection.');
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
    if (!profilePic || !user?.email) {
      console.log('No profile pic or user email:', { profilePic, userEmail: user?.email });
      return;
    }

    setUploading(true);
    try {
      console.log('Uploading profile picture for:', user.email); // Debug log
      
      const formData = new FormData();
      formData.append('profilePicture', profilePic);

      const response = await axios.post(
        `http://localhost:5000/api/users/profile-picture?email=${user.email}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Upload response:', response.data); // Debug log

      if (response.data.success) {
        setError(null);
        setProfilePic(null);
        setPreviewUrl(null);
        // Update current profile picture with timestamp to avoid caching
        const newProfilePicUrl = `http://localhost:5000/api/users/profile-picture/${user.email}?t=${Date.now()}`;
        setCurrentProfilePic(newProfilePicUrl);
        alert('Profile picture updated successfully!');
      } else {
        setError(response.data.message || 'Failed to upload profile picture');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to update profile picture');
    } finally {
      setUploading(false);
    }
  };

  const removePreview = () => {
    setProfilePic(null);
    setPreviewUrl(null);
    setError(null);
  };

  if (loading) return (
    <div className="main-content">
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <h2>Loading profile...</h2>
        <p>Please wait while we fetch your profile data.</p>
      </div>
    </div>
  );

  if (error && !user) return (
    <div className="main-content">
      <div className="error-state">
        <h2>Profile Not Available</h2>
        <p>{error}</p>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.href = '/login'}
        >
          Go to Login
        </button>
      </div>
    </div>
  );

  if (!user) return (
    <div className="main-content">
      <div className="error-state">
        <h2>User Profile Not Found</h2>
        <p>Unable to load user profile data.</p>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.href = '/login'}
        >
          Go to Login
        </button>
      </div>
    </div>
  );

  return (
    <div className="main-content">
      <div className="content-wrapper">
        <div className="page-header">
          <h1 className="page-title">
            <span className="page-icon"></span>
            User Profile
          </h1>
          <p className="page-subtitle">Manage your personal information and settings</p>
        </div>

        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-picture-section">
                <div className="profile-picture-container">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Profile Preview" 
                      className="profile-picture" 
                    />
                  ) : currentProfilePic ? (
                    <img 
                      src={currentProfilePic} 
                      alt="Profile" 
                      className="profile-picture"
                      onError={() => setCurrentProfilePic(null)}
                    />
                  ) : (
                    <div className="profile-picture-placeholder">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <label htmlFor="profile-upload" className="profile-picture-upload">
                    <span className="upload-icon">📷</span>
                    <input
                      type="file"
                      id="profile-upload"
                      accept="image/*"
                      onChange={handlePictureChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                
                {previewUrl && (
                  <div className="profile-picture-actions">
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={handleUpload}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : 'Save Picture'}
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={removePreview}
                      disabled={uploading}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              
              <div className="profile-info-header">
                <h2 className="profile-name">{user.name || 'User Profile'}</h2>
                <span className={`status-badge ${user.status || 'pending'}`}>
                  {(user.status || 'pending').charAt(0).toUpperCase() + (user.status || 'pending').slice(1)}
                </span>
              </div>
            </div>

            <div className="profile-content">
              {isEditing ? (
                <div className="profile-edit-form">
                  <h3 className="section-title">Edit Profile Information</h3>
                  
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
                      Save Changes
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={handleEditToggle}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-info">
                  <div className="info-grid">
                    <div className="info-item">
                      <label className="info-label">Full Name:</label>
                      <span className="info-value">{user.name || 'Not provided'}</span>
                    </div>
                    
                    <div className="info-item">
                      <label className="info-label">Email Address:</label>
                      <span className="info-value">{user.email}</span>
                    </div>
                    
                    <div className="info-item">
                      <label className="info-label">Account Type:</label>
                      <span className="info-badge">User</span>
                    </div>

                    <div className="info-item">
                      <label className="info-label">Account Verified:</label>
                      <span className={`status-badge ${user.isVerified ? 'approved' : 'pending'}`}>
                        {user.isVerified ? 'Verified' : 'Pending Verification'}
                      </span>
                    </div>

                    <div className="info-item">
                      <label className="info-label">Member Since:</label>
                      <span className="info-value">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                      </span>
                    </div>
                  </div>

                  <div className="profile-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={handleEditToggle}
                    >
                      <span className="btn-icon">✏️</span>
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="alert alert-error">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;