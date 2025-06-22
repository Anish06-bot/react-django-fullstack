import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- Added useNavigate
import { toast } from 'react-toastify';
import './formstyle.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // <-- Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = { username, password };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        toast.success('Login successful!');

        // ✅ Redirect to Gym Dashboard
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed');
        toast.error(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error');
      toast.error('Network error, please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="form-button">Login</button>
      </form>

      <div className="form-forgot">
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-footer">
        <p>
          Don't have an account?{' '}
          <Link to="/signup" className="toggle-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
