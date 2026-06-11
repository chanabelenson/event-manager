import './Producer.css';

export default function UpdateItem({ update, canMarkDone, onMarkDone }) {
  const isProducer = update.author_role === 'producer';
  const isDone = update.status === 'done';

  return (
    <div className={`update-item ${isProducer ? 'producer-update' : 'owner-update'}${isDone ? ' done' : ''}`}>
      <div>
        <span className="update-item-author">
          {isProducer ? '🎬 מפיק' : '👤 בעל האירוע'}
        </span>
        <span className={`update-item-content${isDone ? ' done' : ''}`}>
          {update.content}
        </span>
      </div>
      {isDone ? (
        <span className="update-done-icon">✓</span>
      ) : (
        canMarkDone && (
          <button className="btn-secondary btn-mark-done" onClick={() => onMarkDone(update.id)}>
            בוצע ✓
          </button>
        )
      )}
    </div>
  );
}
