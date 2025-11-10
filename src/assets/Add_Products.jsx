import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiHash, FiTag, FiClipboard, FiDollarSign, FiBarChart2, FiUploadCloud, FiPaperclip } from 'react-icons/fi';
import './Add_Products.css';

const categoryOptions = ['Action Figure', 'Small Action Figure', 'Bricks', 'Vehicle Figure', 'Cute Dolls', 'Small Cute Dolls', 'Decorations'];
const statusOptions = ['Available', 'Stock Out', 'Re-Stock'];

export default function AddProductsPage() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [supplierNumber, setSupplierNumber] = useState('');
  const [name, setName] = useState('');
  const [productId, setProductId] = useState('');
  const [category, setCategory] = useState(categoryOptions[0]);
  const [orderQty, setOrderQty] = useState(1);
  const [inStock, setInStock] = useState(1);
  const [buyingCost, setBuyingCost] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [status, setStatus] = useState(statusOptions[0]);
  const [details, setDetails] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});

  const profit = useMemo(() => Number(sellingPrice) - Number(buyingCost), [sellingPrice, buyingCost]);
  const marginPct = useMemo(() => (buyingCost > 0 ? (profit / Number(buyingCost)) * 100 : 0), [profit, buyingCost]);

  function generateProductId() {
    const timestamp = Date.now().toString().slice(-8);
    setProductId(`P-${timestamp}`);
  }

  function onImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function validate() {
    // Validation logic can be expanded here
    const next = {};
    if (!name.trim()) next.name = 'Product name is required';
    if (!productId.trim()) next.productId = 'Product ID is required';
    return next;
  }

  function onSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    console.log("Creating product:", { name, productId });
    // In a real app, you would send this data to an API
    alert('Product created successfully!');
    navigate('/products'); // Navigate back to the list
  }

  return (
    <section className="addp-page">
      <header className="addp-header">
        <h1>Add New Product</h1>
        <div className="addp-header-actions">
          <button type="button" className="addp-btn addp-btn-muted" onClick={() => navigate('/products')}>Back to List</button>
          <button type="submit" form="add-product-form" className="addp-btn addp-btn-primary">Create Product</button>
        </div>
      </header>

      <form id="add-product-form" className="addp-form-grid" onSubmit={onSubmit} noValidate>
        {/* Left Panel */}
        <div className="addp-left-panel">
          <div className="addp-card">
            <h2 className="addp-card-title">Product Information</h2>
            <div className="addp-field">
              <label htmlFor="name"><FiPackage /> Product Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Iron Man Action Figure" />
              {errors.name && <div className="addp-err">{errors.name}</div>}
            </div>
            <div className="addp-field-row">
              <div className="addp-field">
                <label htmlFor="productId"><FiHash /> Product ID</label>
                <div className="addp-input-with-btn">
                  <input id="productId" type="text" value={productId} onChange={(e) => setProductId(e.target.value)} placeholder="Click Generate" />
                  <button type="button" onClick={generateProductId}>Generate</button>
                </div>
                {errors.productId && <div className="addp-err">{errors.productId}</div>}
              </div>
              <div className="addp-field">
                <label htmlFor="category"><FiTag /> Category</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="addp-card">
            <h2 className="addp-card-title">Inventory & Pricing</h2>
             <div className="addp-field-row">
              <div className="addp-field">
                <label htmlFor="orderQty">Order Qty</label>
                <input id="orderQty" type="number" value={orderQty} onChange={(e) => setOrderQty(Number(e.target.value))} />
              </div>
              <div className="addp-field">
                <label htmlFor="inStock">In Stock</label>
                <input id="inStock" type="number" value={inStock} onChange={(e) => setInStock(Number(e.target.value))} />
              </div>
               <div className="addp-field">
                <label htmlFor="supplierNumber">Supplier #</label>
                <input id="supplierNumber" type="number" value={supplierNumber} onChange={(e) => setSupplierNumber(Number(e.target.value))} placeholder="e.g., 1" />
              </div>
            </div>
            <div className="addp-field-row">
              <div className="addp-field">
                <label htmlFor="buyingCost"><FiDollarSign /> Buying Cost</label>
                <input id="buyingCost" type="number" value={buyingCost} onChange={(e) => setBuyingCost(e.target.value)} placeholder="0.00" />
              </div>
              <div className="addp-field">
                <label htmlFor="sellingPrice"><FiDollarSign /> Selling Price</label>
                <input id="sellingPrice" type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder="0.00" />
              </div>
            </div>
            <div className="addp-metrics">
              <div className="addp-chip"><FiBarChart2 /> Profit: <strong>${profit.toFixed(2)}</strong></div>
              <div className="addp-chip">Margin: <strong>{marginPct.toFixed(1)}%</strong></div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="addp-right-panel">
          <div className="addp-card">
            <h2 className="addp-card-title">Product Media</h2>
            <div className="addp-uploader" onClick={() => fileRef.current?.click()}>
              {imagePreview ? (
                <img src={imagePreview} alt="Product Preview" />
              ) : (
                <div className="addp-upload-placeholder">
                  <FiUploadCloud size={32} />
                  <span>Click to upload image</span>
                </div>
              )}
              <input type="file" accept="image/*" ref={fileRef} onChange={onImageChange} hidden />
            </div>
          </div>

          <div className="addp-card">
            <h2 className="addp-card-title">Details & Status</h2>
            <div className="addp-field">
              <label htmlFor="status"><FiPaperclip /> Status</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="addp-field">
              <label htmlFor="details"><FiClipboard /> Product Details</label>
              <textarea id="details" rows={6} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Add notes, variations, etc." />
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}