import React, { useState } from 'react';
import AdminSidebar from './Admin_Sidebar';
import AdminDashboard from './Admin_Dashboard';
import AdminProducts from './Admin_Products';
import Admin_Customers from './Admin_Customers';
import Admin_Orders from './Admin_Orders';
import Finance from './Finance';
import Add_Products from './Add_Products'; // NEW: import Add Products page
import Add_Customers from './Add_Customers'; // NEW: import Add Customers page
import Add_Orders from './Add_Orders'; // NEW: import Add Orders page
import './Admin_Panel.css';

function AdminPanel() {
  const [activeView, setActiveView] = useState('dashboard');

  // Callbacks used by children to change the view
  const goProductsList = () => setActiveView('products');
  const goAddProduct = () => setActiveView('addProduct');
  const goCustomersList = () => setActiveView('customers');
  const goAddCustomer = () => setActiveView('addCustomer');
  const goOrdersList = () => setActiveView('orders');
  const goAddOrder = () => setActiveView('addOrder');

  return (
    <div className="admin-panel">
      <AdminSidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="admin-content">
        {activeView === 'dashboard' && <AdminDashboard />}
        {activeView === 'products' && (
          <AdminProducts
            onAddNew={goAddProduct} // Pass callback to switch to Add Products page
          />
        )}
        {activeView === 'addProduct' && (
          <Add_Products
            onBack={goProductsList}    // Back to product list
            onCreated={goProductsList} // After successful create, go to product list
          />
        )}
        {activeView === 'customers' && (
          <Admin_Customers
            onAddNew={goAddCustomer} // Pass callback to switch to Add Customers page
          />
        )}
        {activeView === 'addCustomer' && (
          <Add_Customers
            onBack={goCustomersList}    // Back to customer list
            onCreated={goCustomersList} // After successful create, go to customer list
          />
        )}
        {activeView === 'orders' && (
          <Admin_Orders
            onAddNew={goAddOrder} // Pass callback to switch to Add Orders page
          />
        )}
        {activeView === 'addOrder' && (
          <Add_Orders
            onBack={goOrdersList}    // Back to orders list
            onCreated={goOrdersList} // After successful create, go to orders list
          />
        )}
        {activeView === 'finance' && <Finance />}
      </div>
    </div>
  );
}

export default AdminPanel;