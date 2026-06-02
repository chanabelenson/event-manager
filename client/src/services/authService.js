const API = '/api/auth';

const opts = {
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
};

export async function register(name, email, password) {
  const res = await fetch(`${API}/register`, {
    ...opts,
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'שגיאה בהרשמה');
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${API}/login`, {
    ...opts,
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'שגיאה בהתחברות');
  return data;
}

export async function logout() {
  await fetch(`${API}/logout`, { ...opts, method: 'POST' });
}

export async function getMe() {
  const res = await fetch(`${API}/me`, { ...opts });
  if (!res.ok) return null;
  const data = await res.json();
  return data.user;
}
