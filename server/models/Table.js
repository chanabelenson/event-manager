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

export const verifyTableOwnership = async (tableId, userId) => {
  const [rows] = await pool.query(
    `SELECT t.id FROM tables t
     JOIN events e ON e.id = t.event_id
     WHERE t.id = ? AND e.user_id = ?`,
    [tableId, userId]
  );
  return rows.length > 0;
};

export const verifyTablesOwnership = async (tableIds, userId) => {
  if (!tableIds.length) return true;
  const [rows] = await pool.query(
    `SELECT COUNT(*) as count FROM tables t
     JOIN events e ON e.id = t.event_id
     WHERE t.id IN (?) AND e.user_id = ?`,
    [tableIds, userId]
  );
  return rows[0].count === tableIds.length;
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
