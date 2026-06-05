import pool from '../config/db.js';
import * as Event from '../models/Event.js';

export async function getTasks(eventId, userId) {
  // תחילה בדקן שהאירוע שייך למשתמש
  const event = await Event.findEventById(eventId, userId);
  if (!event) {
    const error = new Error('אירוע לא נמצא');
    error.status = 404;
    throw error;
  }

  const [rows] = await pool.query(
    'SELECT * FROM tasks WHERE event_id = ? ORDER BY task_date ASC, id ASC',
    [eventId]
  );
  return rows;
}

export async function addTask(eventId, userId, { task_name, task_date, estimated_cost, actual_cost, category, notes }) {
  // בדיקה שהאירוע שייך למשתמש
  const event = await Event.findEventById(eventId, userId);
  if (!event) {
    const error = new Error('אירוע לא נמצא');
    error.status = 404;
    throw error;
  }

  if (!task_name) {
    const error = new Error('שם משימה חובה');
    error.status = 400;
    throw error;
  }

  const [result] = await pool.query(
    'INSERT INTO tasks (event_id, task_name, task_date, estimated_cost, actual_cost, category, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [eventId, task_name, task_date || null, estimated_cost || 0, actual_cost || 0, category || null, notes || null]
  );

  return { id: result.insertId };
}

export async function toggleTask(taskId, userId, is_completed) {
  // בדיקה שהמשימה שייכת למשתמש
  const [task] = await pool.query(
    'SELECT t.* FROM tasks t JOIN events e ON t.event_id = e.id WHERE t.id = ? AND e.user_id = ?',
    [taskId, userId]
  );

  if (!task || task.length === 0) {
    const error = new Error('משימה לא נמצאה');
    error.status = 404;
    throw error;
  }

  await pool.query('UPDATE tasks SET is_completed=? WHERE id=?', [is_completed, taskId]);
}

export async function updateTask(taskId, userId, { task_name, estimated_cost, actual_cost, category, notes }) {
  // בדיקה שהמשימה שייכת למשתמש
  const [task] = await pool.query(
    'SELECT t.* FROM tasks t JOIN events e ON t.event_id = e.id WHERE t.id = ? AND e.user_id = ?',
    [taskId, userId]
  );

  if (!task || task.length === 0) {
    const error = new Error('משימה לא נמצאה');
    error.status = 404;
    throw error;
  }

  await pool.query(
    'UPDATE tasks SET task_name=?, estimated_cost=?, actual_cost=?, category=?, notes=? WHERE id=?',
    [task_name, estimated_cost || 0, actual_cost || 0, category || null, notes || null, taskId]
  );
}

export async function deleteTask(taskId, userId) {
  // בדיקה שהמשימה שייכת למשתמש
  const [task] = await pool.query(
    'SELECT t.* FROM tasks t JOIN events e ON t.event_id = e.id WHERE t.id = ? AND e.user_id = ?',
    [taskId, userId]
  );

  if (!task || task.length === 0) {
    const error = new Error('משימה לא נמצאה');
    error.status = 404;
    throw error;
  }

  await pool.query('DELETE FROM tasks WHERE id=?', [taskId]);
}
