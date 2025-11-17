import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, LayoutGrid, List, Edit, Trash2 } from 'lucide-react';
import './Admin_Customers.css';

// --- Expanded Sample Data ---
const initialCustomers = [
    // --- Registered Users ---
    { id: 'CUST_1001', name: 'Tony Stark', email: 'tony@stark.com', phone: '+1 555-1000', orders: 25, address: '10880 Malibu Point, CA', status: 'Loyal', userType: 'Registered User', loyaltyTier: 'Gold', dateOfBirth: '1970-05-29', gender: 'Male', socialMediaLink: 'https://linkedin.com/in/tonystark', customerNotes: 'Genius, billionaire, playboy, philanthropist.', accountInfo: { passwordHistory: [{ pass: '********', setAt: '2025-01-15', ip: '98.176.21.3', device: 'Stark Tower Desktop' }], lastLogin: { date: '2025-11-16', ip: '98.176.21.3', device: 'Stark Tower Desktop' }}},
    { id: 'CUST_1002', name: 'Bruce Wayne', email: 'bruce@wayne.com', phone: '+1 555-2000', orders: 18, address: '1007 Mountain Drive, Gotham', status: 'Loyal', userType: 'Registered User', loyaltyTier: 'Silver', dateOfBirth: '1972-02-19', gender: 'Male', socialMediaLink: '', customerNotes: 'Prefers to work at night.', accountInfo: { passwordHistory: [{ pass: '********', setAt: '2024-11-20', ip: '104.28.7.12', device: 'Batcomputer' }], lastLogin: { date: '2025-11-15', ip: '104.28.7.12', device: 'Batcomputer' }}},
    { id: 'CUST_1003', name: 'Peter Parker', email: 'peter@dailybugle.com', phone: '+1 555-3000', orders: 5, address: '20 Ingram Street, Queens', status: 'Basic', userType: 'Registered User', loyaltyTier: 'Basic', dateOfBirth: '2001-08-10', gender: 'Male', socialMediaLink: '', customerNotes: 'Photographer. Seems to disappear a lot.', accountInfo: { passwordHistory: [{ pass: '********', setAt: '2025-09-10', ip: '172.217.16.35', device: 'Android Smartphone' }], lastLogin: { date: '2025-11-10', ip: '172.217.16.35', device: 'Android Smartphone' }}},
    { id: 'CUST_1006', name: 'Clark Kent', email: 'clark@dailyplanet.com', phone: '+1 555-5000', orders: 12, address: 'Metropolis', status: 'Loyal', userType: 'Registered User', loyaltyTier: 'Silver', dateOfBirth: '1979-06-18', gender: 'Male', socialMediaLink: '', customerNotes: '', accountInfo: { passwordHistory: [{ pass: '********', setAt: '2025-06-30', ip: '1.1.1.1', device: 'Daily Planet Workstation' }], lastLogin: { date: '2025-11-12', ip: '1.1.1.1', device: 'Daily Planet Workstation' }}},
    { id: 'CUST_1007', name: 'Wanda Maximoff', email: 'wanda.m@swords.gov', phone: '+1 555-6000', orders: 3, address: 'Westview, NJ', status: 'Basic', userType: 'Registered User', loyaltyTier: 'Bronze', dateOfBirth: '1989-11-10', gender: 'Female', socialMediaLink: '', customerNotes: '', accountInfo: { passwordHistory: [{ pass: '********', setAt: '2025-10-01', ip: '34.203.250.45', device: 'Personal Laptop' }], lastLogin: { date: '2025-11-01', ip: '34.203.250.45', device: 'Personal Laptop' }}},
    { id: 'CUST_1008', name: 'Natasha Romanoff', email: 'nat@shield.com', phone: '+1 555-7000', orders: 30, address: 'Undisclosed Location', status: 'Loyal', userType: 'Registered User', loyaltyTier: 'Gold', dateOfBirth: '1984-12-03', gender: 'Female', socialMediaLink: '', customerNotes: '', accountInfo: { passwordHistory: [{ pass: '********', setAt: '2024-05-18', ip: '203.0.113.1', device: 'Encrypted Satellite Phone' }], lastLogin: { date: '2025-11-14', ip: '203.0.113.1', device: 'Encrypted Satellite Phone' }}},
    { id: 'CUST_1009', name: 'Barry Allen', email: 'barry@starlabs.com', phone: '+1 555-8000', orders: 8, address: 'Central City', status: 'Basic', userType: 'Registered User', loyaltyTier: 'Basic', dateOfBirth: '1992-03-14', gender: 'Male', socialMediaLink: '', customerNotes: '', accountInfo: { passwordHistory: [{ pass: '********', setAt: '2025-08-22', ip: '198.51.100.5', device: 'STAR Labs Computer' }], lastLogin: { date: '2025-11-16', ip: '198.51.100.5', device: 'STAR Labs Computer' }}},
    
    // --- Social Media (Admin Created) Users ---
    { id: 'CUST_1004', name: 'Diana Prince', email: 'diana@themyscira.org', phone: '+1 555-4000', orders: 9, address: 'Themyscira', status: 'Basic', userType: 'Social Media', loyaltyTier: 'Bronze', dateOfBirth: '1918-03-22', gender: 'Female', source: 'Facebook', adminCreator: 'ninjashamimkabirkazim', customerNotes: 'Antique dealer.' },
    { id: 'CUST_1005', name: 'Steve Rogers', email: 'steve@avengers.com', phone: '+1 555-1001', orders: 15, address: '569 Leaman Place, Brooklyn', status: 'Loyal', userType: 'Social Media', loyaltyTier: 'Silver', dateOfBirth: '1918-07-04', gender: 'Male', source: 'Instagram', adminCreator: 'ninjashamimkabirkazim', customerNotes: 'The first Avenger.' },
    { id: 'CUST_1010', name: 'Arthur Curry', email: 'aquaman@justice.com', phone: '+1 555-9000', orders: 4, address: 'Amnesty Bay, ME', status: 'Basic', userType: 'Social Media', loyaltyTier: 'Basic', dateOfBirth: '1986-01-29', gender: 'Male', source: 'Facebook', adminCreator: 'admin_user', customerNotes: '' },
    { id: 'CUST_1011', name: 'Hal Jordan', email: 'hal@ferrisair.com', phone: '+1 555-1010', orders: 11, address: 'Coast City, CA', status: 'Loyal', userType: 'Social Media', loyaltyTier: 'Silver', dateOfBirth: '1975-04-08', gender: 'Male', source: 'Instagram', adminCreator: 'ninjashamimkabirkazim', customerNotes: '' },
    { id: 'CUST_1012', name: 'Carol Danvers', email: 'carol@usaf.mil', phone: '+1 555-1111', orders: 22, address: 'Edwards Air Force Base', status: 'Loyal', userType: 'Social Media', loyaltyTier: 'Gold', dateOfBirth: '1968-04-24', gender: 'Female', source: 'Instagram', adminCreator: 'admin_user', customerNotes: '' },
    { id: 'CUST_1013', name: 'Matt Murdock', email: 'matt@nelsonmurdock.com', phone: '+1 555-1212', orders: 2, address: 'Hell\'s Kitchen, NY', status: 'Basic', userType: 'Social Media', loyaltyTier: 'Basic', dateOfBirth: '1982-12-18', gender: 'Male', source: 'Facebook', adminCreator: 'ninjashamimkabirkazim', customerNotes: '' },
    { id: 'CUST_1014', name: 'Jessica Jones', email: 'jess@aliasinvestigations.com', phone: '+1 555-1313', orders: 1, address: 'Hell\'s Kitchen, NY', status: 'Basic', userType: 'Social Media', loyaltyTier: 'Basic', dateOfBirth: '1984-06-15', gender: 'Female', source: 'Facebook', adminCreator: 'admin_user', customerNotes: '' },
    { id: 'CUST_1015', name: 'Luke Cage', email: 'luke@heroesforhire.com', phone: '+1 555-1414', orders: 6, address: 'Harlem, NY', status: 'Basic', userType: 'Social Media', loyaltyTier: 'Bronze', dateOfBirth: '1972-10-12', gender: 'Male', source: 'Instagram', adminCreator: 'ninjashamimkabirkazim', customerNotes: '' },
];

