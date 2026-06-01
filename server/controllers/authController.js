import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'כל השדות חובה' });

  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length) return res.status(409).json({ message: 'אימייל כבר קיים' });

  const hash = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash]);

  res.status(201).json({ message: 'נרשמת בהצלחה' });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'כל השדות חובה' });

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (!rows.length) return res.status(401).json({ message: 'אימייל או סיסמה שגויים' });

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'אימייל או סיסמה שגויים' });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
}
