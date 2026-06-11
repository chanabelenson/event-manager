import ProducerUpdates from '../../components/Event/Producer/ProducerUpdates';

export default function ProducerEventDetail({ event, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '520px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3>{event.event_name}</h3>
          <button className="btn-ghost" onClick={onClose}>✕</button>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div className="budget-summary-item" style={{ flex: 1, textAlign: 'center' }}>
            <span>אישרו הגעה</span>
            <strong style={{ fontSize: '24px', display: 'block' }}>{event.confirmed_count}</strong>
          </div>
          <div className="budget-summary-item" style={{ flex: 1, textAlign: 'center' }}>
            <span>טרם ענו</span>
            <strong style={{ fontSize: '24px', display: 'block' }}>{event.pending_count}</strong>
          </div>
        </div>

        <ProducerUpdates eventId={event.id} userRole="producer" />
      </div>
    </div>
  );
}
