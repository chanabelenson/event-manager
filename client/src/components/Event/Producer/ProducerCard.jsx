import './Producer.css';

const Stars = ({ value }) => (
  <div className="producer-stars">
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} className={n <= value ? 'star-filled' : 'star-empty'}>★</span>
    ))}
  </div>
);

export default function ProducerCard({ producer, isAssigned, onClick }) {
  return (
    <div className={`event-card producer-card${isAssigned ? ' assigned' : ''}`} onClick={onClick}>
      {isAssigned && <span className="producer-badge">המפיק שלי ✓</span>}
      <h3 className={`producer-card-name${isAssigned ? ' has-badge' : ''}`}>🎬 {producer.full_name}</h3>
      {producer.avg_rating > 0 && <Stars value={Math.round(producer.avg_rating)} />}
      {producer.phone && <p>📞 {producer.phone}</p>}
      {producer.contact_email && <p>✉️ {producer.contact_email}</p>}
      {producer.bio && <p className="producer-card-bio">{producer.bio}</p>}
      <p className="producer-card-rating-text">
        {producer.rating_count > 0
          ? `דירוג ממוצע: ${producer.avg_rating} (${producer.rating_count} דירוגים)`
          : 'אין דירוגים עדיין'}
      </p>
    </div>
  );
}
