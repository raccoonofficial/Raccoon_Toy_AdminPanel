import React from 'react';
import './Admin_Sidebar.css';

function AdminSidebar({ activeView, setActiveView, className = '', isMobile = false, isOpen = false }) {
  const sidebarClasses = `admin-sidebar ${className} ${isMobile && isOpen ? 'open' : ''}`.trim();

  const navItems = [
    { view: 'dashboard', label: 'Dashboard', icon: '📊' },
    { view: 'products', label: 'Products', icon: '📦' },
    { view: 'customers', label: 'Customers', icon: '👥' },
    { view: 'orders', label: 'Orders List', icon: '🛒' },
    { view: 'finance', label: 'Finance', icon: '💰' }
  ];

  return (
    <aside className={sidebarClasses}>
      <div className="sidebar-inner">
        <div className="logo">
          <img
            src="https://i.postimg.cc/pTyvHkyK/Frame-361.png"
            alt="Logo"
            className="logo-img"
          />
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li 
                key={item.view}
                className={activeView === item.view ? 'active' : ''}
              >
                <button
                  type="button"
                  onClick={() => setActiveView(item.view)}
                  aria-current={activeView === item.view ? 'page' : undefined}
                  aria-label={item.label}
                  data-tooltip={item.label}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <span className="sidebar-version">v2.0</span>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;