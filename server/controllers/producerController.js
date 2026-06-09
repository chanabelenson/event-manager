import * as ProducerService from '../services/producerService.js';
import { AppError } from '../utils/AppError.js';

export const getProducers = async (req, res) => {
  res.json(await ProducerService.getProducers());
};

export const getEventProducer = async (req, res) => {
  res.json(await ProducerService.getEventProducer(req.params.eventId));
};

export const assignProducer = async (req, res) => {
  await ProducerService.assignProducer(req.params.eventId, req.body.producer_id, req.user.id);
  res.json({ message: 'מפיק שויך בהצלחה' });
};

export const removeProducer = async (req, res) => {
  await ProducerService.removeProducer(req.params.eventId);
  res.json({ message: 'מפיק הוסר' });
};

export const rateProducer = async (req, res) => {
  await ProducerService.rateProducer(req.params.eventId, req.user.id, req.body.rating, req.body.review);
  res.json({ message: 'דירוג נשמר' });
};

export const getProducerDashboard = async (req, res) => {
  if (req.user.role !== 'producer') throw new AppError('אין הרשאה', 403);
  res.json(await ProducerService.getProducerDashboard(req.user.id));
};
