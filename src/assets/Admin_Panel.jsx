import React, { useState, useEffect } from 'react';
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
  const [activeView, setActiveView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      // Close mobile menu when switching to desktop
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when view changes
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [activeView, isMobile]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen, isMobile]);

  // Callbacks used by children to change the view
  const goProductsList = () => setActiveView('products');
  const goAddProduct = () => setActiveView('addProduct');
  const goCustomersList = () => setActiveView('customers');
  const goAddCustomer = () => setActiveView('addCustomer');
  const goOrdersList = () => setActiveView('orders');
  const goAddOrder = () => setActiveView('addOrder');

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when overlay is clicked
  const handleOverlayClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="admin-panel">
      {/* Mobile Menu Toggle Button */}
      {isMobile && (
        <button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}

      {/* Sidebar Overlay for Mobile */}
      {isMobile && (
        <div
          className={`sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        className={isMobileMenuOpen ? 'open' : ''}
        isMobile={isMobile}
        isOpen={isMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="admin-content">
        {activeView === 'dashboard' && <AdminDashboard />}
        
        {activeView === 'products' && (
          <AdminProducts
            onAddNew={goAddProduct}
          />
        )}
        
        {activeView === 'addProduct' && (
          <Add_Products
            onBack={goProductsList}
            onCreated={goProductsList}
          />
        )}
        
        {activeView === 'customers' && (
          <Admin_Customers
            onAddNew={goAddCustomer}
          />
        )}
        
        {activeView === 'addCustomer' && (
          <Add_Customers
            onBack={goCustomersList}
            onCreated={goCustomersList}
          />
        )}
        
        {activeView === 'orders' && (
          <Admin_Orders
            onAddNew={goAddOrder}
          />
        )}
        
        {activeView === 'addOrder' && (
          <Add_Orders
            onBack={goOrdersList}
            onCreated={goOrdersList}
          />
        )}
        
        {activeView === 'finance' && <Finance />}
      </div>
    </div>
  );
}

export default AdminPanel;