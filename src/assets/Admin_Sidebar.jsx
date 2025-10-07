import React from 'react';
import './Admin_Sidebar.css';

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="logo">
        <img src="https://raw.githubusercontent.com/raccoonofficial/image_host/main/raccoon_toy_logo.png" alt="Raccoon Toy Logo" className="logo-img" />
      </div>
      <nav>
        <ul>
          <li className="active"><a href="#dashboard">Dashboard</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#customers">Customers</a></li>
          <li><a href="#orders">Orders List</a></li>
        </ul>
      </nav>
    </aside>
  );
}

export default AdminSidebar;