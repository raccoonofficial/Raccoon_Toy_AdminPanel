import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, LogIn, Shield } from 'lucide-react';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Simple login handler for frontend development
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      sessionStorage.setItem('authToken', 'demo_token_' + Date.now());
      sessionStorage.setItem('username', username);
      
      if (rememberMe) {
        localStorage.setItem('rememberToken', 'demo_token_' + Date.now());
        localStorage.setItem('username', username);
      }

      navigate('/dashboard');
      setIsLoading(false);
    }, 800);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page-wrapper">
      {/* ===== Left Branding Panel ===== */}
      <div className="login-branding-panel">
        <div className="branding-content">
          <div className="branding-logo">
            <Shield size={60} />
          </div>
          <h1 className="branding-title">Raccoon Toy Co.</h1>
          <p className="branding-subtitle">Administrator Control Panel</p>
          <div className="branding-footer">
            &copy; 2025 Raccoon Toy Admin Panel. All rights reserved.
          </div>
        </div>
        <div className="branding-background"></div>
      </div>

      {/* ===== Right Login Form Panel ===== */}
      <div className="login-form-panel">
        <div className="login-card">
          <div className="login-header">
            <h1>Admin Sign In</h1>
            <p>Please enter your credentials to continue</p>
          </div>

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
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="login-button" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>Need help? <a href="#" onClick={(e) => e.preventDefault()}>Contact Administrator</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;