// src/Components/LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    // Navigate to login
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} style={{
      padding: '10px 20px',
      backgroundColor: '#dc2626',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    }}>
      Logout
    </button>
  );
}
