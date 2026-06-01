import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Invitation from './pages/Invitation/Invitation';
import { getToken } from './services/authService';

function ProtectedRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/invite/:token" element={<Invitation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
