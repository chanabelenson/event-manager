import * as Guest from '../models/Guest.js';

export const getGuests = async (req, res) => {
  try {
    res.json(await Guest.getGuests(req.params.eventId));
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const addGuest = async (req, res) => {
  try {
    const { guest_name } = req.body;
    if (!guest_name) return res.status(400).json({ message: 'שם חובה' });
    const { insertId, invitation_token } = await Guest.addGuest(req.params.eventId, req.body);
    res.status(201).json({ id: insertId, invitation_token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const updateStatus = async (req, res) => {
  try {
    await Guest.updateGuestStatus(req.params.id, req.body.status);
    res.json({ message: 'עודכן' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const updateTable = async (req, res) => {
  try {
    await Guest.updateGuestTable(req.params.id, req.body.table_id);
    res.json({ message: 'עודכן' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const bulkUpdateTables = async (req, res) => {
  try {
    const { assignments } = req.body;
    if (!Array.isArray(assignments)) return res.status(400).json({ message: 'נתונים שגויים' });
    await Guest.bulkUpdateGuestTables(assignments);
    res.json({ message: 'שיבוץ נשמר' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const deleteGuest = async (req, res) => {
  try {
    await Guest.deleteGuest(req.params.id);
    res.json({ message: 'נמחק' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};
