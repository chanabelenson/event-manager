import * as InvitationService from '../services/invitationService.js';
import { AppError } from '../utils/AppError.js';

export const getInvitation = async (req, res) => {
  const guest = await InvitationService.getInvitation(req.params.token);
  if (!guest) throw new AppError('הזמנה לא נמצאה', 404);
  res.json(guest);
};

export const updateInvitationStatus = async (req, res) => {
  await InvitationService.updateInvitationStatus(req.params.token, req.body.status, req.body.confirmed_count);
  res.json({ message: 'סטטוס עודכן בהצלחה' });
};
