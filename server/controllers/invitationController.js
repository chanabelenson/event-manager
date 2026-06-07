import * as InvitationService from '../services/invitationService.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

export const getInvitation = asyncHandler(async (req, res) => {
  const guest = await InvitationService.getInvitation(req.params.token);
  if (!guest) throw new AppError('הזמנה לא נמצאה', 404);

  res.json({
    ...guest,
    deadline_passed: new Date(guest.event_date).getTime() - Date.now() < TWO_DAYS_MS,
  });
});

export const updateInvitationStatus = asyncHandler(async (req, res) => {
  await InvitationService.updateInvitationStatus(req.params.token, req.body.status);
  res.json({ message: 'סטטוס עודכן בהצלחה' });
});
