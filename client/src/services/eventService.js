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
export const updateEvent = (id, fields) => fetch(`${API}/${id}`, opts('PUT', fields)).then(handle);
export const deleteEvent = (id) => fetch(`${API}/${id}`, opts('DELETE')).then(handle);
