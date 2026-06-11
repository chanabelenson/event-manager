import { respondToRequest } from '../../services/producerService';

export default function PendingRequests({ requests, onRespond }) {
  if (!requests.length) return null;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });

  const handle = async (requestId, action) => {
    await respondToRequest(requestId, action);
    onRespond(requestId, action);
  };

  return (
    <div className="pending-requests">
      <h2 className="pending-requests-title">בקשות חדשות 🔔</h2>
      <div className="events-grid pending-requests-grid">
        {requests.map((r) => (
          <div key={r.id} className="event-card event-card-static">
            <h3>{r.event_name}</h3>
            <p>📅 {formatDate(r.event_date)}</p>
            <p>📍 {r.location_name}</p>
            <p className="request-owner">בעל האירוע: {r.owner_name}</p>
            <div className="request-actions">
              <button className="btn-primary" onClick={() => handle(r.id, 'approved')}>✓ אשר</button>
              <button className="btn-ghost" onClick={() => handle(r.id, 'rejected')}>✕ דחה</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
