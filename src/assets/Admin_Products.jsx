import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { FiSearch } from 'react-icons/fi';
import './Admin_Products.css';

const initialSuppliers = [
  {
    supplierNumber: 1,
    products: [
      { name: 'Iron Man', productId: 'P_2025100001', category: 'Action Figure', quantity: 2, inStock: 2, buyingCost: 500, totalCost: 755, sellingPrice: 900, status: 'Available' },
      { name: 'Thanos', productId: 'P_2025100002', category: 'Action Figure', quantity: 1, inStock: 1, buyingCost: 500, totalCost: 755, sellingPrice: 900, status: 'Available' },
      { name: 'Captain America', productId: 'P_2025100003', category: 'Action Figure', quantity: 1, inStock: 1, buyingCost: 500, totalCost: 755, sellingPrice: 900, status: 'Available' },
    ]
  },
  {
    supplierNumber: 2,
    products: [
      { name: 'Venom', productId: 'P_2025100004', category: 'Action Figure', quantity: 1, inStock: 1, buyingCost: 480, totalCost: 720, sellingPrice: 899, status: 'Stock Out' },
      { name: 'Luffy', productId: 'P_2025100005', category: 'Action Figure', quantity: 1, inStock: 1, buyingCost: 670, totalCost: 1000, sellingPrice: 1399, status: 'Re-Stock' },
    ]
  },
  {
    supplierNumber: 3,
    products: [
      { name: 'Zoro', productId: 'P_2025100006', category: 'Action Figure', quantity: 2, inStock: 2, buyingCost: 665, totalCost: 1199, sellingPrice: 1399, status: 'Available' },
    ]
  },
  {
    supplierNumber: 10,
    products: [
      { name: 'Sasuke', productId: 'P_2025100019', category: 'Action Figure', quantity: 1, inStock: 0, buyingCost: 665, totalCost: 1000, sellingPrice: 1399, status: 'Stock Out' },
    ]
  },
];

const categoryOptions = [
  'Action Figure',
  'Small Action Figure',
  'Bricks',
  'Vechicle Figure',
  'Cute Dolls',
  'Small Cute Dolls',
  'Decorations'
];

const STATUS_OPTIONS = ['Available', 'Stock Out', 'Re-Stock'];

const statusTheme = {
  'Available': {
    class: 'available',
    bg: '#e8fff3',
    color: '#1d9b68',
    border: '#b4f5d4'
  },
  'Stock Out': {
    class: 'out',
    bg: '#ffeaea',
    color: '#d7261d',
    border: '#ffd6d6'
  },
  'Re-Stock': {
    class: 'restock',
    bg: '#fcfbe6',
    color: '#a18400',
    border: '#f2e3a0'
  }
};

