import pool from '../config/db.js';

export const getTables = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*, COUNT(g.id) as assigned_guests
       FROM tables t
       LEFT JOIN guests g ON g.table_id = t.id
       WHERE t.event_id = ?
       GROUP BY t.id
       ORDER BY t.table_number ASC`,
      [req.params.eventId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const addTable = async (req, res) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO tables (event_id, table_number, capacity) VALUES (?, ?, ?)',
      [req.params.eventId, req.body.table_number, req.body.capacity || 10]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const deleteTable = async (req, res) => {
  try {
    await pool.query('UPDATE guests SET table_id=NULL WHERE table_id=?', [req.params.id]);
    await pool.query('DELETE FROM tables WHERE id=?', [req.params.id]);
    res.json({ message: 'נמחק' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};
