import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducerDashboard } from '../../services/producerService';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/Common/ConfirmModal';

export default function ProducerDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getProducerDashboard()
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('he-IL', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>הארועים שלי 🎬</h1>
          <p>שלום {user?.name} | מפיק אירועים</p>
        </div>
        <div className="header-actions">
          <button className="btn-ghost" onClick={() => setConfirmLogout(true)}>התנתק</button>
        </div>
      </header>

      {loading ? (
        <div className="dashboard-empty"><p>טוען...</p></div>
      ) : events.length === 0 ? (
        <div className="dashboard-empty">
          <span className="empty-icon">📋</span>
          <h3>אין אירועים משויכים אליך עדיין</h3>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <span className="event-card-icon">🎬</span>
              <h3>{event.event_name}</h3>
              <p className="event-card-date">📅 {formatDate(event.event_date)}</p>
              <p className="event-card-location">📍 {event.location_name}</p>
              <div style={{ marginTop: '8px', padding: '8px', background: 'var(--surface)', borderRadius: '8px' }}>
                <p>✅ מגיעים: <strong>{event.confirmed_count} אנשים</strong></p>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmLogout && (
        <ConfirmModal
          title="התנתקות"
          message="האם אתה בטוח שברצונך להתנתק?"
          confirmText="התנתק"
          confirmClass="btn-danger"
          onConfirm={handleLogout}
          onCancel={() => setConfirmLogout(false)}
        />
      )}
    </div>
  );
}
