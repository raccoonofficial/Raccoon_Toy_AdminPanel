import React, { useState, useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';
import './Admin_Orders.css';

const initialOrders = [
  {
    orderId: 'ORD-10001',
    customer: 'Tony Stark',
    date: '2025-03-10',
    items: 4,
    total: 1299.99,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Processing'
  },
  {
    orderId: 'ORD-10002',
    customer: 'Steve Rogers',
    date: '2025-03-11',
    items: 1,
    total: 249.00,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Pending'
  },
  {
    orderId: 'ORD-10003',
    customer: 'Natasha Romanoff',
    date: '2025-03-11',
    items: 3,
    total: 540.50,
    paymentStatus: 'Refunded',
    fulfillmentStatus: 'Cancelled'
  },
  {
    orderId: 'ORD-10004',
    customer: 'Bruce Banner',
    date: '2025-03-12',
    items: 2,
    total: 420.00,
    paymentStatus: 'Unpaid',
    fulfillmentStatus: 'Pending'
  },
  {
    orderId: 'ORD-10005',
    customer: 'Peter Parker',
    date: '2025-03-12',
    items: 5,
    total: 799.75,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Shipped'
  },
  {
    orderId: 'ORD-10006',
    customer: 'Wanda Maximoff',
    date: '2025-03-13',
    items: 2,
    total: 310.00,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Delivered'
  },
];

const FULFILLMENT_OPTIONS = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled'
];

const paymentBadgeClass = {
  'Paid': 'paid',
  'Unpaid': 'unpaid',
  'Refunded': 'refunded',
};

const fulfillClass = {
  'Pending': 'pending',
  'Processing': 'processing',
  'Shipped': 'shipped',
  'Delivered': 'delivered',
  'Cancelled': 'cancelled',
};

function Admin_Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter(o =>
      o.orderId.toLowerCase().includes(term) ||
      o.customer.toLowerCase().includes(term)
    );
  }, [orders, search]);

  const handleFulfillmentChange = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o => o.orderId === orderId ? { ...o, fulfillmentStatus: newStatus } : o)
    );
  };

  const noResults = filtered.length === 0;

  return (
    <section className="admin-orders">
      <div className="orders-header">
        <h1>Orders</h1>
        <div className="orders-controls">
          <div className="search-box">
            <input
              type="search"
              placeholder="Search orders"
              aria-label="Search orders"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FiSearch className="search-icon" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="orders-table-card">
        <div className="orders-table-scroll">
          <table className="orders-table alt-structure">
            <thead>
              <tr>
                <th className="col-id">Order ID</th>
                <th className="col-customer">Customer</th>
                <th className="col-date">Date</th>
                <th className="col-items">Items</th>
                <th className="col-total">Total</th>
                <th className="col-pay">Payment</th>
                <th className="col-fulfill">Fulfillment</th>
                <th className="col-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {noResults && (
                <tr className="no-results-row">
                  <td colSpan={8} style={{ textAlign: 'center', padding: '14px 8px', fontWeight: 600, color: '#6a39ff' }}>
                    No orders found for that search.
                  </td>
                </tr>
              )}

              {!noResults && filtered.map(o => {
                const cancelled = o.fulfillmentStatus === 'Cancelled';
                return (
                  <tr
                    key={o.orderId}
                    className={`data-row ${cancelled ? 'row-cancelled' : ''}`}
                  >
                    <td className="col-id">{o.orderId}</td>
                    <td className="col-customer">{o.customer}</td>
                    <td className="col-date">{o.date}</td>
                    <td className="col-items" style={{ textAlign: 'center' }}>{o.items}</td>
                    <td className="col-total amount-cell">₹ {o.total.toLocaleString(undefined,{minimumFractionDigits:2})}</td>
                    <td className="col-pay">
                      <span className={`payment-badge ${paymentBadgeClass[o.paymentStatus]}`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="col-fulfill">
                      <select
                        className={`fulfill-select ${fulfillClass[o.fulfillmentStatus]}`}
                        value={o.fulfillmentStatus}
                        aria-label="Change fulfillment status"
                        onChange={(e) => handleFulfillmentChange(o.orderId, e.target.value)}
                      >
                        {FULFILLMENT_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td className="actions-cell col-action">
                      <button className="edit-btn" title="View / Edit">
                        <svg viewBox="0 0 24 24" width="11" height="11" fill="#007aff">
                          <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zM20.71 7.04a.9959.9959 0 0 0 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                      </button>
                      <button className="delete-btn" title="Cancel / Delete">
                        <svg viewBox="0 0 24 24" width="11" height="11" fill="#ff3b30">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}

            </tbody>
          </table>
        </div>
        <div className="orders-footer">
          <button className="add-order-btn">+ Create Order</button>
        </div>
      </div>
    </section>
  );
}

export default Admin_Orders;