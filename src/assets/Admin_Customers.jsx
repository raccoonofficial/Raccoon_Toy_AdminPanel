import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Plus, Search, LayoutGrid, List, Edit, Trash2 } from 'lucide-react';
import './Admin_Customers.css';

// --- Sample Data ---
const initialCustomers = [
  { id: 'CUST_1001', name: 'Tony Stark', email: 'tony@stark.com', phone: '+1 555-1000', orders: 25, address: '10880 Malibu Point, CA', status: 'Loyal' },
  { id: 'CUST_1002', name: 'Bruce Wayne', email: 'bruce@wayne.com', phone: '+1 555-2000', orders: 18, address: '1007 Mountain Drive, Gotham', status: 'Loyal' },
  { id: 'CUST_1003', name: 'Peter Parker', email: 'peter@dailybugle.com', phone: '+1 555-3000', orders: 5, address: '20 Ingram Street, Queens', status: 'Basic' },
  { id: 'CUST_1004', name: 'Diana Prince', email: 'diana@themyscira.org', phone: '+1 555-4000', orders: 9, address: 'Themyscira', status: 'Basic' },
  { id: 'CUST_1005', name: 'Steve Rogers', email: 'steve@avengers.com', phone: '+1 555-1001', orders: 15, address: '569 Leaman Place, Brooklyn', status: 'Loyal' },
];

// --- Main Customers Page Component for Listing Customers ---
export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [viewMode, setViewMode] = useState('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate(); // Initialize navigate

  const handleDelete = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
        setCustomers(customers.filter(c => c.id !== customerId));
    }
  };

  const handleEdit = (customer) => {
    // For now, this can be a placeholder. You might navigate to an edit page.
    alert(`Editing ${customer.name}.`);
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const term = searchTerm.toLowerCase();
      const matchesTerm = c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term) || c.id.toLowerCase().includes(term);
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesTerm && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  return (
    <section className="customers-page">
      <div className="page-header">
        <h1>Customers</h1>
        {/* This button now navigates to the "add" page */}
        <button className="btn primary" onClick={() => navigate('/users/add')}><Plus size={16} /><span>Add New Customer</span></button>
      </div>

      <div className="filter-controls">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input type="text" placeholder="Search by name, email, or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-wrapper">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Basic">Basic</option>
            <option value="Loyal">Loyal</option>
          </select>
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
                  <button onClick={() => handleEdit(c)}><Edit size={16} /></button>
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
                      <button onClick={() => handleEdit(c)} title="Edit"><Edit size={16} /></button>
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