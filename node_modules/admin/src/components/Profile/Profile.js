import React from 'react';

function Profile() {
  // Example static profile data; replace with dynamic data as needed
  const user = {
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Administrator'
  };

  return (
    <div>
      <h2>Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
}

export default Profile;