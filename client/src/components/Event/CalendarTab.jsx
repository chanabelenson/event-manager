import { useState, useEffect } from 'react';
import { getTasks, addTask, toggleTask, deleteTask } from '../../services/eventService';

function getDaysRange(createdAt, eventDate) {
  const start = new Date(createdAt);
  start.setHours(0, 0, 0, 0);
  const end = new Date(eventDate);
  end.setHours(0, 0, 0, 0);
  const days = [];
  const cur = new Date(start);
  while (cur <= end) {
    days.push(cur.toISOString().split('T')[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

function isDatePast(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) < today;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function CalendarTab({ eventId, createdAt, eventDate }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({});
  const days = getDaysRange(createdAt, eventDate);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => { getTasks(eventId).then(setTasks).catch(console.error); }, [eventId]);

  const tasksForDay = (date) => tasks.filter((t) => t.task_date && t.task_date.split('T')[0] === date);

  const handleAdd = async (date) => {
    const title = newTask[date]?.trim();
    if (!title) return;
    const { id } = await addTask(eventId, { task_name: title, task_date: date });
    setTasks([...tasks, { id, task_date: date, task_name: title, is_completed: false }]);
    setNewTask({ ...newTask, [date]: '' });
  };

  const handleToggle = async (id, is_completed) => {
    await toggleTask(id, !is_completed);
    setTasks(tasks.map((t) => (t.id === id ? { ...t, is_completed: !is_completed } : t)));
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="tab-content">
      <div className="calendar-days">
        {days.map((date) => {
          const past = isDatePast(date);
          const isToday = date === today;
          const dayTasks = tasksForDay(date);
          return (
            <div key={date} className={`calendar-day ${past ? 'past' : ''} ${isToday ? 'today' : ''}`}>
              <div className="calendar-day-header">
                <span className="calendar-date">{formatDate(date)}</span>
                {past && <span className="past-badge">עבר</span>}
                {isToday && <span className="today-badge">היום</span>}
              </div>
              <ul className="task-list">
                {dayTasks.map((t) => (
                  <li key={t.id} className={t.is_completed ? 'done' : ''}>
                    <input type="checkbox" checked={!!t.is_completed} onChange={() => handleToggle(t.id, t.is_completed)} />
                    <span>{t.task_name}</span>
                    <button onClick={() => handleDelete(t.id)}>🗑️</button>
                  </li>
                ))}
              </ul>
              {!past && (
                <div className="task-add-row">
                  <input
                    placeholder="משימה חדשה..."
                    value={newTask[date] || ''}
                    onChange={(e) => setNewTask({ ...newTask, [date]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd(date)}
                  />
                  <button onClick={() => handleAdd(date)} className="btn-primary">+</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
