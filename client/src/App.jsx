import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import ProducerDashboard from './pages/Dashboard/ProducerDashboard';
import EventPage from './pages/Event/EventPage';
import Invitation from './pages/Invitation/Invitation';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to={user.role === 'producer' ? '/producer/dashboard' : '/dashboard'} />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute role="owner"><Dashboard /></ProtectedRoute>} />
            <Route path="/producer/dashboard" element={<ProtectedRoute role="producer"><ProducerDashboard /></ProtectedRoute>} />
            <Route path="/event/:id" element={<Navigate to="budget" replace />} />
            <Route path="/event/:id/:tab" element={<ProtectedRoute role="owner"><EventPage /></ProtectedRoute>} />
            <Route path="/invite/:token" element={<Invitation />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
