import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Mail, Phone, Home, Star, Tag, Link as LinkIcon, Edit3, UserCircle, Briefcase, Key, Users, Info, AtSign, Globe, Monitor, Calendar, Zap, ShieldAlert, ShieldCheck, ShieldX, CheckSquare, XSquare } from 'lucide-react';
import { findCustomerById } from './Admin_Customers';
import './View_Customer.css';

export default function ViewCustomerPage() {
  const navigate = useNavigate();
  const { customerId } = useParams();
  
  const [activeTab, setActiveTab] = useState('Identity');
  const [customer, setCustomer] = useState(null);
  const [editableCustomer, setEditableCustomer] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const customerData = findCustomerById(customerId);
    if (customerData) {
      const fullData = {
        ...customerData,
        interestedCategories: customerData.interestedCategories || {},
        accountStatus: customerData.accountStatus || 'Active', 
        statusHistory: customerData.statusHistory || [
          { action: 'Activated', by: 'System', date: '2023-10-01 09:00:00' },
          { action: 'Created', by: 'ninjashamimkabirkazim', date: '2023-09-28 14:32:01' }
        ],
        country: customerData.country || 'USA', // Ensure country data exists
      };
      setCustomer(fullData);
      setEditableCustomer(JSON.parse(JSON.stringify(fullData))); // Deep copy for safe editing
    }
  }, [customerId]);

  const handleEditToggle = () => {
    if (isEditMode) {
      // Logic to save changes
      setCustomer(editableCustomer);
    }
    setIsEditMode(!isEditMode);
  };

  const handleCancel = () => {
    setEditableCustomer(JSON.parse(JSON.stringify(customer))); // Discard changes by reverting to original state
    setIsEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableCustomer(prev => ({ ...prev, [name]: value }));
  };

  if (!customer) {
    return <div className="cvc-loading">Loading Customer Details...</div>;
  }
  
  const TabButton = ({ name, icon }) => (
    <button type="button" className={activeTab === name ? 'cvc-active' : ''} onClick={() => setActiveTab(name)}>
      {icon}
      <span>{name}</span>
    </button>
  );

  const selectedCategories = Object.keys(customer.interestedCategories || {}).filter(k => customer.interestedCategories[k]);
  const fullAddress = [customer.address, customer.city, customer.state, customer.zip, customer.country].filter(Boolean).join(', ');

  const renderTabContent = () => {
    const data = isEditMode ? editableCustomer : customer;
    switch (activeTab) {
      case 'Identity':
        return (
          <div className="cvc-tab-content">
            <div className="cvc-field-group">
              <label><User size={16} /> Full Name</label>
              <input name="name" value={data.name} onChange={handleInputChange} disabled={!isEditMode} />
            </div>
            <div className="cvc-field-group-row">
              <div className="cvc-field-group">
                <label>Date of Birth</label>
                <input name="dateOfBirth" type="date" value={data.dateOfBirth || ''} onChange={handleInputChange} disabled={!isEditMode} />
              </div>
              <div className="cvc-field-group">
                <label>Gender</label>
                 <select name="gender" value={data.gender} onChange={handleInputChange} disabled={!isEditMode}>
                  <option>Prefer not to say</option><option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'Contact':
        return (
           <div className="cvc-tab-content">
            <div className="cvc-field-group">
              <label><Mail size={16} /> Email Address</label>
              <input name="email" value={data.email} onChange={handleInputChange} disabled={!isEditMode}/>
            </div>
            <div className="cvc-field-group">
              <label><Phone size={16} /> Phone Number</label>
              <input name="phone" value={data.phone || ''} onChange={handleInputChange} disabled={!isEditMode}/>
            </div>
            <div className="cvc-field-group">
                <label><Home size={16}/> Street Address</label>
                <input name="address" value={data.address || ''} onChange={handleInputChange} disabled={!isEditMode} placeholder="123 Main Street" />
            </div>
            <div className="cvc-field-group-row">
                 <div className="cvc-field-group">
                    <label>City</label>
                    <input name="city" value={data.city || ''} onChange={handleInputChange} disabled={!isEditMode} placeholder="City"/>
                 </div>
                 <div className="cvc-field-group">
                    <label>State</label>
                    <input name="state" value={data.state || ''} onChange={handleInputChange} disabled={!isEditMode} placeholder="State / Province"/>
                 </div>
            </div>
             <div className="cvc-field-group-row">
                 <div className="cvc-field-group">
                    <label>ZIP Code</label>
                    <input name="zip" value={data.zip || ''} onChange={handleInputChange} disabled={!isEditMode} placeholder="ZIP / Postal Code"/>
                 </div>
                 <div className="cvc-field-group">
                    <label>Country</label>
                    <select name="country" value={data.country} onChange={handleInputChange} disabled={!isEditMode}>
                        <option>USA</option>
                        <option>Canada</option>
                        <option>UK</option>
                    </select>
                 </div>
            </div>
          </div>
        );
      case 'Profile':
         return (
          <div className="cvc-tab-content">
             <div className="cvc-field-group">
                <label><Star size={16} /> Loyalty Tier</label>
                <select name="loyaltyTier" value={data.loyaltyTier} onChange={handleInputChange} disabled={!isEditMode}>
                    <option value="Basic">Basic</option>
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                </select>
            </div>
            <div className="cvc-field-group">
              <label><AtSign size={16} /> Customer Source</label>
              <input value={data.sourceType} disabled />
            </div>
            {(data.sourceType === 'Facebook' || data.sourceType === 'Instagram') && (
              <div className="cvc-field-group">
                <label><LinkIcon size={16} /> Social Media URL</label>
                <input name="socialMediaLink" value={data.socialMediaLink || ''} onChange={handleInputChange} disabled={!isEditMode} />
              </div>
            )}
            <div className="cvc-field-group">
              <label><Tag size={16} /> Interested Categories</label>
              <div className="cvc-checkbox-grid-modern">
                {selectedCategories.length > 0 ? selectedCategories.map(cat => (
                  <div key={cat}>
                    <input type="checkbox" id={cat} checked readOnly disabled />
                    <label htmlFor={cat}>{cat}</label>
                  </div>
                )) : <p className="cvc-field-hint">No interests specified.</p>}
              </div>
            </div>
          </div>
        );
      case 'Account':
        if (customer.userType === 'Registered User') {
          return (
            <div className="cvc-tab-content">
              <div className="cvc-field-group">
                <label><Users size={16} /> User Type</label>
                <input value="Registered User" disabled />
              </div>
              {isEditMode && (
                <div className="cvc-field-group">
                  <label><Key size={16} /> Password Management</label>
                  <button type="button" className="cvc-btn-form cvc-secondary" onClick={() => navigate(`/users/reset-password/${customerId}`)}>Create New Password</button>
                </div>
              )}
              <div className="cvc-field-group"><label><Info size={16} /> Last Login Details</label><div className="cvc-info-grid">
                  <div><Calendar size={14}/><span>{customer.accountInfo?.lastLogin.date}</span></div>
                  <div><Monitor size={14}/><span>{customer.accountInfo?.lastLogin.device}</span></div>
                  <div><Globe size={14}/><span>{customer.accountInfo?.lastLogin.ip}</span></div>
              </div></div>
              <div className="cvc-field-group"><label><Key size={16}/> Password & Device History</label><div className="cvc-history-table"><table>
                  <thead><tr><th>Password</th><th>Set On</th><th>Device</th><th>IP Address</th></tr></thead>
                  <tbody>{customer.accountInfo?.passwordHistory.map((p, i) => (
                      <tr key={i}><td>{p.pass}</td><td>{p.setAt}</td><td>{p.device}</td><td>{p.ip}</td></tr>
                  ))}</tbody>
              </table></div></div>
            </div>
          );
        }
        return (
            <div className="cvc-tab-content">
                <div className="cvc-field-group">
                    <label><Users size={16}/> User Type</label>
                    <input value="Social Media" disabled />
                </div>
                <div className="cvc-field-group">
                    <label><UserCircle size={16}/> Admin Creator</label>
                    <input value={customer.adminCreator} disabled />
                </div>
            </div>
        );
      case 'Action':
        return (
          <div className="cvc-tab-content">
            {isEditMode ? (
              <div className="cvc-field-group">
                <label><Zap size={16} /> Account Actions</label>
                <p className="cvc-field-hint">Perform administrative actions on this customer's account. These actions may be irreversible.</p>
                <div className="cvc-action-buttons-grid">
                  <div className="cvc-action-item">
                      <div className="cvc-action-item-header">
                          <ShieldCheck size={18} className="cvc-action-icon-activate" />
                          <h4>Activate Account</h4>
                      </div>
                      <p className="cvc-field-hint">Enable the account if it is currently disabled.</p>
                      <button className="cvc-action-btn cvc-action-activate">Activate</button>
                  </div>
                  <div className="cvc-action-item">
                      <div className="cvc-action-item-header">
                          <ShieldAlert size={18} className="cvc-action-icon-disable" />
                          <h4>Disable Account</h4>
                      </div>
                      <p className="cvc-field-hint">Temporarily suspend the account.</p>
                      <button className="cvc-action-btn cvc-action-disable">Disable</button>
                  </div>
                  <div className="cvc-action-item">
                      <div className="cvc-action-item-header">
                          <ShieldX size={18} className="cvc-action-icon-ban" />
                          <h4>Ban Account</h4>
                      </div>
                      <p className="cvc-field-hint">Permanently ban the customer.</p>
                      <button className="cvc-action-btn cvc-action-ban">Ban</button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="cvc-field-group">
                    <label><Zap size={16} /> Account Status</label>
                    <div className={`cvc-status-display cvc-status-${customer.accountStatus.toLowerCase()}`}>
                        {customer.accountStatus === 'Active' && <ShieldCheck size={20} />}
                        {customer.accountStatus === 'Disabled' && <ShieldAlert size={20} />}
                        {customer.accountStatus === 'Banned' && <ShieldX size={20} />}
                        <span>{customer.accountStatus}</span>
                    </div>
                </div>
                <div className="cvc-field-group">
                    <label><Info size={16}/> Status History Log</label>
                    <div className="cvc-history-table">
                        <table>
                            <thead><tr><th>Action</th><th>Performed By</th><th>Date</th></tr></thead>
                            <tbody>
                                {customer.statusHistory.map((log, i) => (
                                    <tr key={i}><td>{log.action}</td><td>{log.by}</td><td>{log.date}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
              </>
            )}
          </div>
        );
      case 'Notes':
        return (
          <div className="cvc-tab-content">
            <div className="cvc-field-group">
              <label><Edit3 size={16} /> Customer Notes</label>
              <textarea name="customerNotes" value={data.customerNotes || ''} onChange={handleInputChange} rows={8} disabled={!isEditMode}></textarea>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="cvc-profile-builder">
      <div className="cvc-builder-card">
        <div className="cvc-left-panel">
          <div className="cvc-profile-preview">
            <div className="cvc-profile-header">
                <div className="cvc-avatar-placeholder"><UserCircle size={64} strokeWidth={1} /></div>
                <h3>{customer.name}</h3>
                <p>{customer.id}</p>
                <span className={`cvc-tier-badge cvc-tier-${customer.loyaltyTier.toLowerCase()}`}>{customer.loyaltyTier}</span>
            </div>
            <div className="cvc-profile-details">
              <div className="cvc-details-section">
                <div className="cvc-detail-item"><span className="cvc-detail-label">User Type:</span><span className="cvc-detail-value">{customer.userType}</span></div>
                <div className="cvc-detail-item"><span className="cvc-detail-label">Email:</span><span className="cvc-detail-value">{customer.email || '...'}</span></div>
                <div className="cvc-detail-item"><span className="cvc-detail-label">Phone:</span><span className="cvc-detail-value">{customer.phone || '...'}</span></div>
                <div className="cvc-detail-item"><span className="cvc-detail-label">Address:</span><span className="cvc-detail-value">{fullAddress || '...'}</span></div>
              </div>
            </div>
          </div>
           <div className="cvc-form-actions-vertical">
            <button type="button" className="cvc-btn-form cvc-primary" onClick={handleEditToggle}>
              {isEditMode ? <><CheckSquare size={16}/> Save Changes</> : <><Edit3 size={16}/> Edit Customer</>}
            </button>
            {isEditMode && (
              <button type="button" className="cvc-btn-form cvc-muted" onClick={handleCancel}>
                <XSquare size={16}/> Cancel
              </button>
            )}
            <button type="button" className="cvc-btn-form cvc-muted" onClick={() => navigate('/users')}>Back to List</button>
          </div>
        </div>
        
        <div className="cvc-right-panel">
          <div className="cvc-tab-navigation">
            <TabButton name="Identity" icon={<User size={18}/>} />
            <TabButton name="Contact" icon={<Phone size={18}/>} />
            <TabButton name="Profile" icon={<Briefcase size={18}/>} />
            <TabButton name="Account" icon={<Key size={18}/>} />
            <TabButton name="Action" icon={<Zap size={18}/>} />
            <TabButton name="Notes" icon={<Edit3 size={18}/>} />
          </div>
          <div className="cvc-tab-content-container">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}