import { Router } from 'express';
import { requireRole } from '../middleware/auth.js';
import { getEventProducer, removeProducer, updateEventProducer } from '../controllers/producerController.js';
import { getEventRequest, sendRequest, cancelRequest } from '../controllers/producerRequestController.js';
import updatesRouter from './updatesRouter.js';

// ── event producer router ────────────────────────
const router = Router({ mergeParams: true });
router.use(requireRole('owner'));

// ה-CRUD הבסיסי של המפיק באירוע
router.get('/', getEventProducer);
router.put('/', updateEventProducer);  // כולל דירוג או עדכון
router.delete('/', removeProducer);    // הסרת המפיק מהאירוע

// ראוטר מקונן עבור בקשות ספציפיות לאירוע הזה
const eventRequestRouter = Router({ mergeParams: true });
eventRequestRouter.get('/', getEventRequest);
eventRequestRouter.post('/', sendRequest);     // העברנו את ה-POST של שליחת הבקשה לכאן!
eventRequestRouter.delete('/', cancelRequest); // ביטול בקשה

router.use('/request', eventRequestRouter);
router.use('/updates', updatesRouter);

export default router;
