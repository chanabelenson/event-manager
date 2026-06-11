import * as ProducerUpdate from '../models/ProducerUpdate.js';
import * as EventProducer from '../models/EventProducer.js';
import * as Event from '../models/Event.js';
import { AppError } from '../utils/AppError.js';

async function verifyAccess(eventId, userId, role) {
  if (role === 'owner') {
    const event = await Event.findEventById(eventId, userId);
    if (!event) throw new AppError('אין גישה', 403);
  } else {
    const producer = await EventProducer.getEventProducer(eventId);
    if (!producer || producer.id !== userId) throw new AppError('אין גישה', 403);
  }
}

export async function getUpdates(eventId, userId, role) {
  await verifyAccess(eventId, userId, role);
  return await ProducerUpdate.getUpdates(eventId);
}

export async function addUpdate(eventId, userId, role, content) {
  await verifyAccess(eventId, userId, role);
  if (!content?.trim()) throw new AppError('תוכן חובה', 400);
  const id = await ProducerUpdate.addUpdate(eventId, role, content.trim());
  return { id };
}

export async function markDone(eventId, userId, updateId) {
  const event = await Event.findEventById(eventId, userId);
  if (!event) throw new AppError('אין גישה', 403);
  await ProducerUpdate.markDone(updateId);
}
