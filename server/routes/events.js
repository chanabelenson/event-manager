import { Router } from 'express';
import { getMyEvents, createEvent, getEventById, updateRsvpDeadline, deleteEvent } from '../controllers/eventsController.js';
import guestsRouter from './guests.js';
import tablesRouter from './tables.js';
import tasksRouter from './tasks.js';
import giftsRouter from './gifts.js';

const router = Router();

router.get('/', getMyEvents);
router.post('/', createEvent);
router.get('/:id', getEventById);
router.patch('/:id/rsvp-deadline', updateRsvpDeadline);
router.delete('/:id', deleteEvent);

router.use('/:eventId/guests', guestsRouter);
router.use('/:eventId/tables', tablesRouter);
router.use('/:eventId/tasks', tasksRouter);
router.use('/:eventId/gifts', giftsRouter);

export default router;
