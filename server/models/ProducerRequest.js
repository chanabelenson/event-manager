import pool from '../config/db.js';

export const createRequest = async (eventId, producerId) => {
  const [result] = await pool.query(
    'INSERT INTO producer_requests (event_id, producer_id) VALUES (?, ?)',
    [eventId, producerId]
  );
  return result.insertId;
};

export const getRequestById = async (requestId) => {
  const [rows] = await pool.query('SELECT * FROM producer_requests WHERE id = ?', [requestId]);
  return rows[0] || null;
};

export const getRequestByEventAndProducer = async (eventId, producerId) => {
  const [rows] = await pool.query(
    'SELECT * FROM producer_requests WHERE event_id = ? AND producer_id = ?',
    [eventId, producerId]
  );
  return rows[0] || null;
};

export const getPendingRequestsByProducer = async (producerId) => {
  const [rows] = await pool.query(
    `SELECT pr.id, pr.event_id, pr.created_at,
            e.event_name, e.event_date, e.location_name,
            u.full_name as owner_name
     FROM producer_requests pr
     JOIN events e ON e.id = pr.event_id
     JOIN users u ON u.id = e.user_id
     WHERE pr.producer_id = ? AND pr.status = 'pending'
     ORDER BY pr.created_at DESC`,
    [producerId]
  );
  return rows;
};

export const getRequestByEvent = async (eventId) => {
  const [rows] = await pool.query(
    "SELECT * FROM producer_requests WHERE event_id = ? AND status = 'pending'",
    [eventId]
  );
  return rows[0] || null;
};

export const cancelByEvent = async (eventId) => {
  await pool.query(
    "DELETE FROM producer_requests WHERE event_id = ? AND status = 'pending'",
    [eventId]
  );
};

export const updateStatus = async (requestId, status) => {
  await pool.query('UPDATE producer_requests SET status = ? WHERE id = ?', [status, requestId]);
};
