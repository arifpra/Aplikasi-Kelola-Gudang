import { radius } from '../theme/tokens';

export default function Skeleton({ className = '', height = 16, width = '100%' }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 ${className}`}
      style={{
        height,
        width,
        borderRadius: radius.lg,
      }}
    />
  );
}
