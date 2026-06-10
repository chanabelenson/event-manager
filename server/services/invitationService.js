import * as Invitation from '../models/Invitation.js';
import { AppError } from '../utils/AppError.js';

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
const STATUS_IDS = { confirmed: 2, declined: 3 };

export async function getInvitation(token) {
  const guest = await Invitation.getByToken(token);
  if (!guest) return null;

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
  if (!STATUS_IDS[status]) throw new AppError('סטטוס לא תקין', 400);

  const guest = await getInvitation(token);
  if (!guest) throw new AppError('הזמנה לא נמצאה', 404);
  if (guest.deadline_passed) throw new AppError('לא ניתן לשנות אישור הגעה לאחר המועד האחרון', 403);

  const statusId = STATUS_IDS[status];

  if (status === 'confirmed') {
    const count = Number(confirmed_count);
    if (!count || count < 1 || count > guest.guests_count)
      throw new AppError(`מספר מגיעים חייב להיות בין 1 ל-${guest.guests_count}`, 400);
    await Invitation.updateStatusByToken(token, statusId, count);
  } else {
    await Invitation.updateStatusByToken(token, statusId);
  }
}
