import { Router } from 'express';
import { getMyEvents, createEvent } from '../controllers/eventsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware); // כל הנתיבים כאן דורשים התחברות

router.get('/', getMyEvents);
router.post('/', createEvent);

export default router;
