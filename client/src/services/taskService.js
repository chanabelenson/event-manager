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

export const getTasks = (eventId) => fetch(`${API}/${eventId}/tasks`, opts()).then(handle);
export const addTask = (eventId, body) => fetch(`${API}/${eventId}/tasks`, opts('POST', body)).then(handle);
export const updateTask = (eventId, id, body) => fetch(`${API}/${eventId}/tasks/${id}`, opts('PUT', body)).then(handle);
export const deleteTask = (eventId, id) => fetch(`${API}/${eventId}/tasks/${id}`, opts('DELETE')).then(handle);
