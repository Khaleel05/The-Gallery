import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../sections/Header'
import './profile.css'; // You'll need to create this CSS file

function Profile() {
    const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    bio: currentUser?.bio || ''
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  //Handle logout funtion 
  
  // If user is not loaded or not authenticated
  if (!currentUser) {
    return (
      <div className="profile-container">
        <h2>Not authenticated</h2>
        <button onClick={() => navigate('/')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
        <button className='logout-btn'onClick={()=> navigate('/home')}>Main</button>
        <button className="logout-btn" onClick={()=> navigate()}>Logout</button>
      </div>

      <div className="profile-content">
        <div className="profile-avatar">
          {/* Display user initial or placeholder avatar */}
          <div className="avatar-circle">
            {currentUser?.name?.charAt(0)?.toUpperCase() || currentUser?.email?.charAt(0)?.toUpperCase() || '?'}
          </div>
        </div>

        {isEditing ? (
          <form className="profile-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled // Usually email changes require verification
              />
            </div>
            
            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="save-btn">Save Changes</button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{currentUser.name || 'Not provided'}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{currentUser.email}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Bio:</span>
              <span className="detail-value">{currentUser.bio || 'No bio provided'}</span>
            </div>
            
            <div className="profile-actions">
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <h3>Favorite Movies</h3>
          <p className="stat-number">{currentUser.favorites?.length || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Reviews</h3>
          <p className="stat-number">{currentUser.reviews?.length || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Member Since</h3>
          <p className="stat-date">
            {currentUser.createdAt 
              ? new Date(currentUser.createdAt).toLocaleDateString() 
              : 'Unknown'}
          </p>
        </div>
      </div>

      {/* You could add sections for favorite movies, reviews, etc. here */}
    </div>
  );
}

export default Profile;