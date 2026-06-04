const TODAY = new Date().toISOString().split('T')[0];

function isPast(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) < today;
}

export default function CalendarCell({ date, tasks, onClick }) {
  const past = isPast(date);
  const isToday = date === TODAY;
  const dayNum = new Date(date).getDate();
  const doneTasks = tasks.filter((t) => t.is_completed).length;

  return (
    <div
      className={`cal-cell ${past ? 'cal-past' : ''} ${isToday ? 'cal-today' : ''}`}
      onClick={() => onClick(date)}
    >
      <span className="cal-cell-num">{dayNum}</span>

      {tasks.length > 0 && (
        <span className="cal-cell-badge">{doneTasks}/{tasks.length}</span>
      )}

      {isToday && <span className="cal-cell-dot today-dot" />}
      {past && !isToday && <div className="cal-cell-overlay" />}
    </div>
  );
}
