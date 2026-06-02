import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/authService';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('הסיסמאות אינן תואמות');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/login');
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
        <h2>הרשמה</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>שם מלא</label>
            <input type="text" name="name" placeholder="ישראל ישראלי" value={form.name} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>אימייל</label>
            <input type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>סיסמה</label>
            <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>אימות סיסמה</label>
            <input type="password" name="confirm" placeholder="••••••••" value={form.confirm} onChange={handleChange} required />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? '...נרשם' : 'יצירת חשבון 🎉'}
          </button>
        </form>
        <p>יש לך חשבון? <Link to="/login">התחבר כאן</Link></p>
      </div>
    </div>
  );
}
