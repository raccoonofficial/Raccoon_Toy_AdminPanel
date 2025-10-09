import React, { useState } from 'react';
import './Add_Orders.css';

export default function Add_Orders({ onBack, onCreated }) {
  const [orderId, setOrderId] = useState('');
  const [date, setDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [products, setProducts] = useState([{ productName: '', qty: '', deliveryCharge: '', unitPrice: '' }]);
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

    products.forEach((product, index) => {
      if (!product.productName.trim()) next[`productName_${index}`] = 'Product name is required';
      if (!product.qty.trim() || isNaN(Number(product.qty))) next[`qty_${index}`] = 'Valid quantity is required';
      if (!product.deliveryCharge.trim() || isNaN(Number(product.deliveryCharge))) next[`deliveryCharge_${index}`] = 'Valid delivery charge is required';
      if (!product.unitPrice.trim() || isNaN(Number(product.unitPrice))) next[`unitPrice_${index}`] = 'Valid unit price is required';
    });

    return next;
  }

  function clearForm() {
    setOrderId('');
    setDate('');
    setCustomerName('');
    setCustomerId('');
    setAddress('');
    setPhone('');
    setProducts([{ productName: '', qty: '', deliveryCharge: '', unitPrice: '' }]);
    setStatus('Pending');
    setPaymentStatus('Unpaid');
    setErrors({});
  }

  function addProduct() {
    setProducts([...products, { productName: '', qty: '', deliveryCharge: '', unitPrice: '' }]);
  }

  function removeProduct(index) {
    setProducts(products.filter((_, i) => i !== index));
  }

  function handleProductChange(index, field, value) {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
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
      items: products.map(product => ({
        productName: product.productName.trim(),
        qty: Number(product.qty),
        deliveryCharge: Number(product.deliveryCharge),
        unitPrice: Number(product.unitPrice),
      })),
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

          <h2 className="ap-card-title">Products</h2>
          {products.map((product, index) => (
            <div key={index} className="field-row three">
              <div className="field">
                <label>Product Name</label>
                <input
                  type="text"
                  value={product.productName}
                  onChange={(e) => handleProductChange(index, 'productName', e.target.value)}
                  placeholder="e.g., Halo Kitty Doll"
                />
                {errors[`productName_${index}`] && <div className="err">{errors[`productName_${index}`]}</div>}
              </div>
              <div className="field">
                <label>Qty</label>
                <input
                  type="number"
                  value={product.qty}
                  onChange={(e) => handleProductChange(index, 'qty', e.target.value)}
                  placeholder="e.g., 2"
                />
                {errors[`qty_${index}`] && <div className="err">{errors[`qty_${index}`]}</div>}
              </div>
              <div className="field">
                <label>Delivery Charge</label>
                <input
                  type="number"
                  value={product.deliveryCharge}
                  onChange={(e) => handleProductChange(index, 'deliveryCharge', e.target.value)}
                  placeholder="e.g., 50.00"
                />
                {errors[`deliveryCharge_${index}`] && <div className="err">{errors[`deliveryCharge_${index}`]}</div>}
              </div>
              <div className="field">
                <label>Unit Price</label>
                <input
                  type="number"
                  value={product.unitPrice}
                  onChange={(e) => handleProductChange(index, 'unitPrice', e.target.value)}
                  placeholder="e.g., 100.00"
                />
                {errors[`unitPrice_${index}`] && <div className="err">{errors[`unitPrice_${index}`]}</div>}
              </div>
              <div className="field">
                <button type="button" className="btn muted" onClick={() => removeProduct(index)}>
                  Remove Product
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="btn ghost" onClick={addProduct}>
            + Add Another Product
          </button>
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