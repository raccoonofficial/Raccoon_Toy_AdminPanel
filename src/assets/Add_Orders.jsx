import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHash, FiCalendar, FiUser, FiHome, FiPhone, FiArchive, FiDollarSign, FiPlus, FiClipboard, FiPackage, FiSearch, FiPercent } from 'react-icons/fi';
import { Trash2 } from 'lucide-react';
import './Add_Orders.css';

// --- SIMULATED PRODUCT INVENTORY ---
const inventoryProducts = [
  { id: 'P-1001', name: 'Sazule Action Figure (Big)', price: 1260 },
  { id: 'P-1002', name: 'Halo Kitty Bricks', price: 215 },
  { id: 'P-1003', name: 'Goku Action Figure', price: 700 },
  { id: 'P-1004', name: 'Iron Man Action Figure', price: 1500 },
  { id: 'P-1005', name: 'Vehicle Figure', price: 450 },
  { id: 'P-1006', name: 'Cute Dolls', price: 350 },
];

const deliveryOptions = [
    { label: 'Free', value: 0 },
    { label: 'Standard (60 TK)', value: 60 },
    { label: 'Express (120 TK)', value: 120 },
];

// --- STABLE ProductSearch COMPONENT ---
function ProductSearch({ lineId, selectedProduct, onProductSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const filteredProducts = inventoryProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (product) => {
        onProductSelect(lineId, product);
        setSearchTerm('');
        setIsFocused(false);
    };

    if (selectedProduct) {
        return (
            <div className="product-search-selected">
                <span>{selectedProduct.name}</span>
                <button onClick={() => onProductSelect(lineId, null)}>&#x2715;</button>
            </div>
        );
    }
    
    return (
        <div className="product-search-container" onBlur={() => setTimeout(() => setIsFocused(false), 150)}>
            <div className="product-search-input-wrapper">
                <FiSearch className="search-icon" />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    placeholder="Search for a product..."
                />
            </div>
            {isFocused && searchTerm && (
                <div className="product-search-results">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(p => (
                            <div key={p.id} className="search-result-item" onClick={() => handleSelect(p)}>
                                {p.name}
                            </div>
                        ))
                    ) : (
                        <div className="search-result-item none">No products found</div>
                    )}
                </div>
            )}
        </div>
    );
}


