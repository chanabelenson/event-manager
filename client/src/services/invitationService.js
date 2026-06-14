const API = '/api/invitation';

const opts = (method, body) => ({
  method: method || 'GET',
  headers: { 'Content-Type': 'application/json' },
  ...(body ? { body: JSON.stringify(body) } : {}),
});

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'שגיאה');
  return data;
};

export const getInvitation = (token) => fetch(`${API}/${token}`, opts()).then(handle);
export const updateInvitation = (token, fields) =>
  fetch(`${API}/${token}`, opts('PUT', fields)).then(handle);