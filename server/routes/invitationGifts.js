import { Router } from 'express';
import { getGiftsForGuest, updateGiftClaim } from '../controllers/invitationGiftsController.js';

const router = Router({ mergeParams: true });

router.get('/', getGiftsForGuest);
router.put('/:giftId', updateGiftClaim);

export default router;
