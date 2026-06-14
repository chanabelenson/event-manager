import { Router } from 'express';
import { requireRole } from '../middleware/auth.js';
import { getEventProducer, removeProducer, updateEventProducer } from '../controllers/producerController.js';
import { getEventRequest, sendRequest, cancelRequest } from '../controllers/producerRequestController.js';
import updatesRouter from './updatesRouter.js';

const router = Router({ mergeParams: true });

router.use('/updates', updatesRouter);

router.get('/', requireRole('owner'), getEventProducer);
router.post('/', requireRole('owner'), sendRequest);
router.put('/', requireRole('owner'), updateEventProducer);
router.delete('/', requireRole('owner'), removeProducer);

const eventRequestRouter = Router({ mergeParams: true });
eventRequestRouter.get('/', requireRole('owner'), getEventRequest);
eventRequestRouter.delete('/', requireRole('owner'), cancelRequest);

router.use('/request', eventRequestRouter);

export default router;
