import bcrypt from 'bcrypt';
import * as User from '../models/User.js';
import { AppError } from '../utils/AppError.js';

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
