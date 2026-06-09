import { Router } from 'express';
import { register, login, logout, getMe, getProducers, sendResetCode, verifyResetCode, changePassword } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authMiddleware, getMe);
router.post('/send-reset-code', authMiddleware, sendResetCode);
router.post('/verify-reset-code', authMiddleware, verifyResetCode);
router.put('/change-password', authMiddleware, changePassword);
router.get('/producers', authMiddleware, getProducers);

export default router;
