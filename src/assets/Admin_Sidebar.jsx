import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Landmark,
  Music,
  User, // Import the User icon
} from 'lucide-react';
import logo from '../assets/images/logo.png'; // Import the logo
import './Admin_Sidebar.css';

const navLinks = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Users', icon: Users, href: '/users' },
  { label: 'Products', icon: Package, href: '/products' },
  { label: 'Orders', icon: ShoppingCart, href: '/orders' },
  { label: 'Finance', icon: Landmark, href: '/finance' },
  { label: 'Music Player', icon: Music, href: '/music' }, // Added Music Player link
  { label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

const Admin_Sidebar = ({ onNavigate, className }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();

  const handleLinkClick = (path) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };
  
  return (
    <nav
      className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${className || ''}`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="sidebar-logo-icon" />
        <span className="sidebar-logo-text">RaccoonToy Co.</span>
      </div>

      <ul className="sidebar-links">
        {navLinks.map((link) => (
          <li key={link.label}>
            <Link
              to={link.href}
              className={`sidebar-link ${location.pathname.startsWith(link.href) ? 'active' : ''}`}
              onClick={() => handleLinkClick(link.href)}
            >
              <link.icon className="sidebar-icon" />
              <span className="sidebar-label">{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <Link
          to="/profile"
          className={`sidebar-link ${location.pathname.startsWith('/profile') ? 'active' : ''}`}
          onClick={() => handleLinkClick('/profile')}
        >
          <User className="sidebar-icon" />
          <span className="sidebar-label">Profile</span>
        </Link>
        <a href="#" className="sidebar-link" onClick={(e) => { e.preventDefault(); handleLinkClick('/logout'); }}>
          <LogOut className="sidebar-icon" />
          <span className="sidebar-label">Logout</span>
        </a>
      </div>
    </nav>
  );
};

export default Admin_Sidebar;