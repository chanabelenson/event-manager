import { Router } from 'express';
import { sendResetCode, verifyResetCode, changePassword } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/reset-request', authMiddleware, sendResetCode);
router.post('/verify', authMiddleware, verifyResetCode);
router.put('/change', authMiddleware, changePassword);

export default router;
