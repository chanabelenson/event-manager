import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, login as loginService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'owner', phone: '', contact_email: '', bio: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('הסיסמאות אינן תואמות');
    setLoading(true);
    try {
      const producerData = form.role === 'producer' ? { phone: form.phone, contact_email: form.contact_email, bio: form.bio } : {};
      await register(form.name, form.email, form.password, form.role, producerData);
      const data = await loginService(form.email, form.password);
      login(data.user);
      navigate(data.user.role === 'producer' ? '/producer/dashboard' : '/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-bg-shapes"><span /><span /><span /></div>
      <div className="auth-card auth-card-register">
        <div className="auth-logo">
          🎊 SimchaManager
          <span>ניהול אירועים</span>
        </div>
        <div className="auth-divider" />
        <h2>הרשמה</h2>
        <form className="auth-form auth-form-grid" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>סוג חשבון</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="owner">בעל אירוע</option>
              <option value="producer">מפיק אירועים</option>
            </select>
          </div>
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

          {form.role === 'producer' && (
            <div className="producer-fields">
              <div className="input-group">
                <label>טלפון</label>
                <input type="tel" name="phone" placeholder="050-0000000" value={form.phone} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>אימייל ליצירת קשר</label>
                <input type="email" name="contact_email" placeholder="contact@example.com" value={form.contact_email} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>תיאור / ביוגרפיה</label>
                <textarea name="bio" placeholder="ספר על עצמך..." value={form.bio} onChange={handleChange} rows={3} />
              </div>
            </div>
          )}

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
