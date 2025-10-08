import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { FiSearch } from 'react-icons/fi';
import './Admin_Customers.css';

/* ------------------ Sample Data (Address + Basic/Loyal) ------------------ */
const initialCustomers = [
  {
    customerId: 'CUST_10001',
    name: 'Tony Stark',
    email: 'tony@starkindustries.com',
    phone: '+1 555-1000',
    orders: 12,
    address: '10880 Malibu Point, CA',
    status: 'Loyal'
  },
  {
    customerId: 'CUST_10002',
    name: 'Steve Rogers',
    email: 'steve@avengers.com',
    phone: '+1 555-1001',
    orders: 5,
    address: '569 Leaman Place, Brooklyn, NY',
    status: 'Basic'
  },
  {
    customerId: 'CUST_10003',
    name: 'Natasha Romanoff',
    email: 'natasha@shield.gov',
    phone: '+1 555-1002',
    orders: 19,
    address: 'Unknown (Classified)',
    status: 'Loyal'
  },
  {
    customerId: 'CUST_10004',
    name: 'Bruce Banner',
    email: 'bruce@science.org',
    phone: '+1 555-1003',
    orders: 2,
    address: 'Culver University Labs, VA',
    status: 'Basic'
  },
  {
    customerId: 'CUST_10005',
    name: 'Peter Parker',
    email: 'peter@dailybugle.net',
    phone: '+1 555-1004',
    orders: 7,
    address: '20 Ingram Street, Queens, NY',
    status: 'Basic'
  }
];

/* ------------------ Status Theming (Premium Yellow for Loyal) ------------------ */
const CUSTOMER_STATUS_OPTIONS = ['Basic', 'Loyal'];

const statusTheme = {
  Basic: {
    class: 'basic',
    bg: '#f2f3f5',
    color: '#5d6470',
    border: '#d4d7dd'
  },
  Loyal: {
    class: 'loyal',
    bg: '#fff4c2',          // updated premium yellow background
    color: '#e7aa01ff',       // richer gold text
    border: '#cc9c00ff'       // defined border
  }
};

/* ------------------ Custom Status Dropdown ------------------ */
function StatusDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    CUSTOMER_STATUS_OPTIONS.findIndex(s => s === value) || 0
  );
  const btnRef = useRef(null);
  const listRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!btnRef.current?.contains(e.target) && !listRef.current?.contains(e.target)) {
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

  useEffect(() => {
    const idx = CUSTOMER_STATUS_OPTIONS.findIndex(s => s === value);
    if (idx >= 0) setActiveIndex(idx);
  }, [value]);

  const onButtonKeyDown = (e) => {
    if (['ArrowDown', 'Enter', ' '].includes(e.key)) {
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
      setActiveIndex(i => (i + 1) % CUSTOMER_STATUS_OPTIONS.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i - 1 + CUSTOMER_STATUS_OPTIONS.length) % CUSTOMER_STATUS_OPTIONS.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(CUSTOMER_STATUS_OPTIONS.length - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const chosen = CUSTOMER_STATUS_OPTIONS[activeIndex];
      if (chosen) {
        onChange(chosen);
        close();
        btnRef.current?.focus();
      }
    }
  };

  return (
    <div className="cust-status-dropdown-wrapper">
      <button
        type="button"
        ref={btnRef}
        className={`cust-status-trigger ${statusTheme[value].class}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change customer status"
        onClick={() => setOpen(o => !o)}
        onKeyDown={onButtonKeyDown}
        style={{
          background: statusTheme[value].bg,
          color: statusTheme[value].color,
          borderColor: statusTheme[value].border
        }}
      >
        <span
          className="cust-status-swatch"
          aria-hidden="true"
          style={{ backgroundColor: statusTheme[value].color }}
        />
        {value}
        <span className="cust-status-caret" aria-hidden="true" />
      </button>
      {open && (
        <ul
          className="cust-status-dropdown-list"
          role="listbox"
          tabIndex={-1}
          ref={listRef}
          aria-activedescendant={`cust-status-opt-${activeIndex}`}
          onKeyDown={onListKeyDown}
        >
          {CUSTOMER_STATUS_OPTIONS.map((opt, i) => {
            const theme = statusTheme[opt];
            const selected = opt === value;
            const active = i === activeIndex;
            return (
              <li
                id={`cust-status-opt-${i}`}
                key={opt}
                role="option"
                aria-selected={selected}
                className={
                  'cust-status-option ' +
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
                style={{
                  color: theme.color
                }}
              >
                <span
                  className="cust-option-accent"
                  style={{ backgroundColor: theme.color }}
                  aria-hidden="true"
                />
                <span className="cust-option-label">{opt}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ------------------ Main Component ------------------ */
function Admin_Customers() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusChange = (customerId, newStatus) => {
    setCustomers(prev =>
      prev.map(c => (c.customerId === customerId ? { ...c, status: newStatus } : c))
    );
  };

  const filteredCustomers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.customerId.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term) ||
      c.address.toLowerCase().includes(term)
    );
  }, [customers, searchTerm]);

  const noResults = filteredCustomers.length === 0;

  return (
    <section className="admin-customers">
      <div className="customers-header">
        <h1>Customers</h1>
        <div className="customers-controls">
          <div className="search-box">
            <input
              type="search"
              placeholder="Search customers"
              aria-label="Search customers"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="search-icon" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="customers-table-card">
        <div className="customers-table-scroll">
          <table className="customers-table alt-structure">
            <thead>
              <tr>
                <th className="cust-col-id">Customer ID</th>
                <th className="cust-col-name">Name</th>
                <th className="cust-col-email">Email</th>
                <th className="cust-col-phone">Phone</th>
                <th className="cust-col-orders">Orders</th>
                <th className="cust-col-address">Address</th>
                <th className="cust-col-status">Status</th>
                <th className="cust-col-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {noResults && (
                <tr className="no-results-row">
                  <td colSpan={8} style={{ textAlign: 'center', padding: '14px 8px', fontWeight: 600, color: '#6a39ff' }}>
                    No customers match your search.
                  </td>
                </tr>
              )}

              {!noResults && filteredCustomers.map(c => (
                <tr key={c.customerId} className="data-row">
                  <td className="cust-col-id">{c.customerId}</td>
                  <td className="cust-col-name">{c.name}</td>
                  <td className="cust-col-email">{c.email}</td>
                  <td className="cust-col-phone">{c.phone}</td>
                  <td className="cust-col-orders">{c.orders}</td>
                  <td className="cust-col-address">{c.address}</td>
                  <td className="cust-col-status">
                    <StatusDropdown
                      value={c.status}
                      onChange={(newStatus) => handleStatusChange(c.customerId, newStatus)}
                    />
                  </td>
                  <td className="cust-actions-cell cust-col-action">
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
              ))}

            </tbody>
          </table>
        </div>
        <div className="customers-footer">
          <button className="add-customer-btn">+ Add Customer</button>
        </div>
      </div>
    </section>
  );
}

export default Admin_Customers;