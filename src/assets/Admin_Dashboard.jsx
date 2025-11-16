import React, { useState } from 'react';
import { DollarSign, ShoppingBag, BarChart3, Wallet, Users, Package, Bell, Eye, UserCheck, Inbox, Hourglass, CheckCircle, XCircle, Truck, Smartphone, Laptop, FileText, Shield, User as UserIcon, Globe, Search } from 'lucide-react';
import './Admin_Dashboard.css';
import SalesChart from './SalesChart';
import './SalesChart.css';

// Data for summary cards
const summaryData = [
  { title: 'Total Sell', value: '300K', icon: DollarSign, color: '#f97316' },
  { title: 'Total Profit', value: '300K', icon: ShoppingBag, color: '#fb923c' },
  { title: 'Sell This Month', value: '300K', icon: BarChart3, color: '#fdba74' },
  { title: 'Cost This Month', value: '300K', icon: Wallet, color: '#f87171' },
  { title: 'Total Visitors', value: '45.2K', icon: Eye, color: '#ea580c' },
  { title: 'Today Visitors', value: '1,234', icon: UserCheck, color: '#c2410c' },
];

// Data for the new user stats section
const userStatsData = [
  { title: 'Total Users', value: '15.3K', icon: Users, color: '#3b82f6' },
  { title: 'Mobile Users', value: '11.2K', icon: Smartphone, color: '#8b5cf6' },
  { title: 'Computer Users', value: '4.1K', icon: Laptop, color: '#10b981' },
  { title: 'Active Users', value: '986', icon: UserCheck, color: '#ef4444' },
];

