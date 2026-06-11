import pool from '../config/db.js';
import { ROLES } from '../utils/constants.js';

export const getUpdates = async (eventId) => {
  const [rows] = await pool.query(
    `SELECT pu.id, pu.event_id, pu.content, pu.status, pu.created_at,
            ur.role_name AS author_role
     FROM producer_updates pu
     JOIN user_roles ur ON ur.id = pu.author_role_id
     WHERE pu.event_id = ?
     ORDER BY pu.created_at ASC`,
    [eventId]
  );
  return rows;
};

export const addUpdate = async (eventId, authorRole, content) => {
  const roleId = authorRole === 'producer' ? ROLES.PRODUCER : ROLES.OWNER;
  const [result] = await pool.query(
    'INSERT INTO producer_updates (event_id, author_role_id, content) VALUES (?, ?, ?)',
    [eventId, roleId, content]
  );
  return result.insertId;
};

export const markDone = async (updateId) => {
  await pool.query('UPDATE producer_updates SET status = "done" WHERE id = ?', [updateId]);
};
