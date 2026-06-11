import { useState, useEffect } from 'react';
import { getProducerReviews } from '../../../services/producerService';

const Stars = ({ value }) => (
  <div style={{ display: 'flex', gap: '2px', fontSize: '16px' }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} style={{ color: n <= value ? '#f59e0b' : '#d1d5db' }}>★</span>
    ))}
  </div>
);

export default function ProducerProfile({ producer, onRequest, onCancel, requestSent, requestLocked, onClose }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getProducerReviews(producer.id).then(setReviews).catch(console.error);
  }, [producer.id]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '480px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3>🎬 {producer.full_name}</h3>
          <button className="btn-ghost" onClick={onClose}>✕</button>
        </div>

        {producer.phone && <p>📞 {producer.phone}</p>}
        {producer.contact_email && <p>✉️ {producer.contact_email}</p>}
        {producer.bio && <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '8px 0' }}>{producer.bio}</p>}

        <div style={{ margin: '16px 0', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
          <h4 style={{ marginBottom: '10px' }}>ביקורות ודירוגים</h4>
          {reviews.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>אין ביקורות עדיין</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {reviews.map((r, i) => (
                <div key={i} style={{ padding: '10px', background: 'var(--surface)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{r.event_name}</span>
                    <Stars value={r.rating} />
                  </div>
                  {r.review && <p style={{ fontSize: '13px' }}>{r.review}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {requestSent ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="btn-secondary" style={{ flex: 1, textAlign: 'center', cursor: 'default' }}>
              ✓ בקשה נשלחה
            </span>
            <button className="btn-ghost" style={{ color: '#ef4444' }} onClick={onCancel}>
              בטל בקשה
            </button>
          </div>
        ) : (
          <button
            className={requestLocked ? 'btn-secondary' : 'btn-primary'}
            style={{ width: '100%' }}
            onClick={() => onRequest(producer)}
            disabled={requestLocked}
          >
            {requestLocked ? 'כבר נשלחה בקשה לאירוע זה' : '+ שלח בקשת התחברות'}
          </button>
        )}
      </div>
    </div>
  );
}
