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

// GET /api/producers - רשימת כל המפיקים
router.get('/', getProducers);

// GET /api/producers/dashboard - לוח בקרה של המפיק המחובר
router.get('/dashboard', getProducerDashboard);

// GET /api/producers/event/:eventId - מפיק משויך לאירוע
router.get('/event/:eventId', getEventProducer);

// POST /api/producers/event/:eventId - שיוך מפיק לאירוע
router.post('/event/:eventId', assignProducer);

// DELETE /api/producers/event/:eventId - הסרת מפיק מאירוע
router.delete('/event/:eventId', removeProducer);

// POST /api/producers/event/:eventId/rate - דירוג מפיק
router.post('/event/:eventId/rate', rateProducer);

export default router;
