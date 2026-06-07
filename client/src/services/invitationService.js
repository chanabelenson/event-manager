const API = '/api/invitation';

// פונקציית עזר מקומית מותאמת לאורחים אנונימיים (ללא credentials)
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
export const updateInvitationStatus = (token, status, confirmed_count) =>
  fetch(`${API}/${token}/status`, opts('PATCH', { status, confirmed_count })).then(handle);