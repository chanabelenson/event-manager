import pool from '../config/db.js';

export const getTasks = async (eventId) => {
  const [rows] = await pool.query(
    'SELECT * FROM tasks WHERE event_id = ? ORDER BY task_date ASC, id ASC',
    [eventId]
  );
  return rows;
};

export const addTask = async (eventId, { task_name, task_date, estimated_cost, actual_cost, category, notes }) => {
  const [result] = await pool.query(
    'INSERT INTO tasks (event_id, task_name, task_date, estimated_cost, actual_cost, category, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [eventId, task_name, task_date || null, estimated_cost || 0, actual_cost || 0, category || null, notes || null]
  );
  return result.insertId;
};

export const toggleTask = async (id, is_completed) => {
  await pool.query('UPDATE tasks SET is_completed=? WHERE id=?', [is_completed, id]);
};

export const updateTask = async (id, { task_name, estimated_cost, actual_cost, category, notes }) => {
  await pool.query(
    'UPDATE tasks SET task_name=?, estimated_cost=?, actual_cost=?, category=?, notes=? WHERE id=?',
    [task_name, estimated_cost || 0, actual_cost || 0, category || null, notes || null, id]
  );
};

export const deleteTask = async (id) => {
  await pool.query('DELETE FROM tasks WHERE id=?', [id]);
};
