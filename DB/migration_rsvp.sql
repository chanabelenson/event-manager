-- Migration: add rsvp_deadline to events, confirmed_count to guests
ALTER TABLE events ADD COLUMN IF NOT EXISTS rsvp_deadline DATE DEFAULT NULL;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS confirmed_count INT DEFAULT NULL;
