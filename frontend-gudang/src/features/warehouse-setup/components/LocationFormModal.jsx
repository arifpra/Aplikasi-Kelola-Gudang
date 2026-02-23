import { useEffect, useMemo, useState } from 'react';
import Button from '../../../shared/ui/Button';
import { Card, CardBody, CardHeader } from '../../../shared/ui/Card';
import Input from '../../../shared/ui/Input';
import EmptyState from '../../../shared/ui/EmptyState';

const codeRegex = /^[A-Z0-9-]+$/;

function normalizeCode(value) {
  return value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
}

function validate(values) {
  const next = {};

  if (!values.warehouse_id) {
    next.warehouse_id = 'Warehouse is required';
  }

  if (!values.code) {
    next.code = 'Code is required';
  } else if (values.code.length < 2 || values.code.length > 20) {
    next.code = 'Code length must be 2-20';
  } else if (!codeRegex.test(values.code)) {
    next.code = 'Use A-Z, 0-9, and dash only';
  }

  if (!values.name) {
    next.name = 'Name is required';
  } else if (values.name.length < 2 || values.name.length > 100) {
    next.name = 'Name length must be 2-100';
  }

  return next;
}

export default function LocationFormModal({
  open,
  initialData = null,
  warehouses = [],
  defaultWarehouseId = '',
  loading = false,
  onClose,
  onSubmit,
  onGoWarehouses,
}) {
  const [values, setValues] = useState({ warehouse_id: '', code: '', name: '', is_active: true });
  const [errors, setErrors] = useState({});

  const isEdit = useMemo(() => Boolean(initialData?.id), [initialData]);
  const activeWarehouses = useMemo(() => warehouses.filter((warehouse) => warehouse.is_active), [warehouses]);

  useEffect(() => {
    if (!open) return;

    const nextDefaultWarehouse = initialData?.warehouse_id || defaultWarehouseId || activeWarehouses[0]?.id || '';

    setValues({
      warehouse_id: nextDefaultWarehouse,
      code: initialData?.code || '',
      name: initialData?.name || '',
      is_active: typeof initialData?.is_active === 'boolean' ? initialData.is_active : true,
    });
    setErrors({});
  }, [open, initialData, defaultWarehouseId, activeWarehouses]);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    await onSubmit({
      warehouse_id: String(values.warehouse_id).trim(),
      code: values.code.trim().toUpperCase(),
      name: values.name.trim(),
      ...(isEdit ? { is_active: values.is_active } : {}),
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-900/40 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-900">{isEdit ? 'Edit Location' : 'Create Location'}</h2>
          <p className="mt-1 text-sm text-slate-500">Pilih warehouse aktif lalu isi data location.</p>
        </CardHeader>
        <CardBody>
          {!isEdit && !activeWarehouses.length ? (
            <EmptyState
              title="Tidak ada warehouse aktif"
              description="Buat atau aktifkan warehouse terlebih dulu sebelum membuat location."
              action={(
                <Button type="button" onClick={() => onGoWarehouses?.()}>
                  Go to Warehouses
                </Button>
              )}
            />
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-900">Warehouse</span>
                <select
                  value={values.warehouse_id}
                  onChange={(event) => handleChange('warehouse_id', event.target.value)}
                  className="w-full rounded-2xl border px-3 py-2.5 text-sm"
                  disabled={!isEdit && !activeWarehouses.length}
                >
                  <option value="">Select warehouse</option>
                  {(isEdit ? warehouses : activeWarehouses).map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.code} - {warehouse.name}
                      {warehouse.is_active ? '' : ' (Inactive)'}
                    </option>
                  ))}
                </select>
                {errors.warehouse_id ? <span className="mt-1 block text-xs text-red-600">{errors.warehouse_id}</span> : null}
              </label>

              <Input
                label="Code"
                value={values.code}
                onChange={(event) => handleChange('code', normalizeCode(event.target.value))}
                error={errors.code}
                maxLength={20}
                placeholder="LOC-A1"
              />

              <Input
                label="Name"
                value={values.name}
                onChange={(event) => handleChange('name', event.target.value)}
                error={errors.name}
                maxLength={100}
                placeholder="Area A1"
              />

              {isEdit ? (
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={values.is_active}
                    onChange={(event) => handleChange('is_active', event.target.checked)}
                  />
                  Active
                </label>
              ) : null}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : isEdit ? 'Save changes' : 'Create'}
                </Button>
              </div>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
