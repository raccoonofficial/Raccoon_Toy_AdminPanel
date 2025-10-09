import React, { useState } from 'react';
import './Add_Orders.css';

export default function Add_Orders({ onBack, onCreated }) {
  const [orderId, setOrderId] = useState('');
  const [date, setDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [productName, setProductName] = useState('');
  const [qty, setQty] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [status, setStatus] = useState('Pending');
  const [paymentStatus, setPaymentStatus] = useState('Unpaid');
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    if (!orderId.trim()) next.orderId = 'Order ID is required';
    if (!date.trim()) next.date = 'Date is required';
    if (!customerName.trim()) next.customerName = 'Customer name is required';
    if (!customerId.trim()) next.customerId = 'Customer ID is required';
    if (!address.trim()) next.address = 'Address is required';
    if (!phone.trim()) next.phone = 'Phone number is required';
    if (!productName.trim()) next.productName = 'Product name is required';
    if (!qty.trim() || isNaN(Number(qty))) next.qty = 'Valid quantity is required';
    if (!deliveryCharge.trim() || isNaN(Number(deliveryCharge))) next.deliveryCharge = 'Valid delivery charge is required';
    if (!unitPrice.trim() || isNaN(Number(unitPrice))) next.unitPrice = 'Valid unit price is required';
    return next;
  }

  function clearForm() {
    setOrderId('');
    setDate('');
    setCustomerName('');
    setCustomerId('');
    setAddress('');
    setPhone('');
    setProductName('');
    setQty('');
    setDeliveryCharge('');
    setUnitPrice('');
    setStatus('Pending');
    setPaymentStatus('Unpaid');
    setErrors({});
  }

  function onSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    const payload = {
      orderId,
      date,
      customer: { name: customerName, id: customerId, address, phone },
      items: [{ productName, qty: Number(qty), deliveryCharge: Number(deliveryCharge), unitPrice: Number(unitPrice) }],
      status,
      paymentStatus,
    };
    try {
      const drafts = JSON.parse(localStorage.getItem('newOrderDrafts') || '[]');
      drafts.push(payload);
      localStorage.setItem('newOrderDrafts', JSON.stringify(drafts));
    } catch {}

    onCreated?.();
  }

  return (
    <section className="add-orders-page">
      <div className="ap-header">
        <h1>Add Order</h1>
      </div>

      <form id="add-order-form" className="ap-form" onSubmit={onSubmit} noValidate>
        <div className="ap-card">
          <div className="field">
            <label>Order ID</label>
            <input type="text" value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="e.g., ORD001" />
            {errors.orderId && <div className="err">{errors.orderId}</div>}
          </div>
          <div className="field">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            {errors.date && <div className="err">{errors.date}</div>}
          </div>
          <div className="field">
            <label>Customer Name</label>
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g., John Doe" />
            {errors.customerName && <div className="err">{errors.customerName}</div>}
          </div>
          <div className="field">
            <label>Customer ID</label>
            <input type="text" value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder="e.g., CUST001" />
            {errors.customerId && <div className="err">{errors.customerId}</div>}
          </div>
          <div className="field">
            <label>Address</label>
            <textarea rows={4} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g., 123 Elm Street" />
            {errors.address && <div className="err">{errors.address}</div>}
          </div>
          <div className="field">
            <label>Phone</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g., +1 555-1000" />
            {errors.phone && <div className="err">{errors.phone}</div>}
          </div>
          <div className="field">
            <label>Product Name</label>
            <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g., Halo Kitty Doll" />
            {errors.productName && <div className="err">{errors.productName}</div>}
          </div>
          <div className="field">
            <label>Qty</label>
            <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="e.g., 2" />
            {errors.qty && <div className="err">{errors.qty}</div>}
          </div>
          <div className="field">
            <label>Delivery Charge</label>
            <input type="number" value={deliveryCharge} onChange={(e) => setDeliveryCharge(e.target.value)} placeholder="e.g., 50.00" />
            {errors.deliveryCharge && <div className="err">{errors.deliveryCharge}</div>}
          </div>
          <div className="field">
            <label>Unit Price</label>
            <input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="e.g., 100.00" />
            {errors.unitPrice && <div className="err">{errors.unitPrice}</div>}
          </div>
          <div className="field">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="field">
            <label>Payment Status</label>
            <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
              <option value="Unpaid">Unpaid</option>
              <option value="DC Paid">DC Paid</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        <div className="ap-actions bottom">
          <button type="button" className="btn ghost" onClick={() => onBack?.()}>Back</button>
          <button type="button" className="btn muted" onClick={clearForm}>Reset</button>
          <button type="submit" className="btn primary">Create Order</button>
        </div>
      </form>
    </section>
  );
}