import React, { useState } from 'react';
import './formStyles.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');

  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showOTP, setShowOTP] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);

  // Handle Signup Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const formData = {
      username,
      email,
      password,
    };

    try {
      setLoading(true);
      setError('');
      setMessage('');

      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'OTP sent to your email');
        setRegisteredEmail(email);
        setShowOTP(true);

        // Clear input
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Verification
  const handleOTPSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');
      setMessage('');

      const response = await fetch('http://localhost:8000/api/verify-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Your account has been verified!');
        setShowOTP(false);
        setOtp('');
      } else {
        setError(data.error || 'OTP verification failed');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('Network error during OTP verification');
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOTP = async () => {
    debugger; 
    try {
      setResendDisabled(true);
      setLoading(true);
      setError('');
      setMessage('');

      const response = await fetch('http://localhost:8000/api/resend-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'OTP resent successfully');
      } else {
        setError(data.error || 'Failed to resend OTP');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError('Network error during OTP resend');
    } finally {
      setLoading(false);
      setTimeout(() => setResendDisabled(false), 30000); // enable after 30s
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-box">
        <h2>{showOTP ? 'Verify OTP' : 'Create Account'}</h2>

        {!showOTP ? (
          <form onSubmit={handleSubmit} className="signup-form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleOTPSubmit} className="signup-form">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>

            <div className="form-footer" style={{ marginTop: '10px' }}>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendDisabled || loading}
                style={{
                  marginTop: '10px',
                  backgroundColor: '#fff',
                  color: '#667eea',
                  border: '1px solid #667eea',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: resendDisabled ? 'not-allowed' : 'pointer',
                }}
              >
                {resendDisabled ? 'Resend OTP (Wait...)' : 'Resend OTP'}
              </button>
            </div>
          </>
        )}

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        {!showOTP && (
          <div className="form-footer">
            <p>Already have an account? <a href="/login">Login</a></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Signup;
