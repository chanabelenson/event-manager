import * as Task from '../models/Task.js';

export const getTasks = async (req, res) => {
  try {
    res.json(await Task.getTasks(req.params.eventId));
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const addTask = async (req, res) => {
  try {
    const { task_name } = req.body;
    if (!task_name) return res.status(400).json({ message: 'שם משימה חובה' });
    const id = await Task.addTask(req.params.eventId, req.body);
    res.status(201).json({ id });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const toggleTask = async (req, res) => {
  try {
    await Task.toggleTask(req.params.id, req.body.is_completed);
    res.json({ message: 'עודכן' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const updateTask = async (req, res) => {
  try {
    await Task.updateTask(req.params.id, req.body);
    res.json({ message: 'עודכן' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await Task.deleteTask(req.params.id);
    res.json({ message: 'נמחק' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};
