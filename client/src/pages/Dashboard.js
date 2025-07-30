// Updated Admin Login + Security Setup

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaPlusCircle } from 'react-icons/fa';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
    } else {
      // Optional: validate token with backend
      axios
        .post('http://localhost:5000/api/admin/verify', { token })
        .then((res) => {
          if (res.data.valid) setIsAuthorized(true);
          else navigate('/admin-login');
        })
        .catch(() => navigate('/admin-login'));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  if (!isAuthorized) return null;

  return (
    <div
      className="dashboard"
      style={{
        fontFamily: 'Poppins, sans-serif',
        maxWidth: '1000px',
        margin: '40px auto',
        padding: '2rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '30px',
        }}
      >
        <h2
          style={{
            color: '#065f46',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FaCar style={{ marginRight: '10px' }} />
          Admin Dashboard
        </h2>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => navigate('/manage-cars')}
            style={{
              backgroundColor: '#065f46',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <FaPlusCircle style={{ marginRight: '8px' }} />
            Manage Cars
          </button>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#dc2626',
              color: '#fff',
              padding: '10px 16px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <section
        style={{
          color: '#333',
          fontSize: '16px',
          fontFamily: 'Poppins, sans-serif',
          lineHeight: '1.6',
        }}
      >
        <p>
          <strong style={{ fontSize: '18px', color: '#065f46' }}>
            Welcome back, Automike
          </strong>
          <br />
          Use the dashboard to:
           </p>
          <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
            <li>Upload new cars</li>
            <li>Edit current listings</li>
            <li>Remove sold vehicles</li>
          </ul>
       
      </section>
    </div>
  );
}

export default Dashboard;


