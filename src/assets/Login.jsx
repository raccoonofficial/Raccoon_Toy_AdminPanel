import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, LogIn, ShieldAlert } from 'lucide-react';
import logo from '../assets/images/logo.png'; // Make sure the path is correct
import './Login.css';

function Login() {
  const navigate = useNavigate();
  // Set initial state to empty strings for user input
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Login handler that validates user input
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Clear previous errors

    // Simulate network delay and validate credentials
    setTimeout(() => {
      if (username === 'cabrio' && password === 'devil') {
        sessionStorage.setItem('authToken', 'demo_token_' + Date.now());
        sessionStorage.setItem('username', username);
        navigate('/dashboard');
      } else {
        setError('Invalid username or password. Please try again.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Card Header */}
        <div className="login-header">
          <div className="header-logo">
            <img src={logo} alt="Raccoon Toy Co. Logo" className="header-logo-img" />
          </div>
          <h1 className="header-title">Raccoon Toy Co.</h1>
          <p className="header-subtitle">Admin Panel Access</p>
        </div>

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <User className="input-icon" size={20} />
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>
          
          {/* Error Message Display */}
          {error && (
            <div className="login-error">
              <ShieldAlert size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="login-button" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span>Please Wait</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>Enter</span>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          
        </div>
      </div>
    </div>
  );
}

export default Login;