// import pool from '../config/db.js';
// import * as Event from '../models/Event.js';
// import { AppError } from '../utils/AppError.js';

// const STATUS_IDS = { pending: 1, confirmed: 2, declined: 3 };

// export async function getGuests(eventId, userId) {
//   const event = await Event.findEventById(eventId, userId);
//   if (!event) throw new AppError('אירוע לא נמצא', 404);

//   const [guests] = await pool.query(
//     `SELECT g.*, t.table_number as assigned_table, gs.status_name as status, gc.category_name as category
//      FROM guests g
//      LEFT JOIN tables t ON t.id = g.table_id
//      LEFT JOIN guest_statuses gs ON gs.id = g.status_id
//      LEFT JOIN guest_categories gc ON gc.id = g.category_id
//      WHERE g.event_id = ? ORDER BY g.guest_name ASC`,
//     [eventId]
//   );
//   return guests;
// }

// export async function addGuest(eventId, userId, { guest_name, phone_number, guests_count, category_id }) {
//   const event = await Event.findEventById(eventId, userId);
//   if (!event) throw new AppError('אירוע לא נמצא', 404);
//   if (!guest_name) throw new AppError('שם חובה', 400);

//   const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
//   const [result] = await pool.query(
//     'INSERT INTO guests (event_id, guest_name, phone_number, guests_count, category_id, status_id, invitation_token) VALUES (?, ?, ?, ?, ?, 1, ?)',
//     [eventId, guest_name, phone_number || null, guests_count || 1, category_id || null, token]
//   );
//   return { id: result.insertId, invitation_token: token };
// }

// export async function updateGuestStatus(guestId, userId, status) {
//   const statusId = STATUS_IDS[status];
//   if (!statusId) throw new AppError('סטטוס לא תקין', 400);

//   const [guest] = await pool.query(
//     'SELECT g.* FROM guests g JOIN events e ON g.event_id = e.id WHERE g.id = ? AND e.user_id = ?',
//     [guestId, userId]
//   );
//   if (!guest.length) throw new AppError('אורח לא נמצא', 404);

//   await pool.query('UPDATE guests SET status_id=? WHERE id=?', [statusId, guestId]);
// }

// export async function updateGuestTable(guestId, userId, tableId) {
//   const [guest] = await pool.query(
//     'SELECT g.* FROM guests g JOIN events e ON g.event_id = e.id WHERE g.id = ? AND e.user_id = ?',
//     [guestId, userId]
//   );
//   if (!guest.length) throw new AppError('אורח לא נמצא', 404);
//   await pool.query('UPDATE guests SET table_id=? WHERE id=?', [tableId || null, guestId]);
// }

// export async function bulkUpdateTables(assignments, userId) {
//   if (!Array.isArray(assignments)) throw new AppError('נתונים שגויים', 400);
//   for (const { guestId, tableId } of assignments) {
//     const [guest] = await pool.query(
//       'SELECT g.* FROM guests g JOIN events e ON g.event_id = e.id WHERE g.id = ? AND e.user_id = ?',
//       [guestId, userId]
//     );
//     if (!guest.length) continue;
//     await pool.query('UPDATE guests SET table_id=? WHERE id=?', [tableId, guestId]);
//   }
// }

// export async function deleteGuest(guestId, userId) {
//   const [guest] = await pool.query(
//     'SELECT g.* FROM guests g JOIN events e ON g.event_id = e.id WHERE g.id = ? AND e.user_id = ?',
//     [guestId, userId]
//   );
//   if (!guest.length) throw new AppError('אורח לא נמצא', 404);
//   await pool.query('DELETE FROM guests WHERE id=?', [guestId]);
// }


import pool from '../config/db.js';
import * as Event from '../models/Event.js';
import { AppError } from '../utils/AppError.js';
// ---- שורת הייבוא החדשה ----
import { sendInvitationEmail } from '../utils/email.js';

const STATUS_IDS = { pending: 1, confirmed: 2, declined: 3 };

