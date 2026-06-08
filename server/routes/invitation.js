import { Router } from 'express';
import { getInvitation, updateInvitationStatus } from '../controllers/invitationController.js';
import { getGiftsForGuest, claimGift, unclaimGift } from '../controllers/invitationGiftsController.js';

const router = Router();

router.get('/:token', getInvitation);
router.patch('/:token/status', updateInvitationStatus);

router.get('/:token/gifts', getGiftsForGuest);
router.patch('/:token/gifts/:giftId/claim', claimGift);
router.patch('/:token/gifts/:giftId/unclaim', unclaimGift);

export default router;
