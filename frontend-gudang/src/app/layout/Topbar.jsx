import { Bell, Search } from 'lucide-react';
import { useAuth } from '../auth/authStore';
import { colors, radius, spacing } from '../../shared/theme/tokens';
import Button from '../../shared/ui/Button';

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header
      className="mb-6 flex items-center justify-between gap-4"
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: radius.lg,
        padding: spacing.md,
      }}
    >
      <label className="flex w-full max-w-md items-center gap-2 rounded-2xl border px-3 py-2" style={{ borderColor: colors.border }}>
        <Search size={16} color={colors.muted} />
        <input
          className="w-full bg-transparent text-sm outline-none"
          placeholder="Search modules, SKU, documents..."
          style={{ color: colors.text }}
        />
      </label>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center border"
          style={{
            borderColor: colors.border,
            borderRadius: radius.lg,
            color: colors.muted,
            backgroundColor: colors.surface,
          }}
        >
          <Bell size={16} />
        </button>
        <div className="min-w-0 text-right">
          <p className="truncate text-sm font-semibold" style={{ color: colors.text }}>
            {user?.name || user?.email}
          </p>
          <p className="text-xs" style={{ color: colors.muted }}>
            ERP User
          </p>
        </div>
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
