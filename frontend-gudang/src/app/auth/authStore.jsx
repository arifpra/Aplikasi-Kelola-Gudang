import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../lib/api/client';
import { clearAccessToken, getAccessToken, setAccessToken } from './token';

const AuthContext = createContext(null);

function mapUser(payloadUser) {
  if (!payloadUser) return null;

  return {
    id: payloadUser.id,
    name: payloadUser.name,
    email: payloadUser.email,
    roles: Array.isArray(payloadUser.roles) ? payloadUser.roles : [],
    permissions: Array.isArray(payloadUser.permissions) ? payloadUser.permissions : [],
  };
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const didLogBootstrapPermsRef = useRef(false);

  const bootstrap = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.get('/auth/me');
      const mapped = mapUser(response.data?.data?.user);
      setUser(mapped);

      if (import.meta.env.DEV && !didLogBootstrapPermsRef.current && mapped) {
        console.info('[RBAC] /auth/me permissions:', mapped.permissions);
        didLogBootstrapPermsRef.current = true;
      }
    } catch (_error) {
      clearAccessToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(
    async (email, password) => {
      const response = await apiClient.post('/auth/login', { email, password });
      const accessToken = response.data?.data?.accessToken;
      const payloadUser = response.data?.data?.user;

      if (!accessToken) {
        throw new Error('Login gagal: token tidak ditemukan.');
      }

      setAccessToken(accessToken);
      setUser(mapUser(payloadUser));
      navigate('/dashboard', { replace: true });
    },
    [navigate],
  );

  const logout = useCallback(() => {
    clearAccessToken();
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      roles: user?.roles || [],
      permissions: user?.permissions || [],
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      bootstrap,
    }),
    [user, loading, login, logout, bootstrap],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }

  return context;
}
