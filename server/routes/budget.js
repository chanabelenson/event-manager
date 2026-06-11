import { Router } from 'express';
import {
  getBudgetData,
  addBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
} from '../controllers/budgetController.js';
import paymentsRouter from './payments.js';

const router = Router({ mergeParams: true });

router.get('/', getBudgetData);
router.post('/', addBudgetItem);
router.put('/:id', updateBudgetItem);
router.delete('/:id', deleteBudgetItem);

router.use('/:itemId/payments', paymentsRouter);

export default router;
