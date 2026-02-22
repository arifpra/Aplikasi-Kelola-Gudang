import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/authStore';
import ProtectedRoute from './auth/ProtectedRoute';
import AppLayout from './layout/AppLayout';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import LoginPage from '../features/auth/pages/LoginPage';
import { colors } from '../shared/theme/tokens';
import PlaceholderPage from '../features/common/pages/PlaceholderPage';
import RequirePermRoute from './rbac/RequirePermRoute';
import { PERMS } from '../shared/constants/permissions';

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
              element={withPerm(PERMS.MASTERDATA_READ, <PlaceholderPage title="Products" description="Master Data / Products" actionLabel="Create Product" />)}
            />
            <Route
              path="/master-data/uom"
              element={withPerm(PERMS.MASTERDATA_READ, <PlaceholderPage title="UOM" description="Master Data / UOM" actionLabel="Create UOM" />)}
            />
            <Route
              path="/master-data/partners"
              element={withPerm(PERMS.MASTERDATA_READ, <PlaceholderPage title="Partners" description="Master Data / Partners" actionLabel="Create Partner" />)}
            />

            <Route
              path="/warehouse-setup/warehouses"
              element={withPerm(PERMS.WAREHOUSE_SETUP_READ, <PlaceholderPage title="Warehouses" description="Warehouse Setup / Warehouses" actionLabel="Create Warehouse" />)}
            />
            <Route
              path="/warehouse-setup/locations"
              element={withPerm(PERMS.WAREHOUSE_SETUP_READ, <PlaceholderPage title="Locations" description="Warehouse Setup / Locations" actionLabel="Create Location" />)}
            />
            <Route
              path="/warehouse-setup/zones"
              element={withPerm(PERMS.WAREHOUSE_SETUP_READ, <PlaceholderPage title="Zones" description="Warehouse Setup / Zones" actionLabel="Create Zone" />)}
            />

            <Route path="/purchasing" element={withPerm(PERMS.PURCHASING_READ, <PlaceholderPage title="Purchasing" description="Purchasing module placeholder" actionLabel="Create PO" />)} />
            <Route path="/inventory" element={withPerm(PERMS.INVENTORY_READ, <PlaceholderPage title="Inventory" description="Inventory module placeholder" actionLabel="Create Movement" />)} />
            <Route path="/manufacturing" element={withPerm(PERMS.MANUFACTURING_READ, <PlaceholderPage title="Manufacturing" description="Manufacturing module placeholder" actionLabel="Create Work Order" />)} />
            <Route path="/compliance" element={withPerm(PERMS.COMPLIANCE_READ, <PlaceholderPage title="Compliance" description="Compliance module placeholder" actionLabel="Create Recall" />)} />
            <Route path="/settings" element={<PlaceholderPage title="Settings" description="Application settings placeholder" actionLabel="Save Settings" />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
