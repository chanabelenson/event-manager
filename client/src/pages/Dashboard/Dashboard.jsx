import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyEvents } from '../../services/eventService';
import { logout } from '../../services/authService';
import NewEventModal from './NewEventModal';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getMyEvents()
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>האירועים שלי</h1>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ אירוע חדש</button>
          <button className="btn-ghost" onClick={handleLogout}>התנתק</button>
        </div>
      </header>

      {loading ? (
        <p className="dashboard-empty">טוען...</p>
      ) : events.length === 0 ? (
        <div className="dashboard-empty">
          <p>אין לך אירועים עדיין</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>צור את האירוע הראשון שלך</button>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card" onClick={() => navigate(`/event/${event.id}`)}>
              <h3>{event.event_name}</h3>
              <p className="event-card-date">📅 {formatDate(event.event_date)}</p>
              <p className="event-card-location">📍 {event.location_name}</p>
              {event.location_address && (
                <p className="event-card-location" style={{ fontSize: '13px', opacity: 0.7 }}>
                  {event.location_address}
                </p>
              )}
              <span className="event-card-arrow">←</span>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <NewEventModal
          onClose={() => setShowModal(false)}
          onCreated={(newEvent) => setEvents((prev) => [newEvent, ...prev])}
        />
      )}
    </div>
  );
}
