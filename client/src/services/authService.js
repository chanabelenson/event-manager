const API = 'http://localhost:5000/api/auth';

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'שגיאה');
  return data;
};

export async function register(name, email, password) {
  return fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, email, password }),
  }).then(handle);
}

export async function login(email, password) {
  return fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  }).then(handle);
}

export async function logout() {
  return fetch(`${API}/logout`, {
    method: 'POST',
    credentials: 'include',
  }).then(handle);
}

export async function getMe() {
  return fetch(`${API}/me`, {
    credentials: 'include',
  }).then(handle);
}
