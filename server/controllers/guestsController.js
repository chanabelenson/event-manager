import pool from '../config/db.js';

export const getGuests = async (req, res) => {
  try {
    const [guests] = await pool.query(
      `SELECT g.*, t.table_number as assigned_table 
       FROM guests g
       LEFT JOIN tables t ON t.id = g.table_id
       WHERE g.event_id = ? ORDER BY g.guest_name ASC`,
      [req.params.eventId]
    );
    res.json(guests);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const addGuest = async (req, res) => {
  try {
    const { guest_name } = req.body;
    if (!guest_name) return res.status(400).json({ message: 'שם חובה' });
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const [result] = await pool.query(
      'INSERT INTO guests (event_id, guest_name, phone_number, guests_count, category, invitation_token) VALUES (?, ?, ?, ?, ?, ?)',
      [req.params.eventId, guest_name, req.body.phone_number || null, req.body.guests_count || 1, req.body.category || null, token]
    );
    res.status(201).json({ id: result.insertId, invitation_token: token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const updateStatus = async (req, res) => {
  try {
    await pool.query('UPDATE guests SET status=? WHERE id=?', [req.body.status, req.params.id]);
    res.json({ message: 'עודכן' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const updateTable = async (req, res) => {
  try {
    await pool.query('UPDATE guests SET table_id=? WHERE id=?', [req.body.table_id || null, req.params.id]);
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
    await Promise.all(
      assignments.map(({ guestId, tableId }) =>
        pool.query('UPDATE guests SET table_id=? WHERE id=?', [tableId, guestId])
      )
    );
    res.json({ message: 'שיבוץ נשמר' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const deleteGuest = async (req, res) => {
  try {
    await pool.query('DELETE FROM guests WHERE id=?', [req.params.id]);
    res.json({ message: 'נמחק' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};
