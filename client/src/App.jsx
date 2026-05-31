import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Invitation from './pages/Invitation/Invitation';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* דף הבית מפנה אוטומטית למסך ההתחברות */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* נתיבי הרשמה והתחברות */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* אזור ניהול האירוע של בעל השמחה */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* דף הזמנה דינמי לאורחים (לפי טוקן ייחודי בכתובת) */}
          <Route path="/invite/:token" element={<Invitation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;