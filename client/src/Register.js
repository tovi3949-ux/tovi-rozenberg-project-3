import React, { useState } from 'react';
import service from './service';
import './index.css';

function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // בדיקת התאמת סיסמאות
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await service.register(username, password);
      
      // שמירת Token ו-Username
      localStorage.setItem('token', response.token);
      localStorage.setItem('username', response.username);
      
      // קריאה לפונקציה שמעבירה לדף הראשי
      onRegisterSuccess();
    } catch (err) {
      console.error('Register error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">📝 Register</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="auth-input"
          placeholder="👤 Username (min 3 characters)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
          maxLength={50}
        />
        <input
          type="password"
          className="auth-input"
          placeholder="🔒 Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          maxLength={100}
        />
        <input
          type="password"
          className="auth-input"
          placeholder="🔒 Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          maxLength={100}
        />
        <button 
          type="submit" 
          className="auth-btn"
          disabled={loading}
        >
          {loading ? '⏳ Creating account...' : 'Register'}
        </button>
      </form>
      {error && <div className="auth-error">❌ {error}</div>}
      <div className="auth-switch">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin}>
          Login here
        </button>
      </div>
    </div>
  );
}

export default Register; 