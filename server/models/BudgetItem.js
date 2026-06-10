import pool from '../config/db.js';

export const getBudgetItems = async (eventId) => {
  const [rows] = await pool.query(
    'SELECT * FROM budget_items WHERE event_id = ? ORDER BY id ASC',
    [eventId]
  );
  return rows;
};

export const verifyOwnership = async (itemId, userId) => {
  const [rows] = await pool.query(
    'SELECT bi.id FROM budget_items bi JOIN events e ON bi.event_id = e.id WHERE bi.id = ? AND e.user_id = ?',
    [itemId, userId]
  );
  return rows.length > 0;
};

export const addBudgetItem = async (eventId, { item_name, category, cost, notes }) => {
  const [result] = await pool.query(
    'INSERT INTO budget_items (event_id, item_name, category, cost, notes) VALUES (?, ?, ?, ?, ?)',
    [eventId, item_name, category || null, cost || 0, notes || null]
  );
  return result.insertId;
};

export const updateBudgetItem = async (itemId, { item_name, category, cost, notes }) => {
  await pool.query(
    'UPDATE budget_items SET item_name=?, category=?, cost=?, notes=? WHERE id=?',
    [item_name, category || null, cost || 0, notes || null, itemId]
  );
};

export const deleteBudgetItem = async (itemId) => {
  await pool.query('DELETE FROM budget_items WHERE id=?', [itemId]);
};

export const getPaymentsByItems = async (itemIds) => {
  if (!itemIds.length) return [];
  const placeholders = itemIds.map(() => '?').join(',');
  const [rows] = await pool.query(
    `SELECT * FROM budget_payments WHERE budget_item_id IN (${placeholders}) ORDER BY paid_at ASC`,
    itemIds
  );
  return rows;
};

export const verifyPaymentOwnership = async (paymentId, userId) => {
  const [rows] = await pool.query(
    `SELECT bp.id FROM budget_payments bp
     JOIN budget_items bi ON bp.budget_item_id = bi.id
     JOIN events e ON bi.event_id = e.id
     WHERE bp.id = ? AND e.user_id = ?`,
    [paymentId, userId]
  );
  return rows.length > 0;
};

export const addPayment = async (itemId, { amount, paid_at, note }) => {
  const [result] = await pool.query(
    'INSERT INTO budget_payments (budget_item_id, amount, paid_at, note) VALUES (?, ?, ?, ?)',
    [itemId, amount, paid_at, note || null]
  );
  return result.insertId;
};

export const deletePayment = async (paymentId) => {
  await pool.query('DELETE FROM budget_payments WHERE id=?', [paymentId]);
};
