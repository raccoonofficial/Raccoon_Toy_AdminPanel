import React, { useState, useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';
import './Admin_Orders.css';

/* ====== INITIAL DATA (updated: items per order) ====== */
const initialOrders = [
  {
    orderId: 'ORD-10001',
    customer: 'Tony Stark',
    date: '2025-03-10',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Processing',
    items: [
      { sku: 'MK-50', name: 'Iron Man Armor MK50', qty: 1, price: 699.99 },
      { sku: 'ARC-01', name: 'Arc Reactor Replica', qty: 2, price: 199.50 },
      { sku: 'HUD-01', name: 'HUD Nano Display', qty: 1, price: 200.00 },
    ]
  },
  {
    orderId: 'ORD-10002',
    customer: 'Steve Rogers',
    date: '2025-03-11',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Pending',
    items: [
      { sku: 'SHLD-01', name: 'Vibranium Shield Model', qty: 1, price: 249.00 },
    ]
  },
  {
    orderId: 'ORD-10003',
    customer: 'Natasha Romanoff',
    date: '2025-03-11',
    paymentStatus: 'Refunded',
    fulfillmentStatus: 'Cancelled',
    items: [
      { sku: 'STLTH-01', name: 'Stealth Suit Figure', qty: 2, price: 180.00 },
      { sku: 'GAD-07', name: 'Grapple Baton Replica', qty: 1, price: 180.50 },
    ]
  },
  {
    orderId: 'ORD-10004',
    customer: 'Bruce Banner',
    date: '2025-03-12',
    paymentStatus: 'Unpaid',
    fulfillmentStatus: 'Pending',
    items: [
      { sku: 'HULK-01', name: 'Hulk Smash Diorama', qty: 1, price: 250.00 },
      { sku: 'LAB-02', name: 'Gamma Lab Set', qty: 1, price: 170.00 },
    ]
  },
  {
    orderId: 'ORD-10005',
    customer: 'Peter Parker',
    date: '2025-03-12',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Shipped',
    items: [
      { sku: 'WEB-01', name: 'Web Shooter Replica', qty: 2, price: 149.50 },
      { sku: 'MASK-01', name: 'Spidey Mask Figure', qty: 1, price: 120.75 },
      { sku: 'CITY-SET', name: 'Mini City Rooftop Set', qty: 2, price: 190.00 },
    ]
  },
  {
    orderId: 'ORD-10006',
    customer: 'Wanda Maximoff',
    date: '2025-03-13',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Delivered',
    items: [
      { sku: 'CHAOS-01', name: 'Chaos Magic FX Pack', qty: 1, price: 180.00 },
      { sku: 'WITCH-01', name: 'Scarlet Witch Figure', qty: 1, price: 130.00 },
    ]
  },
];

/* ====== CONSTANTS ====== */
const FULFILLMENT_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const paymentBadgeClass = {
  Paid: 'paid',
  Unpaid: 'unpaid',
  Refunded: 'refunded',
};

const fulfillClass = {
  Pending: 'pending',
  Processing: 'processing',
  Shipped: 'shipped',
  Delivered: 'delivered',
  Cancelled: 'cancelled',
};

/* ====== COMPONENT ====== */
function Admin_Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');

  const handleFulfillmentChange = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o =>
        o.orderId === orderId ? { ...o, fulfillmentStatus: newStatus } : o
      )
    );
  };

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter(order => {
      const matchOrder =
        order.orderId.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term) ||
        order.items.some(it => it.name.toLowerCase().includes(term) || it.sku.toLowerCase().includes(term));
      return matchOrder;
    });
  }, [orders, search]);

  const noResults = filteredOrders.length === 0;

  const getOrderTotal = (order) =>
    order.items.reduce((sum, it) => sum + it.qty * it.price, 0);

  return (
    <section className="admin-orders grouped">
      <div className="orders-header">
        <h1>Orders</h1>
        <div className="orders-controls">
          <div className="search-box">
            <input
              type="search"
              placeholder="Search orders / items"
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
          <table className="orders-table alt-structure orders-group-structure">
            <thead>
              <tr>
                <th className="ord-col-id">Order ID</th>
                <th className="ord-col-customer">Customer</th>
                <th className="ord-col-date">Date</th>
                <th className="ord-col-item">Item</th>
                <th className="ord-col-sku">SKU</th>
                <th className="ord-col-qty">Qty</th>
                <th className="ord-col-line">Line Total</th>
                <th className="ord-col-total">Order Total</th>
                <th className="ord-col-payment">Payment</th>
                <th className="ord-col-fulfill">Fulfillment</th>
                <th className="ord-col-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {noResults && (
                <tr className="no-results-row">
                  <td colSpan={11} style={{ textAlign: 'center', padding: '14px 8px', fontWeight: 600, color: '#6a39ff' }}>
                    No matching orders or items.
                  </td>
                </tr>
              )}

              {!noResults && filteredOrders.map(order => {
                const orderTotal = getOrderTotal(order);
                const itemCount = order.items.length;
                const isCancelled = order.fulfillmentStatus === 'Cancelled';

                return order.items.map((item, idx) => {
                  const lineTotal = (item.qty * item.price).toFixed(2);
                  const first = idx === 0;
                  const last = idx === itemCount - 1;

                  return (
                    <tr
                      key={`${order.orderId}-${item.sku}-${idx}`}
                      className={`data-row grouped-row ${last ? 'order-last' : ''} ${isCancelled ? 'order-cancelled' : ''}`}
                    >
                      {first && (
                        <>
                          <td
                            rowSpan={itemCount}
                            className="ord-col-id group-cell"
                            title={`Order ${order.orderId}`}
                          >
                            {order.orderId}
                          </td>
                          <td
                            rowSpan={itemCount}
                            className="ord-col-customer group-cell"
                          >
                            {order.customer}
                          </td>
                          <td
                            rowSpan={itemCount}
                            className="ord-col-date group-cell"
                          >
                            {order.date}
                          </td>
                        </>
                      )}

                      {/* Item cells (per-row) */}
                      <td className="ord-col-item">{item.name}</td>
                      <td className="ord-col-sku">{item.sku}</td>
                      <td className="ord-col-qty">{item.qty}</td>
                      <td className="ord-col-line amount-cell">₹ {lineTotal}</td>

                      {first && (
                        <>
                          <td
                            rowSpan={itemCount}
                            className="ord-col-total group-cell amount-cell order-total-cell"
                          >
                            ₹ {orderTotal.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </td>
                          <td
                            rowSpan={itemCount}
                            className="ord-col-payment group-cell"
                          >
                            <span className={`payment-badge ${paymentBadgeClass[order.paymentStatus]}`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td
                            rowSpan={itemCount}
                            className="ord-col-fulfill group-cell"
                          >
                            <select
                              className={`fulfill-select ${fulfillClass[order.fulfillmentStatus]}`}
                              value={order.fulfillmentStatus}
                              aria-label="Change fulfillment status"
                              onChange={(e) =>
                                handleFulfillmentChange(order.orderId, e.target.value)
                              }
                            >
                              {FULFILLMENT_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </td>
                          <td
                            rowSpan={itemCount}
                            className="ord-col-action group-cell actions-cell"
                          >
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
                        </>
                      )}
                    </tr>
                  );
                });
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