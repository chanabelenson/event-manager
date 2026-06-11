import { useState, useEffect } from 'react';
import { getTasks, addTask, updateTask, deleteTask } from '../../../services/taskService';
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
    const year = cur.getFullYear();
    const month = String(cur.getMonth() + 1).padStart(2, '0');
    const day = String(cur.getDate()).padStart(2, '0');
    
    days.push(`${year}-${month}-${day}`);
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

export default function CalendarTab({ eventId, createdAt, eventDate }) {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const days = getDaysRange(createdAt, eventDate);

  useEffect(() => { 
    getTasks(eventId).then(setTasks).catch(console.error); 
  }, [eventId]);

  const tasksForDate = (date) => tasks.filter((t) => {
    if (!t.task_date) return false;
    const dateObj = new Date(t.task_date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}` === date;
  });

  const handleAdd = async (date, title) => {
    try {
      const { id } = await addTask(eventId, { task_name: title, task_date: date });
      setTasks((prev) => [...prev, { id, task_date: date, task_name: title, is_completed: false }]);
    } catch (error) {
      console.error("שגיאה בהוספת משימה:", error);
    }
  };

  const handleToggle = async (id, is_completed) => {
    try {
      await updateTask(eventId, id, { is_completed: !is_completed });
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, is_completed: !is_completed } : t)));
    } catch (error) {
      console.error("שגיאה בעדכון משימה:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(eventId, id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("שגיאה במחיקת משימה:", error);
    }
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