import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Home, Star, Tag, Link as LinkIcon, Edit3, UserCircle, Briefcase, MapPin } from 'lucide-react';
import './Add_Customers.css';

export default function AddCustomersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Identity');
  const [formData, setFormData] = useState({
    name: '',
    id: `CUST-${Date.now().toString().slice(-6)}`,
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Prefer not to say',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
    socialMediaLink: '',
    loyaltyTier: 'Basic',
    interestedCategories: {},
    customerNotes: ''
  });
  const [errors, setErrors] = useState({});

  const INTEREST_CATEGORIES = ["Action Figures", "Dolls", "Building Blocks", "Puzzles", "Educational", "Outdoor"];

  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = 'Name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) next.email = 'A valid email is required';
    return next;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        interestedCategories: { ...prev.interestedCategories, [name]: checked }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length === 0) {
      console.log('New Customer Data:', {
        ...formData,
        interestedCategories: Object.keys(formData.interestedCategories).filter(k => formData.interestedCategories[k])
      });
      alert('Customer created successfully!');
      navigate('/users');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Identity':
        return (
          <div className="cvc-tab-content">
            <div className="cvc-field-group">
              <label htmlFor="name"><User size={16} /> Full Name</label>
              <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Jane Doe" />
              {errors.name && <div className="cvc-err">{errors.name}</div>}
            </div>
            <div className="cvc-field-group-row">
              <div className="cvc-field-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input id="dateOfBirth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
              </div>
              <div className="cvc-field-group">
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
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
              <label htmlFor="email"><Mail size={16} /> Email Address</label>
              <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane.doe@example.com"/>
              {errors.email && <div className="cvc-err">{errors.email}</div>}
            </div>
            <div className="cvc-field-group">
              <label htmlFor="phone"><Phone size={16} /> Phone Number</label>
              <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567"/>
            </div>
             <div className="cvc-field-group">
                <label htmlFor="address"><Home size={16}/> Street Address</label>
                <input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main Street" />
            </div>
            <div className="cvc-field-group-row">
                 <input name="city" value={formData.city} onChange={handleChange} placeholder="City"/>
                 <input name="state" value={formData.state} onChange={handleChange} placeholder="State / Province"/>
            </div>
             <div className="cvc-field-group-row">
                 <input name="zip" value={formData.zip} onChange={handleChange} placeholder="ZIP / Postal Code"/>
                 <select name="country" value={formData.country} onChange={handleChange}><option>USA</option><option>Canada</option><option>UK</option></select>
            </div>
          </div>
        );
      case 'Profile':
         return (
          <div className="cvc-tab-content">
             <div className="cvc-field-group">
                <label htmlFor="loyaltyTier"><Star size={16} /> Loyalty Tier</label>
                <select id="loyaltyTier" name="loyaltyTier" value={formData.loyaltyTier} onChange={handleChange}>
                  <option>Basic</option><option>Bronze</option><option>Silver</option><option>Gold</option>
                </select>
            </div>
            <div className="cvc-field-group">
              <label htmlFor="socialMediaLink"><LinkIcon size={16} /> Social Media URL</label>
              <input id="socialMediaLink" type="url" name="socialMediaLink" value={formData.socialMediaLink} onChange={handleChange} placeholder="https://linkedin.com/in/janedoe"/>
            </div>
            <div className="cvc-field-group">
              <label><Tag size={16} /> Interested Categories</label>
              <div className="cvc-checkbox-grid-modern">
                {INTEREST_CATEGORIES.map(cat => (
                  <div key={cat}>
                    <input type="checkbox" id={cat} name={cat} checked={!!formData.interestedCategories[cat]} onChange={handleChange} />
                    <label htmlFor={cat}>{cat}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'Notes':
        return (
          <div className="cvc-tab-content">
            <div className="cvc-field-group">
              <label htmlFor="customerNotes"><Edit3 size={16} /> Customer Notes</label>
              <textarea id="customerNotes" name="customerNotes" rows={8} value={formData.customerNotes} onChange={handleChange} placeholder="Add any relevant notes here..."></textarea>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const TabButton = ({ name, icon }) => (
    <button type="button" className={activeTab === name ? 'cvc-active' : ''} onClick={() => setActiveTab(name)}>
      {icon}
      <span>{name}</span>
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="cvc-profile-builder" noValidate>
      <div className="cvc-builder-card">
        <div className="cvc-left-panel">
          <div className="cvc-profile-preview">
            <div className="cvc-avatar-placeholder">
              <UserCircle size={64} strokeWidth={1} />
            </div>
            <h3>{formData.name || "New Customer"}</h3>
            <p>{formData.id}</p>
            <span className={`cvc-tier-badge cvc-tier-${formData.loyaltyTier.toLowerCase()}`}>{formData.loyaltyTier}</span>

            <div className="cvc-profile-details">
              {formData.email && (
                <div className="cvc-detail-item">
                  <Mail size={14} />
                  <span>{formData.email}</span>
                </div>
              )}
              {formData.phone && (
                <div className="cvc-detail-item">
                  <Phone size={14} />
                  <span>{formData.phone}</span>
                </div>
              )}
              {(formData.city || formData.country) && (
                 <div className="cvc-detail-item">
                    <MapPin size={14} />
                    <span>
                        {formData.city}{formData.city && formData.country ? ', ' : ''}{formData.country}
                    </span>
                </div>
              )}
            </div>
          </div>
           <div className="cvc-form-actions-vertical">
            <button type="submit" className="cvc-btn-form cvc-primary">Save Customer</button>
            <button type="button" className="cvc-btn-form cvc-muted" onClick={() => navigate('/users')}>Cancel</button>
          </div>
        </div>
        
        <div className="cvc-right-panel">
          <div className="cvc-tab-navigation">
            <TabButton name="Identity" icon={<User size={18}/>} />
            <TabButton name="Contact" icon={<Phone size={18}/>} />
            <TabButton name="Profile" icon={<Briefcase size={18}/>} />
            <TabButton name="Notes" icon={<Edit3 size={18}/>} />
          </div>
          <div className="cvc-tab-content-container">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </form>
  );
}