import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Rss, // Using Rss as a placeholder for the logo icon
} from 'lucide-react';
import './Admin_Sidebar.css';

const navLinks = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '#' },
  { label: 'Users', icon: Users, href: '#' },
  { label: 'Products', icon: Package, href: '#' },
  { label: 'Orders', icon: ShoppingCart, href: '#' },
  { label: 'Analytics', icon: BarChart3, href: '#' },
  { label: 'Settings', icon: Settings, href: '#' },
];

const Admin_Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeLink, setActiveLink] = useState('Dashboard');

  const handleLinkClick = (label) => {
    setActiveLink(label);
  };

  return (
    <nav
      className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="sidebar-header">
        <Rss className="sidebar-logo-icon" />
        <span className="sidebar-logo-text">Raccoon Admin</span>
      </div>

      <ul className="sidebar-links">
        {navLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className={`sidebar-link ${activeLink === link.label ? 'active' : ''}`}
              onClick={() => handleLinkClick(link.label)}
            >
              <link.icon className="sidebar-icon" />
              <span className="sidebar-label">{link.label}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <a href="#" className="sidebar-link">
          <LogOut className="sidebar-icon" />
          <span className="sidebar-label">Logout</span>
        </a>
      </div>
    </nav>
  );
};

export default Admin_Sidebar;