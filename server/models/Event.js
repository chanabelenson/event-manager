import pool from '../config/db.js';

export async function findEventById(eventId, userId) {
  const [rows] = await pool.query(
    'SELECT * FROM events WHERE id = ? AND user_id = ?',
    [eventId, userId]
  );
  return rows[0] || null;
}

export async function getUserEvents(userId) {
  const [rows] = await pool.query(
    'SELECT * FROM events WHERE user_id = ? ORDER BY event_date ASC',
    [userId]
  );
  return rows;
}

export async function createEvent(userId, { event_name, event_date, location_name, location_address }) {
  const [result] = await pool.query(
    'INSERT INTO events (user_id, event_name, event_date, location_name, location_address) VALUES (?, ?, ?, ?, ?)',
    [userId, event_name, event_date, location_name, location_address || null]
  );
  return result.insertId;
}

export async function updateRsvpDeadline(eventId, userId, rsvp_deadline) {
  const [result] = await pool.query(
    'UPDATE events SET rsvp_deadline=? WHERE id=? AND user_id=?',
    [rsvp_deadline || null, eventId, userId]
  );
  return result.affectedRows > 0;
}

export async function deleteEventById(eventId, userId) {
  const [result] = await pool.query(
    'DELETE FROM events WHERE id = ? AND user_id = ?',
    [eventId, userId]
  );
  return result.affectedRows > 0;
}
