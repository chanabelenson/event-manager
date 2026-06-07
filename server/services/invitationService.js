import pool from '../config/db.js';
import { AppError } from '../utils/AppError.js';

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

export async function getInvitation(token) {
  const [rows] = await pool.query(
    `SELECT g.*, e.event_date, e.rsvp_deadline
     FROM guests g
     JOIN events e ON g.event_id = e.id
     WHERE g.invitation_token = ?`,
    [token]
  );
  if (!rows[0]) return null;

  const guest = rows[0];
  const deadline = guest.rsvp_deadline
    ? new Date(guest.rsvp_deadline)
    : new Date(new Date(guest.event_date).getTime() - TWO_DAYS_MS);

  return {
    ...guest,
    deadline_date: deadline.toISOString().split('T')[0],
    deadline_passed: Date.now() > deadline.getTime(),
  };
}

export async function updateInvitationStatus(token, status, confirmed_count) {
  if (!['confirmed', 'declined'].includes(status))
    throw new AppError('סטטוס לא תקין', 400);

  const guest = await getInvitation(token);
  if (!guest) throw new AppError('הזמנה לא נמצאה', 404);
  if (guest.deadline_passed) throw new AppError('לא ניתן לשנות אישור הגעה לאחר המועד האחרון', 403);

  if (status === 'confirmed') {
    const count = Number(confirmed_count);
    if (!count || count < 1 || count > guest.guests_count)
      throw new AppError(`מספר מגיעים חייב להיות בין 1 ל-${guest.guests_count}`, 400);
    await pool.query(
      'UPDATE guests SET status=?, confirmed_count=? WHERE invitation_token=?',
      [status, count, token]
    );
  } else {
    await pool.query(
      'UPDATE guests SET status=?, confirmed_count=0 WHERE invitation_token=?',
      [status, token]
    );
  }
}
