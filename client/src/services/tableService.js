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

export const getTables = (eventId) => fetch(`${API}/${eventId}/tables`, opts()).then(handle);
export const addTable = (eventId, body) => fetch(`${API}/${eventId}/tables`, opts('POST', body)).then(handle);
export const deleteTable = (eventId, id) => fetch(`${API}/${eventId}/tables/${id}`, opts('DELETE')).then(handle);
