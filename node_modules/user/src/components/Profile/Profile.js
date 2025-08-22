import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user'));

        if (!userData || !userData.name || !userData.email) {
          throw new Error('User data not found');
        }

        // Set user data directly from localStorage
        setUser({
          name: userData.name,
          email: userData.email
        });

      } catch (err) {
        console.error('Profile error:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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

      // Get user email for identification
      const userData = JSON.parse(localStorage.getItem('user'));
      
      const response = await axios.post(
        `http://localhost:5000/api/users/profile-picture`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          params: {
            email: userData.email
          }
        }
      );

      if (response.data.success) {
        setError(null);
        alert('Profile picture updated successfully');
      }
    } catch (err) {
      setError('Failed to update profile picture');
      console.error('Upload error:', err);
    }
  };

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (error) return <div className="profile-error">{error}</div>;
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
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <label htmlFor="profile-upload" className="profile-picture-upload">
              <span>Change Picture</span>
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
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          
          {profilePic && (
            <button 
              className="profile-upload-btn"
              onClick={handleUpload}
            >
              Upload New Picture
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;