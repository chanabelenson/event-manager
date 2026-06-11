import { Router } from 'express';
import { requireRole } from '../middleware/auth.js';
import { getProducers, getProducerReviews } from '../controllers/producerController.js';

const router = Router();

router.get('/', requireRole('owner'), getProducers);
router.get('/:id/reviews', getProducerReviews);

export default router;
