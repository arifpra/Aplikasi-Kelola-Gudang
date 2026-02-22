import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { colors, spacing } from '../../shared/theme/tokens';
import Toast from '../../shared/ui/Toast';

export default function AppLayout() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="mx-auto flex max-w-[1400px] gap-5" style={{ padding: spacing.lg }}>
        <Sidebar />

        <div className="min-w-0 flex-1">
          <Topbar />
          <main>
            <Outlet />
          </main>
        </div>
      </div>
      <Toast />
    </div>
  );
}
