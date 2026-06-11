import * as Event from '../models/event.js';
import { AppError } from '../utils/AppError.js';

export async function getMyEvents(userId) {
  return await Event.getUserEvents(userId);
}

export async function getEventById(eventId, userId) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);
  return event;
}

export async function createEvent(userId, eventData) {
  const { event_name, event_date, location_name, location_address } = eventData;
  if (!event_name || !event_date || !location_name)
    throw new AppError('שם האירוע, תאריך ומיקום הם שדות חובה', 400);

  const eventId = await Event.createEvent(userId, eventData);
  return { id: eventId, user_id: userId, event_name, event_date, location_name, location_address: location_address || null };
}

export async function updateEvent(eventId, userId, fields) {
  const updated = await Event.updateEvent(eventId, userId, fields);
  if (!updated) throw new AppError('אירוע לא נמצא או אין הרשאה', 404);
}

export async function deleteEvent(eventId, userId) {
  const isDeleted = await Event.deleteEventById(eventId, userId);
  if (!isDeleted) throw new AppError('אירוע לא נמצא או אין הרשאה', 404);
}
