import { Router } from 'express';
import { getGifts, addGift, deleteGift } from '../controllers/giftsController.js';

const router = Router({ mergeParams: true });

router.get('/', getGifts);
router.post('/', addGift);
router.delete('/:giftId', deleteGift);

export default router;
