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

export const getBudgetData    = (eventId)               => fetch(`${API}/${eventId}/budget`, opts()).then(handle);
export const addBudgetItem    = (eventId, body)         => fetch(`${API}/${eventId}/budget`, opts('POST', body)).then(handle);
export const updateBudgetItem = (eventId, id, body)     => fetch(`${API}/${eventId}/budget/${id}`, opts('PUT', body)).then(handle);
export const deleteBudgetItem = (eventId, id)           => fetch(`${API}/${eventId}/budget/${id}`, opts('DELETE')).then(handle);
export const addPayment    = (eventId, itemId, body) => fetch(`${API}/${eventId}/budget/${itemId}/payments`, opts('POST', body)).then(handle);
export const deletePayment = (eventId, itemId, paymentId) => fetch(`${API}/${eventId}/budget/${itemId}/payments/${paymentId}`, opts('DELETE')).then(handle);
