import * as Table from '../models/Table.js';
import * as Event from '../models/Event.js';
import { AppError } from '../utils/AppError.js';

export async function getTables(eventId, userId) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);
  return await Table.getTables(eventId);
}

export async function addTable(eventId, userId, { table_number, capacity }) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);
  const id = await Table.addTable(eventId, { table_number, capacity });
  return { id };
}

export async function deleteTable(tableId, userId) {
  const owned = await Table.verifyTableOwnership(tableId, userId);
  if (!owned) throw new AppError('שולחן לא נמצא', 404);
  await Table.deleteTable(tableId);
}
