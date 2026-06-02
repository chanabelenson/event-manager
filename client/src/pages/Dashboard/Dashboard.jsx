import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyEvents } from '../../services/eventService';
import { logout } from '../../services/authService';
import NewEventModal from './NewEventModal';
import Confetti from '../../components/Confetti';

const EVENT_ICONS = ['🎊', '💍', '🎂', '🥂', '🎈', '✨'];

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const stopConfetti = useCallback(() => setShowConfetti(false), []);
  const navigate = useNavigate();

  useEffect(() => {
    getMyEvents()
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

  const getIcon = (id) => EVENT_ICONS[id % EVENT_ICONS.length];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>האירועים שלי 🎊</h1>
          <p>{events.length > 0 ? `${events.length} אירועים פעילים` : 'ברוך הבא למערכת'}</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ אירוע חדש</button>
          <button className="btn-ghost" onClick={handleLogout}>התנתק</button>
        </div>
      </header>

      {loading ? (
        <div className="dashboard-empty">
          <span className="empty-icon">✨</span>
          <p>טוען...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="dashboard-empty">
          <span className="empty-icon">🎉</span>
          <h3>עדיין אין אירועים</h3>
          <p>צור את האירוע הראשון שלך ותתחיל לנהל הכל במקום אחד</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>צור אירוע ראשון ✨</button>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card" onClick={() => navigate(`/event/${event.id}`)}>
              <span className="event-card-icon">{getIcon(event.id)}</span>
              <h3>{event.event_name}</h3>
              <p className="event-card-date">📅 {formatDate(event.event_date)}</p>
              <p className="event-card-location">📍 {event.location_name}</p>
              {event.location_address && (
                <p className="event-card-address">{event.location_address}</p>
              )}
              <span className="event-card-arrow">←</span>
            </div>
          ))}
        </div>
      )}

      {showConfetti && <Confetti onDone={stopConfetti} />}

      {showModal && (
        <NewEventModal
          onClose={() => setShowModal(false)}
          onCreated={(newEvent) => {
            setEvents((prev) => [newEvent, ...prev]);
            setShowConfetti(true);
          }}
        />
      )}
    </div>
  );
}
