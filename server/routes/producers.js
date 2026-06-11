import { Router } from 'express';
import { getProducers, getEventProducer, removeProducer, rateProducer, getProducerDashboard, getProducerReviews } from '../controllers/producerController.js';
import { getEventRequest, sendRequest, cancelRequest, getPendingRequests, respondToRequest } from '../controllers/producerRequestController.js';
import { getUpdates, addUpdate, markDone } from '../controllers/producerUpdateController.js';
import { requireRole } from '../middleware/auth.js';

const router = Router({ mergeParams: true });

router.get('/', requireRole('owner'), getProducers);
router.get('/:producerId/reviews', getProducerReviews);
router.get('/dashboard', requireRole('producer'), getProducerDashboard);
router.get('/requests', requireRole('producer'), getPendingRequests);
router.post('/requests/:requestId/respond', requireRole('producer'), respondToRequest);
router.get('/event/:eventId', requireRole('owner'), getEventProducer);
router.delete('/event/:eventId', requireRole('owner'), removeProducer);
router.post('/event/:eventId/rate', requireRole('owner'), rateProducer);
router.get('/event/:eventId/request', requireRole('owner'), getEventRequest);
router.post('/event/:eventId/request', requireRole('owner'), sendRequest);
router.delete('/event/:eventId/request', requireRole('owner'), cancelRequest);
router.get('/event/:eventId/updates', getUpdates);
router.post('/event/:eventId/updates', addUpdate);
router.patch('/event/:eventId/updates/:updateId/done', requireRole('owner'), markDone);

export default router;
