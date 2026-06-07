import { Router } from 'express';
import { getTables, addTable, deleteTable } from '../controllers/tablesController.js';
const router = Router({ mergeParams: true });

router.get('/', getTables);
router.post('/', addTable);
router.delete('/:id', deleteTable);

export default router;
