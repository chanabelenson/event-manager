import { Router } from 'express';
import { requireRole } from '../middleware/auth.js';
import { getUpdates, addUpdate, updateUpdate } from '../controllers/producerUpdateController.js';

const router = Router({ mergeParams: true });

router.get('/', getUpdates);
router.post('/', addUpdate);
router.put('/:updateId', requireRole('owner'), updateUpdate);

export default router;
