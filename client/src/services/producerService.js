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

export const getProducers        = ()                        => fetch(API, opts()).then(handle);
export const getProducerReviews  = (producerId)              => fetch(`${API}/${producerId}/reviews`, opts()).then(handle);
export const getProducerDashboard= ()                        => fetch(`${API}/dashboard`, opts()).then(handle);
export const getEventProducer    = (eventId)                 => fetch(`${API}/event/${eventId}`, opts()).then(handle);
export const removeProducer      = (eventId)                 => fetch(`${API}/event/${eventId}`, opts('DELETE')).then(handle);
export const rateProducer        = (eventId, rating, review) => fetch(`${API}/event/${eventId}/rate`, opts('POST', { rating, review })).then(handle);
export const getEventRequest     = (eventId)                 => fetch(`${API}/event/${eventId}/request`, opts()).then(handle);
export const sendRequest         = (eventId, producer_id)    => fetch(`${API}/event/${eventId}/request`, opts('POST', { producer_id })).then(handle);
export const cancelRequest       = (eventId)                 => fetch(`${API}/event/${eventId}/request`, opts('DELETE')).then(handle);
export const getPendingRequests  = ()                        => fetch(`${API}/requests`, opts()).then(handle);
export const respondToRequest    = (requestId, action)       => fetch(`${API}/requests/${requestId}/respond`, opts('POST', { action })).then(handle);
export const getUpdates          = (eventId)                 => fetch(`${API}/event/${eventId}/updates`, opts()).then(handle);
export const addUpdate           = (eventId, content)        => fetch(`${API}/event/${eventId}/updates`, opts('POST', { content })).then(handle);
export const markUpdateDone      = (eventId, updateId)       => fetch(`${API}/event/${eventId}/updates/${updateId}/done`, opts('PATCH')).then(handle);
