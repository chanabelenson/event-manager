import { Router } from 'express';
import { getMyEvents, createEvent, getEventById, deleteEvent } from '../controllers/eventsController.js';
import { authMiddleware } from '../middleware/auth.js';
import guestsRouter from './guests.js';
import tablesRouter from './tables.js';
import tasksRouter from './tasks.js';

const router = Router();
router.use(authMiddleware);

router.get('/', getMyEvents);
router.post('/', createEvent);
router.get('/:id', getEventById);
router.delete('/:id', deleteEvent);

router.use('/:eventId/guests', guestsRouter);
router.use('/:eventId/tables', tablesRouter);
router.use('/:eventId/tasks', tasksRouter);

export default router;
