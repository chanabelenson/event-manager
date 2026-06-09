const TABS = [
  { key: 'budget', label: '💰 תקציב' },
  { key: 'guests', label: '👥 מוזמנים' },
  { key: 'tables', label: '🪑 שולחנות' },
  { key: 'calendar', label: '📅 יומן' },
  { key: 'gifts', label: '🎁 מתנות' },
  { key: 'producer', label: '🎬 מפיק' },
];

export default function EventNav({ active, onChange }) {
  return (
    <nav className="event-nav">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          className={`event-nav-btn ${active === tab.key ? 'active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
