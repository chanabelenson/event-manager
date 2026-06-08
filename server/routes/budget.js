import { Router } from 'express';
import { getBudgetItems, addBudgetItem, updateBudgetItem, deleteBudgetItem } from '../controllers/budgetController.js';

const router = Router({ mergeParams: true });

router.get('/', getBudgetItems);
router.post('/', addBudgetItem);
router.put('/:id', updateBudgetItem);
router.delete('/:id', deleteBudgetItem);

export default router;
