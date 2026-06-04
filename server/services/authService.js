import bcrypt from 'bcrypt';
import * as User from '../models/User.js';

export async function registerUser(name, email, password) {
  if (!name || !email || !password) {
    throw new Error('Missing required fields');
  }

  const exists = await User.emailExists(email);
  if (exists) {
    return { success: false, code: 409, message: 'אימייל כבר קיים' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await User.createUser(name, email, hashedPassword);

  return { success: true, userId };
}

export async function authenticateUser(email, password) {
  const user = await User.findUserByEmail(email);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) return null;

  return user;
}

export async function getUserProfile(id) {
  return await User.findUserById(id);
}
