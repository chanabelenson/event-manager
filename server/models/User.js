import pool from '../config/db.js';
import { ROLES } from '../utils/constants.js';

export async function findUserByEmail(email) {
  const [rows] = await pool.query(
    `SELECT u.id, u.full_name, u.email, ur.role_name AS role, up.password_hash
     FROM users u
     JOIN user_roles ur ON ur.id = u.role_id
     JOIN user_passwords up ON up.user_id = u.id
     WHERE u.email = ?`,
    [email]
  );
  return rows[0] || null;
}

export async function findUserById(id) {
  const [rows] = await pool.query(
    `SELECT u.id, u.full_name, u.email, ur.role_name AS role,
            pp.phone, pp.contact_email, pp.bio
     FROM users u
     JOIN user_roles ur ON ur.id = u.role_id
     LEFT JOIN producer_profiles pp ON pp.user_id = u.id
     WHERE u.id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function emailExists(email) {
  const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  return rows.length > 0;
}

export async function getPasswordHash(userId) {
  const [rows] = await pool.query('SELECT password_hash FROM user_passwords WHERE user_id = ?', [userId]);
  return rows[0]?.password_hash || null;
}

export async function updatePassword(userId, hashedPassword) {
  await pool.query('UPDATE user_passwords SET password_hash = ? WHERE user_id = ?', [hashedPassword, userId]);
}

export async function saveResetCode(userId, code, expiresAt) {
  await pool.query(
    'INSERT INTO password_reset_codes (user_id, code, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE code = ?, expires_at = ?',
    [userId, code, expiresAt, code, expiresAt]
  );
}

export async function getResetCode(userId) {
  const [rows] = await pool.query('SELECT code, expires_at FROM password_reset_codes WHERE user_id = ?', [userId]);
  return rows[0] || null;
}

export async function deleteResetCode(userId) {
  await pool.query('DELETE FROM password_reset_codes WHERE user_id = ?', [userId]);
}

export async function createUser(name, email, hashedPassword, roleId = ROLES.OWNER) {
  const [result] = await pool.query(
    'INSERT INTO users (full_name, email, role_id) VALUES (?, ?, ?)',
    [name, email, roleId]
  );
  const userId = result.insertId;
  await pool.query(
    'INSERT INTO user_passwords (user_id, password_hash) VALUES (?, ?)',
    [userId, hashedPassword]
  );
  return userId;
}

export async function createProducerProfile(userId, { phone, contact_email, bio }) {
  await pool.query(
    'INSERT INTO producer_profiles (user_id, phone, contact_email, bio) VALUES (?, ?, ?, ?)',
    [userId, phone || null, contact_email || null, bio || null]
  );
}

export async function getAllProducers() {
  const [rows] = await pool.query(
    `SELECT u.id, u.full_name, u.email, pp.phone, pp.contact_email, pp.bio,
            ROUND(AVG(ep.rating), 1) as avg_rating, COUNT(ep.rating) as rating_count
     FROM users u
     JOIN producer_profiles pp ON pp.user_id = u.id
     LEFT JOIN event_producers ep ON ep.producer_id = u.id
     WHERE u.role_id = ?
     GROUP BY u.id, u.full_name, u.email, pp.phone, pp.contact_email, pp.bio`,
    [ROLES.PRODUCER]
  );
  return rows;
}
