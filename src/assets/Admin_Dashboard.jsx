import React from 'react';
import './Admin_Dashboard.css';

function AdminDashboard() {
  const orders = [
    { id: 'P_1101', name: 'Badhon shikder', phone: '01712345789', location: 'Nilambar sha Road-Dhaka, Hajaribag', price: '260 Taka' },
    { id: 'P_1102', name: 'Sara Ahmed', phone: '01798765432', location: 'Mirpur, Dhaka', price: '420 Taka' },
    { id: 'P_1103', name: 'John Doe', phone: '01711223344', location: 'Gulshan, Dhaka', price: '150 Taka' },
    { id: 'P_1104', name: 'Aisha Khan', phone: '01755667788', location: 'Dhanmondi, Dhaka', price: '320 Taka' },
  ];

  // Realistic sample numbers (not tiny percentages) to demonstrate scaling
  const chartData = [120, 190, 80, 140, 210, 160, 240, 180, 120, 260, 230, 300];

  const maxValue = Math.max(...chartData, 1); // avoid division by zero

  return (
    <main className="admin-dashboard" role="main" style={{ marginLeft: '200px' }}>
      <div className="admin-dashboard-inner">
        <h1>Dashboard</h1>

        {/* Top section: left summary grid + right chart */}
        <div className="dashboard-top-section">
          <div className="summary-cards">
            <div className="card">
              <p>Total Sell</p>
              <h2>300K</h2>
            </div>
            <div className="card">
              <p>Total Profit</p>
              <h2>300K</h2>
            </div>
            <div className="card">
              <p>Sell This Month</p>
              <h2>300K</h2>
            </div>
            <div className="card">
              <p>Cost This Month</p>
              <h2>300K</h2>
            </div>
          </div>

          <div className="sales-chart-card card">
            <div className="chart-header">
              <h3>Sales</h3>
              <select aria-label="Select timescale">
                <option>Month</option>
                <option>Year</option>
              </select>
            </div>

            <div className="chart-container" role="img" aria-label="Monthly sales chart">
              <div className="chart-bars">
                {['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'].map((m, i) => {
                  const heightPercent = (chartData[i] / maxValue) * 100;
                  return (
                    <div className="bar-group" key={m}>
                      <div
                        className="bar"
                        style={{ height: `${heightPercent}%` }}
                        title={`${m}: ${chartData[i]}`}
                      />
                      <span className="bar-label">{m}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Orders table */}
        <div className="orders-today-card card">
          <h3>Orders Today</h3>
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
                    <td>{order.id}</td>
                    <td>{order.name}</td>
                    <td>{order.phone}</td>
                    <td>{order.location}</td>
                    <td>{order.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;