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
  const [rows] = await pool.query(
    `SELECT u.id, u.full_name, u.email, u.role, pp.phone, pp.contact_email, pp.bio
     FROM users u
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

export async function createUser(name, email, hashedPassword, role = 'owner') {
  const [result] = await pool.query(
    'INSERT INTO users (full_name, email, role) VALUES (?, ?, ?)',
    [name, email, role]
  );
  const userId = result.insertId;
  await pool.query(
    'INSERT INTO user_passwords (user_id, password_text) VALUES (?, ?)',
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
     WHERE u.role = 'producer'
     GROUP BY u.id, u.full_name, u.email, pp.phone, pp.contact_email, pp.bio`,
  );
  return rows;
}
