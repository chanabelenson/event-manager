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

export const addTask = async (eventId, { task_name, task_date, estimated_cost, actual_cost, notes }) => {
  const [result] = await pool.query(
    'INSERT INTO tasks (event_id, task_name, task_date, estimated_cost, actual_cost, notes) VALUES (?, ?, ?, ?, ?, ?)',
    [eventId, task_name, task_date || null, estimated_cost || 0, actual_cost || 0, notes || null]
  );
  return result.insertId;
};

export const updateTask = async (id, fields) => {
  const allowed = ['task_name', 'task_date', 'notes', 'is_completed', 'estimated_cost', 'actual_cost'];
  const updates = Object.fromEntries(Object.entries(fields).filter(([k]) => allowed.includes(k)));
  if (!Object.keys(updates).length) return;
  const cols = Object.keys(updates).map(k => `${k}=?`).join(', ');
  await pool.query(`UPDATE tasks SET ${cols} WHERE id=?`, [...Object.values(updates), id]);
};

export const deleteTask = async (id) => {
  await pool.query('DELETE FROM tasks WHERE id=?', [id]);
};