export async function getGuests(eventId, userId) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);

  const [guests] = await pool.query(
    `SELECT g.*, t.table_number as assigned_table, gs.status_name as status, gc.category_name as category
     FROM guests g
     LEFT JOIN tables t ON t.id = g.table_id
     LEFT JOIN guest_statuses gs ON gs.id = g.status_id
     LEFT JOIN guest_categories gc ON gc.id = g.category_id
     WHERE g.event_id = ? ORDER BY g.guest_name ASC`,
    [eventId]
  );
  return guests;
}

// ---- עדכון פונקציית addGuest: הוספת email לקליטה ----
export async function addGuest(eventId, userId, { guest_name, email, phone_number, guests_count, category_id }) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);
  if (!guest_name) throw new AppError('שם חובה', 400);

  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  
  // 1. שמירת האורח בבסיס הנתונים (הוספתי גם את עמודת ה-email בהנחה שהיא קיימת בטבלה שלך ב-DB)
  const [result] = await pool.query(
    'INSERT INTO guests (event_id, guest_name, email, phone_number, guests_count, category_id, status_id, invitation_token) VALUES (?, ?, ?, ?, ?, ?, 1, ?)',
    [eventId, guest_name, email || null, phone_number || null, guests_count || 1, category_id || null, token]
  );

  // 2. יצירת הקישור הייחודי של האורח (נשתמש בפורמט של הדומיין של ה-Client שלך עם הטוקן)
  const clientDomain = 'http://localhost:5173'; // או הדומיין האמיתי כשהאתר באוויר
  const invitationLink = `${clientDomain}/invite/${token}`;

  // 3. במידה והמשתמש הזין אימייל, נשלח את המייל האוטומטי ברקע (בלי לחכות לו עם await כדי לא לעכב את התגובה של השרת למשתמש)
  if (email) {
    sendInvitationEmail({
      guestEmail: email,
      guestName: guest_name,
      invitationLink: invitationLink
    });
  }

  return { id: result.insertId, invitation_token: token };
}

export async function updateGuestStatus(guestId, userId, status) {
  const statusId = STATUS_IDS[status];
  if (!statusId) throw new AppError('סטטוס לא תקין', 400);

  const [guest] = await pool.query(
    'SELECT g.* FROM guests g JOIN events e ON g.event_id = e.id WHERE g.id = ? AND e.user_id = ?',
    [guestId, userId]
  );
  if (!guest.length) throw new AppError('אורח לא נמצא', 404);

  await pool.query('UPDATE guests SET status_id=? WHERE id=?', [statusId, guestId]);
}

export async function updateGuestTable(guestId, userId, tableId) {
  const [guest] = await pool.query(
    'SELECT g.* FROM guests g JOIN events e ON g.event_id = e.id WHERE g.id = ? AND e.user_id = ?',
    [guestId, userId]
  );
  if (!guest.length) throw new AppError('אורח לא נמצא', 404);
  await pool.query('UPDATE guests SET table_id=? WHERE id=?', [tableId || null, guestId]);
}

export async function bulkUpdateTables(assignments, userId) {
  if (!Array.isArray(assignments)) throw new AppError('נתונים שגויים', 400);
  for (const { guestId, tableId } of assignments) {
    const [guest] = await pool.query(
      'SELECT g.* FROM guests g JOIN events e ON g.event_id = e.id WHERE g.id = ? AND e.user_id = ?',
      [guestId, userId]
    );
    if (!guest.length) continue;
    await pool.query('UPDATE guests SET table_id=? WHERE id=?', [tableId, guestId]);
  }
}

export async function deleteGuest(guestId, userId) {
  const [guest] = await pool.query(
    'SELECT g.* FROM guests g JOIN events e ON g.event_id = e.id WHERE g.id = ? AND e.user_id = ?',
    [guestId, userId]
  );
  if (!guest.length) throw new AppError('אורח לא נמצא', 404);
  await pool.query('DELETE FROM guests WHERE id=?', [guestId]);
}