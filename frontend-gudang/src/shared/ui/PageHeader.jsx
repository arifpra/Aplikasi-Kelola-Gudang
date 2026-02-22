import { colors, spacing } from '../../shared/theme/tokens';

export default function PageHeader({ title, description, actions = null }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4" style={{ marginBottom: spacing.md }}>
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: colors.text }}>
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm" style={{ color: colors.muted }}>
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
