import { useEffect, useMemo, useState } from 'react';
import { colors, radius, shadow } from '../theme/tokens';
import { subscribeToast } from './toastEvents';

const toneMap = {
  info: { backgroundColor: '#EFF6FF', color: colors.info },
  success: { backgroundColor: '#ECFDF3', color: colors.success },
  warning: { backgroundColor: '#FFF7ED', color: colors.warning },
  danger: { backgroundColor: '#FEF2F2', color: colors.danger },
};

export default function Toast() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    return subscribeToast((toast) => {
      setItems((prev) => [...prev, toast]);
    });
  }, []);

  useEffect(() => {
    if (!items.length) return undefined;

    const timer = setTimeout(() => {
      setItems((prev) => prev.slice(1));
    }, 2600);

    return () => clearTimeout(timer);
  }, [items]);

  const current = items[0];
  const tone = useMemo(() => toneMap[current?.type] || toneMap.info, [current]);

  if (!current) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className="min-w-64 rounded-2xl px-4 py-3 text-sm font-medium"
        style={{
          ...tone,
          borderRadius: radius.lg,
          boxShadow: shadow.soft,
          border: `1px solid ${colors.border}`,
        }}
      >
        {current.message}
      </div>
    </div>
  );
}

