const base = (token) => `/api/invitation/${token}/gifts`;

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'שגיאה');
  return data;
};

export const getGiftsForGuest = (token) =>
  fetch(base(token)).then(handle);

export const claimGift = (token, giftId) =>
  fetch(`${base(token)}/${giftId}/claim`, { method: 'PATCH' }).then(handle);

export const unclaimGift = (token, giftId) =>
  fetch(`${base(token)}/${giftId}/unclaim`, { method: 'PATCH' }).then(handle);
