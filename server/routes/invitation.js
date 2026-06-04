import { Router } from 'express';
import { getInvitation, updateInvitationStatus } from '../controllers/invitationController.js';

const router = Router();

router.get('/:token', getInvitation);
router.patch('/:token/status', updateInvitationStatus);

export default router;
