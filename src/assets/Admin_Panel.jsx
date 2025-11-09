import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'; // Import Outlet and useNavigate
import AdminSidebar from './Admin_Sidebar';
import './Admin_Panel.css';

// AdminPanel is now a layout component. It renders the sidebar and the active route's content.
function AdminPanel() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate(); // Use navigate for sidebar clicks

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen, isMobile]);
  
  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="admin-panel">
      {isMobile && (
        <button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span /><span /><span />
        </button>
      )}

      {isMobile && (
        <div
          className={`sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <AdminSidebar
        onNavigate={handleNavigate}
        className={isMobileMenuOpen ? 'open' : ''}
      />

      <div className="admin-content">
        {/* The Outlet component renders the matched child route component */}
        <Outlet />
      </div>
    </div>
  );
}

export default AdminPanel;