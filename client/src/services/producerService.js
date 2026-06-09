const API = '/api/producers';

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

export const getProducers = () => fetch(API, opts()).then(handle);
export const getProducerDashboard = () => fetch(`${API}/dashboard`, opts()).then(handle);
export const getEventProducer = (eventId) => fetch(`${API}/event/${eventId}`, opts()).then(handle);
export const assignProducer = (eventId, producer_id) => fetch(`${API}/event/${eventId}`, opts('POST', { producer_id })).then(handle);
export const removeProducer = (eventId) => fetch(`${API}/event/${eventId}`, opts('DELETE')).then(handle);
export const rateProducer = (eventId, rating, review) => fetch(`${API}/event/${eventId}/rate`, opts('POST', { rating, review })).then(handle);
