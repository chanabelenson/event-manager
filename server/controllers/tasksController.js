import * as TaskService from '../services/taskService.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await TaskService.getTasks(req.params.eventId, req.user.id);
  res.json(tasks);
});

export const addTask = asyncHandler(async (req, res) => {
  const { id } = await TaskService.addTask(req.params.eventId, req.user.id, req.body);
  res.status(201).json({ id });
});

export const toggleTask = asyncHandler(async (req, res) => {
  await TaskService.toggleTask(req.params.id, req.user.id, req.body.is_completed);
  res.json({ message: 'עודכן' });
});

export const updateTask = asyncHandler(async (req, res) => {
  await TaskService.updateTask(req.params.id, req.user.id, req.body);
  res.json({ message: 'עודכן' });
});

export const deleteTask = asyncHandler(async (req, res) => {
  await TaskService.deleteTask(req.params.id, req.user.id);
  res.json({ message: 'נמחק' });
});
