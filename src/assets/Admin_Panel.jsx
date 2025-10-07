import React from 'react';
import AdminSidebar from './Admin_Sidebar';
import AdminDashboard from './Admin_Dashboard';
import './Admin_Panel.css';

function AdminPanel() {
  return (
    <div className="admin-panel">
      <AdminSidebar />
      <AdminDashboard />
    </div>
  );
}

export default AdminPanel;