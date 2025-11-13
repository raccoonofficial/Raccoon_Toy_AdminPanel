import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHash, FiCalendar, FiUser, FiHome, FiPhone, FiArchive, FiDollarSign, FiPlus, FiClipboard, FiPackage, FiSearch, FiPercent, FiEdit2, FiMail, FiStar, FiShoppingBag, FiGlobe } from 'react-icons/fi';
import { CheckCircle, Circle, Package, Send, ShoppingCart, Truck, UserPlus } from 'lucide-react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { Trash2 } from 'lucide-react';
import './Add_Orders.css';

// --- SIMULATED DATABASES ---
const inventoryProducts = [
  { id: 'P-1001', name: 'Sazule Action Figure (Big)', price: 1260 },
  { id: 'P-1002', name: 'Halo Kitty Bricks', price: 215 },
  { id: 'P-1003', name: 'Goku Action Figure', price: 700 },
  { id: 'P-1004', name: 'Iron Man Action Figure', price: 1500 },
  { id: 'P-1005', name: 'Vehicle Figure', price: 450 },
  { id: 'P-1006', name: 'Cute Dolls', price: 350 },
];

const simulatedCustomers = [
  { id: 'CUST-101', name: 'Noor Zahan', email: 'noor.zahan@example.com', phone: '555-0101', address: '123 Main St, Anytown, USA', orderHistoryCount: 12, loyaltyTier: 'Gold' },
  { id: 'CUST-102', name: 'Kabir Singh', email: 'kabir.s@example.com', phone: '555-0102', address: '456 Oak Ave, Sometown, USA', orderHistoryCount: 3, loyaltyTier: 'Bronze' },
  { id: 'CUST-103', name: 'Alia Bhatt', email: 'alia.b@example.com', phone: '555-0103', address: '789 Pine Ln, Otherville, USA', orderHistoryCount: 1, loyaltyTier: 'Basic' },
];


const deliveryOptions = [
    { label: 'Free', value: 0 },
    { label: 'Standard (60 TK)', value: 60 },
    { label: 'Express (120 TK)', value: 120 },
];

const orderStatusSteps = [
    { name: 'Pending', icon: <ShoppingCart size={24}/> },
    { name: 'Packed', icon: <Package size={24}/> },
    { name: 'Send', icon: <Send size={24}/> },
    { name: 'Delivered', icon: <Truck size={24}/> },
];

// --- Reusable Search Components ---
function ProductSearch({ lineId, selectedProduct, onProductSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const filteredProducts = inventoryProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
        <div className="search-container" onBlur={() => setTimeout(() => setIsFocused(false), 150)}>
            <div className="search-input-wrapper">
                <FiSearch className="search-icon" />
                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onFocus={() => setIsFocused(true)} placeholder="Search for a product..."/>
            </div>
            {isFocused && searchTerm && (
                <div className="search-results">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(p => (
                            <div key={p.id} className="search-result-item" onClick={() => handleSelect(p)}>{p.name}</div>
                        ))
                    ) : ( <div className="search-result-item none">No products found</div> )}
                </div>
            )}
        </div>
    );
}

