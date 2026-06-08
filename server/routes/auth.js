import { Router } from 'express';
import { register, login, logout, getMe, getProducers } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authMiddleware, getMe);
router.get('/producers', authMiddleware, getProducers);

export default router;
