import pool from '../config/db.js';
import { REQUEST_STATUS } from '../utils/constants.js';

export const createRequest = async (eventId, producerId) => {
  const [result] = await pool.query(
    'INSERT INTO producer_requests (event_id, producer_id, status_id) VALUES (?, ?, ?)',
    [eventId, producerId, REQUEST_STATUS.PENDING]
  );
  return result.insertId;
};

export const getRequestById = async (requestId) => {
  const [rows] = await pool.query(
    `SELECT pr.*, rs.status_name AS status
     FROM producer_requests pr
     JOIN request_statuses rs ON rs.id = pr.status_id
     WHERE pr.id = ?`,
    [requestId]
  );
  return rows[0] || null;
};

export const getRequestByEventAndProducer = async (eventId, producerId) => {
  const [rows] = await pool.query(
    'SELECT * FROM producer_requests WHERE event_id = ? AND producer_id = ? AND status_id = ?',
    [eventId, producerId, REQUEST_STATUS.PENDING]
  );
  return rows[0] || null;
};

export const getRequestsByProducer = async (producerId, { status, page = 1, limit = 10 } = {}) => {
  const offset = (page - 1) * limit;
  const params = [producerId];

  let statusClause = '';
  if (status) {
    const statusMap = { pending: REQUEST_STATUS.PENDING, approved: REQUEST_STATUS.APPROVED, rejected: REQUEST_STATUS.REJECTED };
    const statusId = statusMap[status];
    if (statusId) { statusClause = 'AND pr.status_id = ?'; params.push(statusId); }
  }
  params.push(Number(limit), Number(offset));

  const [rows] = await pool.query(
    `SELECT pr.id, pr.event_id, rs.status_name AS status, pr.created_at,
            e.event_name, e.event_date, e.location_name,
            u.full_name as owner_name
     FROM producer_requests pr
     JOIN request_statuses rs ON rs.id = pr.status_id
     JOIN events e ON e.id = pr.event_id
     JOIN users u ON u.id = e.user_id
     WHERE pr.producer_id = ? ${statusClause}
     ORDER BY pr.created_at DESC
     LIMIT ? OFFSET ?`,
    params
  );
  return rows;
};

export const getRequestByEvent = async (eventId) => {
  const [rows] = await pool.query(
    'SELECT * FROM producer_requests WHERE event_id = ? AND status_id = ?',
    [eventId, REQUEST_STATUS.PENDING]
  );
  return rows[0] || null;
};

export const cancelByEvent = async (eventId) => {
  await pool.query(
    'DELETE FROM producer_requests WHERE event_id = ? AND status_id = ?',
    [eventId, REQUEST_STATUS.PENDING]
  );
};

export const updateStatus = async (requestId, statusId) => {
  await pool.query('UPDATE producer_requests SET status_id = ? WHERE id = ?', [statusId, requestId]);
};

export const deleteRequest = async (requestId) => {
  await pool.query('DELETE FROM producer_requests WHERE id = ?', [requestId]);
};
