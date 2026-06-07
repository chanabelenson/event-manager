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
export const toggleTask = (id, is_completed) => fetch(`${API}/tasks/${id}/toggle`, opts('PATCH', { is_completed })).then(handle);
export const updateTask = (id, body) => fetch(`${API}/tasks/${id}`, opts('PUT', body)).then(handle);
export const deleteTask = (id) => fetch(`${API}/tasks/${id}`, opts('DELETE')).then(handle);
