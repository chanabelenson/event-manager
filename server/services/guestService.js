import pool from '../config/db.js';
import * as Guest from '../models/Guest.js';
import * as Event from '../models/Event.js';
import { AppError } from '../utils/AppError.js';
import { sendInvitationEmail } from '../utils/email.js';

const STATUS_IDS = { pending: 1, confirmed: 2, declined: 3 };

export async function getGuests(eventId, userId) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);
  return await Guest.getGuests(eventId);
}

export async function addGuest(eventId, userId, { guest_name, email, guests_count, category_id }) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);
  if (!guest_name) throw new AppError('שם חובה', 400);

  const { insertId, invitation_token } = await Guest.addGuest(eventId, { guest_name, email, guests_count, category_id });

  if (email) {
    const clientDomain = process.env.CLIENT_URL || 'http://localhost:5173';
    sendInvitationEmail({
      guestEmail: email,
      guestName: guest_name,
      eventName: event.event_name,
      invitationLink: `${clientDomain}/invite/${invitation_token}`,
    });
  }

  return { id: insertId, invitation_token };
}

export async function updateGuest(guestId, userId, fields) {
  const owned = await Guest.verifyGuestOwnership(guestId, userId);
  if (!owned) throw new AppError('אורח לא נמצא', 404);
  await Guest.updateGuest(guestId, fields);
}

export async function autoArrangeBulk(eventId, userId, assignments) {
  if (!Array.isArray(assignments)) throw new AppError('נתונים שגויים', 400);
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);
  await Guest.bulkUpdateGuestTables(eventId, assignments);
}

export async function getTableAssignments(eventId, userId) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);
  return await Guest.getTableAssignments(eventId);
}

export async function deleteGuest(guestId, userId) {
  const owned = await Guest.verifyGuestOwnership(guestId, userId);
  if (!owned) throw new AppError('אורח לא נמצא', 404);
  await Guest.deleteGuest(guestId);
}
