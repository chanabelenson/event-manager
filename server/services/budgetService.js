import pool from '../config/db.js';
import * as Event from '../models/Event.js';
import { AppError } from '../utils/AppError.js';

export async function getBudgetData(eventId, userId) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);

  const [items] = await pool.query(
    'SELECT * FROM budget_items WHERE event_id = ? ORDER BY id ASC',
    [eventId]
  );

  let payments = [];
  if (items.length) {
    const placeholders = items.map(() => '?').join(',');
    const [rows] = await pool.query(
      `SELECT * FROM budget_payments WHERE budget_item_id IN (${placeholders}) ORDER BY paid_at ASC`,
      items.map(i => i.id)
    );
    payments = rows;
  }

  const paymentsByItem = {};
  payments.forEach(p => {
    if (!paymentsByItem[p.budget_item_id]) paymentsByItem[p.budget_item_id] = [];
    paymentsByItem[p.budget_item_id].push(p);
  });

  return {
    total_budget: event.total_budget,
    items: items.map(i => ({ ...i, payments: paymentsByItem[i.id] || [] })),
  };
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
    'SELECT bi.id FROM budget_items bi JOIN events e ON bi.event_id = e.id WHERE bi.id = ? AND e.user_id = ?',
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
    'SELECT bi.id FROM budget_items bi JOIN events e ON bi.event_id = e.id WHERE bi.id = ? AND e.user_id = ?',
    [itemId, userId]
  );
  if (!rows.length) throw new AppError('פריט לא נמצא', 404);
  await pool.query('DELETE FROM budget_items WHERE id=?', [itemId]);
}

export async function updateBudgetCeiling(eventId, userId, total_budget) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);
  await Event.updateTotalBudget(eventId, userId, total_budget);
}

export async function addPayment(itemId, userId, { amount, paid_at, note }) {
  const [rows] = await pool.query(
    'SELECT bi.id FROM budget_items bi JOIN events e ON bi.event_id = e.id WHERE bi.id = ? AND e.user_id = ?',
    [itemId, userId]
  );
  if (!rows.length) throw new AppError('פריט לא נמצא', 404);
  if (!amount || Number(amount) <= 0) throw new AppError('סכום חובה', 400);
  if (!paid_at) throw new AppError('תאריך חובה', 400);

  const [result] = await pool.query(
    'INSERT INTO budget_payments (budget_item_id, amount, paid_at, note) VALUES (?, ?, ?, ?)',
    [itemId, amount, paid_at, note || null]
  );
  return { id: result.insertId };
}

export async function deletePayment(paymentId, userId) {
  const [rows] = await pool.query(
    `SELECT bp.id FROM budget_payments bp
     JOIN budget_items bi ON bp.budget_item_id = bi.id
     JOIN events e ON bi.event_id = e.id
     WHERE bp.id = ? AND e.user_id = ?`,
    [paymentId, userId]
  );
  if (!rows.length) throw new AppError('תשלום לא נמצא', 404);
  await pool.query('DELETE FROM budget_payments WHERE id=?', [paymentId]);
}
