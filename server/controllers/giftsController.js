import * as Gift from '../models/Gift.js';
import * as Event from '../models/Event.js';
import { AppError } from '../utils/AppError.js';

export const getGifts = async (req, res, next) => {
  try {
    const gifts = await Gift.getGifts(req.params.eventId);
    res.json(gifts);
  } catch (err) { next(err); }
};

export const addGift = async (req, res, next) => {
  try {
    const { name, description, link } = req.body;
    if (!name) return next(new AppError('שם המתנה חובה', 400));
    const id = await Gift.addGift(req.params.eventId, { name, description, link });
    res.status(201).json({ id, name, description: description || null, link: link || null, claimed_by: null, claimed_by_name: null });
  } catch (err) { next(err); }
};

export const deleteGift = async (req, res, next) => {
  try {
    const claimed = await Gift.isClaimed(req.params.giftId);
    if (claimed) return next(new AppError('לא ניתן למחוק מתנה שכבר נתבעה', 409));
    await Gift.deleteGift(req.params.giftId);
    res.json({ message: 'המתנה נמחקה' });
  } catch (err) { next(err); }
};
