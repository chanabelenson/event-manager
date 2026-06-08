import jwt from 'jsonwebtoken';
import { registerUser, authenticateUser, getUserProfile, listProducers } from '../services/authService.js';
import { AppError } from '../utils/AppError.js';

const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
};

const COOKIE_OPTIONS = { ...COOKIE_BASE, maxAge: 7 * 24 * 60 * 60 * 1000 };

export const register = async (req, res) => {
  const { name, email, password, role, phone, contact_email, bio } = req.body;
  if (!name || !email || !password) throw new AppError('כל השדות חובה', 400);

  await registerUser(name, email, password, role || 'owner', { phone, contact_email, bio });
  res.status(201).json({ message: 'נרשמת בהצלחה' });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError('כל השדות חובה', 400);

  const user = await authenticateUser(email, password);
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, COOKIE_OPTIONS);
  res.json({ user: { id: user.id, name: user.full_name, email: user.email, role: user.role } });
};

export function logout(req, res) {
  res.clearCookie('token', COOKIE_BASE);
  res.json({ message: 'התנתקת בהצלחה' });
}

export const getMe = async (req, res) => {
  const user = await getUserProfile(req.user.id);
  if (!user) throw new AppError('משתמש לא נמצא', 404);
  res.json({ user: { id: user.id, name: user.full_name, email: user.email, role: user.role } });
};

export const getProducers = async (req, res) => {
  const producers = await listProducers();
  res.json(producers);
};
