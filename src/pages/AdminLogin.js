 // src/pages/AdminLogin.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', {

        username,
        password,
      });

      if (res.data.token) {
        localStorage.setItem('adminToken', res.data.token);
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Try again.');
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Admin Login</h2>
      <form onSubmit={handleLogin} style={formStyle}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />

        <div style={passwordContainerStyle}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...inputStyle, paddingRight: '45px', marginBottom: 0 }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={eyeStyle}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '👁️‍🗨️' : '👁️'}
          </span>
        </div>

        <button type="submit" style={{ ...buttonStyle, marginTop: '1rem' }}>
          Login
        </button>
      </form>
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

// 💄 Styles
const containerStyle = {
  maxWidth: '400px',
  margin: '100px auto',
  fontFamily: 'Poppins, sans-serif',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 0 10px rgba(0,0,0,0.08)',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const titleStyle = {
  color: '#065f46',
  marginBottom: '1.5rem',
  textAlign: 'center',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  fontSize: '16px',
  boxSizing: 'border-box',
};

const buttonStyle = {
  width: '100%',
  backgroundColor: '#065f46',
  color: 'white',
  padding: '12px',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
};

const passwordContainerStyle = {
  position: 'relative',
  width: '100%',
};

const eyeStyle = {
  position: 'absolute',
  top: '50%',
  right: '12px',
  transform: 'translateY(-50%)',
  fontSize: '20px',
  cursor: 'pointer',
  userSelect: 'none',
  opacity: 0.7,
};

const errorStyle = {
  color: 'red',
  marginTop: '10px',
  textAlign: 'center',
};


export default AdminLogin;
