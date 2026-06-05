import pool from '../config/db.js';

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

export async function getInvitation(token) {
  const [rows] = await pool.query(
    `SELECT g.*, e.event_date 
     FROM guests g 
     JOIN events e ON g.event_id = e.id 
     WHERE g.invitation_token = ?`,
    [token]
  );

  return rows[0] || null;
}

export async function updateInvitationStatus(token, status) {
  if (!['confirmed', 'declined'].includes(status)) {
    const error = new Error('סטטוס לא תקין');
    error.status = 400;
    throw error;
  }

  const guest = await getInvitation(token);
  if (!guest) {
    const error = new Error('הזמנה לא נמצאה');
    error.status = 404;
    throw error;
  }

  if (isDeadlinePassed(guest.event_date)) {
    const error = new Error('לא ניתן לשנות אישור הגעה פחות מיומיים לפני האירוע');
    error.status = 403;
    throw error;
  }

  await pool.query('UPDATE guests SET status=? WHERE invitation_token=?', [status, token]);
}

function isDeadlinePassed(eventDate) {
  return new Date(eventDate).getTime() - Date.now() < TWO_DAYS_MS;
}
