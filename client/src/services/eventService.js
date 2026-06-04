const API = '/api/events';

const opts = (method, body) => ({
  method: method || 'GET',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  ...(body ? { body: JSON.stringify(body) } : {}),
});

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'שגיאה');
  return data;
};

export const getMyEvents = () => fetch(API, opts()).then(handle);
export const getEvent = (id) => fetch(`${API}/${id}`, opts()).then(handle);
export const createEvent = (body) => fetch(API, opts('POST', body)).then(handle);
export const deleteEvent = (id) => fetch(`${API}/${id}`, opts('DELETE')).then(handle);

// Guests
export const getGuests = (eventId) => fetch(`${API}/${eventId}/guests`, opts()).then(handle);
export const addGuest = (eventId, body) => fetch(`${API}/${eventId}/guests`, opts('POST', body)).then(handle);
export const updateGuestStatus = (id, status) => fetch(`${API}/guests/${id}/status`, opts('PATCH', { status })).then(handle);
export const updateGuestTable = (id, table_id) => fetch(`${API}/guests/${id}/table`, opts('PATCH', { table_id })).then(handle);
export const deleteGuest = (id) => fetch(`${API}/guests/${id}`, opts('DELETE')).then(handle);

// Tables
export const getTables = (eventId) => fetch(`${API}/${eventId}/tables`, opts()).then(handle);
export const addTable = (eventId, body) => fetch(`${API}/${eventId}/tables`, opts('POST', body)).then(handle);
export const deleteTable = (id) => fetch(`${API}/tables/${id}`, opts('DELETE')).then(handle);

// Tasks
export const getTasks = (eventId) => fetch(`${API}/${eventId}/tasks`, opts()).then(handle);
export const addTask = (eventId, body) => fetch(`${API}/${eventId}/tasks`, opts('POST', body)).then(handle);
export const toggleTask = (id, is_completed) => fetch(`${API}/tasks/${id}/toggle`, opts('PATCH', { is_completed })).then(handle);
export const updateTask = (id, body) => fetch(`${API}/tasks/${id}`, opts('PUT', body)).then(handle);
export const deleteTask = (id) => fetch(`${API}/tasks/${id}`, opts('DELETE')).then(handle);
