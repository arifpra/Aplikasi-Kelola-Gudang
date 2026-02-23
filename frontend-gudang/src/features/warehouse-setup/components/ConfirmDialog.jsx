import Button from '../../../shared/ui/Button';
import { Card, CardBody, CardHeader } from '../../../shared/ui/Card';

export default function ConfirmDialog({
  open,
  title = 'Deactivate this item?',
  description = 'This will set status to inactive.',
  confirmLabel = 'Deactivate',
  cancelLabel = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-900/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </CardHeader>
        <CardBody>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
              {cancelLabel}
            </Button>
            <Button type="button" variant="danger" onClick={onConfirm} disabled={loading}>
              {loading ? 'Processing...' : confirmLabel}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
