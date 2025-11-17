import React from 'react';
import { User, Mail, Calendar, Shield, Edit, Lock, Phone, MapPin, Clock } from 'lucide-react';
import './Admin_Profile.css';
import logo from '../assets/images/logo.png'; // Using the logo as a placeholder avatar

const Admin_Profile = ({ userName }) => {
  const user = {
    name: userName,
    email: 'ninjashamim@example.com',
    role: 'Administrator',
    joinDate: 'December 1, 2024',
    avatar: logo,
    phone: '+1 (123) 456-7890',
    location: 'Dhaka, Bangladesh',
    bio: 'Lead Administrator for RaccoonToy Co. Responsible for overseeing system integrity and user management.',
    lastLogin: '2025-11-17T09:30:00Z',
  };

  const recentActivity = [
    { id: 1, action: 'Changed password', time: 'Yesterday at 5:30 PM' },
    { id: 2, action: 'Updated product #T-004', time: 'November 15, 2025' },
    { id: 3, action: 'Logged in from a new device', time: 'November 14, 2025' },
  ];

  const formatLoginTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <main className="pro-profile-page" role="main">
      <div className="pro-profile-page-inner">
        {/* Left Column: Profile Summary */}
        <div className="pro-profile-summary-card">
          <div className="pro-profile-avatar-wrapper">
            <img src={user.avatar} alt="User Avatar" className="pro-profile-avatar" />
            <span className="pro-status-indicator-online"></span>
          </div>
          <h2 className="pro-profile-name">{user.name}</h2>
          <p className="pro-profile-role">{user.role}</p>
          <div className="pro-profile-main-actions">
            <button className="pro-action-btn pro-primary">
              <Edit size={16} />
              <span>Edit Profile</span>
            </button>
            <button className="pro-action-btn">
              <Lock size={16} />
              <span>Change Password</span>
            </button>
          </div>
          <div className="pro-last-login-info">
            <Clock size={14} />
            <span>Last login: {formatLoginTime(user.lastLogin)}</span>
          </div>
        </div>

        {/* Right Column: Detailed Information */}
        <div className="pro-profile-details-column">
          <div className="pro-card pro-about-me-card">
            <h3>About Me</h3>
            <p className="pro-profile-bio">{user.bio}</p>
            <div className="pro-info-grid">
              <div className="pro-info-item">
                <label>Email Address</label>
                <span>{user.email}</span>
              </div>
              <div className="pro-info-item">
                <label>Phone</label>
                <span>{user.phone}</span>
              </div>
              <div className="pro-info-item">
                <label>Location</label>
                <span>{user.location}</span>
              </div>
              <div className="pro-info-item">
                <label>Joined Date</label>
                <span>{user.joinDate}</span>
              </div>
            </div>
          </div>

          <div className="pro-card pro-activity-card">
            <h3>Recent Activity</h3>
            <ul className="pro-activity-list">
              {recentActivity.map(activity => (
                <li key={activity.id} className="pro-activity-item">
                  <div className="pro-activity-dot"></div>
                  <div className="pro-activity-text">
                    <p>{activity.action}</p>
                    <span>{activity.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Admin_Profile;