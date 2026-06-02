import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginService(form.email, form.password);
      login(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-bg-shapes">
        <span /><span /><span />
      </div>
      <div className="auth-card">
        <div className="auth-logo">
          🎊 SimchaManager
          <span>ניהול אירועים</span>
        </div>
        <div className="auth-divider" />
        <h2>התחברות</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>אימייל</label>
            <input type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>סיסמה</label>
            <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? '...מתחבר' : 'כניסה למערכת ✨'}
          </button>
        </form>
        <p>אין לך חשבון? <Link to="/register">הירשם כאן</Link></p>
      </div>
    </div>
  );
}
