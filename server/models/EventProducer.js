import pool from '../config/db.js';

export async function getEventProducer(eventId) {
  const [rows] = await pool.query(
    `SELECT u.id, u.full_name, u.email, pp.phone, pp.contact_email, pp.bio,
            ep.rating, ep.review
     FROM event_producers ep
     JOIN users u ON u.id = ep.producer_id
     LEFT JOIN producer_profiles pp ON pp.user_id = u.id
     WHERE ep.event_id = ?`,
    [eventId]
  );
  return rows[0] || null;
}

export async function assignProducer(eventId, producerId) {
  await pool.query(
    `INSERT INTO event_producers (event_id, producer_id) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE producer_id = VALUES(producer_id)`,
    [eventId, producerId]
  );
}

export async function removeProducer(eventId) {
  await pool.query('DELETE FROM event_producers WHERE event_id = ?', [eventId]);
}

export async function rateProducer(eventId, ownerId, rating, review) {
  const [rows] = await pool.query(
    'SELECT id FROM events WHERE id = ? AND user_id = ?',
    [eventId, ownerId]
  );
  if (!rows.length) return false;

  await pool.query(
    'UPDATE event_producers SET rating = ?, review = ? WHERE event_id = ?',
    [rating, review || null, eventId]
  );
  return true;
}

export async function getProducerReviews(producerId) {
  const [rows] = await pool.query(
    `SELECT ep.rating, ep.review, e.event_name
     FROM event_producers ep
     JOIN events e ON e.id = ep.event_id
     WHERE ep.producer_id = ? AND ep.rating IS NOT NULL
     ORDER BY e.event_date DESC`,
    [producerId]
  );
  return rows;
}

export async function getProducerEvents(producerId) {
  const [rows] = await pool.query(
    `SELECT e.id, e.event_name, e.event_date, e.location_name,
            (SELECT COALESCE(SUM(CASE WHEN g.confirmed_count IS NOT NULL THEN g.confirmed_count ELSE g.guests_count END), 0)
             FROM guests g JOIN guest_statuses gs ON gs.id = g.status_id
             WHERE g.event_id = e.id AND gs.status_name = 'confirmed') as confirmed_count,
            (SELECT COALESCE(SUM(g.guests_count), 0)
             FROM guests g JOIN guest_statuses gs ON gs.id = g.status_id
             WHERE g.event_id = e.id AND gs.status_name = 'pending') as pending_count
     FROM event_producers ep
     JOIN events e ON e.id = ep.event_id
     WHERE ep.producer_id = ?
     ORDER BY e.event_date ASC`,
    [producerId]
  );
  return rows;
}
