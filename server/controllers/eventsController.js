import pool from '../config/db.js';

export async function getMyEvents(req, res) {
  try {
    const [events] = await pool.query(
      'SELECT * FROM events WHERE user_id = ? ORDER BY event_date ASC',
      [req.user.id]
    );
    res.json(events);
  } catch (err) {
    console.error('getMyEvents error:', err.message);
    res.status(500).json({ message: 'שגיאת שרת פנימית' });
  }
}

export async function getEventById(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM events WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'אירוע לא נמצא' });
    res.json(rows[0]);
  } catch (err) {
    console.error('getEventById error:', err.message);
    res.status(500).json({ message: 'שגיאת שרת פנימית' });
  }
}

export async function createEvent(req, res) {
  try {
    const { event_name, event_date, location_name, location_address } = req.body;
    if (!event_name || !event_date || !location_name)
      return res.status(400).json({ message: 'שם האירוע, תאריך ומיקום הם שדות חובה' });

    const [result] = await pool.query(
      'INSERT INTO events (user_id, event_name, event_date, location_name, location_address) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, event_name, event_date, location_name, location_address || null]
    );

    res.status(201).json({
      id: result.insertId,
      user_id: req.user.id,
      event_name,
      event_date,
      location_name,
      location_address: location_address || null,
    });
  } catch (err) {
    console.error('createEvent error:', err.message);
    res.status(500).json({ message: 'שגיאת שרת פנימית' });
  }
}

export async function deleteEvent(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT id FROM events WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'אירוע לא נמצא או אין הרשאה' });

    await pool.query('DELETE FROM events WHERE id = ?', [id]);
    res.json({ message: 'האירוע נמחק בהצלחה' });
  } catch (err) {
    console.error('deleteEvent error:', err.message);
    res.status(500).json({ message: 'שגיאת שרת פנימית' });
  }
}
