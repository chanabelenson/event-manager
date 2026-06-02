import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const COOKIE_OPTIONS = {
  httpOnly: true,       // JavaScript בקליינט לא יכול לגשת
  secure: process.env.NODE_ENV === 'production', // HTTPS בלבד בפרודקשן
  sameSite: 'strict',   // הגנה מ-CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ימים
};

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'כל השדות חובה' });

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ message: 'אימייל כבר קיים' });

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hash]
    );

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

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'אימייל או סיסמה שגויים' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'אימייל או סיסמה שגויים' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, COOKIE_OPTIONS);
    res.json({ user: { id: user.id, name: user.full_name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'שגיאת שרת פנימית' });
  }
}

export async function logout(req, res) {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.json({ message: 'התנתקת בהצלחה' });
}

export async function getMe(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, full_name, email FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'משתמש לא נמצא' });
    res.json({ user: { id: rows[0].id, name: rows[0].full_name, email: rows[0].email } });
  } catch (err) {
    console.error('getMe error:', err.message);
    res.status(500).json({ message: 'שגיאת שרת פנימית' });
  }
}
