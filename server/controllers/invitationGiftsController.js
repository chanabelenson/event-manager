import * as Gift from '../models/Gift.js';
import { getGuestByToken } from '../models/Guest.js';
import { AppError } from '../utils/AppError.js';

export const getGiftsForGuest = async (req, res) => {
  const guest = await getGuestByToken(req.params.token);
  if (!guest) throw new AppError('הזמנה לא נמצאה', 404);
  const gifts = await Gift.getGiftsForGuest(guest.event_id, guest.id);
  res.json(gifts);
};

export const updateGiftClaim = async (req, res) => {
  const guest = await getGuestByToken(req.params.token);
  if (!guest) throw new AppError('הזמנה לא נמצאה', 404);

  const { claimed } = req.body;
  if (claimed) {
    const success = await Gift.claimGift(req.params.giftId, guest.id);
    if (!success) throw new AppError('המתנה כבר נתבעה על ידי מישהו אחר', 409);
  } else {
    await Gift.unclaimGift(req.params.giftId, guest.id);
  }
  res.json({ message: 'עודכן' });
};
