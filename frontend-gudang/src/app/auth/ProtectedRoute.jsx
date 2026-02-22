import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './authStore';
import { colors } from '../../shared/theme/tokens';

export default function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center" style={{ backgroundColor: colors.background, color: colors.muted }}>
        Memuat sesi...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
