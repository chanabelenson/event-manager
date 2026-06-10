import pool from '../config/db.js';

export const getCategories = async (eventId) => {
  const [rows] = await pool.query(
    'SELECT * FROM guest_categories WHERE event_id = ? ORDER BY category_name ASC',
    [eventId]
  );
  return rows;
};

export const addCategory = async (eventId, category_name) => {
  const [result] = await pool.query(
    'INSERT INTO guest_categories (event_id, category_name) VALUES (?, ?)',
    [eventId, category_name]
  );
  return result.insertId;
};

export const deleteCategory = async (categoryId, eventId) => {
  await pool.query('DELETE FROM guest_categories WHERE id = ? AND event_id = ?', [categoryId, eventId]);
};
