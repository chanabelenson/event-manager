import { useState, useEffect } from 'react';
import { getProducerReviews } from '../../../services/producerService';
import './Producer.css';

const Stars = ({ value }) => (
  <div className="producer-stars">
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} className={n <= value ? 'star-filled' : 'star-empty'}>★</span>
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
        <div className="producer-profile-header">
          <h3>🎬 {producer.full_name}</h3>
          <button className="btn-ghost" onClick={onClose}>✕</button>
        </div>

        <div className="producer-profile-meta">
          {producer.phone && <p>📞 {producer.phone}</p>}
          {producer.contact_email && <p>✉️ {producer.contact_email}</p>}
        </div>
        {producer.bio && <p className="producer-profile-bio">{producer.bio}</p>}

        <div className="producer-reviews-section">
          <h4>ביקורות ודירוגים</h4>
          {reviews.length === 0 ? (
            <p className="producer-reviews-empty">אין ביקורות עדיין</p>
          ) : (
            <div className="producer-reviews-list">
              {reviews.map((r, i) => (
                <div key={i} className="producer-review-item">
                  <div className="producer-review-item-header">
                    <span className="producer-review-event">{r.event_name}</span>
                    <Stars value={r.rating} />
                  </div>
                  {r.review && <p className="producer-review-text">{r.review}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {requestSent ? (
          <div className="producer-profile-actions">
            <span className="btn-secondary producer-request-sent">✓ בקשה נשלחה</span>
            <button className="btn-cancel-request" onClick={onCancel}>בטל בקשה</button>
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
