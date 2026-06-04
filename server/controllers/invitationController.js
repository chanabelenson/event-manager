import { getGuestByToken, updateGuestStatusByToken } from '../models/Guest.js';

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

function isDeadlinePassed(eventDate) {
  return new Date(eventDate).getTime() - Date.now() < TWO_DAYS_MS;
}

export async function getInvitation(req, res) {
  try {
    const guest = await getGuestByToken(req.params.token);
    if (!guest) return res.status(404).json({ message: 'הזמנה לא נמצאה' });

    res.json({
      ...guest,
      deadline_passed: isDeadlinePassed(guest.event_date),
    });
  } catch (err) {
    console.error('getInvitation error:', err.message);
    res.status(500).json({ message: 'שגיאת שרת פנימית' });
  }
}

export async function updateInvitationStatus(req, res) {
  try {
    const { status } = req.body;
    if (!['confirmed', 'declined'].includes(status))
      return res.status(400).json({ message: 'סטטוס לא תקין' });

    const guest = await getGuestByToken(req.params.token);
    if (!guest) return res.status(404).json({ message: 'הזמנה לא נמצאה' });

    if (isDeadlinePassed(guest.event_date))
      return res.status(403).json({ message: 'לא ניתן לשנות אישור הגעה פחות מיומיים לפני האירוע' });

    await updateGuestStatusByToken(req.params.token, status);
    res.json({ message: 'סטטוס עודכן בהצלחה' });
  } catch (err) {
    console.error('updateInvitationStatus error:', err.message);
    res.status(500).json({ message: 'שגיאת שרת פנימית' });
  }
}
