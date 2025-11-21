import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { FiSearch, FiX, FiGrid, FiList, FiEdit } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './Admin_Products.css';

const initialProducts = [
  { supplierNumber: 1, stockId: 'STK-A84B', name: 'Iron Man', productId: 'P_2025100001', category: 'Action Figure', orderQty: 2, inStock: 2, sold: 0, buyingCost: 500, totalCost: 550, sellingPrice: 900, status: 'Available', image: 'https://i.ibb.co/6n211ez/d55b8855-3373-4564-8849-0d351980f72c.png' },
  { supplierNumber: 1, stockId: 'STK-C3D9', name: 'Thanos', productId: 'P_2025100002', category: 'Action Figure', orderQty: 1, inStock: 1, sold: 0, buyingCost: 500, totalCost: 550, sellingPrice: 900, status: 'Available', image: 'https://i.ibb.co/6n211ez/d55b8855-3373-4564-8849-0d351980f72c.png' },
  { supplierNumber: 1, stockId: 'STK-F0A2', name: 'Captain America', productId: 'P_2025100003', category: 'Action Figure', orderQty: 1, inStock: 1, sold: 0, buyingCost: 500, totalCost: 560, sellingPrice: 950, status: 'Re-Stock', image: 'https://i.ibb.co/6n211ez/d55b8855-3373-4564-8849-0d351980f72c.png' },
  { supplierNumber: 2, stockId: 'STK-E5G7', name: 'Venom', productId: 'P_2025100004', category: 'Action Figure', orderQty: 1, inStock: 0, sold: 1, buyingCost: 480, totalCost: 510, sellingPrice: 899, status: 'Stock Out', image: 'https://i.ibb.co/6n211ez/d55b8855-3373-4564-8849-0d351980f72c.png' },
  { supplierNumber: 2, stockId: 'STK-H1I8', name: 'Luffy', productId: 'P_2025100005', category: 'Action Figure', orderQty: 5, inStock: 1, sold: 4, buyingCost: 670, totalCost: 720, sellingPrice: 1399, status: 'Available', image: 'https://i.ibb.co/6n211ez/d55b8855-3373-4564-8849-0d351980f72c.png' },
];

const categoryOptions = ['Action Figure', 'Small Action Figure', 'Bricks', 'Vehicle Figure', 'Cute Dolls', 'Small Cute Dolls', 'Decorations'];
const STATUS_OPTIONS = ['Available', 'Stock Out', 'Re-Stock'];

function StatusDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) close();
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [open, close]);

  const onSelect = (option) => {
    onChange(option);
    close();
  };

  return (
    <div className="ap-status-dropdown-wrapper" ref={wrapperRef}>
      <button type="button" className="ap-status-trigger" onClick={() => setOpen(o => !o)}>
        <span className="ap-status-swatch" data-status={value}></span>
        {value}
      </button>
      {open && (
        <div className="ap-status-dropdown-list">
          {STATUS_OPTIONS.map(opt => (
            <button key={opt} className="ap-status-option" onClick={() => onSelect(opt)}>
              <span className="ap-status-swatch" data-status={opt}></span>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    status: '',
  });

  const handleStatusChange = (productId, newStatus) => {
    setProducts(prev =>
      prev.map(p => p.productId === productId ? { ...p, status: newStatus } : p)
    );
  };

  const handleFilterChange = (filterName, value) => {
    setActiveFilters(prev => ({ ...prev, [filterName]: value }));
  };
  
  const clearFilters = () => {
    setActiveFilters({ category: '', status: '' });
    setSearchTerm('');
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch = term === '' || p.name.toLowerCase().includes(term) || p.productId.toLowerCase().includes(term);
      const matchesCategory = activeFilters.category === '' || p.category === activeFilters.category;
      const matchesStatus = activeFilters.status === '' || p.status === activeFilters.status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, activeFilters]);

  return (
    <section className="ap-admin-products">
      <header className="ap-header">
        <h1>Products</h1>
        <div className="ap-header-controls">
          <div className="ap-search-box">
            <FiSearch className="ap-search-icon" aria-hidden="true" />
            <input type="search" placeholder="Search by name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="ap-add-product-btn" onClick={() => navigate('/products/add')}>
            Add Product
          </button>
          <div className="ap-view-toggle">
            <button className={`ap-toggle-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} title="List View">
              <FiList size={21} />
            </button>
            <button className={`ap-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')} title="Grid View">
              <FiGrid size={21} />
            </button>
          </div>
        </div>
      </header>

      <div className="ap-filter-bar">
        <div className="ap-filter-group">
          <label htmlFor="status-filter">Status</label>
          <select id="status-filter" value={activeFilters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="ap-filter-group">
          <label htmlFor="category-filter">Category</label>
          <select id="category-filter" value={activeFilters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
            <option value="">All Categories</option>
            {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <button className="ap-clear-filters-btn" onClick={clearFilters}>
          <FiX size={14} /> Clear All
        </button>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="ap-no-results-full-page">
          <p>No products found for the selected filters.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="ap-product-card-grid">
          {filteredProducts.map(prod => (
            <div key={prod.productId} className="ap-product-card">
              <div className="ap-card-image-container">
                <img src={prod.image} alt={prod.name} className="ap-card-image" />
                <div className="ap-card-stock-overlay">
                  <span className={`ap-card-stock-level ${prod.inStock === 0 ? 'ap-out-of-stock' : ''}`}>
                    In Stock: {prod.inStock}
                  </span>
                </div>
                <button className="ap-card-edit-btn" onClick={() => navigate(`/products/edit/${prod.productId}`)}>
                  <FiEdit size={16} />
                </button>
              </div>
              <div className="ap-card-content">
                <h3 className="ap-card-name">{prod.name}</h3>
                <div className="ap-card-price-list">
                  <div className="ap-card-price-item">
                    <span className="ap-card-price-label">Buying</span>
                    <span className="ap-card-price-value">${prod.buyingCost.toFixed(2)}</span>
                  </div>
                  <div className="ap-card-price-item">
                    <span className="ap-card-price-label">Total</span>
                    <span className="ap-card-price-value">${prod.totalCost.toFixed(2)}</span>
                  </div>
                  <div className="ap-card-price-item">
                    <span className="ap-card-price-label">Selling</span>
                    <span className="ap-card-price-value ap-price-selling">${prod.sellingPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="ap-product-list-card">
          <div className="ap-product-grid-header">
            <div className="ap-col-name">Product Name</div>
            <div className="ap-col-image">Image</div>
            <div className="ap-col-category">Category</div>
            <div className="ap-col-qty">Order Qty</div>
            <div className="ap-col-instock">In Stock</div>
            <div className="ap-col-sold">Sold</div>
            <div className="ap-col-price">Buying Cost</div>
            <div className="ap-col-price">Total Cost</div>
            <div className="ap-col-price">Selling Price</div>
            <div className="ap-col-status">Status</div>
            <div className="ap-col-action">Action</div>
          </div>
          <div className="ap-product-list-body">
            {filteredProducts.map(prod => (
              <div key={prod.productId} className={`ap-product-row ap-row-status-${prod.status.toLowerCase().replace(' ', '-')}`}>
                <div className="ap-col-name">
                  <span className="ap-product-name">{prod.name}</span>
                  <span className="ap-product-id">{prod.productId}</span>
                </div>
                <div className="ap-col-image">
                  <img src={prod.image} alt={prod.name} />
                </div>
                <div className="ap-col-category">{prod.category}</div>
                <div className="ap-col-qty">{prod.orderQty}</div>
                <div className={`ap-col-instock ${prod.inStock === 0 ? 'ap-out-of-stock' : ''}`}>{prod.inStock}</div>
                <div className="ap-col-sold">{prod.sold}</div>
                <div className="ap-col-price">${prod.buyingCost.toFixed(2)}</div>
                <div className="ap-col-price">${prod.totalCost.toFixed(2)}</div>
                <div className="ap-col-price">${prod.sellingPrice.toFixed(2)}</div>
                <div className="ap-col-status">
                  <StatusDropdown
                    value={prod.status}
                    onChange={(newStatus) => handleStatusChange(prod.productId, newStatus)}
                  />
                </div>
                <div className="ap-col-action">
                  <button className="ap-edit-btn" onClick={() => navigate(`/products/edit/${prod.productId}`)}>
                    <FiEdit size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminProducts;