import React, { useState } from 'react';
import AdminSidebar from './Admin_Sidebar';
import AdminDashboard from './Admin_Dashboard';
import AdminProducts from './Admin_Products';
import './Admin_Panel.css';

function AdminPanel() {
  const [activeView, setActiveView] = useState('dashboard');
  return (
    <div className="admin-panel">
      <AdminSidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="admin-content">
        {activeView === 'dashboard' && <AdminDashboard />}
        {activeView === 'products' && <AdminProducts />}
        {/* ...other views */}
      </div>
    </div>
  );
}
export default AdminPanel;