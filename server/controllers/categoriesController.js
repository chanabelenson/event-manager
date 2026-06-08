import pool from '../config/db.js';
import * as Event from '../models/Event.js';
import { AppError } from '../utils/AppError.js';

export const getCategories = async (req, res) => {
  const event = await Event.findEventById(req.params.eventId, req.user.id);
  if (!event) throw new AppError('אירוע לא נמצא', 404);

  const [rows] = await pool.query(
    'SELECT * FROM guest_categories WHERE event_id = ? ORDER BY category_name ASC',
    [req.params.eventId]
  );
  res.json(rows);
};

export const addCategory = async (req, res) => {
  const event = await Event.findEventById(req.params.eventId, req.user.id);
  if (!event) throw new AppError('אירוע לא נמצא', 404);

  const { category_name } = req.body;
  if (!category_name) throw new AppError('שם קטגוריה חובה', 400);

  const [result] = await pool.query(
    'INSERT INTO guest_categories (event_id, category_name) VALUES (?, ?)',
    [req.params.eventId, category_name]
  );
  res.status(201).json({ id: result.insertId, category_name });
};

export const deleteCategory = async (req, res) => {
  const event = await Event.findEventById(req.params.eventId, req.user.id);
  if (!event) throw new AppError('אירוע לא נמצא', 404);

  await pool.query('DELETE FROM guest_categories WHERE id = ? AND event_id = ?', [req.params.categoryId, req.params.eventId]);
  res.json({ message: 'נמחק' });
};
