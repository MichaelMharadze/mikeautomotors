import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import ManageCars from './pages/ManageCars';

function App() {
  return (
   
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manage-cars" element={<ManageCars />} />
      </Routes>
    </Router>
  );
}

export default App;