import { Router } from 'express';
import { getMyEvents, createEvent, deleteEvent } from '../controllers/eventsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getMyEvents);
router.post('/', createEvent);
router.delete('/:id', deleteEvent);

export default router;
