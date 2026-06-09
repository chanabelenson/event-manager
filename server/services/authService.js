import bcrypt from 'bcrypt';
import * as User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { sendResetCodeEmail } from '../utils/email.js';

export async function registerUser(name, email, password) {
  const exists = await User.emailExists(email);
  if (exists) throw new AppError('אימייל כבר קיים', 409);

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.createUser(name, email, hashedPassword);
}

export async function authenticateUser(email, password) {
  const user = await User.findUserByEmail(email);
  if (!user) throw new AppError('אימייל או סיסמה שגויים', 401);

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new AppError('אימייל או סיסמה שגויים', 401);

  return user;
}

export async function getUserProfile(id) {
  return await User.findUserById(id);
}

export async function sendResetCode(userId) {
  const user = await User.findUserById(userId);
  if (!user) throw new AppError('משתמש לא נמצא', 404);

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await User.saveResetCode(userId, code, expiresAt);
  sendResetCodeEmail({ userEmail: user.email, userName: user.full_name, code });
}

export async function verifyResetCode(userId, code) {
  const resetEntry = await User.getResetCode(userId);
  if (!resetEntry) throw new AppError('לא נשלח קוד אימות', 400);
  if (new Date() > new Date(resetEntry.expires_at)) throw new AppError('הקוד פג תוקף, יש לשלוח קוד חדש', 400);
  if (resetEntry.code !== code) throw new AppError('הקוד שגוי', 400);
}

export async function changePassword(userId, code, currentPassword, newPassword) {
  const resetEntry = await User.getResetCode(userId);
  if (!resetEntry) throw new AppError('לא נשלח קוד אימות', 400);
  if (new Date() > new Date(resetEntry.expires_at)) throw new AppError('הקוד פג תוקף, יש לשלוח קוד חדש', 400);
  if (resetEntry.code !== code) throw new AppError('הקוד שגוי', 400);

  const currentHash = await User.getPasswordHash(userId);
  const isMatch = await bcrypt.compare(currentPassword, currentHash);
  if (!isMatch) throw new AppError('הסיסמה הנוכחית שגויה', 401);

  const newHash = await bcrypt.hash(newPassword, 10);
  await User.updatePassword(userId, newHash);
  await User.deleteResetCode(userId);
}
