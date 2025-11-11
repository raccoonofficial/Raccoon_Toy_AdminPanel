import React, { useMemo, useState, useCallback } from 'react';
import { FiSearch } from 'react-icons/fi';
import { Plus, LayoutGrid, List, Edit, Trash2 } from 'lucide-react';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths, isWithinInterval, parseISO } from 'date-fns';
import './Admin_Orders.css';

// --- OPTIONS & ABBREVIATIONS ---
const PAYMENT_OPTIONS = ['Advance', 'Paid', 'Unpaid'];
const STATUS_OPTIONS = ['Pending', 'Packed', 'Send', 'Delivered', 'Cancelled', 'Pre-order'];
const TIME_FILTER_OPTIONS = ['All Time', 'Recent', 'This Week', 'Last Week', 'This Month', 'Last Month'];


const PAYMENT_ABBREVIATIONS = {
  Advance: 'ADV',
  Paid: 'PD',
  Unpaid: 'UNP',
};

const STATUS_ABBREVIATIONS = {
  Pending: 'PND',
  Packed: 'PAC',
  Send: 'SND',
  Delivered: 'DEL',
  Cancelled: 'CNC',
  'Pre-order': 'PRE',
};


const initialOrders = [
  {
    date: '2025-11-10',
    stdId: '0231232',
    orderNumber: '202509001',
    customer: { name: 'Noor Zahan', id: 'C_2025001', address: '123 Main St, Anytown', phone: '555-1234' },
    paymentStatus: 'Paid',
    status: 'Delivered',
    costAfterSell: 795,
    totalSoldPrice: 1475,
    profit: 680,
    advanceAmount: null,
    items: [
      { productName: 'Sazule Action Figure (Big)', qty: 1, deliveryCharge: 0, unitPrice: 1260 },
      { productName: 'Halo Kitty Bricks',          qty: 1, deliveryCharge: 0, unitPrice: 215  }
    ]
  },
  {
    date: '2025-11-08',
    stdId: '0231233',
    orderNumber: '202509001B',
    customer: { name: 'Demo Same Day', id: 'C_2025X01', address: 'Same-Day Lane, Metro City', phone: '555-5678' },
    paymentStatus: 'Advance',
    status: 'Packed',
    costAfterSell: 300,
    totalSoldPrice: 520,
    profit: 220,
    advanceAmount: 100,
    items: [
      { productName: 'Sample Product A', qty: 1, deliveryCharge: 0, unitPrice: 200 },
      { productName: 'Sample Product B', qty: 2, deliveryCharge: 0, unitPrice: 160 }
    ]
  },
  {
    date: '2025-10-15',
    stdId: '0231238',
    orderNumber: '202509012',
    customer: { name: 'Sarada Ater Mnn', id: 'C_2025002', address: '456 Oak Ave, Someplace', phone: '555-8765' },
    paymentStatus: 'Unpaid',
    status: 'Pre-order',
    costAfterSell: 370,
    totalSoldPrice: 700,
    profit: 330,
    advanceAmount: null,
    items: [
      { productName: 'Goku Action Figure', qty: 1, deliveryCharge: 0, unitPrice: 700 }
    ]
  }
];

// --- UPDATED CLASSES ---
const paymentSelectClass = {
  Paid: 'paid',
  Advance: 'advance',
  Unpaid: 'unpaid',
};

const statusSelectClass = {
  Delivered: 'delivered',
  Pending: 'pending',
  Packed: 'packed',
  Send: 'shipped', // 'Send' will reuse the 'shipped' style
  Cancelled: 'cancelled',
  'Pre-order': 'preorder'
};

