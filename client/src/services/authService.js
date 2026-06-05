const API = '/api/auth';

// פונקציית העזר שמייצרת את האפשרויות ומכניסה אוטומטית אבטחה (credentials)
const opts = (method, body) => ({
  method: method || 'GET',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // קריטי לניהול ה-Session של המשתמש המחובר
  ...(body ? { body: JSON.stringify(body) } : {}),
});

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'שגיאה');
  return data;
};

export const register = (name, email, password) => fetch(`${API}/register`, opts('POST', { name, email, password })).then(handle);
export const login = (email, password) => fetch(`${API}/login`, opts('POST', { email, password })).then(handle);
export const logout = () => fetch(`${API}/logout`, opts('POST')).then(handle);
export const getMe = () => fetch(`${API}/me`, opts()).then(handle);