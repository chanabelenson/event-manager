import pool from '../config/db.js';

export const getGifts = async (eventId) => {
  const [rows] = await pool.query(
    `SELECT g.*, gu.guest_name as claimed_by_name
     FROM gifts g
     LEFT JOIN guests gu ON gu.id = g.claimed_by
     WHERE g.event_id = ?
     ORDER BY g.id ASC`,
    [eventId]
  );
  return rows;
};

export const addGift = async (eventId, { name, description, link }) => {
  const [result] = await pool.query(
    'INSERT INTO gifts (event_id, name, description, link) VALUES (?, ?, ?, ?)',
    [eventId, name, description || null, link || null]
  );
  return result.insertId;
};

export const deleteGift = async (id) => {
  await pool.query('DELETE FROM gifts WHERE id = ?', [id]);
};

export const isClaimed = async (id) => {
  const [rows] = await pool.query('SELECT claimed_by FROM gifts WHERE id = ?', [id]);
  return rows[0]?.claimed_by !== null;
};

export const getGiftsForGuest = async (eventId, guestId) => {
  const [rows] = await pool.query(
    `SELECT id, name, description, link,
            claimed_by IS NOT NULL as is_claimed,
            claimed_by = ? as claimed_by_me
     FROM gifts
     WHERE event_id = ?
     ORDER BY id ASC`,
    [guestId, eventId]
  );
  return rows;
};

export const claimGift = async (giftId, guestId) => {
  const [result] = await pool.query(
    'UPDATE gifts SET claimed_by = ? WHERE id = ? AND claimed_by IS NULL',
    [guestId, giftId]
  );
  return result.affectedRows > 0;
};

export const unclaimGift = async (giftId, guestId) => {
  await pool.query(
    'UPDATE gifts SET claimed_by = NULL WHERE id = ? AND claimed_by = ?',
    [giftId, guestId]
  );
};
