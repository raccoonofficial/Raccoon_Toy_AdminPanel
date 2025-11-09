import React, { useState, useMemo } from 'react';
import { Plus, X, Search, LayoutGrid, List, Edit, Trash2 } from 'lucide-react';
import './Add_Customers.css';

// --- Sample Data ---
const initialCustomers = [
  { id: 'CUST_1001', name: 'Tony Stark', email: 'tony@stark.com', phone: '+1 555-1000', orders: 25, address: '10880 Malibu Point, CA', status: 'Loyal' },
  { id: 'CUST_1002', name: 'Bruce Wayne', email: 'bruce@wayne.com', phone: '+1 555-2000', orders: 18, address: '1007 Mountain Drive, Gotham', status: 'Loyal' },
  { id: 'CUST_1003', name: 'Peter Parker', email: 'peter@dailybugle.com', phone: '+1 555-3000', orders: 5, address: '20 Ingram Street, Queens', status: 'Basic' },
  { id: 'CUST_1004', name: 'Diana Prince', email: 'diana@themyscira.org', phone: '+1 555-4000', orders: 9, address: 'Themyscira', status: 'Basic' },
  { id: 'CUST_1005', name: 'Steve Rogers', email: 'steve@avengers.com', phone: '+1 555-1001', orders: 15, address: '569 Leaman Place, Brooklyn', status: 'Loyal' },
];

// --- Add/Edit Customer Form Component (in Modal) ---
function CustomerForm({ onBack, onSave, customer }) {
  const [formData, setFormData] = useState(
    customer || { id: '', name: '', email: '', phone: '', orders: '', address: '', status: 'Basic' }
  );
  const [errors, setErrors] = useState({});
  const isEditing = !!customer;

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
    if (Object.keys(v).length) return;
    onSave({ ...formData, orders: Number(formData.orders) });
  };

  return (
    <div className="customer-form-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Customer' : 'Add New Customer'}</h2>
          <button onClick={onBack} className="modal-close-btn"><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="ap-form" noValidate>
          <div className="field">
            <label>Customer ID</label>
            <input type="text" name="id" value={formData.id} onChange={handleChange} placeholder="e.g., CUST_10001" disabled={isEditing} />
            {errors.id && <div className="err">{errors.id}</div>}
          </div>
          <div className="field"><label>Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Tony Stark" />{errors.name && <div className="err">{errors.name}</div>}</div>
          <div className="field"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g., tony@starkindustries.com" />{errors.email && <div className="err">{errors.email}</div>}</div>
          <div className="field"><label>Phone</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g., +1 555-1000" />{errors.phone && <div className="err">{errors.phone}</div>}</div>
          <div className="field-row">
            <div className="field"><label>Orders</label><input type="number" name="orders" value={formData.orders} onChange={handleChange} placeholder="e.g., 12" />{errors.orders && <div className="err">{errors.orders}</div>}</div>
            <div className="field"><label>Status</label><select name="status" value={formData.status} onChange={handleChange}><option value="Basic">Basic</option><option value="Loyal">Loyal</option></select></div>
          </div>
          <div className="field"><label>Address</label><textarea name="address" rows={3} value={formData.address} onChange={handleChange} placeholder="e.g., 10880 Malibu Point, CA" />{errors.address && <div className="err">{errors.address}</div>}</div>

          <div className="modal-actions">
            <button type="button" className="btn muted" onClick={onBack}>Cancel</button>
            <button type="submit" className="btn primary">Save Customer</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Main Customers Page Component ---
// Renamed from Add_Customers to better reflect its new role
export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [viewMode, setViewMode] = useState('card');
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const handleSaveCustomer = (customerData) => {
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === customerData.id ? customerData : c));
    } else {
      // For a new customer, ensure ID is unique (simple check for demo)
      if (customers.some(c => c.id === customerData.id)) {
        alert("A customer with this ID already exists.");
        return;
      }
      setCustomers([customerData, ...customers]);
    }
    setIsAdding(false);
    setEditingCustomer(null);
  };

  const handleDelete = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
        setCustomers(customers.filter(c => c.id !== customerId));
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const term = searchTerm.toLowerCase();
      const matchesTerm = c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term) || c.id.toLowerCase().includes(term);
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesTerm && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);
  
  const isModalOpen = isAdding || !!editingCustomer;

  return (
    <section className="customers-page">
      {isModalOpen && <CustomerForm onBack={() => { setIsAdding(false); setEditingCustomer(null); }} onSave={handleSaveCustomer} customer={editingCustomer} />}
      
      <div className="page-header">
        <h1>Customers</h1>
        <button className="btn primary" onClick={() => setIsAdding(true)}><Plus size={16} /><span>Add New Customer</span></button>
      </div>

      <div className="filter-controls">
        <div className="search-wrapper"><Search className="search-icon" size={20} /><input type="text" placeholder="Search by name, email, or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        <div className="filter-wrapper">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="All">All Statuses</option><option value="Basic">Basic</option><option value="Loyal">Loyal</option></select>
          <div className="view-toggle">
            <button className={viewMode === 'card' ? 'active' : ''} onClick={() => setViewMode('card')} aria-label="Card View"><LayoutGrid size={20} /></button>
            <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')} aria-label="List View"><List size={20} /></button>
          </div>
        </div>
      </div>
      
      {viewMode === 'card' ? (
        <div className="card-view">
          {filteredCustomers.map(c => (
            <div className="customer-card" key={c.id}>
              <div className="card-header"><h3>{c.name}</h3><span className={`status-badge ${c.status.toLowerCase()}`}>{c.status}</span></div>
              <p><strong>ID:</strong> {c.id}</p>
              <p><strong>Email:</strong> {c.email}</p>
              <p><strong>Phone:</strong> {c.phone}</p>
              <p><strong>Address:</strong> {c.address}</p>
              <div className="card-footer">
                <span><strong>Orders:</strong> {c.orders}</span>
                <div className="card-actions">
                  <button onClick={() => setEditingCustomer(c)}><Edit size={16} /></button>
                  <button onClick={() => handleDelete(c.id)} className="delete"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="list-view">
          <table>
            <thead><tr><th>Customer ID</th><th>Name</th><th>Contact</th><th>Address</th><th>Orders</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredCustomers.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td><td>{c.name}</td>
                  <td>{c.email}<br/><span className="phone-sub">{c.phone}</span></td>
                  <td>{c.address}</td><td>{c.orders}</td>
                  <td><span className={`status-badge ${c.status.toLowerCase()}`}>{c.status}</span></td>
                  <td>
                    <div className="list-actions">
                      <button onClick={() => setEditingCustomer(c)} title="Edit"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(c.id)} className="delete" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
       {filteredCustomers.length === 0 && <div className="no-results">No customers match your criteria.</div>}
    </section>
  );
}