import { Router } from 'express';
import { getMyEvents, createEvent, getEventById } from '../controllers/eventsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getMyEvents);
router.post('/', createEvent);
router.get('/:id', getEventById);

export default router;
