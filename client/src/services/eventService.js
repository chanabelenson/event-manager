const API = '/api/events';

const opts = {
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
};

export async function getMyEvents() {
  const res = await fetch(API, { ...opts });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'שגיאה בטעינת אירועים');
  return data;
}

export async function createEvent(eventData) {
  const res = await fetch(API, {
    ...opts,
    method: 'POST',
    body: JSON.stringify(eventData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'שגיאה ביצירת אירוע');
  return data;
}

export async function deleteEvent(id) {
  const res = await fetch(`${API}/${id}`, {
    ...opts,
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'שגיאה במחיקת אירוע');
  return data;
}
