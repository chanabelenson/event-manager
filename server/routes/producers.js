import { Router } from 'express';
import {
  getProducers,
  getEventProducer,
  assignProducer,
  removeProducer,
  rateProducer,
  getProducerDashboard,
} from '../controllers/producerController.js';
import { requireRole } from '../middleware/auth.js';

const router = Router({ mergeParams: true });

router.get('/', requireRole('owner'), getProducers);
router.get('/dashboard', requireRole('producer'), getProducerDashboard);
router.get('/event/:eventId', requireRole('owner'), getEventProducer);
router.post('/event/:eventId', requireRole('owner'), assignProducer);
router.delete('/event/:eventId', requireRole('owner'), removeProducer);
router.post('/event/:eventId/rate', requireRole('owner'), rateProducer);

export default router;
