import { useState } from 'react';
import { createEvent } from '../../services/eventService';

export default function NewEventModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    event_name: '', event_date: '', location_name: '', location_address: '',
  });
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
        <h2>🎊 אירוע חדש</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>שם האירוע</label>
            <input name="event_name" placeholder="למשל: חתונת כהן" value={form.event_name} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>תאריך ושעה</label>
            <input name="event_date" type="datetime-local" value={form.event_date} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>שם המקום</label>
            <input name="location_name" placeholder="למשל: אולם ורד הגליל" value={form.location_name} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>כתובת <span style={{ fontWeight: 400, opacity: 0.6 }}>(אופציונלי)</span></label>
            <input name="location_address" placeholder="רחוב, עיר" value={form.location_address} onChange={handleChange} />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <div className="modal-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '...יוצר' : 'צור אירוע 🎉'}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>ביטול</button>
          </div>
        </form>
      </div>
    </div>
  );
}
