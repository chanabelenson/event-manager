const base = (token) => `/api/invitation/${token}/gifts`;

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'שגיאה');
  return data;
};

export const getGiftsForGuest = (token) =>
  fetch(base(token)).then(handle);

export const updateGiftClaim = (token, giftId, claimed) =>
  fetch(`${base(token)}/${giftId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ claimed }) }).then(handle);
