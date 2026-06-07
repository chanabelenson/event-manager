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
export const updateGuestStatus = (eventId, id, status) => fetch(`${API}/${eventId}/guests/${id}/status`, opts('PATCH', { status })).then(handle);
export const updateGuestTable = (eventId, id, table_id) => fetch(`${API}/${eventId}/guests/${id}/table`, opts('PATCH', { table_id })).then(handle);
export const autoArrangeSave = (eventId, assignments) => fetch(`${API}/${eventId}/guests/auto-arrange`, opts('POST', { assignments })).then(handle);
export const deleteGuest = (eventId, id) => fetch(`${API}/${eventId}/guests/${id}`, opts('DELETE')).then(handle);