export default function Add_Orders({ onBack, onCreated }) {
  const navigate = useNavigate();
  // --- Core States ---
  const [orderId, setOrderId] = useState('');
  const [date, setDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('Pending');
  const [paymentStatus, setPaymentStatus] = useState('Unpaid');
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [errors, setErrors] = useState({});
  const [globalDiscountFixed, setGlobalDiscountFixed] = useState('');
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState('');


  // --- Products State with Discount ---
  const [products, setProducts] = useState([{ 
      id: 1, 
      product: null,
      qty: '1', 
      deliveryCharge: '60',
      discountFixed: '',
      discountPercent: ''
  }]);

  // --- Real-time Price Calculation ---
  const priceSummary = useMemo(() => {
      let subtotal = 0;
      let totalDiscount = 0;
      let totalDelivery = 0;

      products.forEach(p => {
          if (p.product) {
              const lineTotal = p.product.price * (Number(p.qty) || 0);
              subtotal += lineTotal;
              
              let lineDiscount = 0;
              // Prioritize fixed discount if both exist, but logic should prevent that
              if (p.discountFixed) {
                  lineDiscount = Number(p.discountFixed) || 0;
              } else if (p.discountPercent) {
                  lineDiscount = lineTotal * ((Number(p.discountPercent) || 0) / 100);
              }
              totalDiscount += lineDiscount;
          }
          totalDelivery += Number(p.deliveryCharge) || 0;
      });

      const subtotalAfterDiscount = subtotal - totalDiscount;
      const grandTotal = subtotalAfterDiscount + totalDelivery;
      
      return { subtotal, totalDiscount, subtotalAfterDiscount, totalDelivery, grandTotal };
  }, [products]);


  function validate() { /* Validation logic remains the same */ return {}; }
  function generateOrderId() { setOrderId(`ORD-${Date.now().toString().slice(-8)}`); }

  // --- Handlers ---
  function handleProductUpdate(lineId, field, value) {
    setProducts(products.map(p => p.id === lineId ? { ...p, [field]: value } : p));
  }
  
  function handleDiscountChange(lineId, type, value) {
      setProducts(currentProducts => currentProducts.map(p => {
          if (p.id === lineId) {
              if (!p.product || !p.qty || Number(p.qty) <= 0) {
                  return type === 'fixed' ? { ...p, discountFixed: value, discountPercent: '' } : { ...p, discountFixed: '', discountPercent: value };
              }

              const lineTotal = p.product.price * Number(p.qty);
              const numericValue = Number(value) || 0;

              if (type === 'fixed') {
                  const percent = lineTotal > 0 ? (numericValue / lineTotal) * 100 : 0;
                  return { ...p, discountFixed: value, discountPercent: percent > 0 ? percent.toFixed(2) : '' };
              } else {
                  const fixed = lineTotal * (numericValue / 100);
                  return { ...p, discountFixed: fixed > 0 ? fixed.toFixed(2) : '', discountPercent: value };
              }
          }
          return p;
      }));
  }

  function handleGlobalDiscountChange(type, value) {
      const numericValue = Number(value) || 0;
      const totalSubtotal = priceSummary.subtotal;

      if (type === 'fixed') {
          const percent = totalSubtotal > 0 ? (numericValue / totalSubtotal) * 100 : 0;
          setGlobalDiscountFixed(value);
          setGlobalDiscountPercent(percent > 0 ? percent.toFixed(2) : '');
      } else { // percent
          const fixed = totalSubtotal * (numericValue / 100);
          setGlobalDiscountFixed(fixed > 0 ? fixed.toFixed(2) : '');
          setGlobalDiscountPercent(value);
      }
  }
  
  function applyGlobalDiscount() {
      const percentToApply = Number(globalDiscountPercent) || 0;
      if (percentToApply <= 0) return;

      setProducts(currentProducts => currentProducts.map(p => {
          if (p.product && p.qty > 0) {
              const lineTotal = p.product.price * Number(p.qty);
              const fixedDiscount = lineTotal * (percentToApply / 100);
              return {
                  ...p,
                  discountPercent: percentToApply.toFixed(2),
                  discountFixed: fixedDiscount.toFixed(2)
              };
          }
          return p;
      }));
  }

  function handleProductSelect(lineId, selectedProduct) {
      setProducts(products.map(p => p.id === lineId ? { ...p, product: selectedProduct, discountFixed: '', discountPercent: '' } : p));
  }

  function addProduct() {
    setProducts([...products, { id: Date.now(), product: null, qty: '1', deliveryCharge: '60', discountFixed: '', discountPercent: '' }]);
  }

  function removeProduct(id) { setProducts(products.filter(p => p.id !== id)); }
  function onSubmit(e) { /* Submission logic remains the same */ e.preventDefault(); onCreated?.(); }

  return (
    <section className="add-order-page">
      <header className="add-order-header">
        <h1>Add New Order</h1>
        <div className="add-order-header-actions">
          <button type="button" className="add-order-btn add-order-btn-muted" onClick={() => onBack?.()}>Back to List</button>
          <button type="submit" form="add-order-form" className="add-order-btn add-order-btn-primary">Create Order</button>
        </div>
      </header>

      <form id="add-order-form" className="add-order-form-container" onSubmit={onSubmit} noValidate>
        
        {/* --- Top Section: Customer & Order Details --- */}
        <div className="add-order-section-grid two-col">
            <div className="add-order-card">
              <h2 className="add-order-card-title">Customer Information</h2>
              <div className="add-order-field">
                <label htmlFor="customerName"><FiUser /> Customer Name</label>
                <input id="customerName" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g., Noor Zahan" />
              </div>
              <div className="add-order-field">
                <label htmlFor="address"><FiHome /> Full Address</label>
                <textarea id="address" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g., 123 Main St, Anytown"></textarea>
              </div>
            </div>
            <div className="add-order-card">
              <h2 className="add-order-card-title">Order Details</h2>
              <div className="add-order-field-row">
                <div className="add-order-field">
                  <label htmlFor="orderId"><FiHash /> Order ID</label>
                  <div className="add-order-input-with-btn">
                    <input id="orderId" type="text" value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Click Generate" />
                    <button type="button" onClick={generateOrderId}>Generate</button>
                  </div>
                </div>
                <div className="add-order-field">
                  <label htmlFor="date"><FiCalendar /> Order Date</label>
                  <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
              </div>
               <div className="add-order-field-row">
                  <div className="add-order-field">
                      <label htmlFor="customerId"><FiHash /> Customer ID</label>
                      <input id="customerId" type="text" value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder="Optional" />
                  </div>
                  <div className="add-order-field">
                      <label htmlFor="phone"><FiPhone /> Contact Phone</label>
                      <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" />
                  </div>
              </div>
            </div>
        </div>

        {/* --- Middle Section: Products & Finalization --- */}
        <div className="add-order-section-grid main-section">
            <div className="add-order-card product-card">
                <h2 className="add-order-card-title">Products</h2>
                <div className="product-list-body">
                    {products.map(p => (
                        <div key={p.id} className="product-list-row">
                            <div className="product-main-details">
                                <ProductSearch lineId={p.id} selectedProduct={p.product} onProductSelect={handleProductSelect} />
                                <div className="details-grid">
                                    <div className="add-order-field">
                                        <label>Unit Price</label>
                                        <input type="text" value={p.product ? p.product.price.toFixed(2) : '0.00'} readOnly className="price-display" />
                                    </div>
                                    <div className="add-order-field">
                                        <label>Qty</label>
                                        <input type="number" value={p.qty} onChange={e => handleProductUpdate(p.id, 'qty', e.target.value)} placeholder="1" />
                                    </div>
                                </div>
                            </div>
                            <div className="product-discount-details">
                                <label>Discount</label>
                                <div className="discount-grid">
                                    <div className="add-order-input-with-icon">
                                        <FiDollarSign />
                                        <input type="number" placeholder="Fixed" value={p.discountFixed} onChange={e => handleDiscountChange(p.id, 'fixed', e.target.value)} />
                                    </div>
                                    <div className="add-order-input-with-icon">
                                        <FiPercent />
                                        <input type="number" placeholder="Percent" value={p.discountPercent} onChange={e => handleDiscountChange(p.id, 'percent', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div className="product-delivery-details">
                               <label>Delivery</label>
                               <select value={p.deliveryCharge} onChange={e => handleProductUpdate(p.id, 'deliveryCharge', e.target.value)}>
                                 {deliveryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                               </select>
                            </div>
                            <div className="product-actions">
                                {products.length > 1 && (
                                <button type="button" className="add-order-btn-icon" onClick={() => removeProduct(p.id)}><Trash2 size={16} /></button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <button type="button" className="add-order-btn add-order-btn-ghost" onClick={addProduct}>
                    <FiPlus size={16} /> Add Product
                </button>
                <div className="global-discount-section">
                    <h3 className="global-discount-title">Global Discount</h3>
                    <div className="global-discount-inputs">
                        <div className="add-order-input-with-icon">
                            <FiDollarSign />
                            <input type="number" placeholder="Fixed Amount" value={globalDiscountFixed} onChange={e => handleGlobalDiscountChange('fixed', e.target.value)} />
                        </div>
                        <div className="add-order-input-with-icon">
                            <FiPercent />
                            <input type="number" placeholder="Percentage" value={globalDiscountPercent} onChange={e => handleGlobalDiscountChange('percent', e.target.value)} />
                        </div>
                        <button type="button" className="add-order-btn" onClick={applyGlobalDiscount}>Apply</button>
                    </div>
                </div>
            </div>
            <div className="right-panel-stack">
              <div className="add-order-card">
                <h2 className="add-order-card-title">Finalize Order</h2>
                <div className="add-order-field">
                  <label htmlFor="paymentStatus"><FiClipboard /> Payment Status</label>
                  <select id="paymentStatus" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Advance">Advance</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                <div className="add-order-field">
                  <label htmlFor="orderStatus"><FiArchive /> Order Status</label>
                  <select id="orderStatus" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Packed">Packed</option>
                    <option value="Send">Send</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Pre-order">Pre-order</option>
                  </select>
                </div>
                <div className="add-order-field">
                    <label>Marketing</label>
                    <div className="toggle-switch">
                        <input type="checkbox" id="marketing" checked={marketingOptIn} onChange={() => setMarketingOptIn(!marketingOptIn)} />
                        <label htmlFor="marketing">Customer agrees to receive marketing content</label>
                    </div>
                </div>
              </div>
              {paymentStatus === 'Advance' && (
                <div className="add-order-card">
                  <h2 className="add-order-card-title">Advance Payment</h2>
                  <div className="add-order-field">
                    <label htmlFor="advanceAmount"><FiDollarSign /> Advance Amount (TK)</label>
                    <input id="advanceAmount" type="number" value={advanceAmount} onChange={(e) => setAdvanceAmount(e.target.value)} placeholder="e.g., 500" />
                  </div>
                </div>
              )}
            </div>
        </div>

        {/* --- Bottom Section: Price Summary --- */}
        <div className="add-order-card price-summary-card">
            <h2 className="add-order-card-title">Total Summary</h2>
            <div className="summary-grid">
                <div className="summary-item">
                    <span>Subtotal</span>
                    <span className="summary-value">{priceSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-item discount">
                    <span>Discount</span>
                    <span className="summary-value">- {priceSummary.totalDiscount.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                    <span>Subtotal after Discount</span>
                    <span className="summary-value">{priceSummary.subtotalAfterDiscount.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                    <span>Delivery</span>
                    <span className="summary-value">{priceSummary.totalDelivery.toFixed(2)}</span>
                </div>
                <div className="summary-item grand-total">
                    <span>Grand Total</span>
                    <span className="summary-value grand-total-value">{priceSummary.grandTotal.toFixed(2)} TK</span>
                </div>
            </div>
        </div>
      </form>
    </section>
  );
}