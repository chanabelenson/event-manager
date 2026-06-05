import * as EventService from '../services/eventService.js';

export async function getMyEvents(req, res) {
  try {
    const events = await EventService.getMyEvents(req.user.id);
    res.json(events);
  } catch (err) {
    console.error('getMyEvents error:', err.message || err);
    res.status(err.status || 500).json({ message: err.message || 'שגיאת שרת פנימית' });
  }
}

export async function getEventById(req, res) {
  try {
    const event = await EventService.getEventById(req.params.id, req.user.id);
    res.json(event);
  } catch (err) {
    console.error('getEventById error:', err.message || err);
    res.status(err.status || 500).json({ message: err.message || 'שגיאת שרת פנימית' });
  }
}

export async function createEvent(req, res) {
  try {
    const { event_name, event_date, location_name, location_address } = req.body;
    const event = await EventService.createEvent(req.user.id, {
      event_name,
      event_date,
      location_name,
      location_address,
    });
    res.status(201).json(event);
  } catch (err) {
    console.error('createEvent error:', err.message || err);
    res.status(err.status || 500).json({ message: err.message || 'שגיאת שרת פנימית' });
  }
}

export async function deleteEvent(req, res) {
  try {
    await EventService.deleteEvent(req.params.id, req.user.id);
    res.json({ message: 'האירוע נמחק בהצלחה' });
  } catch (err) {
    console.error('deleteEvent error:', err.message || err);
    res.status(err.status || 500).json({ message: err.message || 'שגיאת שרת פנימית' });
  }
}
