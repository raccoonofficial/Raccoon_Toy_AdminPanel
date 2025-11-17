import React, { useState } from 'react';
import { Bell, X, Package, UserPlus, AlertTriangle, FileText, CheckCircle, Search, Star, Inbox } from 'lucide-react';
import './Admin_Notifications.css';

const initialNotifications = [
  { id: 1, icon: <Package size={20} />, text: 'New order #P_1106 received from Mina Raju.', time: '2025-11-17T08:21:44Z', type: 'order', read: false, starred: true },
  { id: 2, icon: <UserPlus size={20} />, text: 'A new user "john_doe" has registered.', time: '2025-11-17T07:26:44Z', type: 'user', read: false, starred: false },
  { id: 3, icon: <AlertTriangle size={20} />, text: 'API log L_2104 reported a risk status.', time: '2025-11-16T12:30:00Z', type: 'alert', read: true, starred: false },
  { id: 4, icon: <FileText size={20} />, text: 'Your monthly sales report is ready to download.', time: '2025-11-16T08:26:44Z', type: 'report', read: true, starred: true },
  { id: 5, icon: <CheckCircle size={20} />, text: 'Order #P_1101 has been successfully delivered.', time: '2025-11-15T18:45:10Z', type: 'success', read: true, starred: false },
  { id: 6, icon: <UserPlus size={20} />, text: 'User "sara_ahmed" updated their profile.', time: '2025-11-15T09:00:21Z', type: 'user', read: true, starred: false },
  { id: 7, icon: <AlertTriangle size={20} />, text: 'Server maintenance is scheduled for tomorrow at 2 AM.', time: '2025-11-14T22:15:00Z', type: 'alert', read: false, starred: false },
  { id: 8, icon: <Package size={20} />, text: 'New product "Plushie Bear" was added to the inventory.', time: '2025-11-13T14:00:00Z', type: 'order', read: true, starred: false },
];

// Helper function to format the date and time
const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const AdminNotifications = ({ onClose }) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleStar = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, starred: !n.starred } : n
    ));
  };

  const filteredNotifications = notifications.filter(n => {
    const filterMatch = 
      (activeFilter === 'all') ||
      (activeFilter === 'unread' && !n.read) ||
      (activeFilter === 'starred' && n.starred);

    const searchMatch = !searchTerm || n.text.toLowerCase().includes(searchTerm.toLowerCase());

    return filterMatch && searchMatch;
  });

  const displayedNotifications = isExpanded ? filteredNotifications : notifications.slice(0, 5);

  return (
    <div className={`notifications-popup ${isExpanded ? 'expanded' : ''}`}>
      <div className="notifications-header">
        <div className="notifications-title">
          <Bell size={20} className="header-icon" />
          <h3>Notifications</h3>
        </div>
        <button onClick={onClose} className="close-notifications-btn" aria-label="Close notifications">
          <X size={20} />
        </button>
      </div>

      {isExpanded && (
        <div className="notifications-filter-controls">
          <div className="log-search-wrapper">
            <Search size={18} className="log-search-icon" />
            <input 
              type="text" 
              placeholder="Search notifications..." 
              className="log-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="log-filter-pills">
            <button className={`log-filter-pill ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>
              <Inbox size={16} /><span>All</span>
            </button>
            <button className={`log-filter-pill ${activeFilter === 'unread' ? 'active' : ''}`} onClick={() => setActiveFilter('unread')}>
              <Bell size={16} /><span>Unread</span>
            </button>
            <button className={`log-filter-pill ${activeFilter === 'starred' ? 'active' : ''}`} onClick={() => setActiveFilter('starred')}>
              <Star size={16} /><span>Starred</span>
            </button>
          </div>
        </div>
      )}

      <div className="notifications-list">
        {displayedNotifications.map(notif => (
          <div key={notif.id} className={`notification-item notification-item-${notif.type} ${notif.read ? 'read' : ''}`}>
            <div className="notification-icon">
              {notif.icon}
            </div>
            <div className="notification-content">
              <p>{notif.text}</p>
              <span className="notification-time">{formatDateTime(notif.time)}</span>
            </div>
            <button className="star-btn" onClick={() => toggleStar(notif.id)} aria-label="Star notification">
              <Star 
                size={16} 
                className={`star-icon ${notif.starred ? 'starred' : ''}`} 
              />
            </button>
          </div>
        ))}
        {displayedNotifications.length === 0 && (
          <div className="no-notifications-message">No notifications found.</div>
        )}
      </div>

      <div className="notifications-footer">
        <button className="footer-action-btn" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Collapse View' : 'View All Notifications'}
        </button>
      </div>
    </div>
  );
};

export default AdminNotifications;