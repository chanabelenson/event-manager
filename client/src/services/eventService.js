import { getToken } from './authService';

const API = 'http://localhost:5000/api/events';

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'שגיאה');
  return data;
};

export const getMyEvents = () => fetch(API, { headers: authHeaders() }).then(handle);
export const getEvent = (id) => fetch(`${API}/${id}`, { headers: authHeaders() }).then(handle);
export const createEvent = (body) => fetch(API, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }).then(handle);

// Guests
export const getGuests = (eventId) => fetch(`${API}/${eventId}/guests`, { headers: authHeaders() }).then(handle);
export const addGuest = (eventId, body) => fetch(`${API}/${eventId}/guests`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }).then(handle);
export const updateGuestStatus = (id, status) => fetch(`${API}/guests/${id}/status`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status }) }).then(handle);
export const updateGuestTable = (id, table_id) => fetch(`${API}/guests/${id}/table`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ table_id }) }).then(handle);
export const deleteGuest = (id) => fetch(`${API}/guests/${id}`, { method: 'DELETE', headers: authHeaders() }).then(handle);

// Tables
export const getTables = (eventId) => fetch(`${API}/${eventId}/tables`, { headers: authHeaders() }).then(handle);
export const addTable = (eventId, body) => fetch(`${API}/${eventId}/tables`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }).then(handle);
export const deleteTable = (id) => fetch(`${API}/tables/${id}`, { method: 'DELETE', headers: authHeaders() }).then(handle);

// Tasks
export const getTasks = (eventId) => fetch(`${API}/${eventId}/tasks`, { headers: authHeaders() }).then(handle);
export const addTask = (eventId, body) => fetch(`${API}/${eventId}/tasks`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }).then(handle);
export const toggleTask = (id, is_completed) => fetch(`${API}/tasks/${id}/toggle`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ is_completed }) }).then(handle);
export const updateTask = (id, body) => fetch(`${API}/tasks/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(body) }).then(handle);
export const deleteTask = (id) => fetch(`${API}/tasks/${id}`, { method: 'DELETE', headers: authHeaders() }).then(handle);
