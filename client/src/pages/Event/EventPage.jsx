import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvent } from '../../services/eventService';
import Countdown from '../../components/Event/shared/Countdown';
import EventNav from '../../components/Event/shared/EventNav';
import BudgetTab from '../../components/Event/Budget/BudgetTab';
import GuestsTab from '../../components/Event/Guests/GuestsTab';
import TablesTab from '../../components/Event/Tables/TablesTab';
import CalendarTab from '../../components/Event/Calendar/CalendarTab';
import GiftsTab from '../../components/Event/Gifts/GiftsTab';

export default function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('budget');

  useEffect(() => { getEvent(id).then(setEvent).catch(() => navigate('/dashboard')); }, [id]);

  if (!event) return <div className="loading">טוען...</div>;

  const tabs = {
    budget: <BudgetTab eventId={id} />,
    guests: <GuestsTab eventId={id} />,
    tables: <TablesTab eventId={id} />,
    calendar: <CalendarTab eventId={id} createdAt={event.created_at} eventDate={event.event_date} />,
    gifts: <GiftsTab eventId={id} />,
  };

  return (
    <div className="event-page">
      <button className="btn-ghost back-btn" onClick={() => navigate('/dashboard')}>→ חזרה</button>

      <header className="event-page-header">
        <h1 className="event-page-title">{event.event_name}</h1>
        <p className="event-page-meta">📍 {event.location_name} &nbsp;|&nbsp; 📅 {new Date(event.event_date).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        <Countdown eventDate={event.event_date} />
      </header>

      <EventNav active={activeTab} onChange={setActiveTab} />

      <main className="event-page-body">
        {tabs[activeTab]}
      </main>
    </div>
  );
}
