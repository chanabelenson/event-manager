import { Router } from 'express';
import { getMyEvents, createEvent, getEventById, deleteEvent } from '../controllers/eventsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getMyEvents);
router.post('/', createEvent);
router.get('/:id', getEventById);
router.delete('/:id', deleteEvent);

export default router;
