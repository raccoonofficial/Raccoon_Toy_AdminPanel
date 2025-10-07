import React from 'react';
import './Admin_Dashboard.css';
import SalesChart from './SalesChart'; // NEW COMPONENT
import './SalesChart.css';             // Chart styles

function AdminDashboard() {
  const orders = [
    { id: 'P_1101', name: 'Badhon shikder', phone: '01712345789', location: 'Nilambar sha Road-Dhaka, Hajaribag', price: '260 Taka' },
    { id: 'P_1102', name: 'Sara Ahmed', phone: '01798765432', location: 'Mirpur, Dhaka', price: '420 Taka' },
    { id: 'P_1103', name: 'John Doe', phone: '01711223344', location: 'Gulshan, Dhaka', price: '150 Taka' },
    { id: 'P_1104', name: 'Aisha Khan', phone: '01755667788', location: 'Dhanmondi, Dhaka', price: '320 Taka' },
  ];

  return (
    <main className="admin-dashboard" role="main">
      <div className="admin-dashboard-inner">
        <h1>Dashboard</h1>

        <div className="dashboard-top-section">
          <div className="summary-cards">
            <div className="card"><p>Total Sell</p><h2>300K</h2></div>
            <div className="card"><p>Total Profit</p><h2>300K</h2></div>
            <div className="card"><p>Sell This Month</p><h2>300K</h2></div>
            <div className="card"><p>Cost This Month</p><h2>300K</h2></div>
          </div>

          {/* Force the chart to use sample data */}
          <SalesChart
            title="Sales"
            forceSample={true} // Forces the use of sample data
            fixedFiveKAxis={true} // Ensures ticks are 0, 5k, 10k, ...
            height={240}
          />
        </div>

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