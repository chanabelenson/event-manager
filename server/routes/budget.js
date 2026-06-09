import { Router } from 'express';
import {
  getBudgetData,
  addBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
  updateBudgetCeiling,
  addPayment,
  deletePayment,
} from '../controllers/budgetController.js';

const router = Router({ mergeParams: true });

// More-specific routes defined first to avoid param collision
router.patch('/ceiling', updateBudgetCeiling);
router.delete('/payments/:paymentId', deletePayment);

router.get('/', getBudgetData);
router.post('/', addBudgetItem);
router.put('/:id', updateBudgetItem);
router.delete('/:id', deleteBudgetItem);

router.post('/:itemId/payments', addPayment);

export default router;
