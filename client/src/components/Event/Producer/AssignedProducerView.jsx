import { useState } from 'react';
import ProducerUpdates from './ProducerUpdates';
import ConfirmModal from '../../Common/ConfirmModal';

const Stars = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: '4px', fontSize: '24px', cursor: onChange ? 'pointer' : 'default' }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} onClick={() => onChange?.(n)} style={{ color: n <= value ? '#f59e0b' : '#d1d5db' }}>★</span>
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
    <div className="event-card" style={{ maxWidth: '500px' }}>
      <h3>🎬 {producer.full_name}</h3>
      {producer.phone && <p>📞 {producer.phone}</p>}
      {producer.contact_email && <p>✉️ {producer.contact_email}</p>}
      {producer.bio && <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{producer.bio}</p>}

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
          <button className="btn-ghost" onClick={() => setConfirmRemove(true)}>הסר מפיק</button>
          {ratingSaved && <span style={{ color: 'green', alignSelf: 'center' }}>✓ נשמר</span>}
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
