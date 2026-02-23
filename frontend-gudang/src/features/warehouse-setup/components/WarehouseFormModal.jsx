import { useEffect, useMemo, useState } from 'react';
import Button from '../../../shared/ui/Button';
import { Card, CardBody, CardHeader } from '../../../shared/ui/Card';
import Input from '../../../shared/ui/Input';

const codeRegex = /^[A-Z0-9-]+$/;

function normalizeCode(value) {
  return value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
}

function validate(values) {
  const next = {};

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

export default function WarehouseFormModal({ open, initialData = null, loading = false, onClose, onSubmit }) {
  const [values, setValues] = useState({ code: '', name: '', address: '', is_active: true });
  const [errors, setErrors] = useState({});

  const isEdit = useMemo(() => Boolean(initialData?.id), [initialData]);

  useEffect(() => {
    if (!open) return;

    setValues({
      code: initialData?.code || '',
      name: initialData?.name || '',
      address: initialData?.address || '',
      is_active: typeof initialData?.is_active === 'boolean' ? initialData.is_active : true,
    });
    setErrors({});
  }, [open, initialData]);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    await onSubmit({
      code: values.code.trim().toUpperCase(),
      name: values.name.trim(),
      address: values.address.trim() || null,
      ...(isEdit ? { is_active: values.is_active } : {}),
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-900/40 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-900">{isEdit ? 'Edit Warehouse' : 'Create Warehouse'}</h2>
          <p className="mt-1 text-sm text-slate-500">Isi data warehouse dengan benar.</p>
        </CardHeader>
        <CardBody>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Code"
              value={values.code}
              onChange={(event) => handleChange('code', normalizeCode(event.target.value))}
              error={errors.code}
              maxLength={20}
              placeholder="WH-JKT-01"
            />

            <Input
              label="Name"
              value={values.name}
              onChange={(event) => handleChange('name', event.target.value)}
              error={errors.name}
              maxLength={100}
              placeholder="Warehouse Jakarta"
            />

            <Input
              label="Address"
              value={values.address}
              onChange={(event) => handleChange('address', event.target.value)}
              maxLength={200}
              placeholder="Alamat (opsional)"
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
        </CardBody>
      </Card>
    </div>
  );
}
