import pool from '../config/db.js';

export const getEventsByUser = async (userId) => {
  const [rows] = await pool.query(
    'SELECT * FROM events WHERE user_id = ? ORDER BY event_date ASC',
    [userId]
  );
  return rows;
};

export const getEventById = async (eventId, userId) => {
  const [rows] = await pool.query(
    'SELECT * FROM events WHERE id = ? AND user_id = ?',
    [eventId, userId]
  );
  return rows[0] || null;
};

export const createEvent = async ({ userId, event_name, event_date, location_name, location_address }) => {
  const [result] = await pool.query(
    'INSERT INTO events (user_id, event_name, event_date, location_name, location_address) VALUES (?, ?, ?, ?, ?)',
    [userId, event_name, event_date, location_name, location_address || null]
  );
  return {
    id: result.insertId,
    user_id: userId,
    event_name,
    event_date,
    location_name,
    location_address: location_address || null,
  };
};

export const deleteEvent = async (eventId) => {
  await pool.query('DELETE FROM events WHERE id = ?', [eventId]);
};

export const isEventOwnedByUser = async (eventId, userId) => {
  const [rows] = await pool.query(
    'SELECT id FROM events WHERE id = ? AND user_id = ?',
    [eventId, userId]
  );
  return rows.length > 0;
};
