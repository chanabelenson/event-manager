import { Router } from 'express';
import { requireRole } from '../middleware/auth.js';
import { getProducerDashboard } from '../controllers/producerController.js';
import { getPendingRequests, respondToRequest } from '../controllers/producerRequestController.js';

const router = Router();

router.use(requireRole('producer'));

router.get('/dashboard', getProducerDashboard);
router.get('/requests', getPendingRequests);
router.put('/requests/:id', respondToRequest);

export default router;
