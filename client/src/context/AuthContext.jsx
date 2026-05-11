import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const rawUser = localStorage.getItem('auction_user');
    return rawUser ? JSON.parse(rawUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('auction_token'));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('auction_token')));

  useEffect(() => {
    const loadMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
        localStorage.setItem('auction_user', JSON.stringify(data.user));
      } catch {
        localStorage.removeItem('auction_token');
        localStorage.removeItem('auction_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadMe();
  }, [token]);

  const saveSession = (payload) => {
    localStorage.setItem('auction_token', payload.token);
    localStorage.setItem('auction_user', JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  };

  const login = async (formData) => {
    const { data } = await api.post('/auth/login', formData);
    saveSession(data);
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    saveSession(data);
  };

  const logout = () => {
    localStorage.removeItem('auction_token');
    localStorage.removeItem('auction_user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, isAuthenticated: Boolean(token), login, register, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
