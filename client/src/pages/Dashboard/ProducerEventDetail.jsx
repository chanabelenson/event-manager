import ProducerUpdates from '../../components/Event/Producer/ProducerUpdates';

export default function ProducerEventDetail({ event, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card scrollable producer-event-detail-card" onClick={(e) => e.stopPropagation()}>
        <div className="producer-event-detail-header">
          <h3>{event.event_name}</h3>
          <button className="btn-ghost" onClick={onClose}>✕</button>
        </div>

        <div className="producer-event-detail-stats">
          <div className="budget-summary-item producer-stat-item">
            <span>אישרו הגעה</span>
            <strong className="producer-stat-value">{event.confirmed_count}</strong>
          </div>
          <div className="budget-summary-item producer-stat-item">
            <span>טרם ענו</span>
            <strong className="producer-stat-value">{event.pending_count}</strong>
          </div>
        </div>

        <ProducerUpdates eventId={event.id} userRole="producer" />
      </div>
    </div>
  );
}
