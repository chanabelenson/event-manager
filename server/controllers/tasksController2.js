import * as TaskService from '../services/taskService.js';

export const getTasks = async (req, res) => {
  try {
    const tasks = await TaskService.getTasks(req.params.eventId, req.user.id);
    res.json(tasks);
  } catch (err) {
    console.error('getTasks error:', err.message || err);
    res.status(err.status || 500).json({ message: err.message || 'שגיאת שרת' });
  }
};

export const addTask = async (req, res) => {
  try {
    const { id } = await TaskService.addTask(req.params.eventId, req.user.id, req.body);
    res.status(201).json({ id });
  } catch (err) {
    console.error('addTask error:', err.message || err);
    res.status(err.status || 500).json({ message: err.message || 'שגיאת שרת' });
  }
};

export const toggleTask = async (req, res) => {
  try {
    await TaskService.toggleTask(req.params.id, req.user.id, req.body.is_completed);
    res.json({ message: 'עודכן' });
  } catch (err) {
    console.error('toggleTask error:', err.message || err);
    res.status(err.status || 500).json({ message: err.message || 'שגיאת שרת' });
  }
};

export const updateTask = async (req, res) => {
  try {
    await TaskService.updateTask(req.params.id, req.user.id, req.body);
    res.json({ message: 'עודכן' });
  } catch (err) {
    console.error('updateTask error:', err.message || err);
    res.status(err.status || 500).json({ message: err.message || 'שגיאת שרת' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await TaskService.deleteTask(req.params.id, req.user.id);
    res.json({ message: 'נמחק' });
  } catch (err) {
    console.error('deleteTask error:', err.message || err);
    res.status(err.status || 500).json({ message: err.message || 'שגיאת שרת' });
  }
};
