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

const PRODUCER_API = '/api/producer';
const EVENT_API = '/api/events';

export const getProducers        = ()                          => fetch(API, opts()).then(handle);
export const getProducerReviews  = (id)                        => fetch(`${API}/${id}/reviews`, opts()).then(handle);
export const getProducerDashboard= ()                          => fetch(`${PRODUCER_API}/dashboard`, opts()).then(handle);
export const getPendingRequests  = (params = {})               => fetch(`${PRODUCER_API}/requests?${new URLSearchParams({ status: 'pending', page: 1, limit: 10, ...params })}`, opts()).then(handle);
export const respondToRequest    = (id, action)                => fetch(`${PRODUCER_API}/requests/${id}`, opts('PUT', { action })).then(handle);
export const getEventProducer    = (eventId)                   => fetch(`${EVENT_API}/${eventId}/producers`, opts()).then(handle);
export const sendRequest         = (eventId, producer_id)      => fetch(`${EVENT_API}/${eventId}/producers`, opts('POST', { producer_id })).then(handle);
export const removeProducer      = (eventId)                   => fetch(`${EVENT_API}/${eventId}/producers`, opts('DELETE')).then(handle);
export const rateProducer        = (eventId, rating, review)   => fetch(`${EVENT_API}/${eventId}/producers`, opts('PUT', { rating, review })).then(handle);
export const getEventRequest     = (eventId)                   => fetch(`${EVENT_API}/${eventId}/producers/request`, opts()).then(handle);
export const cancelRequest       = (eventId)                   => fetch(`${EVENT_API}/${eventId}/producers/request`, opts('DELETE')).then(handle);
export const getUpdates          = (eventId)                   => fetch(`${EVENT_API}/${eventId}/producers/updates`, opts()).then(handle);
export const addUpdate           = (eventId, content)          => fetch(`${EVENT_API}/${eventId}/producers/updates`, opts('POST', { content })).then(handle);
export const markUpdateDone      = (eventId, updateId)         => fetch(`${EVENT_API}/${eventId}/producers/updates/${updateId}`, opts('PUT', { is_done: true })).then(handle);
