const base = (eventId) => `/api/events/${eventId}/gifts`;

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'שגיאה');
  return data;
};

const opts = (method, body) => ({
  method: method || 'GET',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  ...(body ? { body: JSON.stringify(body) } : {}),
});

export const getGifts = (eventId) =>
  fetch(base(eventId), opts()).then(handle);

export const addGift = (eventId, body) =>
  fetch(base(eventId), opts('POST', body)).then(handle);

export const deleteGift = (eventId, giftId) =>
  fetch(`${base(eventId)}/${giftId}`, opts('DELETE')).then(handle);
