import { getToken } from './authService';

const API = 'http://localhost:5000/api/events';

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

export async function getMyEvents() {
  const res = await fetch(API, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'שגיאה בטעינת אירועים');
  return data;
}

export async function createEvent(eventData) {
  const res = await fetch(API, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(eventData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'שגיאה ביצירת אירוע');
  return data;
}
