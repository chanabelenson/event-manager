import * as ProducerRequestService from '../services/producerRequestService.js';

export const getEventRequest = async (req, res) => {
  const data = await ProducerRequestService.getEventRequest(req.params.eventId, req.user.id);
  res.json(data);
};

export const sendRequest = async (req, res) => {
  const data = await ProducerRequestService.sendRequest(req.params.eventId, req.user.id, req.body.producer_id);
  res.status(201).json(data);
};

export const cancelRequest = async (req, res) => {
  await ProducerRequestService.cancelRequest(req.params.eventId, req.user.id);
  res.json({ message: 'בקשה בוטלה' });
};

export const getPendingRequests = async (req, res) => {
  const data = await ProducerRequestService.getPendingRequests(req.user.id);
  res.json(data);
};

export const respondToRequest = async (req, res) => {
  await ProducerRequestService.respondToRequest(req.params.requestId, req.user.id, req.body.action);
  res.json({ message: 'בקשה עודכנה' });
};
