import * as Event from '../models/Event.js';
import * as Table from '../models/Table.js';

export async function getTables(eventId, userId) {
  const authorized = await Event.isEventOwnedByUser(eventId, userId);
  if (!authorized) throw { status: 404, message: 'אירוע לא נמצא' };
  return await Table.getTables(eventId);
}

export async function addTable(eventId, userId, tablePayload) {
  const authorized = await Event.isEventOwnedByUser(eventId, userId);
  if (!authorized) throw { status: 404, message: 'אירוע לא נמצא' };
  return await Table.addTable(eventId, tablePayload);
}

export async function deleteTable(tableId, userId) {
  const authorized = await Table.verifyTableOwnership(tableId, userId);
  if (!authorized) throw { status: 404, message: 'שולחן לא נמצא או אין הרשאה' };
  await Table.deleteTable(tableId);
}
