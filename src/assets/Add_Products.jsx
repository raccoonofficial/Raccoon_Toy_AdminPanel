import React, { useMemo, useRef, useState } from 'react';
import './Add_Products.css';

const categoryOptions = [
  'Action Figure',
  'Small Action Figure',
  'Bricks',
  'Vechicle Figure',
  'Cute Dolls',
  'Small Cute Dolls',
  'Decorations'
];

const statusOptions = ['Available', 'Stock Out', 'Re-Stock'];

const statusTheme = {
  Available: { class: 'available', bg: '#e8fff3', color: '#1d9b68', border: '#b4f5d4' },
  'Stock Out': { class: 'out', bg: '#ffeaea', color: '#d7261d', border: '#ffd6d6' },
  'Re-Stock': { class: 'restock', bg: '#fcfbe6', color: '#a18400', border: '#f2e3a0' }
};

function fieldNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export default function Add_Products({ onBack, onCreated }) {
  const fileRef = useRef(null);

  const [supplierNumber, setSupplierNumber] = useState('');
  const [name, setName] = useState('');
  const [productId, setProductId] = useState('');
  const [category, setCategory] = useState(categoryOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [inStock, setInStock] = useState(1);
  const [buyingCost, setBuyingCost] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [status, setStatus] = useState(statusOptions[0]);
  const [details, setDetails] = useState('');

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [errors, setErrors] = useState({});

  const profit = useMemo(() => {
    const t = fieldNumber(totalCost);
    const s = fieldNumber(sellingPrice);
    return s - t;
  }, [totalCost, sellingPrice]);

  const marginPct = useMemo(() => {
    const t = fieldNumber(totalCost);
    if (!t) return 0;
    return (profit / t) * 100;
  }, [profit, totalCost]);

  function generateProductId() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    setProductId(`P_${y}${m}${d}${hh}${mm}${ss}`);
  }

  function onPickImage() {
    fileRef.current?.click();
  }

  function onImageChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    const url = URL.createObjectURL(f);
    setImagePreview(url);
  }

  function validate() {
    const next = {};
    if (!supplierNumber || Number.isNaN(Number(supplierNumber))) next.supplierNumber = 'Supplier Number is required';
    if (!name.trim()) next.name = 'Product name is required';
    if (!productId.trim()) next.productId = 'Product ID is required';
    if (!category) next.category = 'Category is required';
    if (!Number.isFinite(Number(quantity)) || Number(quantity) <= 0) next.quantity = 'Qty must be > 0';
    if (!Number.isFinite(Number(inStock)) || Number(inStock) < 0) next.inStock = 'In stock must be >= 0';
    if (Number(inStock) > Number(quantity)) next.inStock = 'In stock cannot exceed Qty';
    if (!Number.isFinite(Number(buyingCost)) || Number(buyingCost) < 0) next.buyingCost = 'Invalid';
    if (!Number.isFinite(Number(totalCost)) || Number(totalCost) < 0) next.totalCost = 'Invalid';
    if (!Number.isFinite(Number(sellingPrice)) || Number(sellingPrice) < 0) next.sellingPrice = 'Invalid';
    if (!status) next.status = 'Status is required';
    return next;
  }

  function clearForm() {
    setSupplierNumber('');
    setName('');
    setProductId('');
    setCategory(categoryOptions[0]);
    setQuantity(1);
    setInStock(1);
    setBuyingCost('');
    setTotalCost('');
    setSellingPrice('');
    setStatus(statusOptions[0]);
    setDetails('');
    setImageFile(null);
    setImagePreview('');
    setErrors({});
  }

  function onSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    const payload = {
      supplierNumber: Number(supplierNumber),
      product: {
        name: name.trim(),
        productId: productId.trim(),
        category,
        quantity: Number(quantity),
        inStock: Number(inStock),
        buyingCost: Number(buyingCost),
        totalCost: Number(totalCost),
        sellingPrice: Number(sellingPrice),
        status,
        details: details.trim(),
        imageName: imageFile?.name || ''
      }
    };

    try {
      const drafts = JSON.parse(localStorage.getItem('newProductDrafts') || '[]');
      drafts.push(payload);
      localStorage.setItem('newProductDrafts', JSON.stringify(drafts));
    } catch {}

    onCreated?.(); // signal parent (AdminPanel) to switch back to list
  }

  return (
    <section className="add-products-page">
      <div className="ap-header">
        <h1>Add Product</h1>
        {/* Top-right actions removed as requested */}
      </div>

      <form id="add-product-form" className="ap-form" onSubmit={onSubmit} noValidate>
        <div className="ap-grid">
          {/* Left column: Product core fields */}
          <div className="ap-card">
            <h2 className="ap-card-title">Product Information</h2>

            <div className="field-row two">
              <div className="field">
                <label>Supplier Number</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={supplierNumber}
                  onChange={(e) => setSupplierNumber(e.target.value)}
                  placeholder="e.g., 1"
                />
                {errors.supplierNumber && <div className="err">{errors.supplierNumber}</div>}
              </div>
              <div className="field">
                <label>Product ID</label>
                <div className="with-button">
                  <input
                    type="text"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="P_2025100001"
                  />
                  <button type="button" className="btn mini" onClick={generateProductId}>Generate</button>
                </div>
                {errors.productId && <div className="err">{errors.productId}</div>}
              </div>
            </div>

            <div className="field">
              <label>Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Iron Man"
              />
              {errors.name && <div className="err">{errors.name}</div>}
            </div>

            <div className="field">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <div className="err">{errors.category}</div>}
            </div>

            <div className="field-row three">
              <div className="field">
                <label>Qty</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={quantity}
                  onChange={(e) => {
                    const v = e.target.value;
                    setQuantity(v);
                    if (Number(inStock) > Number(v)) setInStock(v);
                  }}
                />
                {errors.quantity && <div className="err">{errors.quantity}</div>}
              </div>
              <div className="field">
                <label>In Stock</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={inStock}
                  onChange={(e) => setInStock(e.target.value)}
                />
                {errors.inStock && <div className="err">{errors.inStock}</div>}
              </div>
              <div className="field">
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.status && <div className="err">{errors.status}</div>}
              </div>
            </div>

            <div className="field-row three">
              <div className="field">
                <label>Buying Cost</label>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  value={buyingCost}
                  onChange={(e) => setBuyingCost(e.target.value)}
                  placeholder="e.g., 500"
                />
                {errors.buyingCost && <div className="err">{errors.buyingCost}</div>}
              </div>
              <div className="field">
                <label>Total Cost</label>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  value={totalCost}
                  onChange={(e) => setTotalCost(e.target.value)}
                  placeholder="e.g., 755"
                />
                {errors.totalCost && <div className="err">{errors.totalCost}</div>}
              </div>
              <div className="field">
                <label>Selling Price</label>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  placeholder="e.g., 900"
                />
                {errors.sellingPrice && <div className="err">{errors.sellingPrice}</div>}
              </div>
            </div>

            <div className="metrics">
              <div className="chip">Profit: <strong>{Number.isFinite(profit) ? `${profit} TK` : '—'}</strong></div>
              <div className="chip">Margin: <strong>{Number.isFinite(marginPct) ? `${marginPct.toFixed(1)}%` : '—'}</strong></div>
            </div>
          </div>

          {/* Right column: Media & details */}
          <div className="ap-card">
            <h2 className="ap-card-title">Media & Details</h2>

            <div className="uploader">
              <div className="upload-box" onClick={onPickImage} role="button" tabIndex={0}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Product preview" />
                ) : (
                  <div className="placeholder">
                    <span className="plus">+</span>
                    <span>Upload Image</span>
                  </div>
                )}
                <input type="file" accept="image/*" ref={fileRef} onChange={onImageChange} hidden />
              </div>
              <div
                className={`status-chip ${statusTheme[status].class}`}
                style={{
                  background: statusTheme[status].bg,
                  color: statusTheme[status].color,
                  borderColor: statusTheme[status].border
                }}
              >
                {status}
              </div>
            </div>

            <div className="field">
              <label>Details</label>
              <textarea
                rows={8}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Add product details, notes, variations, etc."
              />
            </div>
          </div>
        </div>

        {/* Bottom buttons for small screens */}
        <div className="ap-actions bottom">
          <button type="button" className="btn ghost" onClick={() => onBack?.()}>Back</button>
          <button type="button" className="btn muted" onClick={clearForm}>Reset</button>
          <button type="submit" className="btn primary">Create Product</button>
        </div>
      </form>
    </section>
  );
}