import { colors, radius } from '../theme/tokens';

const baseClass =
  'inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60';

const variantClass = {
  primary: 'text-white hover:brightness-95',
  secondary: 'hover:bg-slate-50',
  ghost: 'hover:bg-slate-100',
  danger: 'text-white hover:brightness-95',
};

const variantStyle = {
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    color: colors.text,
  },
  ghost: {
    backgroundColor: 'transparent',
    color: colors.muted,
  },
  danger: {
    backgroundColor: colors.danger,
  },
};

export default function Button({ variant = 'primary', className = '', style, ...props }) {
  return (
    <button
      {...props}
      className={`${baseClass} ${variantClass[variant] || variantClass.primary} ${className}`}
      style={{ borderRadius: radius.lg, ...variantStyle[variant], ...style }}
    />
  );
}
