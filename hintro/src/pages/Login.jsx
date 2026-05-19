import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Eye, EyeOff } from 'lucide-react';
import '../styles/Login.css';

const VALID_USERS = {
  'shivam@hintro.ai': { password: 'password123', userId: 'u1' },
  'kshitij.saxena@hintro.ai': { password: 'password123', userId: 'u2' },
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    const matched = VALID_USERS[trimmedEmail];

    if (!matched || matched.password !== password) {
      setError('Invalid email or password. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    login(matched.userId);
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        
        <h1 className="login-title">Login</h1>

        <form onSubmit={handleLogin} className={`login-form${shake ? ' shake' : ''}`}>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon-left" size={16} />
              <input
                type="email"
                className="form-input has-left-icon"
                placeholder="Example@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="form-input has-right-icon"
                placeholder="********"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                required
              />
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error-msg">
              {error}
            </div>
          )}

          <button type="submit" className="login-submit-btn">
            Login
          </button>
        </form>

        <div className="login-eval-helper">
          <span className="eval-helper-title">Quick Auto-Fill:</span>
          <div className="eval-helper-buttons">
            <button
              type="button"
              className="eval-btn"
              onClick={() => {
                setEmail('shivam@hintro.ai');
                setPassword('password123');
                setShowPassword(true);
              }}
            >
              User 1 (Empty)
            </button>
            <span className="eval-divider">|</span>
            <button
              type="button"
              className="eval-btn"
              onClick={() => {
                setEmail('kshitij.saxena@hintro.ai');
                setPassword('password123');
                setShowPassword(true);
              }}
            >
              User 2 (Active)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
