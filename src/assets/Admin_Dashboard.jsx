import React from 'react';
import { DollarSign, ShoppingBag, BarChart3, Wallet, Users, Package, Bell, Eye, UserCheck } from 'lucide-react'; // Import necessary icons
import './Admin_Dashboard.css';
import SalesChart from './SalesChart';
import './SalesChart.css';

// Data for summary cards, making it easier to manage and render
const summaryData = [
  { title: 'Total Sell', value: '300K', icon: DollarSign, color: '#4ade80' },
  { title: 'Total Profit', value: '300K', icon: ShoppingBag, color: '#facc15' },
  { title: 'Sell This Month', value: '300K', icon: BarChart3, color: '#60a5fa' },
  { title: 'Cost This Month', value: '300K', icon: Wallet, color: '#f87171' },
  { title: 'Total Visitors', value: '45.2K', icon: Eye, color: '#a78bfa' },
  { title: 'Today Visitors', value: '1,234', icon: UserCheck, color: '#fb923c' },
];

function AdminDashboard() {
  const orders = [
    { id: 'P_1101', name: 'Badhon shikder', phone: '01712345789', location: 'Nilambar sha Road-Dhaka, Hajaribag', price: '260 Taka' },
    { id: 'P_1102', name: 'Sara Ahmed', phone: '01798765432', location: 'Mirpur, Dhaka', price: '420 Taka' },
    { id: 'P_1103', name: 'John Doe', phone: '01711223344', location: 'Gulshan, Dhaka', price: '150 Taka' },
    { id: 'P_1104', name: 'Aisha Khan', phone: '01755667788', location: 'Dhanmondi, Dhaka', price: '320 Taka' },
  ];
  
  // Get today's date formatted nicely
  const today = new Date('2025-11-09T14:46:03Z').toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  // Notification count (you can make this dynamic)
  const notificationCount = 5;

  return (
    <main className="admin-dashboard" role="main">
      <div className="admin-dashboard-inner">
        
        {/* --- Advanced Header --- */}
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, shamim-kabir-kazim-git!</h1>
            <p>Here's your business snapshot as of {today}.</p>
          </div>
          <div className="notification-wrapper">
            <button className="notification-btn" aria-label="Notifications">
              <Bell size={24} />
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* --- Summary Cards with Icons --- */}
        <div className="summary-cards">
          {summaryData.map((item, index) => (
            <div className="card summary-card" key={index}>
              <div className="card-icon" style={{ backgroundColor: item.color }}>
                <item.icon size={24} />
              </div>
              <div className="card-content">
                <p>{item.title}</p>
                <h2>{item.value}</h2>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-main-section">
          {/* --- Sales Chart --- */}
          <div className="card chart-card">
            <div className="card-header">
              <Package size={20} className="header-icon" />
              <h3>Sales Analytics</h3>
            </div>
            <SalesChart
              forceSample={true}
              fixedFiveKAxis={true}
              height={280}
            />
          </div>

          {/* --- Orders Table --- */}
          <div className="card orders-card">
            <div className="card-header">
              <Users size={20} className="header-icon" />
              <h3>Today's Orders</h3>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>P_id</th>
                    <th>C_Name</th>
                    <th>Phone</th>
                    <th>Location</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr key={idx}>
                      <td><span className="cell-label">P_id</span>{order.id}</td>
                      <td><span className="cell-label">Name</span>{order.name}</td>
                      <td><span className="cell-label">Phone</span>{order.phone}</td>
                      <td><span className="cell-label">Location</span>{order.location}</td>
                      <td><span className="cell-label">Price</span>{order.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;