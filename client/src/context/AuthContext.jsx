import { createContext, useContext, useState } from 'react';
import { getToken, logout as logoutService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());

  const login = (newToken) => setToken(newToken);
  const logout = () => { logoutService(); setToken(null); };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
