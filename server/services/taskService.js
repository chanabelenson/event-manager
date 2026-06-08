import pool from '../config/db.js';
import * as Event from '../models/event.js';
import { AppError } from '../utils/AppError.js';

export async function getTasks(eventId, userId) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);

  const [rows] = await pool.query(
    'SELECT * FROM tasks WHERE event_id = ? ORDER BY task_date ASC, id ASC',
    [eventId]
  );
  return rows;
}

export async function addTask(eventId, userId, { task_name, task_date, notes }) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);
  if (!task_name) throw new AppError('שם משימה חובה', 400);

  const [result] = await pool.query(
    'INSERT INTO tasks (event_id, task_name, task_date, notes) VALUES (?, ?, ?, ?)',
    [eventId, task_name, task_date || null, notes || null]
  );
  return { id: result.insertId };
}

export async function toggleTask(taskId, userId, is_completed) {
  const [task] = await pool.query(
    'SELECT t.* FROM tasks t JOIN events e ON t.event_id = e.id WHERE t.id = ? AND e.user_id = ?',
    [taskId, userId]
  );
  if (!task || task.length === 0) throw new AppError('משימה לא נמצאה', 404);

  await pool.query('UPDATE tasks SET is_completed=? WHERE id=?', [is_completed, taskId]);
}

export async function updateTask(taskId, userId, { task_name, task_date, notes }) {
  const [task] = await pool.query(
    'SELECT t.* FROM tasks t JOIN events e ON t.event_id = e.id WHERE t.id = ? AND e.user_id = ?',
    [taskId, userId]
  );
  if (!task || task.length === 0) throw new AppError('משימה לא נמצאה', 404);

  await pool.query(
    'UPDATE tasks SET task_name=?, task_date=?, notes=? WHERE id=?',
    [task_name, task_date || null, notes || null, taskId]
  );
}

export async function deleteTask(taskId, userId) {
  const [task] = await pool.query(
    'SELECT t.* FROM tasks t JOIN events e ON t.event_id = e.id WHERE t.id = ? AND e.user_id = ?',
    [taskId, userId]
  );
  if (!task || task.length === 0) throw new AppError('משימה לא נמצאה', 404);

  await pool.query('DELETE FROM tasks WHERE id=?', [taskId]);
}
