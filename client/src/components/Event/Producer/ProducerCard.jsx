const Stars = ({ value }) => (
  <div style={{ display: 'flex', gap: '2px', fontSize: '16px' }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} style={{ color: n <= value ? '#f59e0b' : '#d1d5db' }}>★</span>
    ))}
  </div>
);

export default function ProducerCard({ producer, isAssigned, onClick }) {
  return (
    <div
      className="event-card"
      style={{
        cursor: 'pointer',
        border: isAssigned ? '2px solid var(--primary)' : undefined,
        boxShadow: isAssigned ? '0 0 0 4px var(--primary)' : undefined,
        position: 'relative',
      }}
      onClick={onClick}
    >
      {isAssigned && (
        <span style={{
          position: 'absolute', top: '10px', left: '10px',
          background: 'var(--primary)', color: 'white',
          borderRadius: '999px', padding: '2px 10px', fontSize: '12px',
        }}>
          המפיק שלי ✓
        </span>
      )}
      <h3 style={{ marginTop: isAssigned ? '20px' : undefined }}>🎬 {producer.full_name}</h3>
      {producer.avg_rating > 0 && <Stars value={Math.round(producer.avg_rating)} />}
      {producer.phone && <p>📞 {producer.phone}</p>}
      {producer.contact_email && <p>✉️ {producer.contact_email}</p>}
      {producer.bio && <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{producer.bio}</p>}
      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
        {producer.rating_count > 0
          ? `דירוג ממוצע: ${producer.avg_rating} (${producer.rating_count} דירוגים)`
          : 'אין דירוגים עדיין'}
      </p>
    </div>
  );
}
