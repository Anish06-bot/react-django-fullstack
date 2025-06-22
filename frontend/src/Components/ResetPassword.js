import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './formstyle.css';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/password-reset-confirm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, new_password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset successful!');
        setError('');
      } else {
        setError(data.error || 'Password reset failed');
        setMessage('');
      }
    } catch (err) {
      setError('Network error');
      setMessage('');
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="form-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          className="form-input"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-input"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className="form-button">Reset Password</button>
      </form>

      {message && (
        <div className="success-message">
          {message}
          <br />
          <button onClick={handleGoToLogin} className="form-button" style={{ marginTop: '10px' }}>
            Go to Login
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default ResetPassword;
