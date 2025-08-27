import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

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
    <div className="user-profile-bg-animated">
      <div className="user-profile-loading">
        <h2>Loading profile...</h2>
        <p>Please wait while we fetch your profile data.</p>
      </div>
    </div>
  );

  if (error && !user) return (
    <div className="user-profile-bg-animated">
      <div className="user-profile-error">
        <h2>Profile Not Available</h2>
        <p>{error}</p>
        <button 
          className="user-profile-btn edit"
          onClick={() => window.location.href = '/login'}
        >
          Go to Login
        </button>
      </div>
    </div>
  );

  if (!user) return (
    <div className="user-profile-bg-animated">
      <div className="user-profile-error">
        <h2>User Profile Not Found</h2>
        <p>Unable to load user profile data.</p>
        <button 
          className="user-profile-btn edit"
          onClick={() => window.location.href = '/login'}
        >
          Go to Login
        </button>
      </div>
    </div>
  );

  return (
    <div className="user-profile-bg-animated">
      <div className="user-profile-bg-bubble b1"></div>
      <div className="user-profile-bg-bubble b2"></div>
      <div className="user-profile-bg-bubble b3"></div>
      <div className="user-profile-bg-bubble b4"></div>
      
      <div className="user-profile-container">
        <div className="user-profile-card">
          <div className="user-profile-header">
            <div className="user-profile-picture-section">
              <div className="user-profile-picture-container">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Profile Preview" 
                    className="user-profile-picture" 
                  />
                ) : currentProfilePic ? (
                  <img 
                    src={currentProfilePic} 
                    alt="Profile" 
                    className="user-profile-picture"
                    onError={() => setCurrentProfilePic(null)}
                  />
                ) : (
                  <div className="user-profile-picture-placeholder">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <label htmlFor="profile-upload" className="user-profile-picture-upload">
                  <i className="upload-icon">📷</i>
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
                <div className="user-profile-picture-actions">
                  <button 
                    className="user-profile-btn upload"
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Save Picture'}
                  </button>
                  <button 
                    className="user-profile-btn cancel-preview"
                    onClick={removePreview}
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            
            <div className="user-profile-title">
              <h1>{user.name || 'User Profile'}</h1>
              <p>Manage your personal information and settings</p>
            </div>
          </div>

          <div className="user-profile-content">
            {isEditing ? (
              <div className="user-profile-edit-form">
                <h3>Edit Profile Information</h3>
                
                <div className="user-profile-field">
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
                
                <div className="user-profile-field">
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

                <div className="user-profile-actions">
                  <button 
                    className="user-profile-btn save"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </button>
                  <button 
                    className="user-profile-btn cancel"
                    onClick={handleEditToggle}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="user-profile-info">
                <div className="user-profile-info-row">
                  <strong>Account Status:</strong>
                  <span className={`user-status-badge ${user.status || 'pending'}`}>
                    {(user.status || 'pending').charAt(0).toUpperCase() + (user.status || 'pending').slice(1)}
                  </span>
                </div>
                
                <div className="user-profile-info-row">
                  <strong>Full Name:</strong>
                  <span>{user.name || 'Not provided'}</span>
                </div>
                
                <div className="user-profile-info-row">
                  <strong>Email Address:</strong>
                  <span>{user.email}</span>
                </div>
                
                <div className="user-profile-info-row">
                  <strong>Account Type:</strong>
                  <span className="user-profile-badge">User</span>
                </div>

                <div className="user-profile-info-row">
                  <strong>Account Verified:</strong>
                  <span className={`user-status-badge ${user.isVerified ? 'approved' : 'pending'}`}>
                    {user.isVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>

                <div className="user-profile-info-row">
                  <strong>Member Since:</strong>
                  <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span>
                </div>

                <div className="user-profile-actions">
                  <button 
                    className="user-profile-btn edit"
                    onClick={handleEditToggle}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
            
            {error && <div className="user-profile-error-msg">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;