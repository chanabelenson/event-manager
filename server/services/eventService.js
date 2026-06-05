import * as Event from '../models/Event.js';

export async function getMyEvents(userId) {
  return await Event.getEventsByUser(userId);
}

export async function getEventById(eventId, userId) {
  const event = await Event.getEventById(eventId, userId);
  if (!event) throw { status: 404, message: 'אירוע לא נמצא' };
  return event;
}

export async function createEvent(userId, eventPayload) {
  return await Event.createEvent({ userId, ...eventPayload });
}

export async function deleteEvent(eventId, userId) {
  const owned = await Event.isEventOwnedByUser(eventId, userId);
  if (!owned) throw { status: 404, message: 'אירוע לא נמצא או אין הרשאה' };
  await Event.deleteEvent(eventId);
}
