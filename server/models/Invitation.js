import pool from '../config/db.js';

export const getByToken = async (token) => {
  const [rows] = await pool.query(
    `SELECT g.*, gs.status_name as status, e.event_name, e.event_date, e.location_name, e.location_address, e.rsvp_deadline
     FROM guests g
     JOIN events e ON g.event_id = e.id
     JOIN guest_statuses gs ON gs.id = g.status_id
     WHERE g.invitation_token = ?`,
    [token]
  );
  return rows[0] || null;
};

export const updateStatusByToken = async (token, statusId, confirmed_count) => {
  if (confirmed_count !== undefined) {
    await pool.query(
      'UPDATE guests SET status_id=?, confirmed_count=? WHERE invitation_token=?',
      [statusId, confirmed_count, token]
    );
  } else {
    await pool.query(
      'UPDATE guests SET status_id=?, confirmed_count=0 WHERE invitation_token=?',
      [statusId, token]
    );
  }
};
