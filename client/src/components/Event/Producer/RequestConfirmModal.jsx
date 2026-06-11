import './Producer.css';

export default function RequestConfirmModal({ producer, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>שליחת בקשת התחברות</h3>
        <p className="request-confirm-message">
          בלחיצה על אשר, המפיק <strong>{producer.full_name}</strong> יקבל גישה לתאריך ומיקום האירוע שלך.
        </p>
        <div className="request-confirm-actions">
          <button className="btn-secondary" onClick={onCancel}>ביטול</button>
          <button className="btn-primary" onClick={onConfirm}>אשר ושלח בקשה</button>
        </div>
      </div>
    </div>
  );
}
