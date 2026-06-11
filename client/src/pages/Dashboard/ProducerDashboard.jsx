import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducerDashboard, getPendingRequests } from '../../services/producerService';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/Common/ConfirmModal';
import Settings from '../Settings/Settings';
import PendingRequests from './PendingRequests';
import ProducerEventDetail from './ProducerEventDetail';

export default function ProducerDashboard() {
  const [events, setEvents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getProducerDashboard(), getPendingRequests()])
      .then(([eventsData, requestsData]) => {
        setEvents(eventsData);
        setRequests(requestsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleRespond = (requestId, action) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
    if (action === 'approved') {
      getProducerDashboard().then(setEvents).catch(console.error);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>הארועים שלי 🎬</h1>
          <p>שלום {user?.name} | מפיק אירועים</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setShowSettings(true)}>שינוי סיסמה</button>
          <button className="btn-ghost" onClick={() => setConfirmLogout(true)}>התנתק</button>
        </div>
      </header>

      {loading ? (
        <div className="dashboard-empty"><p>טוען...</p></div>
      ) : (
        <>
          <div className="event-nav">
            <button
              className={`event-nav-btn${activeTab === 'events' ? ' active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              האירועים שלי
            </button>
            <button
              className={`event-nav-btn${activeTab === 'requests' ? ' active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              בקשות ממתינות
              {requests.length > 0 && (
                <span className="tab-badge">{requests.length}</span>
              )}
            </button>
          </div>

          {activeTab === 'events' && (
            events.length === 0 ? (
              <div className="dashboard-empty">
                <span className="empty-icon">📋</span>
                <h3>אין אירועים משויכים אליך עדיין</h3>
              </div>
            ) : (
              <div className="events-grid">
                {events.map((event) => (
                  <div key={event.id} className="event-card" onClick={() => setSelectedEvent(event)}>
                    <span className="event-card-icon">🎬</span>
                    <h3>{event.event_name}</h3>
                    <p className="event-card-date">📅 {formatDate(event.event_date)}</p>
                    <p className="event-card-location">📍 {event.location_name}</p>
                    <div className="producer-event-stats">
                      <p>✅ מגיעים: <strong>{event.confirmed_count}</strong></p>
                      <p>⏳ טרם ענו: <strong>{event.pending_count}</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'requests' && (
            <PendingRequests requests={requests} onRespond={handleRespond} />
          )}
        </>
      )}

      {selectedEvent && (
        <ProducerEventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}

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
