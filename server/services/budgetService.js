import pool from '../config/db.js';
import * as Event from '../models/Event.js';
import { AppError } from '../utils/AppError.js';

export async function getBudgetItems(eventId, userId) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);

  const [rows] = await pool.query(
    'SELECT * FROM budget_items WHERE event_id = ? ORDER BY id ASC',
    [eventId]
  );
  return rows;
}

export async function addBudgetItem(eventId, userId, { item_name, category, estimated_cost, actual_cost, notes }) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);
  if (!item_name) throw new AppError('שם פריט חובה', 400);

  const [result] = await pool.query(
    'INSERT INTO budget_items (event_id, item_name, category, estimated_cost, actual_cost, notes) VALUES (?, ?, ?, ?, ?, ?)',
    [eventId, item_name, category || null, estimated_cost || 0, actual_cost || 0, notes || null]
  );
  return { id: result.insertId };
}

export async function updateBudgetItem(itemId, userId, { item_name, category, estimated_cost, actual_cost, notes }) {
  const [rows] = await pool.query(
    'SELECT bi.* FROM budget_items bi JOIN events e ON bi.event_id = e.id WHERE bi.id = ? AND e.user_id = ?',
    [itemId, userId]
  );
  if (!rows.length) throw new AppError('פריט לא נמצא', 404);

  await pool.query(
    'UPDATE budget_items SET item_name=?, category=?, estimated_cost=?, actual_cost=?, notes=? WHERE id=?',
    [item_name, category || null, estimated_cost || 0, actual_cost || 0, notes || null, itemId]
  );
}

export async function deleteBudgetItem(itemId, userId) {
  const [rows] = await pool.query(
    'SELECT bi.* FROM budget_items bi JOIN events e ON bi.event_id = e.id WHERE bi.id = ? AND e.user_id = ?',
    [itemId, userId]
  );
  if (!rows.length) throw new AppError('פריט לא נמצא', 404);

  await pool.query('DELETE FROM budget_items WHERE id=?', [itemId]);
}
