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
    <div style={{ marginBottom: '24px' }}>
      <h2 style={{ marginBottom: '12px' }}>בקשות חדשות 🔔</h2>
      <div className="events-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {requests.map((r) => (
          <div key={r.id} className="event-card" style={{ cursor: 'default' }}>
            <h3>{r.event_name}</h3>
            <p>📅 {formatDate(r.event_date)}</p>
            <p>📍 {r.location_name}</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>בעל האירוע: {r.owner_name}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => handle(r.id, 'approved')}>✓ אשר</button>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => handle(r.id, 'rejected')}>✕ דחה</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
