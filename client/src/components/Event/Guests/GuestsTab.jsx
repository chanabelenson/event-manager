import { useState, useEffect } from 'react';
import { getGuests, addGuest, updateGuestStatus, deleteGuest } from '../../../services/guestService';
import ConfirmModal from '../../Common/ConfirmModal';

const STATUS_LABELS = { pending: '⏳ ממתין', confirmed: '✅ מאשר', declined: '❌ מסרב' };
const EMPTY = { guest_name: '', phone_number: '', guests_count: 1, category: '' };

export default function GuestsTab({ eventId }) {
  const [guests, setGuests] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { getGuests(eventId).then(setGuests).catch(console.error); }, [eventId]);

  const confirmed = guests.filter((g) => g.status === 'confirmed').reduce((s, g) => s + Number(g.guests_count), 0);
  const pending = guests.filter((g) => g.status === 'pending').length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, invitation_token } = await addGuest(eventId, form);
    setGuests([...guests, { id, ...form, status: 'pending', invitation_token }]);
    setForm(EMPTY);
  };

  const handleStatus = async (id, status) => {
    await updateGuestStatus(eventId, id, status);
    setGuests(guests.map((g) => (g.id === id ? { ...g, status } : g)));
  };

  const handleDelete = async (id) => {
    await deleteGuest(eventId, id);
    setGuests(guests.filter((g) => g.id !== id));
    setConfirmDelete(null);
  };

  return (
    <div className="tab-content">
      <div className="budget-summary">
        <div className="budget-summary-item"><span>סה"כ מוזמנים</span><strong>{guests.length}</strong></div>
        <div className="budget-summary-item actual"><span>מאשרים ({confirmed} אנשים)</span><strong>{guests.filter(g => g.status === 'confirmed').length}</strong></div>
        <div className="budget-summary-item"><span>ממתינים</span><strong>{pending}</strong></div>
      </div>

      <form className="inline-form" onSubmit={handleSubmit}>
        <input placeholder="שם מלא" value={form.guest_name} onChange={(e) => setForm({ ...form, guest_name: e.target.value })} required />
        <input placeholder="טלפון" value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} />
        <input placeholder="קטגוריה (למשל: משפחה, חברים)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input type="number" min="1" placeholder="מספר אנשים" value={form.guests_count} onChange={(e) => setForm({ ...form, guests_count: e.target.value })} />
        <button type="submit" className="btn-primary">+ הוסף</button>
      </form>

      <table className="data-table">
        <thead><tr><th>שם</th><th>טלפון</th><th>אנשים</th><th>סטטוס</th><th>קישור הזמנה</th><th></th></tr></thead>
        <tbody>
          {guests.map((g) => (
            <tr key={g.id}>
              <td>{g.guest_name}</td>
              <td>{g.phone_number || '-'}</td>
              <td>{g.guests_count}</td>
              <td>
                <select value={g.status} onChange={(e) => handleStatus(g.id, e.target.value)} className="status-select">
                  {Object.entries(STATUS_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </td>
              <td><a href={`/invite/${g.invitation_token}`} target="_blank" rel="noreferrer">🔗 קישור</a></td>
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
