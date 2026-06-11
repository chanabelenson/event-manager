import pool from '../config/db.js';

export const getUpdates = async (eventId) => {
  const [rows] = await pool.query(
    'SELECT * FROM producer_updates WHERE event_id = ? ORDER BY created_at ASC',
    [eventId]
  );
  return rows;
};

export const addUpdate = async (eventId, authorRole, content) => {
  const [result] = await pool.query(
    'INSERT INTO producer_updates (event_id, author_role, content) VALUES (?, ?, ?)',
    [eventId, authorRole, content]
  );
  return result.insertId;
};

export const markDone = async (updateId) => {
  await pool.query('UPDATE producer_updates SET status = "done" WHERE id = ?', [updateId]);
};
