import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/authStore';
import { colors, radius, spacing } from '../../shared/theme/tokens';
import { NAV } from './navConfig';

function hasPerm(item, permissions) {
  if (!item.requiredPerm) return true;
  return permissions.includes(item.requiredPerm);
}

function filterNav(items, permissions) {
  return items
    .map((item) => {
      const children = item.children ? filterNav(item.children, permissions) : undefined;

      if (children?.length) {
        return { ...item, children };
      }

      if (item.children?.length && !children?.length) {
        return null;
      }

      return hasPerm(item, permissions) ? item : null;
    })
    .filter(Boolean);
}

function isPathActive(pathname, targetPath) {
  return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
}

export default function Sidebar() {
  const { permissions } = useAuth();
  const location = useLocation();

  const navItems = useMemo(() => filterNav(NAV, permissions), [permissions]);

  const [openMap, setOpenMap] = useState(() => {
    const initial = {};
    for (const item of NAV) {
      if (item.children?.length) {
        initial[item.key] = isPathActive(location.pathname, item.path);
      }
    }
    return initial;
  });

  const toggleGroup = (key) => {
    setOpenMap((previous) => ({ ...previous, [key]: !previous[key] }));
  };

  return (
    <aside
      className="w-72 shrink-0"
      style={{
        backgroundColor: colors.sidebar,
        borderRadius: radius.lg,
        padding: spacing.md,
      }}
    >
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">Warehouse Suite</p>
        <h1 className="text-2xl font-bold text-white">GudangERP</h1>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const activeParent = isPathActive(location.pathname, item.path);
          const hasChildren = Boolean(item.children?.length);

          if (!hasChildren) {
            return (
              <NavLink
                key={item.key}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium transition"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? colors.primary : 'transparent',
                  color: '#E2E8F0',
                  borderRadius: radius.lg,
                })}
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            );
          }

          const isOpen = openMap[item.key] ?? activeParent;

          return (
            <div key={item.key}>
              <button
                type="button"
                onClick={() => toggleGroup(item.key)}
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-sm font-medium transition"
                style={{
                  backgroundColor: activeParent ? '#1E293B' : 'transparent',
                  color: '#E2E8F0',
                  borderRadius: radius.lg,
                }}
              >
                <span className="flex items-center gap-3">
                  <Icon size={16} />
                  {item.label}
                </span>
                <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }} />
              </button>

              {isOpen ? (
                <div className="mt-1 space-y-1 pl-5">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon;
                    return (
                      <NavLink
                        key={child.key}
                        to={child.path}
                        className="flex items-center gap-2 px-3 py-2 text-sm transition"
                        style={({ isActive }) => ({
                          backgroundColor: isActive ? colors.primary : 'transparent',
                          color: '#CBD5E1',
                          borderRadius: radius.lg,
                        })}
                      >
                        <ChildIcon size={14} />
                        {child.label}
                      </NavLink>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
