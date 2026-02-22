import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ClipboardList } from 'lucide-react';
import { useAuth } from '../../../app/auth/authStore';
import RequirePerm from '../../../app/rbac/RequirePerm';
import { PERMS } from '../../../shared/constants/permissions';
import Badge from '../../../shared/ui/Badge';
import Button from '../../../shared/ui/Button';
import { Card, CardBody, CardHeader } from '../../../shared/ui/Card';
import { colors } from '../../../shared/theme/tokens';
import PageHeader from '../../../shared/ui/PageHeader';
import EmptyState from '../../../shared/ui/EmptyState';
import Skeleton from '../../../shared/ui/Skeleton';

const summaryCards = [
  { label: 'Open Work Orders', value: 14, badge: 'warning' },
  { label: 'Incoming GRN Today', value: 9, badge: 'success' },
  { label: 'Pending QC Decisions', value: 5, badge: 'danger' },
  { label: 'Shipment Ready', value: 7, badge: 'info' },
];

const stockTrend = [
  { name: 'Mon', inbound: 48, outbound: 37 },
  { name: 'Tue', inbound: 55, outbound: 42 },
  { name: 'Wed', inbound: 39, outbound: 31 },
  { name: 'Thu', inbound: 62, outbound: 49 },
  { name: 'Fri', inbound: 58, outbound: 45 },
];

export default function DashboardPage() {
  const { user, roles } = useAuth();
  const isLoadingPreview = false;

  return (
    <section className="space-y-5">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user?.name}. Active role: ${roles.join(', ') || '-'}`}
        actions={<Button variant="secondary">Export Snapshot</Button>}
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardBody>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm" style={{ color: colors.muted }}>
                  {card.label}
                </p>
                <Badge variant={card.badge}>Live</Badge>
              </div>
              <p className="mt-2 text-3xl font-semibold" style={{ color: colors.text }}>
                {card.value}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader style={{ paddingBottom: 0 }}>
            <h3 className="text-base font-semibold" style={{ color: colors.text }}>
              Inbound vs Outbound
            </h3>
          </CardHeader>
          <CardBody>
            {isLoadingPreview ? (
              <Skeleton height={288} />
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stockTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                    <XAxis dataKey="name" stroke={colors.muted} />
                    <YAxis stroke={colors.muted} />
                    <Tooltip />
                    <Bar dataKey="inbound" fill={colors.primary} radius={[6, 6, 0, 0]} />
                    <Bar dataKey="outbound" fill="#1E40AF" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader style={{ paddingBottom: 0 }}>
            <h3 className="text-base font-semibold" style={{ color: colors.text }}>
              Quick Actions
            </h3>
          </CardHeader>
          <CardBody className="space-y-3">
            <RequirePerm code={PERMS.QC_DECIDE} fallback={<p style={{ color: colors.muted }}>No access</p>}>
              <Button className="w-full">Review QC Queue</Button>
            </RequirePerm>
            <RequirePerm code={PERMS.MASTERDATA_WRITE} fallback={<p style={{ color: colors.muted }}>No access</p>}>
              <Button variant="secondary" className="w-full">
                Update Master Data
              </Button>
            </RequirePerm>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader style={{ paddingBottom: 0 }}>
          <h3 className="text-base font-semibold" style={{ color: colors.text }}>
            Recent Alerts
          </h3>
        </CardHeader>
        <CardBody>
          <EmptyState
            icon={ClipboardList}
            title="No active alerts"
            description="Semua proses berjalan normal. Alert operasional akan muncul di sini."
          />
        </CardBody>
      </Card>
    </section>
  );
}
