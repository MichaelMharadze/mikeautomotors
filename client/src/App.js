 // src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import ManageCars from './pages/ManageCars';

// Simple auth check helper
const isAuthenticated = () => !!localStorage.getItem('adminToken');

// Route wrapper to protect private routes
function RequireAuth({ children }) {
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/admin-login" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protect dashboard route */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />

        {/* Protect manage cars route */}
        <Route
          path="/manage-cars"
          element={
            <RequireAuth>
              <ManageCars />
            </RequireAuth>
          }
        />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Optional: catch all unknown routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
