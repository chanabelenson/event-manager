import * as ProducerRequest from '../models/ProducerRequest.js';
import * as EventProducer from '../models/EventProducer.js';
import * as Event from '../models/Event.js';
import { AppError } from '../utils/AppError.js';
import { REQUEST_STATUS } from '../utils/constants.js';

export async function sendRequest(eventId, ownerId, producerId) {
  const event = await Event.findEventById(eventId, ownerId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);

  const existing = await ProducerRequest.getRequestByEventAndProducer(eventId, producerId);
  if (existing) throw new AppError('בקשה כבר נשלחה למפיק זה', 409);

  const id = await ProducerRequest.createRequest(eventId, producerId);
  return { id };
}

export async function getEventRequest(eventId, ownerId) {
  const event = await Event.findEventById(eventId, ownerId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);
  return await ProducerRequest.getRequestByEvent(eventId);
}

export async function cancelRequest(eventId, ownerId) {
  const event = await Event.findEventById(eventId, ownerId);
  if (!event) throw new AppError('אירוע לא נמצא', 404);
  await ProducerRequest.cancelByEvent(eventId);
}

export async function getPendingRequests(producerId, { status, page, limit }) {
  return await ProducerRequest.getRequestsByProducer(producerId, { status, page, limit });
}

export async function respondToRequest(requestId, producerId, action) {
  if (!['approved', 'rejected'].includes(action)) throw new AppError('פעולה לא תקינה', 400);

  const request = await ProducerRequest.getRequestById(requestId);
  if (!request) throw new AppError('בקשה לא נמצאה', 404);
  if (request.producer_id !== producerId) throw new AppError('אין הרשאה', 403);
  if (request.status !== 'pending') throw new AppError('הבקשה כבר טופלה', 400);

  if (action === 'approved') {
    await ProducerRequest.updateStatus(requestId, REQUEST_STATUS.APPROVED);
    await EventProducer.assignProducer(request.event_id, producerId);
  } else {
    await ProducerRequest.deleteRequest(requestId);
  }
}
