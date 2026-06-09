import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyEvents, deleteEvent } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';
import NewEventModal from './NewEventModal';
import ConfirmModal from '../../components/Common/ConfirmModal';
import Confetti from '../../components/Common/Confetti';
import Settings from '../Settings/Settings';

const EVENT_ICONS = ['🎊', '💍', '🎂', '🥂', '🎈', '✨'];

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const stopConfetti = useCallback(() => setShowConfetti(false), []);

  useEffect(() => {
    getMyEvents()
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogoutConfirm = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteEvent(eventToDelete.id);
      setEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id));
    } catch (err) {
      console.error(err.message);
    } finally {
      setEventToDelete(null);
    }
  };

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
          <h1>האירועים של {user?.name} 🎊</h1>
          <p>{events.length > 0 ? `${events.length} אירועים פעילים` : 'ברוך הבא למערכת'}</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ אירוע חדש</button>
          <button className="btn-secondary" onClick={() => setShowSettings(true)}>שינוי סיסמה</button>
          <button className="btn-ghost" onClick={() => setConfirmLogout(true)}>התנתק</button>
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
            <div key={event.id} className="event-card">
              <button
                className="event-card-delete"
                onClick={(e) => { e.stopPropagation(); setEventToDelete(event); }}
                title="מחק אירוע"
              >✕</button>
              <div onClick={() => navigate(`/event/${event.id}`)}>
                <span className="event-card-icon">{getIcon(event.id)}</span>
                <h3>{event.event_name}</h3>
                <p className="event-card-date">📅 {formatDate(event.event_date)}</p>
                <p className="event-card-location">📍 {event.location_name}</p>
                {event.location_address && (
                  <p className="event-card-address">{event.location_address}</p>
                )}
                <span className="event-card-arrow">←</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showConfetti && <Confetti onDone={stopConfetti} />}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}

      {showModal && (
        <NewEventModal
          onClose={() => setShowModal(false)}
          onCreated={(newEvent) => {
            setEvents((prev) => [newEvent, ...prev]);
            setShowConfetti(true);
          }}
        />
      )}

      {confirmLogout && (
        <ConfirmModal
          title="התנתקות"
          message="האם אתה בטוח שברצונך להתנתק?"
          confirmText="התנתק"
          confirmClass="btn-danger"
          onConfirm={handleLogoutConfirm}
          onCancel={() => setConfirmLogout(false)}
        />
      )}

      {eventToDelete && (
        <ConfirmModal
          title="מחיקת אירוע"
          message={`האם אתה בטוח שברצונך למחוק את "${eventToDelete.event_name}"? פעולה זו אינה ניתנת לביטול.`}
          confirmText="מחק"
          confirmClass="btn-danger"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setEventToDelete(null)}
        />
      )}
    </div>
  );
}
