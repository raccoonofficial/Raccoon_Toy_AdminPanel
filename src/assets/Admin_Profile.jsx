import React from 'react';
import { User, Mail, Calendar, Shield, Edit, Lock } from 'lucide-react';
import './Admin_Profile.css';
import logo from '../assets/images/logo.png'; // Using the logo as a placeholder avatar

const Admin_Profile = ({ userName }) => {
  const user = {
    name: userName,
    email: 'ninjashamim@example.com',
    role: 'Administrator',
    joinDate: 'December 1, 2024',
    avatar: logo,
  };

  return (
    <main className="profile-page" role="main">
      <div className="profile-page-inner">
        <div className="profile-header-section">
          <h1>My Profile</h1>
          <p>Manage your personal information and account settings.</p>
        </div>

        <div className="card profile-card">
          <div className="profile-card-header">
            <div className="avatar-section">
              <img src={user.avatar} alt="User Avatar" className="profile-avatar" />
              <div className="avatar-text">
                <h2>{user.name}</h2>
                <span className="user-role">{user.role}</span>
              </div>
            </div>
            <div className="profile-actions">
              <button className="action-btn">
                <Edit size={16} />
                <span>Edit Profile</span>
              </button>
              <button className="action-btn">
                <Lock size={16} />
                <span>Change Password</span>
              </button>
            </div>
          </div>

          <div className="profile-details">
            <h3>Account Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <User size={20} className="detail-icon" />
                <div className="detail-text">
                  <label>Username</label>
                  <span>{user.name}</span>
                </div>
              </div>
              <div className="detail-item">
                <Mail size={20} className="detail-icon" />
                <div className="detail-text">
                  <label>Email Address</label>
                  <span>{user.email}</span>
                </div>
              </div>
              <div className="detail-item">
                <Shield size={20} className="detail-icon" />
                <div className="detail-text">
                  <label>Role</label>
                  <span>{user.role}</span>
                </div>
              </div>
              <div className="detail-item">
                <Calendar size={20} className="detail-icon" />
                <div className="detail-text">
                  <label>Joined Date</label>
                  <span>{user.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Admin_Profile;