function CustomerSearch({ onCustomerSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    
    const filteredCustomers = simulatedCustomers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (customer) => {
        onCustomerSelect(customer);
        setSearchTerm('');
        setIsFocused(false);
    };

    return (
        <div className="search-container" onBlur={() => setTimeout(() => setIsFocused(false), 150)}>
            <div className="search-input-wrapper">
                <FiSearch className="search-icon" />
                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onFocus={() => setIsFocused(true)} placeholder="Search by name, email, or phone..."/>
            </div>
            {isFocused && searchTerm && (
                <div className="search-results">
                    {filteredCustomers.length > 0 ? (
                        filteredCustomers.map(c => (
                            <div key={c.id} className="search-result-item" onClick={() => handleSelect(c)}>
                                <span className="customer-name">{c.name}</span>
                                <span className="customer-contact">{c.email}</span>
                            </div>
                        ))
                    ) : (<div className="search-result-item none">No customers found</div>)}
                </div>
            )}
        </div>
    );
}

function OrderStatusTrail({ currentStatus }) {
    const currentStatusIndex = orderStatusSteps.findIndex(s => s.name === currentStatus);
    return (
        <div className="order-status-trail">
            {orderStatusSteps.map((step, index) => (
                <React.Fragment key={step.name}>
                    <div className={`trail-item ${index <= currentStatusIndex ? 'completed' : ''}`}>
                        <div className="trail-icon">{step.icon}</div>
                        <div className="trail-name">{step.name}</div>
                    </div>
                    {index < orderStatusSteps.length - 1 && <div className="trail-connector"></div>}
                </React.Fragment>
            ))}
        </div>
    );
}


export default function Add_Orders({ onBack, onCreated }) {
  const navigate = useNavigate();
  // --- Core States ---
  const [orderId, setOrderId] = useState('');
  const [date, setDate] = useState('2025-11-12');
  const [stdId, setStdId] = useState('');
  const [orderSource, setOrderSource] = useState('Facebook');
  const [status, setStatus] = useState('Pending');
  const [deliveryCharge, setDeliveryCharge] = useState('60');
  const [paymentStatus, setPaymentStatus] = useState('Unpaid');
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [notes, setNotes] = useState('');
  const [hiddenCharge, setHiddenCharge] = useState('');
  const [errors, setErrors] = useState({});
  const [globalDiscountFixed, setGlobalDiscountFixed] = useState('');
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState('');

  // --- Customer States ---
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({ name: '', email: '', phone: '', address: '' });
  const [modifiedFields, setModifiedFields] = useState({ name: false, email: false, phone: false, address: false });

  // Effect to update form when a customer is selected
  useEffect(() => {
    if (selectedCustomer) {
      setCustomerDetails({
        name: selectedCustomer.name,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone,
        address: selectedCustomer.address,
      });
      // Reset modified indicators on new customer selection
      setModifiedFields({ name: false, email: false, phone: false, address: false });
    } else {
      setCustomerDetails({ name: '', email: '', phone: '', address: '' });
    }
  }, [selectedCustomer]);
  
  // Handle changes and track modifications
  const handleCustomerDetailChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));

    if (selectedCustomer) {
        setModifiedFields(prev => ({
            ...prev,
            [name]: value !== selectedCustomer[name]
        }));
    }
  };


  // --- Products State ---
  const [products, setProducts] = useState([{ 
      id: 1, 
      product: null,
      qty: '1',
      discountFixed: '',
      discountPercent: ''
  }]);

  // --- Real-time Price Calculation ---
  const priceSummary = useMemo(() => {
      let subtotal = 0;
      let totalLineItemDiscount = 0;

      products.forEach(p => {
          if (p.product) {
              const lineTotal = p.product.price * (Number(p.qty) || 0);
              subtotal += lineTotal;
              
              let lineDiscount = 0;
              if (p.discountFixed) {
                  lineDiscount = Number(p.discountFixed) || 0;
              } else if (p.discountPercent) {
                  lineDiscount = lineTotal * ((Number(p.discountPercent) || 0) / 100);
              }
              totalLineItemDiscount += lineDiscount;
          }
      });

      const subtotalAfterLineItemDiscount = subtotal - totalLineItemDiscount;

      let globalDiscountAmount = 0;
      if (globalDiscountFixed) {
          globalDiscountAmount = Number(globalDiscountFixed) || 0;
      } else if (globalDiscountPercent) {
          globalDiscountAmount = subtotalAfterLineItemDiscount * ((Number(globalDiscountPercent) || 0) / 100);
      }
      
      const totalDiscount = totalLineItemDiscount + globalDiscountAmount;
      const subtotalAfterTotalDiscount = subtotal - totalDiscount;
      const parsedHiddenCharge = Number(hiddenCharge) || 0;
      const totalDelivery = Number(deliveryCharge) || 0;
      const grandTotal = subtotalAfterTotalDiscount + totalDelivery + parsedHiddenCharge;
      
      return { subtotal, totalDiscount, grandTotal, totalDelivery, subtotalAfterDiscount: subtotalAfterTotalDiscount, hiddenCharge: parsedHiddenCharge };
  }, [products, globalDiscountFixed, globalDiscountPercent, hiddenCharge, deliveryCharge]);


  function generateOrderId() { setOrderId(`ORD-${Date.now().toString().slice(-8)}`); }
  function handleProductUpdate(lineId, field, value) { setProducts(products.map(p => p.id === lineId ? { ...p, [field]: value } : p)); }
  function addProduct() { setProducts([...products, { id: Date.now(), product: null, qty: '1', discountFixed: '', discountPercent: '' }]); }
  function removeProduct(id) { setProducts(products.filter(p => p.id !== id)); }
  function onSubmit(e) { e.preventDefault(); onCreated?.(); }

  // --- Discount Handlers ---
  function handleDiscountChange(lineId, type, value) {
      setProducts(currentProducts => currentProducts.map(p => {
          if (p.id === lineId) {
              const lineTotal = p.product ? p.product.price * Number(p.qty) : 0;
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
      const baseSubtotal = priceSummary.subtotal - (priceSummary.totalDiscount - (Number(globalDiscountFixed) || 0));

      if (type === 'fixed') {
          const percent = baseSubtotal > 0 ? (numericValue / baseSubtotal) * 100 : 0;
          setGlobalDiscountFixed(value);
          setGlobalDiscountPercent(percent > 0 ? percent.toFixed(2) : '');
      } else {
          const fixed = baseSubtotal * (numericValue / 100);
          setGlobalDiscountFixed(fixed > 0 ? fixed.toFixed(2) : '');
          setGlobalDiscountPercent(value);
      }
  }

  function handleProductSelect(lineId, selectedProduct) {
      setProducts(products.map(p => p.id === lineId ? { ...p, product: selectedProduct, discountFixed: '', discountPercent: '' } : p));
  }

  return (
    <section className="add-order-page">
      <header className="add-order-header">
        <h1>Add New Order</h1>
        <div className="add-order-header-actions">
          <button type="button" className="add-order-btn add-order-btn-muted" onClick={() => onBack?.()}>Back to List</button>
          <button type="submit" form="add-order-form" className="add-order-btn add-order-btn-primary">Create Order</button>
        </div>
      </header>
      
      <OrderStatusTrail currentStatus={status} />

      <form id="add-order-form" className="add-order-form-container" onSubmit={onSubmit} noValidate>
        
        {/* --- Top Section: Customer & Order Details --- */}
        <div className="add-order-section-grid two-col">
            <div className="add-order-card">
              <div className="customer-card-header">
                <h2 className="add-order-card-title">Customer Information</h2>
                {selectedCustomer && (
                  <button type="button" className="change-customer-btn" onClick={() => setSelectedCustomer(null)}>Change</button>
                )}
              </div>

              {!selectedCustomer ? (
                <div className="customer-search-area">
                    <CustomerSearch onCustomerSelect={setSelectedCustomer} />
                    <div className="customer-search-divider">
                        <span>OR</span>
                    </div>
                    <button type="button" className="add-order-btn add-order-btn-ghost" onClick={() => navigate('/users/add')}>
                        <UserPlus size={16} /> Create New Customer
                    </button>
                </div>
              ) : (
                <div className="inline-editable-customer-details">
                    <div className="customer-stats-grid">
                        <div className="customer-stat-item">
                            <span>Customer ID</span>
                            <strong>{selectedCustomer.id}</strong>
                        </div>
                         <div className="customer-stat-item">
                            <span>Prev. Orders</span>
                            <strong>{selectedCustomer.orderHistoryCount}</strong>
                        </div>
                        <div className="customer-stat-item">
                            <span>Loyalty Tier</span>
                            <strong className={`cvc-tier-${selectedCustomer.loyaltyTier.toLowerCase()}`}>{selectedCustomer.loyaltyTier}</strong>
                        </div>
                    </div>
                    <div className="customer-details-row">
                        <div className="inline-field">
                            <FiUser />
                            <input name="name" type="text" value={customerDetails.name} onChange={handleCustomerDetailChange} className="info-display-input" />
                            {modifiedFields.name && <span className="modified-indicator"></span>}
                        </div>
                        <div className="inline-field">
                            <FiMail />
                            <input name="email" type="email" value={customerDetails.email} onChange={handleCustomerDetailChange} className="info-display-input" />
                             {modifiedFields.email && <span className="modified-indicator"></span>}
                        </div>
                    </div>
                     <div className="customer-details-row">
                        <div className="inline-field">
                            <FiPhone />
                            <input name="phone" type="tel" value={customerDetails.phone} onChange={handleCustomerDetailChange} className="info-display-input" />
                             {modifiedFields.phone && <span className="modified-indicator"></span>}
                        </div>
                        <div className="inline-field">
                            <FiHome />
                            <input name="address" type="text" value={customerDetails.address} onChange={handleCustomerDetailChange} className="info-display-input" />
                             {modifiedFields.address && <span className="modified-indicator"></span>}
                        </div>
                    </div>
                </div>
              )}
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
              <div className="add-order-field">
                  <label htmlFor="stdId"><FiUser /> STD ID</label>
                  <input id="stdId" type="text" value={stdId} onChange={(e) => setStdId(e.target.value)} placeholder="Enter Student ID" />
              </div>
              <div className="add-order-field">
                  <label>Order Source</label>
                  <div className="radio-button-group">
                      <label className="radio-option">
                          <input type="radio" name="orderSource" value="Facebook" checked={orderSource === 'Facebook'} onChange={(e) => setOrderSource(e.target.value)} />
                          <FaFacebook />
                          <span>Facebook</span>
                      </label>
                      <label className="radio-option">
                          <input type="radio" name="orderSource" value="Instagram" checked={orderSource === 'Instagram'} onChange={(e) => setOrderSource(e.target.value)} />
                          <FaInstagram />
                          <span>Instagram</span>
                      </label>
                      <label className="radio-option">
                          <input type="radio" name="orderSource" value="Website" checked={orderSource === 'Website'} onChange={(e) => setOrderSource(e.target.value)} />
                          <FiGlobe />
                          <span>Website</span>
                      </label>
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
        
        {/* --- New Row for Charges and Notes --- */}
        <div className="add-order-section-grid two-col">
            <div className="add-order-card">
              <h2 className="add-order-card-title">Additional Charges</h2>
               <div className="add-order-field">
                  <label>Delivery</label>
                   <select value={deliveryCharge} onChange={e => setDeliveryCharge(e.target.value)}>
                     {deliveryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                   </select>
                </div>
              <div className="add-order-field">
                  <label htmlFor="hiddenCharge"><FiDollarSign /> Hidden Charge</label>
                  <input id="hiddenCharge" type="number" value={hiddenCharge} onChange={(e) => setHiddenCharge(e.target.value)} placeholder="e.g., 100" />
              </div>
          </div>
           <div className="add-order-card">
              <h2 className="add-order-card-title">Notes</h2>
              <div className="add-order-field">
                  <label htmlFor="notes"><FiEdit2 /> Add a note for this order</label>
                  <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows="4" placeholder="e.g., Customer requested gift wrapping..."></textarea>
              </div>
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
                <div className="summary-item">
                    <span>Hidden Charge</span>
                    <span className="summary-value">{priceSummary.hiddenCharge.toFixed(2)}</span>
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