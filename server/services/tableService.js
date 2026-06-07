import pool from '../config/db.js';
import * as Event from '../models/event.js';
import { AppError } from '../utils/AppError.js';

export async function getTables(eventId, userId) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);

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
}

export async function addTable(eventId, userId, { table_number, capacity }) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);

  const [result] = await pool.query(
    'INSERT INTO tables (event_id, table_number, capacity) VALUES (?, ?, ?)',
    [eventId, table_number, capacity || 10]
  );
  return result.insertId;
}

export async function deleteTable(tableId, userId) {
  const [table] = await pool.query(
    'SELECT t.* FROM tables t JOIN events e ON t.event_id = e.id WHERE t.id = ? AND e.user_id = ?',
    [tableId, userId]
  );
  if (!table || table.length === 0) throw new AppError('שולחן לא נמצא', 404);

  await pool.query('UPDATE guests SET table_id=NULL WHERE table_id=?', [tableId]);
  await pool.query('DELETE FROM tables WHERE id=?', [tableId]);
}
