import pool from '../config/db.js';

export async function findUserByEmail(email) {
  const [rows] = await pool.query(
    `SELECT u.*, up.password_text as password_hash
     FROM users u
     JOIN user_passwords up ON up.user_id = u.id
     WHERE u.email = ?`,
    [email]
  );
  return rows[0] || null;
}

export async function findUserById(id) {
  const [rows] = await pool.query('SELECT id, full_name, email FROM users WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function emailExists(email) {
  const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  return rows.length > 0;
}

export async function createUser(name, email, hashedPassword) {
  const [result] = await pool.query(
    'INSERT INTO users (full_name, email) VALUES (?, ?)',
    [name, email]
  );
  const userId = result.insertId;
  await pool.query(
    'INSERT INTO user_passwords (user_id, password_text) VALUES (?, ?)',
    [userId, hashedPassword]
  );
  return userId;
}
