import { useState } from 'react';
import { createEvent } from '../../services/eventService';

const EVENT_TYPES = ['חתונה', 'בר מצווה', 'בת מצווה', 'יום הולדת', 'אירוסין', 'אחר'];

export default function NewEventModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ title: '', type: '', date: '', location: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const newEvent = await createEvent(form);
      onCreated(newEvent);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>אירוע חדש</h2>
        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="שם האירוע" value={form.title} onChange={handleChange} required />
          <select name="type" value={form.type} onChange={handleChange} required>
            <option value="">סוג האירוע</option>
            {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input name="date" type="date" value={form.date} onChange={handleChange} required />
          <input name="location" placeholder="מיקום" value={form.location} onChange={handleChange} required />
          {error && <p className="auth-error">{error}</p>}
          <div className="modal-actions">
            <button type="submit" disabled={loading}>{loading ? 'יוצר...' : 'צור אירוע'}</button>
            <button type="button" className="btn-secondary" onClick={onClose}>ביטול</button>
          </div>
        </form>
      </div>
    </div>
  );
}
