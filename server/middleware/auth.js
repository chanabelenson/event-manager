import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'לא מורשה' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'טוקן לא תקין או פג תוקף' });
  }
}
