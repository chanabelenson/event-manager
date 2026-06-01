import pool from '../config/db.js';

export async function getMyEvents(req, res) {
  const [events] = await pool.query(
    'SELECT * FROM events WHERE user_id = ? ORDER BY date ASC',
    [req.user.id]
  );
  res.json(events);
}

export async function createEvent(req, res) {
  const { title, type, date, location } = req.body;
  if (!title || !type || !date || !location)
    return res.status(400).json({ message: 'כל השדות חובה' });

  const [result] = await pool.query(
    'INSERT INTO events (user_id, title, type, date, location) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, title, type, date, location]
  );

  res.status(201).json({ id: result.insertId, user_id: req.user.id, title, type, date, location });
}
