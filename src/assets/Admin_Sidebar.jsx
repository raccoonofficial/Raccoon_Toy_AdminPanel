import React from 'react';
import './Admin_Sidebar.css';

function AdminSidebar({ activeView, setActiveView }) {
  return (
    <aside className="admin-sidebar">
      <div className="logo">
        <img
          src="https://i.postimg.cc/pTyvHkyK/Frame-361.png"
          alt="Raccoon Toy Logo"
          className="logo-img"
        />
      </div>
      <nav>
        <ul>
          <li className={activeView === 'dashboard' ? 'active' : ''}>
            <button
              type="button"
              onClick={() => setActiveView('dashboard')}
              aria-current={activeView === 'dashboard' ? 'page' : undefined}
            >
              Dashboard
            </button>
          </li>
          <li className={activeView === 'products' ? 'active' : ''}>
            <button
              type="button"
              onClick={() => setActiveView('products')}
              aria-current={activeView === 'products' ? 'page' : undefined}
            >
              Products
            </button>
          </li>
          <li className={activeView === 'customers' ? 'active' : ''}>
            <button
              type="button"
              onClick={() => setActiveView('customers')}
              aria-current={activeView === 'customers' ? 'page' : undefined}
            >
              Customers
            </button>
          </li>
          <li className={activeView === 'orders' ? 'active' : ''}>
            <button
              type="button"
              onClick={() => setActiveView('orders')}
              aria-current={activeView === 'orders' ? 'page' : undefined}
            >
              Orders List
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default AdminSidebar;