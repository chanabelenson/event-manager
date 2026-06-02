import { useCountdown } from './useCountdown';

export default function Countdown({ eventDate }) {
  const t = useCountdown(eventDate);

  if (!t) return <p className="countdown-done">🎉 האירוע הגיע!</p>;

  return (
    <div className="countdown">
      {[['ימים', t.days], ['שעות', t.hours], ['דקות', t.minutes], ['שניות', t.seconds]].map(([label, val]) => (
        <div key={label} className="countdown-unit">
          <span className="countdown-val">{String(val).padStart(2, '0')}</span>
          <span className="countdown-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
