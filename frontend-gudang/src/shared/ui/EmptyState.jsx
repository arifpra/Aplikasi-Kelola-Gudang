import { Inbox } from 'lucide-react';
import { colors, radius, spacing } from '../theme/tokens';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data',
  description = 'Belum ada data untuk ditampilkan.',
  action = null,
}) {
  return (
    <div
      className="text-center"
      style={{
        border: `1px dashed ${colors.border}`,
        borderRadius: radius.lg,
        padding: spacing.lg,
        color: colors.muted,
      }}
    >
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full" style={{ backgroundColor: '#EFF6FF' }}>
        <Icon size={20} color={colors.primary} />
      </div>
      <h3 className="text-base font-semibold" style={{ color: colors.text }}>
        {title}
      </h3>
      <p className="mt-1 text-sm">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
