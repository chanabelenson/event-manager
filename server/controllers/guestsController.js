import * as GuestService from '../services/guestService.js';

export const getGuests = async (req, res) => {
  if (req.query.include === 'assignments') {
    const data = await GuestService.getTableAssignments(req.params.eventId, req.user.id);
    return res.json(data);
  }
  const guests = await GuestService.getGuests(req.params.eventId, req.user.id);
  res.json(guests);
};

export const addGuest = async (req, res) => {
  const { id, invitation_token } = await GuestService.addGuest(req.params.eventId, req.user.id, req.body);
  res.status(201).json({ id, invitation_token });
};

export const updateGuest = async (req, res) => {
  await GuestService.updateGuest(req.params.id, req.user.id, req.body);
  res.json({ message: 'עודכן' });
};

export const bulkUpdateTables = async (req, res) => {
  await GuestService.autoArrangeBulk(req.params.eventId, req.user.id, req.body.assignments);
  res.json({ message: 'שיבוץ נשמר' });
};

export const deleteGuest = async (req, res) => {
  await GuestService.deleteGuest(req.params.id, req.user.id);
  res.json({ message: 'נמחק' });
};