// This function is exported so other components (like View and Add) can find a customer
export const findCustomerById = (id) => initialCustomers.find(c => c.id === id);

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [viewMode, setViewMode] = useState('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [userTypeFilter, setUserTypeFilter] = useState('All'); // New state for user type filter
  const navigate = useNavigate();

  const handleView = (customer) => {
    // Navigate to the dedicated view page for the specific customer
    navigate(`/users/view/${customer.id}`);
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
      const matchesUserType = userTypeFilter === 'All' || c.userType === userTypeFilter; // New filter logic
      return matchesTerm && matchesStatus && matchesUserType;
    });
  }, [customers, searchTerm, statusFilter, userTypeFilter]);

  return (
    <section className="customers-page">
      <div className="page-header">
        <h1>Customers</h1>
        <button className="btn primary" onClick={() => navigate('/users/add')}><Plus size={16} /><span>Add New Customer</span></button>
      </div>

      <div className="filter-controls">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input type="text" placeholder="Search by name, email, or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-wrapper">
          {/* New User Type Filter */}
          <select value={userTypeFilter} onChange={(e) => setUserTypeFilter(e.target.value)}>
            <option value="All">All User Types</option>
            <option value="Registered User">Registered User</option>
            <option value="Social Media">Social Media</option>
          </select>
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
              <p><strong>User Type:</strong> <span className={`user-type-badge user-type-${c.userType.split(' ')[0].toLowerCase()}`}>{c.userType}</span></p>
              <div className="card-footer">
                <span><strong>Orders:</strong> {c.orders}</span>
                <div className="card-actions">
                  <button onClick={() => handleView(c)} title="View Details"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(c.id)} className="delete" title="Delete"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="list-view">
          <table>
            <thead><tr><th>Customer ID</th><th>Name</th><th>Contact</th><th>User Type</th><th>Orders</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredCustomers.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td><td>{c.name}</td>
                  <td>{c.email}<br/><span className="phone-sub">{c.phone}</span></td>
                  <td><span className={`user-type-badge user-type-${c.userType.split(' ')[0].toLowerCase()}`}>{c.userType}</span></td>
                  <td>{c.orders}</td>
                  <td><span className={`status-badge ${c.status.toLowerCase()}`}>{c.status}</span></td>
                  <td>
                    <div className="list-actions">
                      <button onClick={() => handleView(c)} title="View Details"><Edit size={16} /></button>
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