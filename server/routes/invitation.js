import { Router } from 'express';
import { getInvitation, updateInvitation } from '../controllers/invitationController.js';
import invitationGiftsRouter from './invitationGifts.js';

const router = Router();

router.get('/:token', getInvitation);
router.put('/:token', updateInvitation);

router.use('/:token/gifts', invitationGiftsRouter);

export default router;
