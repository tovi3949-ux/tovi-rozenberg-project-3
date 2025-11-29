import React, { useState } from 'react';
import service from './service';
import './index.css';

function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await service.login(username, password);
      
      // שמירת Token ו-Username
      localStorage.setItem('token', response.token);
      localStorage.setItem('username', response.username);
      
      // קריאה לפונקציה שמעבירה לדף הראשי
      onLoginSuccess();
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">🔐 Login</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="auth-input"
          placeholder="👤 Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
        />
        <input
          type="password"
          className="auth-input"
          placeholder="🔒 Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button 
          type="submit" 
          className="auth-btn"
          disabled={loading}
        >
          {loading ? '⏳ Logging in...' : 'Login'}
        </button>
      </form>
      {error && <div className="auth-error">❌ {error}</div>}
      <div className="auth-switch">
        Don't have an account?{' '}
        <button onClick={onSwitchToRegister}>
          Register here
        </button>
      </div>
    </div>
  );
}

export default Login;