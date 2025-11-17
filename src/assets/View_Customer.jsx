import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Mail, Phone, Home, Star, Tag, Link as LinkIcon, Edit3, UserCircle, Briefcase, Key, Users, Info, AtSign, Globe, Smartphone, Monitor, Calendar } from 'lucide-react';
import { findCustomerById } from './Admin_Customers';
import './View_Customer.css'; // Using its own dedicated CSS file

export default function ViewCustomerPage() {
  const navigate = useNavigate();
  const { customerId } = useParams();
  
  const [activeTab, setActiveTab] = useState('Identity');
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const customerData = findCustomerById(customerId);
    if (customerData) {
      setCustomer({
        ...customerData,
        // Ensure interestedCategories is an object to avoid errors
        interestedCategories: customerData.interestedCategories || {},
      });
    }
  }, [customerId]);

  // Display a loading state while fetching data
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
  const fullAddress = [customer.address, customer.city, customer.state, customer.zip].filter(Boolean).join(', ');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Identity':
        return (
            <div className="cvc-tab-content">
                <div className="cvc-ro-group"><label>Full Name</label><div className="cvc-ro-value">{customer.name}</div></div>
                <div className="cvc-ro-group"><label>Date of Birth</label><div className="cvc-ro-value">{customer.dateOfBirth || 'N/A'}</div></div>
                <div className="cvc-ro-group"><label>Gender</label><div className="cvc-ro-value">{customer.gender}</div></div>
            </div>
        );
      case 'Contact':
        return (
            <div className="cvc-tab-content">
                <div className="cvc-ro-group"><label>Email Address</label><div className="cvc-ro-value">{customer.email}</div></div>
                <div className="cvc-ro-group"><label>Phone Number</label><div className="cvc-ro-value">{customer.phone || 'N/A'}</div></div>
                <div className="cvc-ro-group"><label>Full Address</label><div className="cvc-ro-value">{fullAddress || 'N/A'}</div></div>
            </div>
        );
      case 'Profile':
        return (
            <div className="cvc-tab-content">
                <div className="cvc-ro-group"><label>Loyalty Tier</label><div className="cvc-ro-value">{customer.loyaltyTier}</div></div>
                <div className="cvc-ro-group"><label>Social Media</label><div className="cvc-ro-value">{customer.socialMediaLink ? <a href={customer.socialMediaLink} target="_blank" rel="noopener noreferrer">{customer.socialMediaLink}</a> : 'N/A'}</div></div>
                <div className="cvc-ro-group"><label>Interested Categories</label><div className="cvc-ro-value">{selectedCategories.join(', ') || 'N/A'}</div></div>
            </div>
        );
      case 'Notes':
        return (
            <div className="cvc-tab-content">
                <div className="cvc-ro-group">
                    <label>Customer Notes</label>
                    <div className="cvc-ro-value cvc-notes-view">{customer.customerNotes || 'No notes added.'}</div>
                </div>
            </div>
        );
      case 'Account':
        if (customer.userType === 'Registered User') {
          return (
            <div className="cvc-tab-content">
              <div className="cvc-ro-group"><label>User Type</label><div className="cvc-ro-value">Registered User</div></div>
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
        // For Social Media users
        return (
            <div className="cvc-tab-content">
                <div className="cvc-ro-group"><label>User Type</label><div className="cvc-ro-value">Social Media</div></div>
                <div className="cvc-ro-group"><label>Original Source</label><div className="cvc-ro-value">{customer.source}</div></div>
                <div className="cvc-ro-group"><label>Admin Creator</label><div className="cvc-ro-value">{customer.adminCreator}</div></div>
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
              
              {selectedCategories.length > 0 && (
                <div className="cvc-details-section">
                  <h4 className="cvc-details-title">Interests</h4>
                  <div className="cvc-interests-preview">
                    {selectedCategories.map(cat => <span key={cat} className="cvc-interest-tag">{cat}</span>)}
                  </div>
                </div>
              )}

              {customer.customerNotes && (
                <div className="cvc-details-section">
                  <h4 className="cvc-details-title">Notes</h4>
                  <p className="cvc-notes-preview">{customer.customerNotes}</p>
                </div>
              )}
            </div>
          </div>
           <div className="cvc-form-actions-vertical">
            <button type="button" className="cvc-btn-form cvc-primary" onClick={() => navigate(`/users/edit/${customerId}`)}>Edit Customer</button>
            <button type="button" className="cvc-btn-form cvc-muted" onClick={() => navigate('/users')}>Back to List</button>
          </div>
        </div>
        
        <div className="cvc-right-panel">
          <div className="cvc-tab-navigation">
            <TabButton name="Identity" icon={<User size={18}/>} />
            <TabButton name="Contact" icon={<Phone size={18}/>} />
            <TabButton name="Profile" icon={<Briefcase size={18}/>} />
            <TabButton name="Account" icon={<Key size={18}/>} />
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