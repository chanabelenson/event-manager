import { useState, useEffect } from 'react';
import { getGuests, addGuest, updateGuest, deleteGuest } from '../../../services/guestService';
import { getEvent, updateEvent } from '../../../services/eventService';
import { getCategories, addCategory } from '../../../services/categoryService';
import ConfirmModal from '../../Common/ConfirmModal';

const STATUS_LABELS = { pending: '⏳ ממתין', confirmed: '✅ מאשר', declined: '❌ מסרב' };
const EMPTY = { guest_name: '', email: '', guests_count: 1, category_id: '' };

export default function GuestsTab({ eventId }) {
  const [guests, setGuests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [newCategory, setNewCategory] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [rsvpDeadline, setRsvpDeadline] = useState('');
  const [deadlineSaved, setDeadlineSaved] = useState(false);

  useEffect(() => {
    getGuests(eventId).then(setGuests).catch(console.error);
    getCategories(eventId).then(setCategories).catch(console.error);
    getEvent(eventId).then((e) => {
      if (e.rsvp_deadline) setRsvpDeadline(e.rsvp_deadline.split('T')[0]);
    }).catch(console.error);
  }, [eventId]);

  const confirmed = guests.filter((g) => g.status === 'confirmed').reduce((s, g) => s + Number(g.confirmed_count ?? g.guests_count), 0);
  const pending = guests.filter((g) => g.status === 'pending').length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, invitation_token } = await addGuest(eventId, form);
    const cat = categories.find((c) => c.id === Number(form.category_id));
    setGuests([...guests, { id, ...form, status: 'pending', category: cat?.category_name || null, invitation_token }]);
    setForm(EMPTY);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    const cat = await addCategory(eventId, newCategory.trim());
    setCategories([...categories, cat]);
    setNewCategory('');
  };

  const handleStatus = async (id, status) => {
    await updateGuest(eventId, id, { status });
    setGuests(guests.map((g) => (g.id === id ? { ...g, status } : g)));
  };

  const handleDelete = async (id) => {
    await deleteGuest(eventId, id);
    setGuests(guests.filter((g) => g.id !== id));
    setConfirmDelete(null);
  };

  const handleDeadlineSave = async () => {
    await updateEvent(eventId, { rsvp_deadline: rsvpDeadline || null });
    setDeadlineSaved(true);
    setTimeout(() => setDeadlineSaved(false), 2000);
  };

  return (
    <div className="tab-content">
      <div className="budget-summary">
        <div className="budget-summary-item"><span>סה"כ מוזמנים</span><strong>{guests.length}</strong></div>
        <div className="budget-summary-item actual"><span>מאשרים ({confirmed} אנשים)</span><strong>{guests.filter(g => g.status === 'confirmed').length}</strong></div>
        <div className="budget-summary-item"><span>ממתינים</span><strong>{pending}</strong></div>
      </div>

      <div className="inline-form" style={{ alignItems: 'center' }}>
        <label style={{ whiteSpace: 'nowrap' }}>מועד אחרון לאישור:</label>
        <input type="date" value={rsvpDeadline} onChange={(e) => setRsvpDeadline(e.target.value)} />
        <button className="btn-primary" onClick={handleDeadlineSave}>שמור</button>
        {deadlineSaved && <span style={{ color: 'green' }}>✓ נשמר</span>}
        {!rsvpDeadline && <small style={{ color: 'gray' }}>(ברירת מחדל: יומיים לפני האירוע)</small>}
      </div>

      <form className="inline-form" onSubmit={handleAddCategory}>
        <input
          placeholder="שם קטגוריה חדשה (למשל: משפחה)"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button type="submit" className="btn-secondary">+ קטגוריה</button>
      </form>

      <form className="inline-form" onSubmit={handleSubmit}>
        <input placeholder="שם מלא" value={form.guest_name} onChange={(e) => setForm({ ...form, guest_name: e.target.value })} required />
        <input type="email" placeholder="אימייל (לשליחת הזמנה)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="status-select">
          <option value="">ללא קטגוריה</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.category_name}</option>)}
        </select>
        <input type="number" min="1" placeholder="מספר אנשים" value={form.guests_count} onChange={(e) => setForm({ ...form, guests_count: e.target.value })} />
        <button type="submit" className="btn-primary">+ הוסף</button>
      </form>

      <table className="data-table">
        <thead><tr><th>שם</th><th>אימייל</th><th>קטגוריה</th><th>מוזמנים</th><th>מגיעים</th><th>סטטוס</th><th>קישור</th><th></th></tr></thead>
        <tbody>
          {guests.map((g) => (
            <tr key={g.id}>
              <td data-label="שם">{g.guest_name}</td>
              <td data-label="אימייל">{g.email || '-'}</td>
              <td data-label="קטגוריה">{g.category || '-'}</td>
              <td data-label="מוזמנים">{g.guests_count}</td>
              <td data-label="מגיעים">{g.status === 'confirmed' ? (g.confirmed_count ?? g.guests_count) : '-'}</td>
              <td data-label="סטטוס">
                <select value={g.status} onChange={(e) => handleStatus(g.id, e.target.value)} className="status-select">
                  {Object.entries(STATUS_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </td>
              <td data-label="קישור"><a href={`/invite/${g.invitation_token}`} target="_blank" rel="noreferrer">🔗 קישור</a></td>
              <td className="row-actions">
                <button onClick={() => setConfirmDelete(g)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmDelete && (
        <ConfirmModal
          title="מחיקת אורח"
          message={`האם למחוק את "${confirmDelete.guest_name}"?`}
          confirmText="מחק"
          onConfirm={() => handleDelete(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