function Admin_Orders({ onAddNew }) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('card');
  const [dateFilter, setDateFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All Time');


  const enriched = useMemo(
    () =>
      orders.map((o) => {
        const totalItemsPrice = o.items.reduce((acc, it) => acc + (it.unitPrice * it.qty), 0);
        const totalDelivery = o.items.reduce((acc, it) => acc + it.deliveryCharge, 0);
        const computedTotal = totalItemsPrice + totalDelivery;
        const sold = o.totalSoldPrice != null ? o.totalSoldPrice : computedTotal;
        const profit =
          o.profit != null
            ? o.profit
            : o.costAfterSell != null
            ? sold - o.costAfterSell
            : null;
        return { ...o, computedTotalPrice: computedTotal, resolvedSold: sold, resolvedProfit: profit, totalDelivery };
      }),
    [orders]
  );
  
  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    const now = new Date('2025-11-11T09:14:17Z'); // Using provided current time
    
    return enriched.filter(order => {
      // Text Search Filter
      const matchesSearch = term === '' ||
        order.date.toLowerCase().includes(term) ||
        order.stdId.toLowerCase().includes(term) ||
        order.orderNumber.toLowerCase().includes(term) ||
        order.customer.name.toLowerCase().includes(term) ||
        order.customer.id.toLowerCase().includes(term) ||
        (order.customer.address && order.customer.address.toLowerCase().includes(term)) ||
        (order.customer.phone && order.customer.phone.toLowerCase().includes(term)) ||
        order.items.some((it) => it.productName.toLowerCase().includes(term));

      // Date Filters
      const orderDate = parseISO(order.date);
      let matchesDate = true;
      if (dateFilter) {
          matchesDate = order.date === dateFilter;
      } else if (timeFilter !== 'All Time') {
          let interval;
          switch (timeFilter) {
              case 'Recent':
                  interval = { start: subWeeks(now, 1), end: now };
                  break;
              case 'This Week':
                  interval = { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
                  break;
              case 'Last Week':
                  const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
                  interval = { start: lastWeekStart, end: endOfWeek(lastWeekStart, { weekStartsOn: 1 }) };
                  break;
              case 'This Month':
                  interval = { start: startOfMonth(now), end: endOfMonth(now) };
                  break;
              case 'Last Month':
                  const lastMonthStart = startOfMonth(subMonths(now, 1));
                  interval = { start: lastMonthStart, end: endOfMonth(lastMonthStart) };
                  break;
              default:
                  break;
          }
          if (interval) {
              matchesDate = isWithinInterval(orderDate, interval);
          }
      }
      
      // Payment Status Filter
      const matchesPayment = paymentFilter === 'All' || order.paymentStatus === paymentFilter;

      // Order Status Filter
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

      return matchesSearch && matchesDate && matchesPayment && matchesStatus;
    });
  }, [enriched, search, dateFilter, paymentFilter, statusFilter, timeFilter]);

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
    setTimeFilter('All Time');
  };

  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
    setDateFilter('');
  };


  const handleStatusChange = (orderNumber, newStatus) => {
    setOrders((prev) => prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status: newStatus } : o)));
  };
  const handlePaymentChange = (orderNumber, newPayment) => {
    setOrders((prev) => prev.map((o) => {
      if (o.orderNumber === orderNumber) {
        // If status is not 'Advance', clear the advance amount
        const advanceAmount = newPayment === 'Advance' ? o.advanceAmount || 0 : null;
        return { ...o, paymentStatus: newPayment, advanceAmount };
      }
      return o;
    }));
  };
  
  // This function would be used by a dedicated edit modal/page in a full application
  const handleAdvanceAmountChange = (orderNumber, amount) => {
      setOrders((prev) => prev.map((o) => {
      if (o.orderNumber === orderNumber) {
        const newAmount = amount === '' ? null : parseFloat(amount);
        return { ...o, advanceAmount: newAmount };
      }
      return o;
    }));
  }

  const handleDelete = (orderNumber) => {
    if (window.confirm(`Are you sure you want to delete order ${orderNumber}?`)) {
      setOrders(orders.filter(o => o.orderNumber !== orderNumber));
    }
  };

  const handleEdit = (order) => {
    // In a real app, this would open a modal or new page to edit order details
    // For now, we can simulate changing the advance amount for demonstration
    if (order.paymentStatus === 'Advance') {
        const newAdvance = prompt(`Enter new advance amount for order #${order.orderNumber}:`, order.advanceAmount || '');
        if (newAdvance !== null) {
          handleAdvanceAmountChange(order.orderNumber, newAdvance);
        }
    } else {
        alert(`Editing Order #${order.orderNumber}. A full edit form would open here.`);
    }
  };

  // --- CARD COMPONENT for Grid View ---
  const OrderCard = ({ order }) => (
    <div className={`order-card-grid ${statusSelectClass[order.status]}`}>
        <div className="card-grid-header">
            <span className="card-grid-ordernum">#{order.orderNumber}</span>
            <span className={`card-grid-status-badge ${statusSelectClass[order.status]}`}>
                {STATUS_ABBREVIATIONS[order.status]}
            </span>
        </div>
        <div className="card-grid-body">
            <p className="card-grid-customer">{order.customer.name}</p>
            <p className="card-grid-stdid">STD ID: <span className="highlight-id">{order.stdId}</span></p>
            
            <div className="card-grid-items-section">
                <ul className="card-grid-items-list">
                    {order.items.map((item, index) => (
                        <li key={index}>
                            <span className="item-name">{item.qty}x {item.productName}</span>
                            <span className="item-price">{(item.unitPrice * item.qty).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="card-grid-total">
                <span className="total-label">Total Price</span>
                <span className="total-amount">{order.resolvedSold.toFixed(2)} TK</span>
            </div>
        </div>
        <div className="card-grid-footer">
            <span className={`card-grid-payment-badge ${paymentSelectClass[order.paymentStatus]}`}>
                {PAYMENT_ABBREVIATIONS[order.paymentStatus]}
            </span>
            <div className="card-actions">
                <button onClick={() => handleEdit(order)} title="Edit"><Edit size={14} /></button>
                <button onClick={() => handleDelete(order.orderNumber)} className="delete" title="Delete"><Trash2 size={14} /></button>
            </div>
        </div>
    </div>
  );


  return (
    <section className="admin-orders-page">
      <div className="page-header">
        <h1>Orders</h1>
        <div className="header-actions">
            <button className="btn primary" onClick={onAddNew}>
                <Plus size={16} /><span>Create Order</span>
            </button>
            <div className="view-toggle">
                <button className={viewMode === 'card' ? 'active' : ''} onClick={() => setViewMode('card')} aria-label="Card View">
                    <LayoutGrid size={20} />
                </button>
                <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')} aria-label="List View">
                    <List size={20} />
                </button>
            </div>
        </div>
      </div>

      <div className="filter-controls">
        <div className="search-wrapper">
          <FiSearch className="search-icon" size={20} />
          <input
            type="search"
            placeholder="Search by any text, ID, or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
            <select value={timeFilter} onChange={handleTimeFilterChange}>
                {TIME_FILTER_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <input 
                type="date" 
                className="date-filter"
                value={dateFilter}
                onChange={handleDateFilterChange}
            />
            <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
                <option value="All">All Payments</option>
                {PAYMENT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
      </div>
      
      {viewMode === 'card' ? (
        <div className="card-view">
          {filteredOrders.map(order => <OrderCard key={order.orderNumber} order={order} />)}
        </div>
      ) : (
        <div className="list-view">
          <div className="list-view-scroll">
            <table>
              <thead>
                <tr>
                  <th>Order Details</th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Items</th>
                  <th>Financials</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.orderNumber} className={statusSelectClass[order.status]}>
                    <td data-label="Order Details" className="cell-order-details">
                      <div className="order-number">#{order.orderNumber}</div>
                      <div className="sub-detail">Date: {order.date}</div>
                      <div className="sub-detail">STD ID: <span className="highlight-id">{order.stdId}</span></div>
                    </td>
                    <td data-label="Customer" className="cell-customer-details">
                       <div className="customer-name">{order.customer.name}</div>
                       <div className="sub-detail">ID: <span className="highlight-id">{order.customer.id}</span></div>
                    </td>
                    <td data-label="Contact" className="cell-contact">
                       <div>{order.customer.address}</div>
                       <div>{order.customer.phone}</div>
                    </td>
                    <td data-label="Items" className="cell-items">
                      <div className="item-row item-header">
                        <span>Product</span>
                        <span>Unit Price</span>
                      </div>
                      {order.items.map((item, i) => (
                        <div key={i} className="item-row">
                          <span>{item.qty}x {item.productName}</span>
                          <span>{item.unitPrice.toFixed(2)}</span>
                        </div>
                      ))}
                      {order.totalDelivery > 0 && <div className="item-row delivery"><span>Delivery</span><span>{order.totalDelivery.toFixed(2)}</span></div>}
                    </td>
                    <td data-label="Financials" className="cell-financials">
                        <div className="financial-group">
                            <div className="financial-row"><span>Total Price:</span><span>{order.computedTotalPrice.toFixed(2)}</span></div>
                            <div className="financial-row cost-row"><span>Cost After Sell:</span><span>{order.costAfterSell != null ? order.costAfterSell.toFixed(2) : 'N/A'}</span></div>
                            <div className="financial-row"><span>Sold At:</span><span>{order.resolvedSold.toFixed(2)}</span></div>
                            <div className="financial-row profit"><span>Profit:</span><span>{order.resolvedProfit != null ? order.resolvedProfit.toFixed(2) : 'N/A'}</span></div>
                        </div>

                        {order.paymentStatus === 'Advance' && (
                            <div className="financial-group advance-group">
                                <div className="advance-header">Advance Payment</div>
                                <div className="financial-row advance">
                                    <span>Advance Paid:</span>
                                    <span>{(order.advanceAmount || 0).toFixed(2)}</span>
                                </div>
                                <div className="financial-row due">
                                    <span>Due Amount:</span>
                                    <span>{(order.resolvedSold - (order.advanceAmount || 0)).toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </td>
                    <td data-label="Status" className="cell-status">
                       <select
                          className={`payment-select ${paymentSelectClass[order.paymentStatus]}`}
                          value={order.paymentStatus}
                          onChange={(e) => handlePaymentChange(order.orderNumber, e.target.value)}
                        >
                          {PAYMENT_OPTIONS.map(p => <option key={p} value={p}>{PAYMENT_ABBREVIATIONS[p]}</option>)}
                        </select>
                       <select
                          className={`order-status-select ${statusSelectClass[order.status]}`}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.orderNumber, e.target.value)}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_ABBREVIATIONS[s]}</option>)}
                        </select>
                    </td>
                    <td data-label="Actions" className="cell-actions">
                      <div className="list-actions">
                        <button onClick={() => handleEdit(order)} title="Edit"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(order.orderNumber)} className="delete" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredOrders.length === 0 && <div className="no-results">No orders match your criteria.</div>}
    </section>
  );
}

export default Admin_Orders;