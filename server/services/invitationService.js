import pool from '../config/db.js';
import { AppError } from '../utils/AppError.js';

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
  if (!['confirmed', 'declined'].includes(status))
    throw new AppError('סטטוס לא תקין', 400);

  const guest = await getInvitation(token);
  if (!guest) throw new AppError('הזמנה לא נמצאה', 404);

  if (new Date(guest.event_date).getTime() - Date.now() < TWO_DAYS_MS)
    throw new AppError('לא ניתן לשנות אישור הגעה פחות מיומיים לפני האירוע', 403);

  await pool.query('UPDATE guests SET status=? WHERE invitation_token=?', [status, token]);
}
