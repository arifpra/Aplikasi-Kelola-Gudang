import { colors, radius } from '../theme/tokens';

export function Table({ columns, rows, renderRow }) {
  return (
    <div
      className="overflow-hidden"
      style={{ border: `1px solid ${colors.border}`, borderRadius: radius.lg, backgroundColor: colors.surface }}
    >
      <table className="min-w-full border-collapse">
        <thead style={{ backgroundColor: '#F8FAFC' }}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                style={{ color: colors.muted }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id || index} style={{ borderTop: `1px solid ${colors.border}` }}>
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-sm" style={{ color: colors.text }}>
                  {renderRow ? renderRow(row, column) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
