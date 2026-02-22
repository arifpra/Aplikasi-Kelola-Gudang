import { colors, radius } from '../theme/tokens';

const badgeStyle = {
  success: { backgroundColor: '#ECFDF3', color: colors.success },
  warning: { backgroundColor: '#FFF7ED', color: colors.warning },
  danger: { backgroundColor: '#FEF2F2', color: colors.danger },
  info: { backgroundColor: '#EFF6FF', color: colors.info },
};

export default function Badge({ variant = 'info', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
      style={{ borderRadius: radius.pill, ...(badgeStyle[variant] || badgeStyle.info) }}
    >
      {children}
    </span>
  );
}
