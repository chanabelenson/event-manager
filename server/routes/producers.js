import { Router } from 'express';
import {
  getProducers,
  getEventProducer,
  assignProducer,
  removeProducer,
  rateProducer,
  getProducerDashboard,
} from '../controllers/producerController.js';

const router = Router({ mergeParams: true });

router.get('/', getProducers);
router.get('/dashboard', getProducerDashboard);
router.get('/event/:eventId', getEventProducer);
router.post('/event/:eventId', assignProducer);
router.delete('/event/:eventId', removeProducer);
router.post('/event/:eventId/rate', rateProducer);

export default router;
