import React, { useState } from 'react';
import './Add_Customers.css';

export default function Add_Customers({ onBack, onCreated }) {
  const [customerId, setCustomerId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('Basic');
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    if (!customerId.trim()) next.customerId = 'Customer ID is required';
    if (!name.trim()) next.name = 'Name is required';
    if (!email.trim()) next.email = 'Email is required';
    if (!phone.trim()) next.phone = 'Phone number is required';
    if (!orders.trim() || isNaN(Number(orders))) next.orders = 'Valid number of orders is required';
    if (!address.trim()) next.address = 'Address is required';
    return next;
  }

  function clearForm() {
    setCustomerId('');
    setName('');
    setEmail('');
    setPhone('');
    setOrders('');
    setAddress('');
    setStatus('Basic');
    setErrors({});
  }

  function onSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    const payload = { customerId, name, email, phone, orders: Number(orders), address, status };
    try {
      const drafts = JSON.parse(localStorage.getItem('newCustomerDrafts') || '[]');
      drafts.push(payload);
      localStorage.setItem('newCustomerDrafts', JSON.stringify(drafts));
    } catch {}

    onCreated?.();
  }

  return (
    <section className="add-customers-page">
      <div className="ap-header">
        <h1>Add Customer</h1>
      </div>

      <form id="add-customer-form" className="ap-form" onSubmit={onSubmit} noValidate>
        <div className="ap-card">
          <div className="field">
            <label>Customer ID</label>
            <input type="text" value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder="e.g., CUST_10001" />
            {errors.customerId && <div className="err">{errors.customerId}</div>}
          </div>
          <div className="field">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Tony Stark" />
            {errors.name && <div className="err">{errors.name}</div>}
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g., tony@starkindustries.com" />
            {errors.email && <div className="err">{errors.email}</div>}
          </div>
          <div className="field">
            <label>Phone</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g., +1 555-1000" />
            {errors.phone && <div className="err">{errors.phone}</div>}
          </div>
          <div className="field">
            <label>Orders</label>
            <input type="number" value={orders} onChange={(e) => setOrders(e.target.value)} placeholder="e.g., 12" />
            {errors.orders && <div className="err">{errors.orders}</div>}
          </div>
          <div className="field">
            <label>Address</label>
            <textarea rows={4} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g., 10880 Malibu Point, CA" />
            {errors.address && <div className="err">{errors.address}</div>}
          </div>
          <div className="field">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Basic">Basic</option>
              <option value="Loyal">Loyal</option>
            </select>
          </div>
        </div>

        <div className="ap-actions bottom">
          <button type="button" className="btn ghost" onClick={() => onBack?.()}>Back</button>
          <button type="button" className="btn muted" onClick={clearForm}>Reset</button>
          <button type="submit" className="btn primary">Create Customer</button>
        </div>
      </form>
    </section>
  );
}