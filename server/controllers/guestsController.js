import * as GuestService from '../services/guestService.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getGuests = asyncHandler(async (req, res) => {
  const guests = await GuestService.getGuests(req.params.eventId, req.user.id);
  res.json(guests);
});

export const addGuest = asyncHandler(async (req, res) => {
  const { id, invitation_token } = await GuestService.addGuest(req.params.eventId, req.user.id, req.body);
  res.status(201).json({ id, invitation_token });
});

export const updateStatus = asyncHandler(async (req, res) => {
  await GuestService.updateGuestStatus(req.params.id, req.user.id, req.body.status);
  res.json({ message: 'עודכן' });
});

export const updateTable = asyncHandler(async (req, res) => {
  await GuestService.updateGuestTable(req.params.id, req.user.id, req.body.table_id);
  res.json({ message: 'עודכן' });
});

export const bulkUpdateTables = asyncHandler(async (req, res) => {
  await GuestService.bulkUpdateTables(req.body.assignments, req.user.id);
  res.json({ message: 'שיבוץ נשמר' });
});

export const deleteGuest = asyncHandler(async (req, res) => {
  await GuestService.deleteGuest(req.params.id, req.user.id);
  res.json({ message: 'נמחק' });
});
