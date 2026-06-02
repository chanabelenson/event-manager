import pool from '../config/db.js';

export const getTables = async (eventId) => {
  const [rows] = await pool.query(
    `SELECT t.*, COUNT(g.id) as assigned_guests
     FROM tables t
     LEFT JOIN guests g ON g.table_id = t.id
     WHERE t.event_id = ?
     GROUP BY t.id
     ORDER BY t.table_number ASC`,
    [eventId]
  );
  return rows;
};

export const addTable = async (eventId, { table_number, capacity }) => {
  const [result] = await pool.query(
    'INSERT INTO tables (event_id, table_number, capacity) VALUES (?, ?, ?)',
    [eventId, table_number, capacity || 10]
  );
  return result.insertId;
};

export const deleteTable = async (id) => {
  await pool.query('UPDATE guests SET table_id=NULL WHERE table_id=?', [id]);
  await pool.query('DELETE FROM tables WHERE id=?', [id]);
};
