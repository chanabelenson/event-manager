import * as ProducerService from '../services/producerService.js';

export const getProducers = async (req, res) => {
  res.json(await ProducerService.getProducers());
};

export const getProducerReviews = async (req, res) => {
  res.json(await ProducerService.getProducerReviews(req.params.id));
};

export const getProducerDashboard = async (req, res) => {
  res.json(await ProducerService.getProducerDashboard(req.user.id));
};

export const getEventProducer = async (req, res) => {
  res.json(await ProducerService.getEventProducer(req.params.eventId));
};

export const removeProducer = async (req, res) => {
  await ProducerService.removeProducer(req.params.eventId);
  res.json({ message: 'מפיק הוסר' });
};

export const updateEventProducer = async (req, res) => {
  const { rating, review, producer_id } = req.body;
  if (producer_id) {
    await ProducerService.assignProducer(req.params.eventId, producer_id, req.user.id);
  }
  if (rating !== undefined) {
    await ProducerService.rateProducer(req.params.eventId, req.user.id, rating, review);
  }
  res.json({ message: 'עודכן' });
};
