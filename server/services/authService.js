import bcrypt from 'bcrypt';
import * as User from '../models/User.js';
import { AppError } from '../utils/AppError.js';

export async function registerUser(name, email, password, role = 'owner', producerData = {}) {
  const exists = await User.emailExists(email);
  if (exists) throw new AppError('אימייל כבר קיים', 409);
  if (!['owner', 'producer'].includes(role)) throw new AppError('תפקיד לא תקין', 400);

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await User.createUser(name, email, hashedPassword, role);

  if (role === 'producer') {
    await User.createProducerProfile(userId, producerData);
  }
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

export async function listProducers() {
  return await User.getAllProducers();
}
