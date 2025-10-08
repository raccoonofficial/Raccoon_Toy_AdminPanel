import React, { useState } from 'react';
import AdminSidebar from './Admin_Sidebar';
import AdminDashboard from './Admin_Dashboard';
import AdminProducts from './Admin_Products';
import Admin_Customers from './Admin_Customers';
import Admin_Orders from './Admin_Orders';
import './Admin_Panel.css';

function AdminPanel() {
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <div className="admin-panel">
      <AdminSidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="admin-content">
        {activeView === 'dashboard' && <AdminDashboard />}
        {activeView === 'products' && <AdminProducts />}
        {activeView === 'customers' && <Admin_Customers />}
        {activeView === 'orders' && <Admin_Orders />}
      </div>
    </div>
  );
}

export default AdminPanel;