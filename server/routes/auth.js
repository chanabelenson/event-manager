import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import passwordRouter from './password.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authMiddleware, getMe);

router.use('/password', passwordRouter);

export default router;
