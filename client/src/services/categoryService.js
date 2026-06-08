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

export const getCategories = (eventId) => fetch(`${API}/${eventId}/categories`, opts()).then(handle);
export const addCategory = (eventId, category_name) => fetch(`${API}/${eventId}/categories`, opts('POST', { category_name })).then(handle);
export const deleteCategory = (eventId, categoryId) => fetch(`${API}/${eventId}/categories/${categoryId}`, opts('DELETE')).then(handle);
