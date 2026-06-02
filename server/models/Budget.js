import pool from '../config/db.js';

export const getBudgetItems = async (eventId) => {
  const [rows] = await pool.query('SELECT * FROM budget_items WHERE event_id = ? ORDER BY created_at ASC', [eventId]);
  return rows;
};

export const addBudgetItem = async (eventId, { category, description, estimated, actual }) => {
  const [result] = await pool.query(
    'INSERT INTO budget_items (event_id, category, description, estimated, actual) VALUES (?, ?, ?, ?, ?)',
    [eventId, category, description, estimated || 0, actual || 0]
  );
  return result.insertId;
};

export const updateBudgetItem = async (id, { category, description, estimated, actual }) => {
  await pool.query(
    'UPDATE budget_items SET category=?, description=?, estimated=?, actual=? WHERE id=?',
    [category, description, estimated, actual, id]
  );
};

export const deleteBudgetItem = async (id) => {
  await pool.query('DELETE FROM budget_items WHERE id=?', [id]);
};
