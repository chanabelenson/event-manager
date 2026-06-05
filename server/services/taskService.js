import * as Event from '../models/Event.js';
import * as Task from '../models/Task.js';

export async function getTasks(eventId, userId) {
  const authorized = await Event.isEventOwnedByUser(eventId, userId);
  if (!authorized) throw { status: 404, message: 'אירוע לא נמצא' };
  return await Task.getTasks(eventId);
}

export async function addTask(eventId, userId, taskPayload) {
  if (!taskPayload.task_name) throw { status: 400, message: 'שם משימה חובה' };
  const authorized = await Event.isEventOwnedByUser(eventId, userId);
  if (!authorized) throw { status: 404, message: 'אירוע לא נמצא' };
  return await Task.addTask(eventId, taskPayload);
}

export async function toggleTask(taskId, userId, is_completed) {
  const authorized = await Task.verifyTaskOwnership(taskId, userId);
  if (!authorized) throw { status: 404, message: 'משימה לא נמצאה או אין הרשאה' };
  await Task.toggleTask(taskId, is_completed);
}

export async function updateTask(taskId, userId, taskPayload) {
  const authorized = await Task.verifyTaskOwnership(taskId, userId);
  if (!authorized) throw { status: 404, message: 'משימה לא נמצאה או אין הרשאה' };
  await Task.updateTask(taskId, taskPayload);
}

export async function deleteTask(taskId, userId) {
  const authorized = await Task.verifyTaskOwnership(taskId, userId);
  if (!authorized) throw { status: 404, message: 'משימה לא נמצאה או אין הרשאה' };
  await Task.deleteTask(taskId);
}
