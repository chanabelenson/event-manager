const API = '/api/invitation';

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'שגיאה');
  return data;
};

export async function getInvitation(token) {
  return fetch(`${API}/${token}`).then(handle);
}

export async function updateInvitationStatus(token, status) {
  return fetch(`${API}/${token}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  }).then(handle);
}
