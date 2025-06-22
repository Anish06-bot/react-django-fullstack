// src/Components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Keep this unless renamed to Home.css

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear token
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo">🏋️ GymZone</div>
        <ul className="sidebar-menu">
          <li>Home</li>
          <li>Products</li>
          <li>Orders</li>
          <li>Users</li>
          <li>Reports</li>
          <li>Settings</li>
          <li
            className="logout"
            onClick={handleLogout}
            style={{ cursor: 'pointer', color: '#f87171' }}
          >
            Logout
          </li>
        </ul>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <h1>Welcome to GymZone Admin Panel</h1>
        </header>
        <section className="stats">
          <div className="card">
            <h3>Total Products</h3>
            <p>24</p>
          </div>
          <div className="card">
            <h3>Total Orders</h3>
            <p>102</p>
          </div>
          <div className="card">
            <h3>Active Users</h3>
            <p>58</p>
          </div>
        </section>
      </main>
    </div>
  );
}
