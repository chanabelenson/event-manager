import pool from '../config/db.js';
import * as Event from '../models/Event.js';

export async function getGuests(eventId, userId) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) {
    const error = new Error('אירוע לא נמצא');
    error.status = 404;
    throw error;
  }

  const [guests] = await pool.query(
    `SELECT g.*, t.table_number as assigned_table 
     FROM guests g
     LEFT JOIN tables t ON t.id = g.table_id
     WHERE g.event_id = ? ORDER BY g.guest_name ASC`,
    [eventId]
  );
  return guests;
}

export async function addGuest(eventId, userId, { guest_name, phone_number, guests_count, category }) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) {
    const error = new Error('אירוע לא נמצא');
    error.status = 404;
    throw error;
  }

  if (!guest_name) {
    const error = new Error('שם חובה');
    error.status = 400;
    throw error;
  }

  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const [result] = await pool.query(
    'INSERT INTO guests (event_id, guest_name, phone_number, guests_count, category, invitation_token) VALUES (?, ?, ?, ?, ?, ?)',
    [eventId, guest_name, phone_number || null, guests_count || 1, category || null, token]
  );

  return { id: result.insertId, invitation_token: token };
}

export async function updateGuestStatus(guestId, userId, status) {
  const [guest] = await pool.query(
    'SELECT g.* FROM guests g JOIN events e ON g.event_id = e.id WHERE g.id = ? AND e.user_id = ?',
    [guestId, userId]
  );

  if (!guest || guest.length === 0) {
    const error = new Error('אורח לא נמצא');
    error.status = 404;
    throw error;
  }

  await pool.query('UPDATE guests SET status=? WHERE id=?', [status, guestId]);
}

export async function updateGuestTable(guestId, userId, tableId) {
  const [guest] = await pool.query(
    'SELECT g.* FROM guests g JOIN events e ON g.event_id = e.id WHERE g.id = ? AND e.user_id = ?',
    [guestId, userId]
  );

  if (!guest || guest.length === 0) {
    const error = new Error('אורח לא נמצא');
    error.status = 404;
    throw error;
  }

  await pool.query('UPDATE guests SET table_id=? WHERE id=?', [tableId || null, guestId]);
}

export async function bulkUpdateTables(assignments, userId) {
  // בדיקה קטנה שהעבודה חוקית
  if (!Array.isArray(assignments)) {
    const error = new Error('נתונים שגויים');
    error.status = 400;
    throw error;
  }

  for (const { guestId, tableId } of assignments) {
    const [guest] = await pool.query(
      'SELECT g.* FROM guests g JOIN events e ON g.event_id = e.id WHERE g.id = ? AND e.user_id = ?',
      [guestId, userId]
    );

    if (!guest || guest.length === 0) continue; // דלג על אורחים לא רלוונטיים

    await pool.query('UPDATE guests SET table_id=? WHERE id=?', [tableId, guestId]);
  }
}

export async function deleteGuest(guestId, userId) {
  const [guest] = await pool.query(
    'SELECT g.* FROM guests g JOIN events e ON g.event_id = e.id WHERE g.id = ? AND e.user_id = ?',
    [guestId, userId]
  );

  if (!guest || guest.length === 0) {
    const error = new Error('אורח לא נמצא');
    error.status = 404;
    throw error;
  }

  await pool.query('DELETE FROM guests WHERE id=?', [guestId]);
}
