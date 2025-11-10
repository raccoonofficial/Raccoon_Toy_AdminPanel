import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// FiRuler has been corrected to FiMaximize
import { FiPackage, FiHash, FiTag, FiClipboard, FiDollarSign, FiBarChart2, FiUploadCloud, FiPaperclip, FiMaximize, FiDroplet, FiArchive, FiGift, FiBox, FiCpu } from 'react-icons/fi';
import './Add_Products.css';

const categoryOptions = ['Action Figure', 'Small Action Figure', 'Bricks', 'Vehicle Figure', 'Cute Dolls', 'Small Cute Dolls', 'Decorations'];
const statusOptions = ['Available', 'Stock Out', 'Re-Stock'];
const MAX_IMAGES = 5;

export default function AddProductsPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
  
  const [images, setImages] = useState(Array(MAX_IMAGES).fill(null));
  const [imagePreviews, setImagePreviews] = useState(Array(MAX_IMAGES).fill(null));

  const [specifications, setSpecifications] = useState({
    materials: '',
    dimensions: '',
    color: '',
    weight: '',
    ageRange: '',
    brand: 'RaccoonToy',
  });
  
  const [errors, setErrors] = useState({});

  const profit = useMemo(() => Number(sellingPrice) - Number(buyingCost), [sellingPrice, buyingCost]);
  const marginPct = useMemo(() => (buyingCost > 0 ? (profit / Number(buyingCost)) * 100 : 0), [profit, buyingCost]);

  function generateProductId() {
    const timestamp = Date.now().toString().slice(-8);
    setProductId(`P-${timestamp}`);
  }

  function handleImageUploadClick(index) {
    setActiveImageIndex(index);
    fileInputRef.current?.click();
  }

  function onImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const newImages = [...images];
    newImages[activeImageIndex] = file;
    setImages(newImages);

    const newImagePreviews = [...imagePreviews];
    newImagePreviews[activeImageIndex] = URL.createObjectURL(file);
    setImagePreviews(newImagePreviews);
    
    e.target.value = '';
  }

  function handleSpecChange(e) {
    const { name, value } = e.target;
    setSpecifications(prev => ({ ...prev, [name]: value }));
  }

  function validate() {
    const next = {};
    if (!name.trim()) next.name = 'Product name is required';
    if (!productId.trim()) next.productId = 'Product ID is required';
    if (!imagePreviews[0]) next.image = 'Primary image is required';
    return next;
  }

  function onSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    console.log("Creating product:", { name, productId, images, specifications });
    alert('Product created successfully!');
    navigate('/products');
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
          
          <div className="addp-card">
            <h2 className="addp-card-title">Specifications</h2>
            <div className="addp-spec-grid">
              <div className="addp-field">
                <label htmlFor="materials"><FiBox/> Materials</label>
                <input id="materials" name="materials" type="text" value={specifications.materials} onChange={handleSpecChange} placeholder="e.g., Plastic" />
              </div>
              <div className="addp-field">
                {/* Corrected icon FiMaximize is used here */}
                <label htmlFor="dimensions"><FiMaximize/> Dimensions</label>
                <input id="dimensions" name="dimensions" type="text" value={specifications.dimensions} onChange={handleSpecChange} placeholder="e.g., 12x7x12 cm" />
              </div>
              <div className="addp-field">
                <label htmlFor="color"><FiDroplet/> Color</label>
                <input id="color" name="color" type="text" value={specifications.color} onChange={handleSpecChange} placeholder="e.g., Green" />
              </div>
              <div className="addp-field">
                <label htmlFor="weight"><FiArchive/> Weight</label>
                <input id="weight" name="weight" type="text" value={specifications.weight} onChange={handleSpecChange} placeholder="e.g., 150g" />
              </div>
              <div className="addp-field">
                <label htmlFor="ageRange"><FiGift/> Age Range</label>
                <input id="ageRange" name="ageRange" type="text" value={specifications.ageRange} onChange={handleSpecChange} placeholder="e.g., 6+ years" />
              </div>
              <div className="addp-field">
                <label htmlFor="brand"><FiCpu/> Brand</label>
                <input id="brand" name="brand" type="text" value={specifications.brand} onChange={handleSpecChange} placeholder="e.g., RaccoonToy" />
              </div>
            </div>
          </div>

        </div>

        {/* Right Panel */}
        <div className="addp-right-panel">
          <div className="addp-card">
            <h2 className="addp-card-title">Product Media</h2>
            <p className="addp-media-sub">Add up to 5 images. The first is the primary image.</p>
            
            <div className="addp-uploader addp-uploader-primary" onClick={() => handleImageUploadClick(0)}>
              {imagePreviews[0] ? (
                <img src={imagePreviews[0]} alt="Primary product view" />
              ) : (
                <div className="addp-upload-placeholder">
                  <FiUploadCloud size={32} />
                  <span>Upload Primary Image</span>
                </div>
              )}
            </div>
            {errors.image && <div className="addp-err">{errors.image}</div>}
            
            <div className="addp-secondary-grid">
              {imagePreviews.slice(1).map((preview, index) => (
                <div key={index} className="addp-uploader addp-uploader-secondary" onClick={() => handleImageUploadClick(index + 1)}>
                  {preview ? (
                    <img src={preview} alt={`Secondary product view ${index + 1}`} />
                  ) : (
                    <div className="addp-upload-placeholder-small">
                      <FiUploadCloud size={20} />
                      <span>Add image</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={onImageChange} hidden />
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