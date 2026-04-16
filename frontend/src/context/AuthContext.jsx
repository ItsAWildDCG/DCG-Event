import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function applySession(result) {
    if (result?.token) {
      localStorage.setItem('dcg_token', result.token);
    }

    if (result?.user) {
      setUser(result.user);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('dcg_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .me()
      .then((me) => setUser(me))
      .catch(() => {
        localStorage.removeItem('dcg_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      async refreshUser() {
        const me = await api.me();
        setUser(me);
        return me;
      },
      async login(email, password) {
        const result = await api.login({ email, password });
        applySession(result);
        return result.user;
      },
      async register(name, email, password, role = 'user') {
        const result = await api.register({ name, email, password, role });
        applySession(result);
        return result.user;
      },
      async updateAccount(name, email) {
        const result = await api.updateAccount({ name, email });
        applySession(result);
        return result.user;
      },
      async changePassword(currentPassword, newPassword) {
        const result = await api.changePassword({ currentPassword, newPassword });
        applySession(result);
        return result.user;
      },
      logout() {
        localStorage.removeItem('dcg_token');
        setUser(null);
      }
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
