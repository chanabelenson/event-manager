import { Router } from 'express';
import { getGuests, addGuest, updateStatus, updateTable, deleteGuest } from '../controllers/guestsController.js';
import { getTables, addTable, deleteTable } from '../controllers/tablesController.js';
import { getTasks, addTask, toggleTask, updateTask, deleteTask } from '../controllers/tasksController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router({ mergeParams: true });
router.use(authMiddleware);

// Guests
router.get('/:eventId/guests', getGuests);
router.post('/:eventId/guests', addGuest);
router.patch('/guests/:id/status', updateStatus);
router.patch('/guests/:id/table', updateTable);
router.delete('/guests/:id', deleteGuest);

// Tables
router.get('/:eventId/tables', getTables);
router.post('/:eventId/tables', addTable);
router.delete('/tables/:id', deleteTable);

// Tasks
router.get('/:eventId/tasks', getTasks);
router.post('/:eventId/tasks', addTask);
router.patch('/tasks/:id/toggle', toggleTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

export default router;
