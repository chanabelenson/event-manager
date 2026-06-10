import * as Task from '../models/Task.js';
import * as Event from '../models/Event.js';
import { AppError } from '../utils/AppError.js';

export async function getTasks(eventId, userId) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);
  return await Task.getTasks(eventId);
}

export async function addTask(eventId, userId, { task_name, task_date, notes }) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);
  if (!task_name) throw new AppError('שם משימה חובה', 400);
  const id = await Task.addTask(eventId, { task_name, task_date, notes });
  return { id };
}

export async function toggleTask(taskId, userId, is_completed) {
  const owned = await Task.verifyTaskOwnership(taskId, userId);
  if (!owned) throw new AppError('משימה לא נמצאה', 404);
  await Task.toggleTask(taskId, is_completed);
}

export async function updateTask(taskId, userId, fields) {
  const owned = await Task.verifyTaskOwnership(taskId, userId);
  if (!owned) throw new AppError('משימה לא נמצאה', 404);
  await Task.updateTask(taskId, fields);
}

export async function deleteTask(taskId, userId) {
  const owned = await Task.verifyTaskOwnership(taskId, userId);
  if (!owned) throw new AppError('משימה לא נמצאה', 404);
  await Task.deleteTask(taskId);
}
