import pool from '../config/db.js';

export const getTasks = async (eventId) => {
  const [rows] = await pool.query(
    'SELECT * FROM tasks WHERE event_id = ? ORDER BY task_date ASC, id ASC',
    [eventId]
  );
  return rows;
};

export const verifyTaskOwnership = async (taskId, userId) => {
  const [rows] = await pool.query(
    `SELECT t.id FROM tasks t
     JOIN events e ON e.id = t.event_id
     WHERE t.id = ? AND e.user_id = ?`,
    [taskId, userId]
  );
  return rows.length > 0;
};

export const addTask = async (eventId, { task_name, task_date, notes }) => {
  const [result] = await pool.query(
    'INSERT INTO tasks (event_id, task_name, task_date, notes) VALUES (?, ?, ?, ?)',
    [eventId, task_name, task_date || null, notes || null]
  );
  return result.insertId;
};

export const toggleTask = async (id, is_completed) => {
  await pool.query('UPDATE tasks SET is_completed=? WHERE id=?', [is_completed, id]);
};

export const updateTask = async (id, { task_name, notes }) => {
  await pool.query(
    'UPDATE tasks SET task_name=?, notes=? WHERE id=?',
    [task_name, notes || null, id]
  );
};

export const deleteTask = async (id) => {
  await pool.query('DELETE FROM tasks WHERE id=?', [id]);
};
