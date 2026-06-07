import * as EventService from '../services/eventService.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getMyEvents = asyncHandler(async (req, res) => {
  const events = await EventService.getMyEvents(req.user.id);
  res.json(events);
});

export const getEventById = asyncHandler(async (req, res) => {
  const event = await EventService.getEventById(req.params.id, req.user.id);
  res.json(event);
});

export const createEvent = asyncHandler(async (req, res) => {
  const { event_name, event_date, location_name, location_address } = req.body;
  const event = await EventService.createEvent(req.user.id, {
    event_name,
    event_date,
    location_name,
    location_address,
  });
  res.status(201).json(event);
});

export const updateRsvpDeadline = asyncHandler(async (req, res) => {
  await EventService.updateRsvpDeadline(req.params.id, req.user.id, req.body.rsvp_deadline);
  res.json({ message: 'עודכן' });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  await EventService.deleteEvent(req.params.id, req.user.id);
  res.json({ message: 'האירוע נמחק בהצלחה' });
});
