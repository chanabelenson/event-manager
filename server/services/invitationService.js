import * as Guest from '../models/Guest.js';

export async function getInvitation(token) {
  return await Guest.getGuestByToken(token);
}

export async function updateInvitationStatus(token, status) {
  if (!['confirmed', 'declined'].includes(status)) {
    throw { status: 400, message: 'סטטוס לא תקין' };
  }

  const guest = await Guest.getGuestByToken(token);
  if (!guest) throw { status: 404, message: 'הזמנה לא נמצאה' };

  await Guest.updateGuestStatusByToken(token, status);
  return guest;
}
