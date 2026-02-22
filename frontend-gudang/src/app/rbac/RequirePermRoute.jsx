import { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/authStore';
import { showToast } from '../../shared/ui/toastStore';

export default function RequirePermRoute({ code, children }) {
  const { loading, isAuthenticated, permissions } = useAuth();
  const location = useLocation();
  const notifiedRef = useRef('');
  const isAllowed = !code || permissions.includes(code);

  useEffect(() => {
    const key = `${location.pathname}:${code || ''}`;
    if (!loading && isAuthenticated && !isAllowed && notifiedRef.current !== key) {
      showToast({ type: 'error', message: 'Anda tidak memiliki akses.' });
      notifiedRef.current = key;
    }
  }, [loading, isAuthenticated, isAllowed, location.pathname, code]);

  if (loading) return children;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAllowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
