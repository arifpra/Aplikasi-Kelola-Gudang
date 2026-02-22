import { useAuth } from '../auth/authStore';

export function usePerm(code) {
  const { permissions } = useAuth();
  return permissions.includes(code);
}
