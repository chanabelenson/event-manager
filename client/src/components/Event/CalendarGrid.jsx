import CalendarCell from './CalendarCell';

const DAYS_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

function getMonthLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });
}

function groupByWeeks(days) {
  if (!days.length) return [];
  const weeks = [];
  const firstDay = new Date(days[0]).getDay();
  let week = Array(firstDay).fill(null);

  for (const day of days) {
    week.push(day);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

function groupByMonth(days) {
  const months = {};
  for (const d of days) {
    const key = d.slice(0, 7);
    if (!months[key]) months[key] = [];
    months[key].push(d);
  }
  return months;
}

export default function CalendarGrid({ days, tasks, onCellClick }) {
  const tasksByDate = {};
  for (const t of tasks) {
    const d = t.task_date?.split('T')[0];
    if (d) { if (!tasksByDate[d]) tasksByDate[d] = []; tasksByDate[d].push(t); }
  }

  const byMonth = groupByMonth(days);

  return (
    <div className="cal-container">
      {Object.entries(byMonth).map(([monthKey, monthDays]) => (
        <div key={monthKey} className="cal-month">
          <h3 className="cal-month-label">{getMonthLabel(monthDays[0])}</h3>
          <div className="cal-header-row">
            {DAYS_HE.map((d) => <span key={d} className="cal-header-cell">{d}</span>)}
          </div>
          {groupByWeeks(monthDays).map((week, wi) => (
            <div key={wi} className="cal-week-row">
              {week.map((date, di) =>
                date ? (
                  <CalendarCell
                    key={date}
                    date={date}
                    tasks={tasksByDate[date] || []}
                    onClick={onCellClick}
                  />
                ) : (
                  <div key={`empty-${di}`} className="cal-cell cal-empty" />
                )
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
