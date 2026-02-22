import { Box } from 'lucide-react';
import { Card, CardBody } from '../../../shared/ui/Card';
import EmptyState from '../../../shared/ui/EmptyState';
import PageHeader from '../../../shared/ui/PageHeader';
import Button from '../../../shared/ui/Button';

export default function PlaceholderPage({ title, description, actionLabel = 'Create' }) {
  return (
    <section className="space-y-5">
      <PageHeader title={title} description={description} />
      <Card>
        <CardBody>
          <EmptyState
            icon={Box}
            title={`${title} belum tersedia`}
            description="Modul ini disiapkan sebagai placeholder untuk fase berikutnya."
            action={<Button>{actionLabel}</Button>}
          />
        </CardBody>
      </Card>
    </section>
  );
}
