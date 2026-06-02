import { useState } from 'react';
import { createEvent } from '../../services/eventService';

export default function NewEventModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    event_name: '',
    event_date: '',
    location_name: '',
    location_address: '',
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
        <h2>אירוע חדש</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="event_name"
            placeholder="שם האירוע (למשל: חתונת כהן)"
            value={form.event_name}
            onChange={handleChange}
            required
          />
          <input
            name="event_date"
            type="datetime-local"
            value={form.event_date}
            onChange={handleChange}
            required
          />
          <input
            name="location_name"
            placeholder="שם המקום (למשל: אולם ורד הגליל)"
            value={form.location_name}
            onChange={handleChange}
            required
          />
          <input
            name="location_address"
            placeholder="כתובת (אופציונלי)"
            value={form.location_address}
            onChange={handleChange}
          />
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
