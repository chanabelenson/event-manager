import * as EventProducer from '../models/EventProducer.js';
import * as User from '../models/User.js';
import { AppError } from '../utils/AppError.js';

export async function getProducers() {
  return await User.getAllProducers();
}

export async function getEventProducer(eventId) {
  return await EventProducer.getEventProducer(eventId);
}

export async function assignProducer(eventId, producerId, ownerId) {
  const producers = await User.getAllProducers();
  if (!producers.find((p) => p.id === producerId))
    throw new AppError('מפיק לא נמצא', 404);
  await EventProducer.assignProducer(eventId, producerId);
}

export async function removeProducer(eventId) {
  await EventProducer.removeProducer(eventId);
}

export async function rateProducer(eventId, ownerId, rating, review) {
  if (rating < 1 || rating > 5) throw new AppError('דירוג חייב להיות בין 1 ל-5', 400);
  const updated = await EventProducer.rateProducer(eventId, ownerId, rating, review);
  if (!updated) throw new AppError('לא ניתן לדרג - אירוע לא נמצא', 404);
}

export async function getProducerDashboard(producerId) {
  return await EventProducer.getProducerEvents(producerId);
}
