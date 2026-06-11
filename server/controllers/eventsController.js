import * as EventService from '../services/eventService.js';

export const getMyEvents = async (req, res) => {
  const events = await EventService.getMyEvents(req.user.id);
  res.json(events);
};

export const getEventById = async (req, res) => {
  const event = await EventService.getEventById(req.params.id, req.user.id);
  res.json(event);
};

export const createEvent = async (req, res) => {
  const { event_name, event_date, location_name, location_address } = req.body;
  const event = await EventService.createEvent(req.user.id, {
    event_name,
    event_date,
    location_name,
    location_address,
  });
  res.status(201).json(event);
};

export const updateEvent = async (req, res) => {
  await EventService.updateEvent(req.params.id, req.user.id, req.body);
  res.json({ message: 'עודכן' });
};

export const deleteEvent = async (req, res) => {
  await EventService.deleteEvent(req.params.id, req.user.id);
  res.json({ message: 'האירוע נמחק בהצלחה' });
};
