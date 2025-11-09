import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import './Admin_Customers.css'; // We can reuse the same CSS

// --- Add Customer Form Page Component ---
export default function AddCustomersPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '', name: '', email: '', phone: '', orders: '', address: '', status: 'Basic'
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!formData.id.trim()) next.id = 'Customer ID is required';
    if (!formData.name.trim()) next.name = 'Name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) next.email = 'A valid email is required';
    if (!formData.phone.trim()) next.phone = 'Phone number is required';
    if (!String(formData.orders).trim() || isNaN(Number(formData.orders))) next.orders = 'A valid number is required';
    if (!formData.address.trim()) next.address = 'Address is required';
    return next;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length === 0) {
      console.log('New Customer Data:', { ...formData, orders: Number(formData.orders) });
      alert('Customer created successfully!');
      navigate('/users'); // Navigate back to the customer list
    }
  };

  return (
    <section className="add-customer-page">
      <div className="page-header">
        <h1>Add New Customer</h1>
      </div>

      <div className="form-container-standalone">
        <form onSubmit={handleSubmit} className="ap-form" noValidate>
          <div className="field">
            <label>Customer ID</label>
            <input type="text" name="id" value={formData.id} onChange={handleChange} placeholder="e.g., CUST_10001" />
            {errors.id && <div className="err">{errors.id}</div>}
          </div>
          <div className="field">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Tony Stark" />
            {errors.name && <div className="err">{errors.name}</div>}
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g., tony@starkindustries.com" />
            {errors.email && <div className="err">{errors.email}</div>}
          </div>
          <div className="field">
            <label>Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g., +1 555-1000" />
            {errors.phone && <div className="err">{errors.phone}</div>}
          </div>
          <div className="field-row">
            <div className="field">
              <label>Orders</label>
              <input type="number" name="orders" value={formData.orders} onChange={handleChange} placeholder="e.g., 12" />
              {errors.orders && <div className="err">{errors.orders}</div>}
            </div>
            <div className="field">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Basic">Basic</option>
                <option value="Loyal">Loyal</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>Address</label>
            <textarea name="address" rows={3} value={formData.address} onChange={handleChange} placeholder="e.g., 10880 Malibu Point, CA" />
            {errors.address && <div className="err">{errors.address}</div>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn muted" onClick={() => navigate('/users')}>Cancel</button>
            <button type="submit" className="btn primary">Save Customer</button>
          </div>
        </form>
      </div>
    </section>
  );
}