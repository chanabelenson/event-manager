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
export const updateGuestStatus = (id, status) => fetch(`${API}/guests/${id}/status`, opts('PATCH', { status })).then(handle);
export const updateGuestTable = (id, table_id) => fetch(`${API}/guests/${id}/table`, opts('PATCH', { table_id })).then(handle);
export const autoArrangeSave = (assignments) => fetch(`${API}/guests/auto-arrange`, opts('POST', { assignments })).then(handle);
export const deleteGuest = (id) => fetch(`${API}/guests/${id}`, opts('DELETE')).then(handle);
