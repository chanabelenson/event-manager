import { Router } from 'express';
import { addPayment, deletePayment } from '../controllers/paymentsController.js';

const router = Router({ mergeParams: true });

router.post('/', addPayment);
router.delete('/:id', deletePayment);

export default router;
