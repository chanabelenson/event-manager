import { Router } from 'express';
<<<<<<< HEAD
import { getMyEvents, createEvent, getEventById } from '../controllers/eventsController.js';
=======
import { getMyEvents, createEvent, deleteEvent } from '../controllers/eventsController.js';
>>>>>>> main
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getMyEvents);
router.post('/', createEvent);
<<<<<<< HEAD
router.get('/:id', getEventById);
=======
router.delete('/:id', deleteEvent);
>>>>>>> main

export default router;
