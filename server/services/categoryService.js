import * as GuestCategory from '../models/GuestCategory.js';
import * as Event from '../models/Event.js';
import { AppError } from '../utils/AppError.js';

export async function getCategories(eventId, userId) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);
  return GuestCategory.getCategories(eventId);
}

export async function addCategory(eventId, userId, category_name) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);
  if (!category_name) throw new AppError('שם קטגוריה חובה', 400);
  const id = await GuestCategory.addCategory(eventId, category_name);
  return { id, category_name };
}

export async function deleteCategory(eventId, userId, categoryId) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);
  await GuestCategory.deleteCategory(categoryId, eventId);
}
