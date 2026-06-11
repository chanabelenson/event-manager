export default function UpdateItem({ update, canMarkDone, onMarkDone }) {
  const isProducerUpdate = update.author_role === 'producer';

  return (
    <div style={{
      padding: '10px 14px',
      borderRadius: 'var(--radius-sm)',
      background: isProducerUpdate ? 'var(--bg-card)' : 'var(--surface)',
      border: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
      opacity: update.status === 'done' ? 0.6 : 1,
    }}>
      <div>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
          {isProducerUpdate ? '🎬 מפיק' : '👤 בעל האירוע'}
        </span>
        <span style={{ textDecoration: update.status === 'done' ? 'line-through' : 'none' }}>
          {update.content}
        </span>
      </div>
      {update.status === 'done' ? (
        <span style={{ color: 'green', fontSize: '18px' }}>✓</span>
      ) : (
        canMarkDone && (
          <button className="btn-secondary" style={{ fontSize: '12px', padding: '4px 10px', whiteSpace: 'nowrap' }} onClick={() => onMarkDone(update.id)}>
            בוצע ✓
          </button>
        )
      )}
    </div>
  );
}
