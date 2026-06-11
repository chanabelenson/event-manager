export default function RequestConfirmModal({ producer, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>שליחת בקשת התחברות</h3>
        <p style={{ margin: '12px 0' }}>
          בלחיצה על אשר, המפיק <strong>{producer.full_name}</strong> יקבל גישה לתאריך ומיקום האירוע שלך.
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={onCancel}>ביטול</button>
          <button className="btn-primary" onClick={onConfirm}>אשר ושלח בקשה</button>
        </div>
      </div>
    </div>
  );
}
