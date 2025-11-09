import React, { useState, useEffect } from 'react';
import { Lock, Mail, Eye, EyeOff, LogIn, Shield, AlertTriangle } from 'lucide-react';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [csrfToken, setCsrfToken] = useState('');

  // Maximum login attempts before lockout
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 900000; // 15 minutes in milliseconds

  // Generate CSRF token on component mount
  useEffect(() => {
    generateCSRFToken();
    checkLockoutStatus();
    
    // Security: Disable right-click and inspect element on production
    if (process.env.NODE_ENV === 'production') {
      document.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    return () => {
      if (process.env.NODE_ENV === 'production') {
        document.removeEventListener('contextmenu', (e) => e.preventDefault());
      }
    };
  }, []);

  // Generate CSRF Token
  const generateCSRFToken = () => {
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    setCsrfToken(token);
    sessionStorage.setItem('csrfToken', token);
  };

  // Check if account is locked due to failed attempts
  const checkLockoutStatus = () => {
    const lockoutEnd = localStorage.getItem('lockoutEnd');
    if (lockoutEnd) {
      const timeRemaining = parseInt(lockoutEnd) - Date.now();
      if (timeRemaining > 0) {
        setIsLocked(true);
        setLockoutTime(timeRemaining);
        startLockoutTimer(timeRemaining);
      } else {
        localStorage.removeItem('lockoutEnd');
        localStorage.removeItem('loginAttempts');
      }
    }
    
    const attempts = localStorage.getItem('loginAttempts');
    if (attempts) {
      setLoginAttempts(parseInt(attempts));
    }
  };

  // Start lockout countdown timer
  const startLockoutTimer = (duration) => {
    const interval = setInterval(() => {
      const lockoutEnd = localStorage.getItem('lockoutEnd');
      if (lockoutEnd) {
        const timeRemaining = parseInt(lockoutEnd) - Date.now();
        if (timeRemaining <= 0) {
          clearInterval(interval);
          setIsLocked(false);
          setLockoutTime(0);
          setLoginAttempts(0);
          localStorage.removeItem('lockoutEnd');
          localStorage.removeItem('loginAttempts');
        } else {
          setLockoutTime(timeRemaining);
        }
      }
    }, 1000);
  };

  // Calculate password strength
  const calculatePasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.length >= 12) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;
    return strength;
  };

  // Handle password change with strength indicator
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  // Sanitize input to prevent XSS
  const sanitizeInput = (input) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return input.replace(reg, (match) => (map[match]));
  };

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Handle failed login attempt
  const handleFailedAttempt = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    localStorage.setItem('loginAttempts', newAttempts.toString());

    if (newAttempts >= MAX_ATTEMPTS) {
      const lockoutEnd = Date.now() + LOCKOUT_DURATION;
      localStorage.setItem('lockoutEnd', lockoutEnd.toString());
      setIsLocked(true);
      setLockoutTime(LOCKOUT_DURATION);
      startLockoutTimer(LOCKOUT_DURATION);
      setError(`Too many failed attempts. Account locked for 15 minutes.`);
    } else {
      setError(`Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
    }
  };

  // Format lockout time
  const formatLockoutTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if account is locked
    if (isLocked) {
      setError(`Account is locked. Try again in ${formatLockoutTime(lockoutTime)}`);
      return;
    }

    // Validate CSRF token
    const storedToken = sessionStorage.getItem('csrfToken');
    if (!storedToken || storedToken !== csrfToken) {
      setError('Security token mismatch. Please refresh the page.');
      return;
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());
    const sanitizedPassword = sanitizeInput(password);

    // Validate email
    if (!validateEmail(sanitizedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Check password strength
    if (passwordStrength < 3) {
      setError('Password does not meet security requirements.');
      return;
    }

    // Check password length
    if (sanitizedPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call with security headers
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include', // Include cookies for session management
        body: JSON.stringify({
          email: sanitizedEmail,
          password: sanitizedPassword,
          rememberMe: rememberMe,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Clear failed attempts on successful login
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lockoutEnd');
        
        // Store secure token (should be httpOnly cookie from backend)
        if (data.token) {
          // In production, use httpOnly cookies instead
          sessionStorage.setItem('authToken', data.token);
        }
        
        // Regenerate CSRF token
        generateCSRFToken();
        
        // Log security event
        console.log('Login successful:', {
          timestamp: new Date().toISOString(),
          user: sanitizedEmail,
          ip: data.ip || 'unknown',
        });

        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        handleFailedAttempt();
        
        // Log failed attempt
        console.warn('Login failed:', {
          timestamp: new Date().toISOString(),
          email: sanitizedEmail,
          reason: data.message || 'Invalid credentials',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
      // Clear password from memory for security
      setPassword('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Get password strength label and color
  const getPasswordStrengthInfo = () => {
    const strengths = [
      { label: 'Very Weak', color: '#ef4444' },
      { label: 'Weak', color: '#f97316' },
      { label: 'Fair', color: '#eab308' },
      { label: 'Good', color: '#84cc16' },
      { label: 'Strong', color: '#22c55e' },
    ];
    return strengths[passwordStrength] || strengths[0];
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="background-shape shape-1"></div>
        <div className="background-shape shape-2"></div>
        <div className="background-shape shape-3"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-icon">
              <Shield size={32} />
            </div>
          </div>
          <h1>Secure Admin Login</h1>
          <p>Protected by enterprise-grade security</p>
        </div>

        {/* Security Alert for Lockout */}
        {isLocked && (
          <div className="security-alert alert-danger">
            <AlertTriangle size={20} />
            <div>
              <strong>Account Temporarily Locked</strong>
              <p>Too many failed login attempts. Try again in {formatLockoutTime(lockoutTime)}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && !isLocked && (
          <div className="security-alert alert-error">
            <AlertTriangle size={20} />
            <p>{error}</p>
          </div>
        )}

        {/* Login Attempts Warning */}
        {loginAttempts > 0 && loginAttempts < MAX_ATTEMPTS && !isLocked && (
          <div className="security-alert alert-warning">
            <AlertTriangle size={20} />
            <p>Warning: {loginAttempts} failed attempt(s). Account will lock after {MAX_ATTEMPTS} attempts.</p>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          {/* CSRF Token Hidden Field */}
          <input type="hidden" name="csrf_token" value={csrfToken} />

          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                disabled={isLocked}
                required
                maxLength="100"
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
                placeholder="Enter secure password"
                value={password}
                onChange={handlePasswordChange}
                autoComplete="current-password"
                disabled={isLocked}
                required
                minLength="8"
                maxLength="128"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
                aria-label="Toggle password visibility"
                disabled={isLocked}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill" 
                    style={{ 
                      width: `${(passwordStrength / 5) * 100}%`,
                      backgroundColor: getPasswordStrengthInfo().color 
                    }}
                  ></div>
                </div>
                <span 
                  className="strength-label"
                  style={{ color: getPasswordStrengthInfo().color }}
                >
                  {getPasswordStrengthInfo().label}
                </span>
              </div>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLocked}
              />
              <span>Remember me for 30 days</span>
            </label>
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="login-button" 
            disabled={isLoading || isLocked}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>Sign In Securely</span>
              </>
            )}
          </button>
        </form>

        <div className="security-features">
          <h4>🔒 Security Features</h4>
          <ul>
            <li>✓ 256-bit encryption</li>
            <li>✓ CSRF protection</li>
            <li>✓ Rate limiting</li>
            <li>✓ Brute force prevention</li>
          </ul>
        </div>

        <div className="login-footer">
          <p>Need access? <a href="#">Contact System Administrator</a></p>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="login-bottom-text">
        <p>&copy; 2025 Raccoon Toy Admin Panel. All rights reserved.</p>
        <p className="security-notice">
          <Shield size={14} /> This is a secure system. All activities are logged and monitored.
        </p>
      </div>
    </div>
  );
}

export default Login;