/* Accessible custom dropdown for status */
function StatusDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    STATUS_OPTIONS.findIndex(s => s === value) || 0
  );
  const btnRef = useRef(null);
  const listRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!btnRef.current) return;
      if (
        !btnRef.current.contains(e.target) &&
        !(listRef.current && listRef.current.contains(e.target))
      ) {
        close();
      }
    };
    window.addEventListener('mousedown', handler);
    window.addEventListener('touchstart', handler);
    return () => {
      window.removeEventListener('mousedown', handler);
      window.removeEventListener('touchstart', handler);
    };
  }, [open, close]);

  // Keyboard navigation
  const onButtonKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  };

  const onListKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      btnRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (i + 1) % STATUS_OPTIONS.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i - 1 + STATUS_OPTIONS.length) % STATUS_OPTIONS.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(STATUS_OPTIONS.length - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const chosen = STATUS_OPTIONS[activeIndex];
      if (chosen) {
        onChange(chosen);
        close();
        btnRef.current?.focus();
      }
    }
  };

  // Ensure activeIndex follows current value if it changes externally
  useEffect(() => {
    const idx = STATUS_OPTIONS.findIndex(s => s === value);
    if (idx >= 0) setActiveIndex(idx);
  }, [value]);

  return (
    <div className="status-dropdown-wrapper">
      <button
        type="button"
        ref={btnRef}
        className={`status-select custom-trigger ${statusTheme[value].class}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change status"
        onClick={() => setOpen(o => !o)}
        onKeyDown={onButtonKeyDown}
      >
        <span className="status-swatch" aria-hidden="true"
              style={{ backgroundColor: statusTheme[value].color }}></span>
        {value}
        <span className="status-caret" aria-hidden="true" />
      </button>
      {open && (
        <ul
          className="status-dropdown-list"
          role="listbox"
          tabIndex={-1}
          ref={listRef}
          aria-activedescendant={`status-opt-${activeIndex}`}
          onKeyDown={onListKeyDown}
        >
          {STATUS_OPTIONS.map((opt, i) => {
            const theme = statusTheme[opt];
            const selected = opt === value;
            const active = i === activeIndex;
            return (
              <li
                id={`status-opt-${i}`}
                key={opt}
                role="option"
                aria-selected={selected}
                className={
                  'status-option ' +
                  theme.class +
                  (selected ? ' selected' : '') +
                  (active ? ' active' : '')
                }
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => {
                  onChange(opt);
                  close();
                  btnRef.current?.focus();
                }}
              >
                <span
                  className="option-accent"
                  style={{ backgroundColor: theme.color }}
                  aria-hidden="true"
                />
                <span className="option-label">{opt}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function AdminProducts() {
  const [supplierData, setSupplierData] = useState(initialSuppliers);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusChange = (supplierNumber, productId, newStatus) => {
    setSupplierData(prev =>
      prev.map(s =>
        s.supplierNumber !== supplierNumber
          ? s
          : {
              ...s,
              products: s.products.map(p =>
                p.productId === productId ? { ...p, status: newStatus } : p
              )
            }
      )
    );
  };

  const filteredSuppliers = useMemo(() => {
    return supplierData
      .map(s => {
        let products = s.products;
        if (selectedCategory) {
          products = products.filter(p => p.category === selectedCategory);
        }
        if (searchTerm.trim()) {
          const term = searchTerm.trim().toLowerCase();
          products = products.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.productId.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term)
          );
        }
        return { ...s, products };
      })
      .filter(s => s.products.length > 0);
  }, [supplierData, selectedCategory, searchTerm]);

  const noResults = filteredSuppliers.length === 0;

  return (
    <section className="admin-products">
      <div className="products-header">
        <h1>Products List</h1>
        <div className="products-controls">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categoryOptions.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="search-box">
            <input
              type="search"
              placeholder="Search"
              aria-label="Search products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="search-icon" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="products-table-card">
        <div className="products-table-scroll">
          <table className="products-table alt-structure">
            <thead>
              <tr>
                <th className="col-supplier">Supplier</th>
                <th className="col-name">Product Name</th>
                <th className="col-id">Product ID</th>
                <th className="col-category">Category</th>
                <th className="col-qty">Qty</th>
                <th className="col-instock">In Stock</th>
                <th>Buying Cost</th>
                <th>Total Cost</th>
                <th>Selling Price</th>
                <th>Status</th>
                <th className="col-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {noResults && (
                <tr className="no-results-row">
                  <td colSpan={11} style={{ textAlign: 'center', padding: '14px 8px', fontWeight: 600, color: '#6a39ff' }}>
                    No products found for the selected filters.
                  </td>
                </tr>
              )}

              {!noResults && filteredSuppliers.map(supplier =>
                supplier.products.map((prod, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === supplier.products.length - 1;
                  return (
                    <tr
                      key={`${supplier.supplierNumber}-${idx}`}
                      className={`data-row ${isLast ? 'supplier-last' : ''}`}
                    >
                      {isFirst && (
                        <td
                          rowSpan={supplier.products.length}
                          className="supplier-cell"
                          title={`Supplier ${supplier.supplierNumber}`}
                        >
                          {supplier.supplierNumber}
                        </td>
                      )}
                      <td className="col-name">{prod.name}</td>
                      <td className="col-id">{prod.productId}</td>
                      <td className="col-category">{prod.category}</td>
                      <td className="col-qty">{prod.quantity}</td>
                      <td className={`col-instock ${prod.inStock === 0 ? 'out-stock-cell' : ''}`}>
                        {prod.inStock}
                      </td>
                      <td>{prod.buyingCost}</td>
                      <td>{prod.totalCost}</td>
                      <td>{prod.sellingPrice}</td>
                      <td>
                        <StatusDropdown
                          value={prod.status}
                          onChange={(newStatus) =>
                            handleStatusChange(supplier.supplierNumber, prod.productId, newStatus)
                          }
                        />
                      </td>
                      <td className="actions-cell col-action">
                        <button className="edit-btn" title="Edit">
                          <svg viewBox="0 0 24 24" width="11" height="11" fill="#007aff">
                            <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zM20.71 7.04a.9959.9959 0 0 0 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                          </svg>
                        </button>
                        <button className="delete-btn" title="Delete">
                          <svg viewBox="0 0 24 24" width="11" height="11" fill="#ff3b30">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="products-footer">
          <button className="add-product-btn">+ Add New Products</button>
        </div>
      </div>
    </section>
  );
}

export default AdminProducts;