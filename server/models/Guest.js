import pool from '../config/db.js';

export const getGuests = async (eventId) => {
  const [rows] = await pool.query(
    `SELECT g.*, t.table_number as assigned_table 
     FROM guests g
     LEFT JOIN tables t ON t.id = g.table_id
     WHERE g.event_id = ? ORDER BY g.guest_name ASC`,
    [eventId]
  );
  return rows;
};

export const addGuest = async (eventId, { guest_name, phone_number, guests_count, category }) => {
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const [result] = await pool.query(
    'INSERT INTO guests (event_id, guest_name, phone_number, guests_count, category, invitation_token) VALUES (?, ?, ?, ?, ?, ?)',
    [eventId, guest_name, phone_number || null, guests_count || 1, category || null, token]
  );
  return { insertId: result.insertId, invitation_token: token };
};

export const updateGuestStatus = async (id, status) => {
  await pool.query('UPDATE guests SET status=? WHERE id=?', [status, id]);
};

export const updateGuestTable = async (id, tableId) => {
  await pool.query('UPDATE guests SET table_id=? WHERE id=?', [tableId || null, id]);
};

export const bulkUpdateGuestTables = async (assignments) => {
  // assignments = [{ guestId, tableId }, ...]
  await Promise.all(
    assignments.map(({ guestId, tableId }) =>
      pool.query('UPDATE guests SET table_id=? WHERE id=?', [tableId, guestId])
    )
  );
};

export const deleteGuest = async (id) => {
  await pool.query('DELETE FROM guests WHERE id=?', [id]);
};
