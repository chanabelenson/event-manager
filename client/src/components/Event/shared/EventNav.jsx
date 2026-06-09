const TABS = [
  { key: 'budget', icon: '💰', label: 'תקציב' },
  { key: 'guests', icon: '👥', label: 'מוזמנים' },
  { key: 'tables', icon: '🪑', label: 'שולחנות' },
  { key: 'calendar', icon: '📅', label: 'יומן' },
  { key: 'gifts', icon: '🎁', label: 'מתנות' },
  { key: 'producer', icon: '🎬', label: 'מפיק' },
];

export default function EventNav({ active, onChange }) {
  return (
    <nav className="event-nav">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          className={`event-nav-btn ${active === tab.key ? 'active' : ''}`}
          onClick={() => onChange(tab.key)}
          title={tab.label}
        >
          {tab.icon} <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
