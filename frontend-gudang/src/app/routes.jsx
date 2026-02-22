import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/authStore';
import ProtectedRoute from './auth/ProtectedRoute';
import AppLayout from './layout/AppLayout';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import LoginPage from '../features/auth/pages/LoginPage';
import { colors } from '../shared/theme/tokens';
import PlaceholderPage from '../features/common/pages/PlaceholderPage';
import RequirePermRoute from './rbac/RequirePermRoute';
import { PERMISSIONS } from '../shared/constants/permissions';

function RootRedirect() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center" style={{ backgroundColor: colors.background, color: colors.muted }}>
        Memuat...
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  );
}

function withPerm(code, element) {
  return <RequirePermRoute code={code}>{element}</RequirePermRoute>;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            <Route
              path="/master-data/products"
              element={withPerm(PERMISSIONS.MASTERDATA_READ, <PlaceholderPage title="Products" description="Master data products" />)}
            />
            <Route
              path="/master-data/uom"
              element={withPerm(PERMISSIONS.MASTERDATA_READ, <PlaceholderPage title="UOM" description="Unit of measure catalog" />)}
            />
            <Route
              path="/master-data/warehouses"
              element={withPerm(PERMISSIONS.MASTERDATA_READ, <PlaceholderPage title="Warehouses" description="Warehouse master" />)}
            />
            <Route
              path="/master-data/locations"
              element={withPerm(PERMISSIONS.MASTERDATA_READ, <PlaceholderPage title="Locations" description="Location master" />)}
            />
            <Route
              path="/master-data/partners"
              element={withPerm(PERMISSIONS.MASTERDATA_READ, <PlaceholderPage title="Partners" description="Partner master" />)}
            />

            <Route
              path="/purchasing/grn"
              element={withPerm(PERMISSIONS.GRN_READ, <PlaceholderPage title="GRN Inbox" description="Purchasing read queue" />)}
            />
            <Route
              path="/purchasing/grn-drafts"
              element={withPerm(PERMISSIONS.GRN_WRITE, <PlaceholderPage title="GRN Drafts" description="Purchasing write queue" />)}
            />

            <Route
              path="/inventory/stock-overview"
              element={withPerm(PERMISSIONS.STOCK_READ, <PlaceholderPage title="Stock Overview" description="Inventory stock visibility" />)}
            />

            <Route path="/manufacturing" element={<PlaceholderPage title="Manufacturing" description="Manufacturing workspace placeholder" />} />
            <Route path="/compliance" element={<PlaceholderPage title="Compliance" description="Compliance workspace placeholder" />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
