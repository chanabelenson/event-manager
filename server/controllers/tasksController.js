import pool from '../config/db.js';

export const getTasks = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE event_id = ? ORDER BY task_date ASC, id ASC',
      [req.params.eventId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const addTask = async (req, res) => {
  try {
    const { task_name, task_date, estimated_cost, actual_cost, category, notes } = req.body;
    if (!task_name) return res.status(400).json({ message: 'שם משימה חובה' });
    const [result] = await pool.query(
      'INSERT INTO tasks (event_id, task_name, task_date, estimated_cost, actual_cost, category, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.params.eventId, task_name, task_date || null, estimated_cost || 0, actual_cost || 0, category || null, notes || null]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const toggleTask = async (req, res) => {
  try {
    await pool.query('UPDATE tasks SET is_completed=? WHERE id=?', [req.body.is_completed, req.params.id]);
    res.json({ message: 'עודכן' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { task_name, estimated_cost, actual_cost, category, notes } = req.body;
    await pool.query(
      'UPDATE tasks SET task_name=?, estimated_cost=?, actual_cost=?, category=?, notes=? WHERE id=?',
      [task_name, estimated_cost || 0, actual_cost || 0, category || null, notes || null, req.params.id]
    );
    res.json({ message: 'עודכן' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id=?', [req.params.id]);
    res.json({ message: 'נמחק' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};
