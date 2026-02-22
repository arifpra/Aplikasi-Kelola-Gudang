import { colors, radius } from '../theme/tokens';

export default function Input({
  label,
  helper,
  error,
  className = '',
  containerClassName = '',
  ...props
}) {
  return (
    <label className={`block ${containerClassName}`}>
      {label ? <span className="mb-2 block text-sm font-medium" style={{ color: colors.text }}>{label}</span> : null}
      <input
        {...props}
        className={`w-full rounded-2xl border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${className}`}
        style={{
          borderColor: error ? colors.danger : colors.border,
          borderRadius: radius.lg,
          color: colors.text,
          backgroundColor: colors.surface,
        }}
      />
      {error ? <span className="mt-1 block text-xs" style={{ color: colors.danger }}>{error}</span> : null}
      {!error && helper ? <span className="mt-1 block text-xs" style={{ color: colors.muted }}>{helper}</span> : null}
    </label>
  );
}
