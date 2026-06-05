import * as Guest from '../models/Guest.js';
import * as Event from '../models/Event.js';
import * as Table from '../models/Table.js';

export async function getGuests(eventId, userId) {
  const authorized = await Event.isEventOwnedByUser(eventId, userId);
  if (!authorized) throw { status: 404, message: 'אירוע לא נמצא' };
  return await Guest.getGuests(eventId);
}

export async function addGuest(eventId, userId, guestPayload) {
  const authorized = await Event.isEventOwnedByUser(eventId, userId);
  if (!authorized) throw { status: 404, message: 'אירוע לא נמצא' };
  return await Guest.addGuest(eventId, guestPayload);
}

export async function updateGuestStatus(guestId, userId, status) {
  if (!['pending', 'confirmed', 'declined'].includes(status)) {
    throw { status: 400, message: 'סטטוס לא תקין' };
  }
  const authorized = await Guest.verifyGuestOwnership(guestId, userId);
  if (!authorized) throw { status: 404, message: 'אורח לא נמצא או אין הרשאה' };
  await Guest.updateGuestStatus(guestId, status);
}

export async function updateGuestTable(guestId, userId, tableId) {
  const authorized = await Guest.verifyGuestOwnership(guestId, userId);
  if (!authorized) throw { status: 404, message: 'אורח לא נמצא או אין הרשאה' };
  if (tableId !== null && tableId !== undefined) {
    const tableAuthorized = await Table.verifyTableOwnership(tableId, userId);
    if (!tableAuthorized) throw { status: 404, message: 'שולחן לא נמצא או אין הרשאה' };
  }
  await Guest.updateGuestTable(guestId, tableId);
}

export async function bulkUpdateTables(assignments, userId) {
  if (!Array.isArray(assignments)) throw { status: 400, message: 'נתונים שגויים' };
  const guestIds = assignments.map((assignment) => assignment.guestId);
  if (!guestIds.length) return;
  const authorized = await Guest.verifyGuestsOwnership(guestIds, userId);
  if (!authorized) throw { status: 404, message: 'אחד או יותר מהאורחים לא נמצאו או אין הרשאה' };

  const tableIds = assignments
    .map((assignment) => assignment.tableId)
    .filter((id) => id !== null && id !== undefined);
  if (tableIds.length) {
    const tablesAuthorized = await Table.verifyTablesOwnership(tableIds, userId);
    if (!tablesAuthorized) throw { status: 404, message: 'אחד או יותר מהשולחנות לא נמצאו או אין הרשאה' };
  }

  await Guest.bulkUpdateGuestTables(assignments);
}

export async function deleteGuest(guestId, userId) {
  const authorized = await Guest.verifyGuestOwnership(guestId, userId);
  if (!authorized) throw { status: 404, message: 'אורח לא נמצא או אין הרשאה' };
  await Guest.deleteGuest(guestId);
}
