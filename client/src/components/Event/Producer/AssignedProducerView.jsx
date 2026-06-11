import { useState } from 'react';
import ProducerUpdates from './ProducerUpdates';
import ConfirmModal from '../../Common/ConfirmModal';
import './Producer.css';

const Stars = ({ value, onChange }) => (
  <div className={`producer-stars${onChange ? ' lg' : ''}`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} onClick={() => onChange?.(n)} className={n <= value ? 'star-filled' : 'star-empty'}>★</span>
    ))}
  </div>
);

export default function AssignedProducerView({ producer, eventId, onRate, onRemove }) {
  const [rating, setRating] = useState(producer.rating || 0);
  const [review, setReview] = useState(producer.review || '');
  const [ratingSaved, setRatingSaved] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const handleRate = async () => {
    await onRate(rating, review);
    setRatingSaved(true);
    setTimeout(() => setRatingSaved(false), 2000);
  };

  return (
    <div className="assigned-producer-card">
      <h3>🎬 {producer.full_name}</h3>
      {producer.phone && <p>📞 {producer.phone}</p>}
      {producer.contact_email && <p>✉️ {producer.contact_email}</p>}
      {producer.bio && <p className="producer-card-bio">{producer.bio}</p>}

      <div className="assigned-producer-rating">
        <p>דרג את המפיק:</p>
        <Stars value={rating} onChange={setRating} />
        <textarea
          placeholder="כתוב המלצה (אופציונלי)..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={3}
        />
        <div className="assigned-rating-actions">
          <button className="btn-primary" onClick={handleRate} disabled={!rating}>שמור דירוג</button>
          <button className="btn-ghost" onClick={() => setConfirmRemove(true)}>הסר מפיק</button>
          {ratingSaved && <span className="rating-saved">✓ נשמר</span>}
        </div>
      </div>

      <ProducerUpdates eventId={eventId} userRole="owner" />

      {confirmRemove && (
        <ConfirmModal
          title="הסרת מפיק"
          message={`האם אתה בטוח שברצונך להסיר את ${producer.full_name} מהאירוע?`}
          confirmText="הסר"
          confirmClass="btn-danger"
          onConfirm={onRemove}
          onCancel={() => setConfirmRemove(false)}
        />
      )}
    </div>
  );
}
