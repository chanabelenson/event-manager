import * as Event from '../models/Event.js';

export async function getMyEvents(userId) {
  return await Event.getUserEvents(userId);
}

export async function getEventById(eventId, userId) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) {
    const error = new Error('אירוע לא נמצא');
    error.status = 404;
    throw error;
  }
  return event;
}

export async function createEvent(userId, eventData) {
  const { event_name, event_date, location_name, location_address } = eventData;
  if (!event_name || !event_date || !location_name) {
    const error = new Error('שם האירוע, תאריך ומיקום הם שדות חובה');
    error.status = 400;
    throw error;
  }
  const eventId = await Event.createEvent(userId, eventData);
  return {
    id: eventId,
    user_id: userId,
    event_name,
    event_date,
    location_name,
    location_address: location_address || null,
  };
}

export async function deleteEvent(eventId, userId) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) {
    const error = new Error('אירוע לא נמצא או אין הרשאה');
    error.status = 404;
    throw error;
  }
  await Event.deleteEventById(eventId, userId);
}
