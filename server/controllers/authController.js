import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, emailExists, createUser } from '../models/User.js';

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'כל השדות חובה' });

    if (await emailExists(email)) return res.status(409).json({ message: 'אימייל כבר קיים' });

    const hash = await bcrypt.hash(password, 10);
    await createUser(name, email, hash);

    res.status(201).json({ message: 'נרשמת בהצלחה' });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'שגיאת שרת פנימית' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'כל השדות חובה' });

    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'אימייל או סיסמה שגויים' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'אימייל או סיסמה שגויים' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.full_name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'שגיאת שרת פנימית' });
  }
}
