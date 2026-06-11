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

export const getGuests = (eventId) => fetch(`${API}/${eventId}/guests`, opts()).then(handle);
export const addGuest = (eventId, body) => fetch(`${API}/${eventId}/guests`, opts('POST', body)).then(handle);
export const updateGuest = (eventId, id, fields) => fetch(`${API}/${eventId}/guests/${id}`, opts('PUT', fields)).then(handle);
export const autoArrangeSave = (eventId, assignments) => fetch(`${API}/${eventId}/guests`, opts('PUT', { assignments })).then(handle);
export const deleteGuest = (eventId, id) => fetch(`${API}/${eventId}/guests/${id}`, opts('DELETE')).then(handle);
export const getAssignments = (eventId) => fetch(`${API}/${eventId}/guests?include=assignments`, opts()).then(handle);
