import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../app/auth/authStore';
import { Card, CardBody, CardHeader } from '../../../shared/ui/Card';
import Input from '../../../shared/ui/Input';
import Button from '../../../shared/ui/Button';
import { colors, spacing } from '../../../shared/theme/tokens';

export default function LoginPage() {
  const { login, loading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('admin@local');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login gagal');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4" style={{ backgroundColor: colors.background }}>
      <Card className="w-full max-w-md">
        <CardHeader style={{ paddingBottom: 0 }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.primary }}>
            GudangERP
          </p>
          <h1 className="mt-2 text-2xl font-semibold" style={{ color: colors.text }}>
            Sign In
          </h1>
          <p className="mt-1 text-sm" style={{ color: colors.muted }}>
            Masuk untuk mengakses dashboard gudang.
          </p>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@local"
              required
            />
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Admin123!"
              required
              error={error}
            />

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Memproses...' : 'Login'}
            </Button>
          </form>

          <div
            className="mt-4 rounded-2xl border p-3 text-xs"
            style={{ borderColor: colors.border, color: colors.muted, backgroundColor: '#F8FAFC' }}
          >
            <p>Default credential:</p>
            <p className="font-semibold" style={{ color: colors.text, marginTop: spacing.sm / 4 }}>
              admin@local / Admin123!
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
