import { Router } from 'express';
import { getTables, addTable, deleteTable } from '../controllers/tablesController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router({ mergeParams: true });
router.use(authMiddleware);

router.get('/', getTables);
router.post('/', addTable);
router.delete('/:id', deleteTable);

export default router;
