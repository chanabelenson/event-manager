import * as TaskService from '../services/taskService.js';

export const getTasks = async (req, res) => {
  const tasks = await TaskService.getTasks(req.params.eventId, req.user.id);
  res.json(tasks);
};

export const addTask = async (req, res) => {
  const { id } = await TaskService.addTask(req.params.eventId, req.user.id, req.body);
  res.status(201).json({ id });
};

export const updateTask = async (req, res) => {
  await TaskService.updateTask(req.params.id, req.user.id, req.body);
  res.json({ message: 'עודכן' });
};

export const deleteTask = async (req, res) => {
  await TaskService.deleteTask(req.params.id, req.user.id);
  res.json({ message: 'נמחק' });
};