function AdminDashboard() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [isOrderSheetVisible, setOrderSheetVisible] = useState(false);
  const [activeLogFilter, setActiveLogFilter] = useState('All Logs'); // Default to 'All Logs'
  const [logSearchTerm, setLogSearchTerm] = useState('');

  const allOrders = [
    { id: 'P_1101', productId: 'T-001', name: 'Badhon shikder', phone: '01712345789', location: 'Nilambar sha Road-Dhaka, Hajaribag', price: '260 Taka', status: 'Delivered' },
    { id: 'P_1102', productId: 'T-002', name: 'Sara Ahmed', phone: '01798765432', location: 'Mirpur, Dhaka', price: '420 Taka', status: 'Pending' },
    { id: 'P_1103', productId: 'T-003', name: 'John Doe', phone: '01711223344', location: 'Gulshan, Dhaka', price: '150 Taka', status: 'Cancelled' },
    { id: 'P_1104', productId: 'T-004', name: 'Aisha Khan', phone: '01755667788', location: 'Dhanmondi, Dhaka', price: '320 Taka', status: 'Packed' },
    { id: 'P_1105', productId: 'T-005', name: 'Kabir Singh', phone: '01711111111', location: 'Banani, Dhaka', price: '500 Taka', status: 'Sent' },
    { id: 'P_1106', productId: 'T-006', name: 'Mina Raju', phone: '01722222222', location: 'Uttara, Dhaka', price: '1000 Taka', status: 'Pending' },
  ];
  
  const allLogs = [
    { id: 'L_2101', api: '/api/v1/users/login', status: 'Normal', type: 'user', user: 'sara_ahmed' },
    { id: 'L_2102', api: '/api/v1/admin/dashboard', status: 'Normal', type: 'admin', user: 'ninjashamimkabirkazim' },
    { id: 'L_2103', api: '/api/v1/products/all', status: 'Normal', type: 'non-user', user: 'guest' },
    { id: 'L_2104', api: '/api/v1/admin/delete/user/5', status: 'Risk', type: 'admin', user: 'ninjashamimkabirkazim' },
    { id: 'L_2105', api: '/api/v1/users/update/profile', status: 'Normal', type: 'user', user: 'sara_ahmed' },
    { id: 'L_2106', api: '/api/v1/orders/new', status: 'Normal', type: 'user', user: 'john_doe' },
  ];

  const orderCounts = {
    all: allOrders.length,
    Pending: allOrders.filter(o => o.status === 'Pending').length,
    Packed: allOrders.filter(o => o.status === 'Packed').length,
    Sent: allOrders.filter(o => o.status === 'Sent').length,
    Delivered: allOrders.filter(o => o.status === 'Delivered').length,
    Cancelled: allOrders.filter(o => o.status === 'Cancelled').length,
  };

  const orderFilters = [
    { name: "Today's Orders", icon: Inbox, status: 'all', count: orderCounts.all },
    { name: 'Pending', icon: Hourglass, status: 'Pending', count: orderCounts.Pending },
    { name: 'Packed', icon: Truck, status: 'Packed', count: orderCounts.Packed + orderCounts.Sent },
    { name: 'Delivered', icon: CheckCircle, status: 'Delivered', count: orderCounts.Delivered },
    { name: 'Cancelled', icon: XCircle, status: 'Cancelled', count: orderCounts.Cancelled },
  ];

  const logFilters = [
    { name: "All Logs", icon: FileText, type: 'all' },
    { name: 'Admin Logs', icon: Shield, type: 'admin' },
    { name: 'User Logs', icon: UserIcon, type: 'user' },
    { name: 'Non-User Logs', icon: Globe, type: 'non-user' },
  ];
  
  const filteredOrders = activeFilter ? allOrders.filter(order => {
    const selectedFilter = orderFilters.find(f => f.name === activeFilter);
    if (selectedFilter.status === 'all') return true;
    if (selectedFilter.name === 'Packed') return order.status === 'Packed' || order.status === 'Sent';
    return order.status === selectedFilter.status;
  }) : [];

  const filteredLogs = allLogs.filter(log => {
    const selectedFilter = logFilters.find(f => f.name === activeLogFilter);
    const categoryMatch = selectedFilter.type === 'all' || log.type === selectedFilter.type;
    const searchMatch = !logSearchTerm || log.user.toLowerCase().includes(logSearchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const handleFilterClick = (filterName) => {
    setActiveFilter(filterName);
    setOrderSheetVisible(true);
  };

  const today = new Date('2025-11-16 20:29:25Z').toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const notificationCount = 5;

  return (
    <main className="admin-dashboard" role="main">
      <div className="admin-dashboard-inner">
        
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, ninjashamimkabirkazim!</h1>
            <p>Here's your business snapshot as of {today}.</p>
          </div>
          <div className="notification-wrapper">
            <button className="notification-btn" aria-label="Notifications">
              <Bell size={28} />
              {notificationCount > 0 && <span className="notification-badge">{notificationCount}</span>}
            </button>
          </div>
        </div>

        <div className="summary-cards">
          {summaryData.map((item, index) => (
            <div className="card summary-card" key={index}>
              <div className="card-icon" style={{ backgroundColor: item.color }}><item.icon size={24} /></div>
              <div className="card-content"><p>{item.title}</p><h2>{item.value}</h2></div>
            </div>
          ))}
        </div>

        <div className="orders-section">
          <div className="order-filter-cards">
            {orderFilters.map(filter => (
              <button key={filter.name} className={`filter-card ${activeFilter === filter.name ? 'active' : ''}`} onClick={() => handleFilterClick(filter.name)}>
                <div className="filter-card-content"><filter.icon size={20} /><span>{filter.name}</span></div>
                {filter.count > 0 && <span className="filter-count-badge">{filter.count}</span>}
              </button>
            ))}
          </div>

          {isOrderSheetVisible && (
            <div className="card orders-card">
              <div className="card-header">
                <div className="card-header-title">
                  <Users size={20} className="header-icon" />
                  <h3>{activeFilter}</h3>
                </div>
                <button className="close-sheet-btn" onClick={() => setOrderSheetVisible(false)} aria-label="Close sheet">
                  <XCircle size={20} />
                </button>
              </div>
              <div className="orders-table-container">
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>P_ID</th><th>Product ID</th><th>C_Name</th><th className="large-screen-column">Phone</th><th className="large-screen-column">Address</th><th>Price</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order, idx) => (
                          <tr key={idx}>
                            <td>{order.id}</td>
                            <td>{order.productId}</td>
                            <td>{order.name}</td>
                            <td className="large-screen-column">{order.phone}</td>
                            <td className="large-screen-column">{order.location}</td>
                            <td>{order.price}</td>
                            <td><span className={`status-indicator status-indicator-small status-${order.status.toLowerCase()}`}>{order.status}</span></td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="7" className="no-orders-message">No orders found for this category.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-main-section">
          <div className="card chart-card">
            <div className="card-header">
              <div className="card-header-title">
                <Package size={20} className="header-icon" />
                <h3>Sales Analytics</h3>
              </div>
            </div>
            <SalesChart forceSample={true} height={280} />
          </div>

          <div className="card user-stats-card">
            <div className="card-header">
              <div className="card-header-title">
                <Users size={20} className="header-icon" />
                <h3>Users</h3>
              </div>
            </div>
            <div className="user-stats-grid">
              {userStatsData.map((stat, index) => (
                <div className="card summary-card" key={index}>
                  <div className="card-icon" style={{ backgroundColor: stat.color }}>
                    <stat.icon size={24} />
                  </div>
                  <div className="card-content">
                    <div className="user-stat-title-wrapper">
                      <p>{stat.title}</p>
                      {stat.title === 'Active Users' && <span className="active-user-dot"></span>}
                    </div>
                    <h2>{stat.value}</h2>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="logs-section">
          <div className="card logs-card">
            <div className="logs-card-header">
              <div className="logs-title-bar">
                <FileText size={20} className="header-icon" />
                <h3>API Logs</h3>
              </div>
              <div className="logs-filter-controls">
                <div className="log-filter-pills">
                  {logFilters.map(filter => (
                    <button key={filter.name} className={`log-filter-pill ${activeLogFilter === filter.name ? 'active' : ''}`} onClick={() => setActiveLogFilter(filter.name)}>
                      <filter.icon size={16} />
                      <span>{filter.name}</span>
                    </button>
                  ))}
                </div>
                <div className="log-search-wrapper">
                  <Search size={18} className="log-search-icon" />
                  <input type="text" placeholder="Filter by user trace..." className="log-search-input" value={logSearchTerm} onChange={(e) => setLogSearchTerm(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="logs-table-container">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Log ID</th><th>User Trace</th><th>API Called</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log, idx) => (
                        <tr key={idx}>
                          <td>{log.id}</td>
                          <td>{log.user}</td>
                          <td>{log.api}</td>
                          <td><span className={`status-indicator status-indicator-small status-${log.status.toLowerCase()}`}>{log.status}</span></td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="4" className="no-orders-message">No logs found for this filter.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

export default AdminDashboard;