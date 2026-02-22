import { usePerm } from './usePerm';

export default function RequirePerm({ code, children, fallback = 'No access' }) {
  const allowed = usePerm(code);

  if (!allowed) {
    return <>{fallback}</>;
  }

  return children;
}
