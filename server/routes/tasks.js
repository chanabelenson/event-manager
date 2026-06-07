import { Router } from 'express';
import { getTasks, addTask, toggleTask, updateTask, deleteTask } from '../controllers/tasksController.js';
const router = Router({ mergeParams: true });

router.get('/', getTasks);
router.post('/', addTask);
router.patch('/:id/toggle', toggleTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
