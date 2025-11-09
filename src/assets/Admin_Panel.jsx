import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AdminSidebar from './Admin_Sidebar';
import AdminDashboard from './Admin_Dashboard';
import AdminProducts from './Admin_Products';
import Admin_Customers from './Admin_Customers';
import Admin_Orders from './Admin_Orders';
import Finance from './Finance';
import Add_Products from './Add_Products';
import Add_Customers from './Add_Customers';
import Add_Orders from './Add_Orders';
import './Admin_Panel.css';

function AdminPanel() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const userName = "shamim-kabir-kazim-git";
  const currentDate = new Date('2025-11-09T15:50:57Z');

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
        <Routes>
          {/* Dashboard Routes */}
          <Route path="/" element={<AdminDashboard userName={userName} date={currentDate} />} />
          <Route path="/dashboard" element={<AdminDashboard userName={userName} date={currentDate} />} />
          
          {/* Products Routes */}
          <Route path="/products" element={<AdminProducts onAddNew={() => navigate('/products/add')} />} />
          <Route path="/products/add" element={<Add_Products onCreated={() => navigate('/products')} onBack={() => navigate('/products')} />} />
          
          {/* Users/Customers Routes */}
          <Route path="/users" element={<Admin_Customers onAddNew={() => navigate('/users/add')} />} />
          <Route path="/users/add" element={<Add_Customers onCreated={() => navigate('/users')} onBack={() => navigate('/users')} />} />

          {/* Orders Routes */}
          <Route path="/orders" element={<Admin_Orders onAddNew={() => navigate('/orders/add')} />} />
          <Route path="/orders/add" element={<Add_Orders onCreated={() => navigate('/orders')} onBack={() => navigate('/orders')} />} />
          
          {/* Finance Route */}
          <Route path="/finance" element={<Finance />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminPanel;