import * as GuestService from '../services/guestService.js';

export const getGuests = async (req, res) => {
  try {
    const guests = await GuestService.getGuests(req.params.eventId, req.user.id);
    res.json(guests);
  } catch (err) {
    console.error('getGuests error:', err.message || err);
    res.status(err.status || 500).json({ message: err.message || 'שגיאת שרת' });
  }
};

export const addGuest = async (req, res) => {
  try {
    const { guest_name } = req.body;
    if (!guest_name) return res.status(400).json({ message: 'שם חובה' });
    const { insertId, invitation_token } = await GuestService.addGuest(req.params.eventId, req.user.id, req.body);
    res.status(201).json({ id: insertId, invitation_token });
  } catch (err) {
    console.error('addGuest error:', err.message || err);
    res.status(err.status || 500).json({ message: err.message || 'שגיאת שרת' });
  }
};

export const updateStatus = async (req, res) => {
  try {
    await GuestService.updateGuestStatus(req.params.id, req.user.id, req.body.status);
    res.json({ message: 'עודכן' });
  } catch (err) {
    console.error('updateStatus error:', err.message || err);
    res.status(err.status || 500).json({ message: err.message || 'שגיאת שרת' });
  }
};

export const updateTable = async (req, res) => {
  try {
    await GuestService.updateGuestTable(req.params.id, req.user.id, req.body.table_id);
    res.json({ message: 'עודכן' });
  } catch (err) {
    console.error('updateTable error:', err.message || err);
    res.status(err.status || 500).json({ message: err.message || 'שגיאת שרת' });
  }
};

export const bulkUpdateTables = async (req, res) => {
  try {
    const { assignments } = req.body;
    await GuestService.bulkUpdateTables(assignments, req.user.id);
    res.json({ message: 'שיבוץ נשמר' });
  } catch (err) {
    console.error('bulkUpdateTables error:', err.message || err);
    res.status(err.status || 500).json({ message: err.message || 'שגיאת שרת' });
  }
};

export const deleteGuest = async (req, res) => {
  try {
    await GuestService.deleteGuest(req.params.id, req.user.id);
    res.json({ message: 'נמחק' });
  } catch (err) {
    console.error('deleteGuest error:', err.message || err);
    res.status(err.status || 500).json({ message: err.message || 'שגיאת שרת' });
  }
};
