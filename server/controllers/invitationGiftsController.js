import * as Gift from '../models/Gift.js';
import { getGuestByToken } from '../models/Guest.js';
import { AppError } from '../utils/AppError.js';

export const getGiftsForGuest = async (req, res, next) => {
  try {
    const guest = await getGuestByToken(req.params.token);
    if (!guest) return next(new AppError('הזמנה לא נמצאה', 404));
    const gifts = await Gift.getGiftsForGuest(guest.event_id, guest.id);
    res.json(gifts);
  } catch (err) { next(err); }
};

export const claimGift = async (req, res, next) => {
  try {
    const guest = await getGuestByToken(req.params.token);
    if (!guest) return next(new AppError('הזמנה לא נמצאה', 404));

    const success = await Gift.claimGift(req.params.giftId, guest.id);
    if (!success) return next(new AppError('המתנה כבר נתבעה על ידי מישהו אחר', 409));

    res.json({ message: 'המתנה סומנה בהצלחה' });
  } catch (err) { next(err); }
};

export const unclaimGift = async (req, res, next) => {
  try {
    const guest = await getGuestByToken(req.params.token);
    if (!guest) return next(new AppError('הזמנה לא נמצאה', 404));

    await Gift.unclaimGift(req.params.giftId, guest.id);
    res.json({ message: 'הסימון הוסר' });
  } catch (err) { next(err); }
};
