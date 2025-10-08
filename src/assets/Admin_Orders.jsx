import React, { useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import './Admin_Orders.css';

/**
 * Changes in this update:
 * 1. Added new column "STD ID" immediately after Date.
 * 2. Added demo stdId values (e.g., '0231232', etc.).
 * 3. Ensured at least two orders share the same date for demo (already present; kept & adjusted).
 * 4. Hover still excludes only the Date cell (STD ID will highlight with rest of order).
 * 5. Payment dropdown (Paid, DC Paid, Unpaid) and Status dropdown (Delivered, Pending, Packed, Shipped, Cancelled) retained.
 * 6. Added stdId to search logic.
 */

const PAYMENT_OPTIONS = ['Paid', 'DC Paid', 'Unpaid'];
const STATUS_OPTIONS = ['Delivered', 'Pending', 'Packed', 'Shipped', 'Cancelled'];

const initialOrders = [
  {
    date: '2025-09-23',
    stdId: '0231232',
    orderNumber: '202509001',
    customer: { name: 'Noor Zahan', id: 'C_2025001', address: '', phone: '' },
    paymentStatus: 'Paid',
    status: 'Delivered',
    costAfterSell: 0,
    totalSoldPrice: 1475,
    profit: 680,
    items: [
      { productName: 'Sazule Action Figure (Big)', qty: 1, deliveryCharge: 0, unitPrice: 1260 },
      { productName: 'Halo Kitty Bricks', qty: 1, deliveryCharge: 0, unitPrice: 215 }
    ]
  },
  {
    date: '2025-09-23',
    stdId: '0231233',
    orderNumber: '202509001B',
    customer: { name: 'Demo Same Day', id: 'C_2025X01', address: 'Same-Day Lane', phone: '' },
    paymentStatus: 'DC Paid',
    status: 'Pending',
    costAfterSell: 300,
    totalSoldPrice: 520,
    profit: 220,
    items: [
      { productName: 'Sample Product A', qty: 1, deliveryCharge: 0, unitPrice: 200 },
      { productName: 'Sample Product B', qty: 2, deliveryCharge: 0, unitPrice: 160 }
    ]
  },
  {
    date: '2025-09-23',
    stdId: '0231234',
    orderNumber: '202509002',
    customer: { name: 'Sarada Ater Mnn', id: 'C_2025002', address: '', phone: '' },
    paymentStatus: 'Paid',
    status: 'Delivered',
    costAfterSell: 0,
    totalSoldPrice: 1000,
    profit: 600,
    items: [
      { productName: 'Halo Kitty Bricks', qty: 1, deliveryCharge: 0, unitPrice: 216 },
      { productName: 'Zeritos Bricks', qty: 1, deliveryCharge: 0, unitPrice: 215 },
      { productName: 'Heitor Arna Bricks', qty: 1, deliveryCharge: 0, unitPrice: 215 },
      { productName: 'Panel Bricks', qty: 1, deliveryCharge: 0, unitPrice: 245 },
      { productName: 'Black Kumala Doll', qty: 1, deliveryCharge: 0, unitPrice: 109 }
    ]
  },
  {
    date: '2025-09-24',
    stdId: '0231235',
    orderNumber: '202509005',
    customer: { name: 'Ubor Moni', id: 'C_2025004', address: '', phone: '' },
    paymentStatus: 'Paid',
    status: 'Delivered',
    costAfterSell: 540,
    totalSoldPrice: 540,
    profit: 290,
    items: [
      { productName: 'Mochy Cat', qty: 2, deliveryCharge: 0, unitPrice: 89.5 },
      { productName: 'Purple Kumala Doll', qty: 1, deliveryCharge: 0, unitPrice: 110 },
      { productName: 'Monky Bricks', qty: 2, deliveryCharge: 0, unitPrice: 93.75 }
    ]
  },
  {
    date: '2025-09-27',
    stdId: '0231236',
    orderNumber: '202509006',
    customer: { name: 'Sabbir Hasan Saik', id: 'C_2025005', address: '19-e lower, Chandina CN.', phone: '8801769592256' },
    paymentStatus: 'Paid',
    status: 'Delivered',
    costAfterSell: 102,
    totalSoldPrice: 370,
    profit: 198,
    items: [
      { productName: 'Pikachu', qty: 1, deliveryCharge: 0, unitPrice: 120 },
      { productName: 'Halo Kitty Doll', qty: 1, deliveryCharge: 0, unitPrice: 150 },
      { productName: 'Hello Kitty Small', qty: 1, deliveryCharge: 0, unitPrice: 100 }
    ]
  },
  {
    date: '2025-09-27',
    stdId: '0231237',
    orderNumber: '202509006B',
    customer: { name: 'Repeat Date Demo', id: 'C_2025X02', address: 'Second Same Date', phone: '' },
    paymentStatus: 'Unpaid',
    status: 'Packed',
    costAfterSell: 150,
    totalSoldPrice: 320,
    profit: 170,
    items: [
      { productName: 'Demo Figure', qty: 1, deliveryCharge: 0, unitPrice: 120 },
      { productName: 'Demo Accessory', qty: 2, deliveryCharge: 0, unitPrice: 100 }
    ]
  },
  {
    date: '2025-10-01',
    stdId: '0231238',
    orderNumber: '202509012',
    customer: { name: 'Sarada Ater Mnn', id: 'C_2025002', address: '', phone: '' },
    paymentStatus: 'Unpaid',
    status: 'Pending',
    costAfterSell: 0,
    totalSoldPrice: 700,
    profit: 330,
    items: [
      { productName: 'Goku Action Figure', qty: 1, deliveryCharge: 0, unitPrice: 700 }
    ]
  }
];

/* Class maps for coloring */
const paymentSelectClass = {
  'Paid': 'paid',
  'DC Paid': 'dcpaid',
  'Unpaid': 'unpaid'
};

const statusSelectClass = {
  'Delivered': 'delivered',
  'Pending': 'pending',
  'Packed': 'packed',
  'Shipped': 'shipped',
  'Cancelled': 'cancelled'
};

function Admin_Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');

  const enriched = useMemo(() => {
    return orders.map(o => {
      const sums = o.items.reduce((acc, it) => {
        acc.items += it.unitPrice * it.qty;
        acc.delivery += it.deliveryCharge;
        return acc;
      }, { items: 0, delivery: 0 });
      const computedTotal = sums.items + sums.delivery;
      const sold = o.totalSoldPrice != null ? o.totalSoldPrice : computedTotal;
      const profit = o.profit != null
        ? o.profit
        : (o.costAfterSell != null ? sold - o.costAfterSell : null);
      return { ...o, computedTotalPrice: computedTotal, resolvedSold: sold, resolvedProfit: profit };
    });
  }, [orders]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return enriched;
    return enriched.filter(o =>
      o.orderNumber.toLowerCase().includes(term) ||
      o.stdId.toLowerCase().includes(term) ||
      o.date.toLowerCase().includes(term) ||
      o.customer.name.toLowerCase().includes(term) ||
      o.customer.id.toLowerCase().includes(term) ||
      (o.customer.address && o.customer.address.toLowerCase().includes(term)) ||
      (o.customer.phone && o.customer.phone.toLowerCase().includes(term)) ||
      o.items.some(it => it.productName.toLowerCase().includes(term))
    );
  }, [enriched, search]);

  const handleStatusChange = (orderNumber, newStatus) => {
    setOrders(prev => prev.map(o => o.orderNumber === orderNumber ? { ...o, status: newStatus } : o));
  };

  const handlePaymentChange = (orderNumber, newPayment) => {
    setOrders(prev => prev.map(o => o.orderNumber === orderNumber ? { ...o, paymentStatus: newPayment } : o));
  };

  return (
    <section className="admin-orders full-structure">
      <div className="orders-header">
        <h1>Orders</h1>
        <div className="orders-controls">
          <div className="search-box">
            <input
              type="search"
              placeholder="Search date / std id / order / customer / product"
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
          <table className="orders-table alt-structure orders-full-group orders-hover-group">
            <thead>
              <tr>
                <th className="ordf-col-date">Date</th>
                <th className="ordf-col-stdid">STD ID</th>
                <th className="ordf-col-order">Order Number</th>
                <th className="ordf-col-custname">Customer Name</th>
                <th className="ordf-col-custid">Customer ID</th>
                <th className="ordf-col-address">Address</th>
                <th className="ordf-col-phone">Phone</th>
                <th className="ordf-col-product">Product Name</th>
                <th className="ordf-col-qty">Qty</th>
                <th className="ordf-col-delivery">Delivery</th>
                <th className="ordf-col-price">Price</th>
                <th className="ordf-col-totalprice">Total Price</th>
                <th className="ordf-col-costafter">Cost After Sell</th>
                <th className="ordf-col-sold">Total Sold Price</th>
                <th className="ordf-col-profit">Profit</th>
                <th className="ordf-col-payment">Payment</th>
                <th className="ordf-col-status">Status</th>
                <th className="ordf-col-action">Action</th>
              </tr>
            </thead>

            {filtered.length === 0 && (
              <tbody>
                <tr className="no-results-row">
                  <td colSpan={18} style={{ textAlign: 'center', padding: '14px 8px', fontWeight: 600, color: '#6a39ff' }}>
                    No matching orders or items.
                  </td>
                </tr>
              </tbody>
            )}

            {filtered.map(order => {
              const rowSpan = order.items.length;
              const isCancelled = order.status === 'Cancelled';
              return (
                <tbody
                  key={order.orderNumber}
                  className={`order-block ${isCancelled ? 'order-cancelled' : ''}`}
                >
                  {order.items.map((line, idx) => {
                    const first = idx === 0;
                    const last = idx === rowSpan - 1;
                    return (
                      <tr
                        key={`${order.orderNumber}-${idx}-${line.productName}`}
                        className={`data-row order-line ${last ? 'order-last' : ''}`}
                      >
                        {first && (
                          <>
                            <td rowSpan={rowSpan} className="ordf-col-date group-cell date-cell">{order.date}</td>
                            <td rowSpan={rowSpan} className="ordf-col-stdid group-cell">{order.stdId}</td>
                            <td rowSpan={rowSpan} className="ordf-col-order group-cell">{order.orderNumber}</td>
                            <td rowSpan={rowSpan} className="ordf-col-custname group-cell">{order.customer.name}</td>
                            <td rowSpan={rowSpan} className="ordf-col-custid group-cell">{order.customer.id}</td>
                            <td rowSpan={rowSpan} className="ordf-col-address group-cell">{order.customer.address}</td>
                            <td rowSpan={rowSpan} className="ordf-col-phone group-cell">{order.customer.phone}</td>
                          </>
                        )}

                        <td className="ordf-col-product">{line.productName}</td>
                        <td className="ordf-col-qty center">{line.qty}</td>
                        <td className="ordf-col-delivery amount-cell">{line.deliveryCharge} TK</td>
                        <td className="ordf-col-price amount-cell">{line.unitPrice} TK</td>

                        {first && (
                          <>
                            <td rowSpan={rowSpan} className="ordf-col-totalprice group-cell amount-cell">
                              {order.computedTotalPrice.toFixed(2)} TK
                            </td>
                            <td rowSpan={rowSpan} className="ordf-col-costafter group-cell amount-cell">
                              {order.costAfterSell != null ? `${order.costAfterSell} TK` : '—'}
                            </td>
                            <td rowSpan={rowSpan} className="ordf-col-sold group-cell amount-cell">
                              {order.resolvedSold != null ? `${order.resolvedSold} TK` : `${order.computedTotalPrice.toFixed(2)} TK`}
                            </td>
                            <td rowSpan={rowSpan} className="ordf-col-profit group-cell amount-cell profit-cell">
                              {order.resolvedProfit != null ? `${order.resolvedProfit} TK` : '—'}
                            </td>
                            <td rowSpan={rowSpan}
                                className={`ordf-col-payment group-cell payment-cell ${paymentSelectClass[order.paymentStatus]}`}>
                              <select
                                className={`payment-select ${paymentSelectClass[order.paymentStatus]}`}
                                value={order.paymentStatus}
                                aria-label="Change payment status"
                                onChange={(e) => handlePaymentChange(order.orderNumber, e.target.value)}
                              >
                                {PAYMENT_OPTIONS.map(p => (
                                  <option key={p} value={p}>{p}</option>
                                ))}
                              </select>
                            </td>
                            <td rowSpan={rowSpan}
                                className={`ordf-col-status group-cell status-cell ${statusSelectClass[order.status]}`}>
                              <select
                                className={`order-status-select full-cell ${statusSelectClass[order.status]}`}
                                value={order.status}
                                aria-label="Change status"
                                onChange={(e) => handleStatusChange(order.orderNumber, e.target.value)}
                              >
                                {STATUS_OPTIONS.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </td>
                            <td rowSpan={rowSpan} className="ordf-col-action group-cell actions-cell">
                              <button className="edit-btn" title="Edit">
                                <svg viewBox="0 0 24 24" width="11" height="11" fill="#007aff">
                                  <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zM20.71 7.04a.9959.9959 0 0 0 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                </svg>
                              </button>
                              <button className="delete-btn" title="Delete / Cancel">
                                <svg viewBox="0 0 24 24" width="11" height="11" fill="#ff3b30">
                                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              );
            })}
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