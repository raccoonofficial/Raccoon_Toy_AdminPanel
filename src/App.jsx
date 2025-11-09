import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Import all the components needed for routing
import AdminPanel from './assets/Admin_Panel';
import Login from './assets/Login';
import AdminDashboard from './assets/Admin_Dashboard';
import AdminProducts from './assets/Admin_Products';
import AdminCustomersPage from './assets/Admin_Customers'; // Use the component with modal logic
import Admin_Orders from './assets/Admin_Orders';
import Finance from './assets/Finance';
import Add_Products from './assets/Add_Products';
import Add_Orders from './assets/Add_Orders';
import './App.css';

function App() {
  const userName = "shamim-kabir-kazim-git";
  const currentDate = new Date('2025-11-09T15:50:57Z');
  
  // useNavigate hook can only be used in a component rendered by a Router,
  // so we can't use it here directly. We'll pass navigate function down.
  // A better approach is to use <Link> or useNavigate in the components themselves.
  // For this refactor, we'll adjust AdminPanel to not need a navigate prop.

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* All admin routes are now nested under AdminPanel for consistent layout */}
        <Route path="/" element={<AdminPanel />}>
          {/* Default route redirects to dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route path="dashboard" element={<AdminDashboard userName={userName} date={currentDate} />} />
          
          {/* Products Routes */}
          {/* Pass navigate via a render prop or context if needed, but Link is better */}
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/add" element={<Add_Products />} />
          
          {/* --- The route you are interested in --- */}
          {/* This renders the page with the customer list AND the modal functionality */}
          <Route path="users" element={<AdminCustomersPage />} />

          {/* Orders Routes */}
          <Route path="orders" element={<Admin_Orders />} />
          <Route path="orders/add" element={<Add_Orders />} />
          
          {/* Finance Route */}
          <Route path="finance" element={<Finance />} />
        </Route>

        {/* Fallback for any other route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;