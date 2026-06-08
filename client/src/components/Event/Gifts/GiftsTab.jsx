import { useState, useEffect } from 'react';
import { getGifts, addGift, deleteGift } from '../../../services/giftService';
import ConfirmModal from '../../Common/ConfirmModal';

export default function GiftsTab({ eventId }) {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', link: '' });
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    getGifts(eventId).then(setGifts).finally(() => setLoading(false));
  }, [eventId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const gift = await addGift(eventId, form);
      setGifts((prev) => [...prev, gift]);
      setForm({ name: '', description: '', link: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (gift) => {
    if (gift.claimed_by) return;
    try {
      await deleteGift(eventId, gift.id);
      setGifts((prev) => prev.filter((g) => g.id !== gift.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirmDelete(null);
    }
  };

  const purchased = gifts.filter((g) => g.claimed_by);
  const unclaimed = gifts.filter((g) => !g.claimed_by);

  if (loading) return <p className="tab-loading">טוען...</p>;

  return (
    <div className="gifts-tab">
      <form className="gifts-form" onSubmit={handleAdd}>
        <h3>הוסף מתנה לרשימה</h3>
        <div className="gifts-form-row">
          <input
            placeholder="שם המתנה *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="תיאור (אופציונלי)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            placeholder="קישור לרכישה (אופציונלי)"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />
          <button type="submit" className="btn-primary">+ הוסף</button>
        </div>
        {error && <p className="auth-error">{error}</p>}
      </form>

      <div className="gifts-stats">
        <span className="gift-stat">🎁 סה"כ: {gifts.length}</span>
        <span className="gift-stat gift-stat-claimed">✅ נקנו: {purchased.length}</span>
        <span className="gift-stat gift-stat-unclaimed">⏳ פנויות: {unclaimed.length}</span>
      </div>

      {gifts.length === 0 ? (
        <p className="tab-empty">עדיין לא הוספת מתנות לרשימה</p>
      ) : (
        <div className="gifts-list">
          {gifts.map((gift) => (
            <div key={gift.id} className={`gift-item ${gift.claimed_by ? 'gift-claimed' : ''}`}>
              <div className="gift-info">
                <span className="gift-status-dot">{gift.claimed_by ? '✅' : '🎁'}</span>
                <div>
                  <p className="gift-name">{gift.name}</p>
                  {gift.description && <p className="gift-desc">{gift.description}</p>}
                  {gift.link && <a href={gift.link} target="_blank" rel="noreferrer" className="gift-link">🔗 קישור לרכישה</a>}
                  {gift.claimed_by_name && (
                    <p className="gift-claimer">נקנתה על ידי: <strong>{gift.claimed_by_name}</strong></p>
                  )}
                </div>
              </div>
              {!gift.claimed_by && (
                <button className="gift-delete-btn" onClick={() => setConfirmDelete(gift)} title="מחק">✕</button>
              )}
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="מחיקת מתנה"
          message={`האם למחוק את "${confirmDelete.name}" מהרשימה?`}
          confirmText="מחק"
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
