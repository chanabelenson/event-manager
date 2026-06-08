import pool from '../config/db.js';

export const getGuests = async (eventId) => {
  const [rows] = await pool.query(
    `SELECT g.*, t.table_number as assigned_table, gs.status_name as status, gc.category_name as category
     FROM guests g
     LEFT JOIN tables t ON t.id = g.table_id
     LEFT JOIN guest_statuses gs ON gs.id = g.status_id
     LEFT JOIN guest_categories gc ON gc.id = g.category_id
     WHERE g.event_id = ? ORDER BY g.guest_name ASC`,
    [eventId]
  );
  return rows;
};

export const verifyGuestOwnership = async (guestId, userId) => {
  const [rows] = await pool.query(
    `SELECT g.id FROM guests g
     JOIN events e ON e.id = g.event_id
     WHERE g.id = ? AND e.user_id = ?`,
    [guestId, userId]
  );
  return rows.length > 0;
};

export const verifyGuestsOwnership = async (guestIds, userId) => {
  if (!guestIds.length) return true;
  const [rows] = await pool.query(
    `SELECT COUNT(*) as count FROM guests g
     JOIN events e ON e.id = g.event_id
     WHERE g.id IN (?) AND e.user_id = ?`,
    [guestIds, userId]
  );
  return rows[0].count === guestIds.length;
};

export const addGuest = async (eventId, { guest_name, guests_count, category_id }) => {
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const [result] = await pool.query(
    'INSERT INTO guests (event_id, guest_name, guests_count, category_id, status_id, invitation_token) VALUES (?, ?, ?, ?, 1, ?)',
    [eventId, guest_name, guests_count || 1, category_id || null, token]
  );
  return { insertId: result.insertId, invitation_token: token };
};

export const updateGuestStatus = async (id, statusId) => {
  await pool.query('UPDATE guests SET status_id=? WHERE id=?', [statusId, id]);
};

export const updateGuestTable = async (id, tableId) => {
  await pool.query('UPDATE guests SET table_id=? WHERE id=?', [tableId || null, id]);
};

export const bulkUpdateGuestTables = async (assignments) => {
  await Promise.all(
    assignments.map(({ guestId, tableId }) =>
      pool.query('UPDATE guests SET table_id=? WHERE id=?', [tableId, guestId])
    )
  );
};

export const deleteGuest = async (id) => {
  await pool.query('DELETE FROM guests WHERE id=?', [id]);
};

export const getGuestByToken = async (token) => {
  const [rows] = await pool.query(
    `SELECT g.*, gs.status_name as status, e.event_name, e.event_date, e.location_name, e.location_address
     FROM guests g
     JOIN events e ON e.id = g.event_id
     JOIN guest_statuses gs ON gs.id = g.status_id
     WHERE g.invitation_token = ?`,
    [token]
  );
  return rows[0] || null;
};

export const updateGuestStatusByToken = async (token, statusId) => {
  await pool.query('UPDATE guests SET status_id=? WHERE invitation_token=?', [statusId, token]);
};
