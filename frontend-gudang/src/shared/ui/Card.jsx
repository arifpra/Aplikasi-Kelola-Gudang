import { colors, radius, shadow, spacing } from '../theme/tokens';

export function Card({ className = '', style, ...props }) {
  return (
    <article
      {...props}
      className={`rounded-2xl ${className}`}
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: radius.lg,
        boxShadow: shadow.soft,
        ...style,
      }}
    />
  );
}

export function CardHeader({ className = '', style, ...props }) {
  return <div {...props} className={className} style={{ padding: spacing.md, ...style }} />;
}

export function CardBody({ className = '', style, ...props }) {
  return <div {...props} className={className} style={{ padding: spacing.md, ...style }} />;
}
