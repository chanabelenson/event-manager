import { useState, useEffect } from 'react';
import { getTasks, addTask, toggleTask, deleteTask } from '../../services/eventService';
import CalendarGrid from './CalendarGrid';
import DayModal from './DayModal';

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

export default function CalendarTab({ eventId, createdAt, eventDate }) {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const days = getDaysRange(createdAt, eventDate);

  useEffect(() => { getTasks(eventId).then(setTasks).catch(console.error); }, [eventId]);

  const tasksForDate = (date) => tasks.filter((t) => t.task_date?.split('T')[0] === date);

  const handleAdd = async (date, title) => {
    const { id } = await addTask(eventId, { task_name: title, task_date: date });
    setTasks((prev) => [...prev, { id, task_date: date, task_name: title, is_completed: false }]);
  };

  const handleToggle = async (id, is_completed) => {
    await toggleTask(id, !is_completed);
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, is_completed: !is_completed } : t)));
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="tab-content">
      <CalendarGrid days={days} tasks={tasks} onCellClick={setSelectedDate} />

      {selectedDate && (
        <DayModal
          date={selectedDate}
          tasks={tasksForDate(selectedDate)}
          onClose={() => setSelectedDate(null)}
          onAdd={handleAdd}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
