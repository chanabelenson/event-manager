import * as ProducerUpdateService from '../services/producerUpdateService.js';

export const getUpdates = async (req, res) => {
  const data = await ProducerUpdateService.getUpdates(req.params.eventId, req.user.id, req.user.role);
  res.json(data);
};

export const addUpdate = async (req, res) => {
  const data = await ProducerUpdateService.addUpdate(req.params.eventId, req.user.id, req.user.role, req.body.content);
  res.status(201).json(data);
};

export const updateUpdate = async (req, res) => {
  await ProducerUpdateService.markDone(req.params.eventId, req.user.id, req.params.updateId);
  res.json({ message: 'עודכן' });
};
