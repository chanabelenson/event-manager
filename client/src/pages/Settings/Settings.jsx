import { useState } from 'react';
import { sendResetCode, verifyResetCode, changePassword } from '../../services/authService';

export default function Settings({ onClose }) {
  const [step, setStep] = useState('initial');
  const [code, setCode] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    setError('');
    setLoading(true);
    try {
      await sendResetCode();
      setCode('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setStep('verify');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    if (code.length !== 6) {
      setError('יש להזין קוד בן 6 ספרות');
      return;
    }
    setLoading(true);
    try {
      await verifyResetCode(code);
      setStep('change');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }
    setLoading(true);
    try {
      await changePassword(code, currentPassword, newPassword);
      setStep('success');
    } catch (err) {
      setError(err.message);
      const isCodeError = err.message.includes('פג תוקף') || err.message.includes('שגוי') || err.message.includes('קוד');
      if (isCodeError) setStep('expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card settings-card">
        <button onClick={onClose} className="settings-close-btn">✕</button>
        <h2>שינוי סיסמה</h2>

        {step === 'initial' && (
          <div className="settings-step-center">
            <p className="settings-info-text">
              נשלח קוד אימות חד-פעמי לכתובת האימייל הרשומה על שמך.
            </p>
            {error && <p className="auth-error">{error}</p>}
            <button className="btn-primary settings-full-btn" onClick={handleSendCode} disabled={loading}>
              {loading ? 'שולח...' : 'שלח קוד לאימייל שלי'}
            </button>
            <button className="btn-ghost settings-full-btn" onClick={onClose}>חזרה לדף הבית</button>
          </div>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifyCode} className="auth-form">
            <p className="settings-info-text">
              קוד אימות נשלח לאימייל שלך. הקוד תקף ל-10 דקות.
            </p>
            <input
              type="text"
              placeholder="הזן קוד אימות (6 ספרות)"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
            />
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'מאמת...' : 'המשך'}</button>
            <button type="button" className="btn-ghost" onClick={handleSendCode} disabled={loading}>
              {loading ? 'שולח...' : 'שלח קוד מחדש'}
            </button>
          </form>
        )}

        {step === 'change' && (
          <form onSubmit={handleChangePassword} className="auth-form">
            <input
              type="password"
              placeholder="סיסמה נוכחית"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="סיסמה חדשה (לפחות 6 תווים)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="אימות סיסמה חדשה"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'שומר...' : 'שנה סיסמה'}
            </button>
          </form>
        )}

        {step === 'expired' && (
          <div className="settings-step-center">
            <p className="settings-expired-icon">⏰</p>
            <p className="settings-expired-msg">{error}</p>
            <p className="settings-expired-hint">יש לשלוח קוד חדש ולנסות שוב.</p>
            <button className="btn-primary settings-full-btn" onClick={handleSendCode} disabled={loading}>
              {loading ? 'שולח...' : 'שלח קוד חדש'}
            </button>
            <button className="btn-ghost settings-full-btn" onClick={onClose}>ביטול</button>
          </div>
        )}

        {step === 'success' && (
          <div className="settings-step-center">
            <p className="settings-success-msg">✓ הסיסמה שונתה בהצלחה!</p>
            <button className="btn-primary" onClick={onClose}>חזרה לדף הבית</button>
          </div>
        )}
      </div>
    </div>
  );
}
