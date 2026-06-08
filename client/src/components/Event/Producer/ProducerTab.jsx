import { useState, useEffect } from 'react';
import { getProducers, getEventProducer, assignProducer, removeProducer, rateProducer } from '../../../services/producerService';

const Stars = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: '4px', fontSize: '24px', cursor: onChange ? 'pointer' : 'default' }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} onClick={() => onChange?.(n)} style={{ color: n <= value ? '#f59e0b' : '#d1d5db' }}>★</span>
    ))}
  </div>
);

export default function ProducerTab({ eventId }) {
  const [producers, setProducers] = useState([]);
  const [assigned, setAssigned] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [ratingSaved, setRatingSaved] = useState(false);

  useEffect(() => {
    getProducers().then(setProducers).catch(console.error);
    getEventProducer(eventId).then((p) => {
      setAssigned(p);
      if (p?.rating) { setRating(p.rating); setReview(p.review || ''); }
    }).catch(console.error);
  }, [eventId]);

  const handleAssign = async (producerId) => {
    await assignProducer(eventId, Number(producerId));
    const p = producers.find((pr) => pr.id === Number(producerId));
    setAssigned({ ...p, rating: null, review: null });
  };

  const handleRemove = async () => {
    await removeProducer(eventId);
    setAssigned(null);
    setRating(0);
    setReview('');
  };

  const handleRate = async () => {
    await rateProducer(eventId, rating, review);
    setRatingSaved(true);
    setTimeout(() => setRatingSaved(false), 2000);
  };

  return (
    <div className="tab-content">
      <h3 className="section-title">מפיק האירוע</h3>

      {!assigned ? (
        <>
          <p style={{ marginBottom: '12px', color: 'var(--text-muted)' }}>בחר מפיק לאירוע זה:</p>
          <div className="events-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {producers.map((p) => (
              <div key={p.id} className="event-card" style={{ cursor: 'default' }}>
                <h3>🎬 {p.full_name}</h3>
                {p.avg_rating && <Stars value={Math.round(p.avg_rating)} />}
                {p.phone && <p>📞 {p.phone}</p>}
                {p.contact_email && <p>✉️ {p.contact_email}</p>}
                {p.bio && <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{p.bio}</p>}
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {p.rating_count > 0 ? `דירוג ממוצע: ${p.avg_rating} (${p.rating_count} דירוגים)` : 'אין דירוגים עדיין'}
                </p>
                <button className="btn-primary" style={{ marginTop: '8px', width: '100%' }} onClick={() => handleAssign(p.id)}>
                  + שייך לאירוע
                </button>
              </div>
            ))}
            {producers.length === 0 && <p>אין מפיקים רשומים במערכת</p>}
          </div>
        </>
      ) : (
        <div className="event-card" style={{ maxWidth: '400px' }}>
          <h3>🎬 {assigned.full_name}</h3>
          {assigned.phone && <p>📞 {assigned.phone}</p>}
          {assigned.contact_email && <p>✉️ {assigned.contact_email}</p>}
          {assigned.bio && <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{assigned.bio}</p>}

          <div style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
            <p style={{ marginBottom: '6px' }}>דרג את המפיק:</p>
            <Stars value={rating} onChange={setRating} />
            <textarea
              placeholder="כתוב המלצה (אופציונלי)..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={3}
              style={{ width: '100%', marginTop: '8px' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button className="btn-primary" onClick={handleRate} disabled={!rating}>שמור דירוג</button>
              <button className="btn-ghost" onClick={handleRemove}>הסר מפיק</button>
              {ratingSaved && <span style={{ color: 'green', alignSelf: 'center' }}>✓ נשמר</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
