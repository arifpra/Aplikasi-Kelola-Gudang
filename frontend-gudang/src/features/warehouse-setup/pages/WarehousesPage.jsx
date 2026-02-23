import { useEffect, useMemo, useState } from 'react';
import { Package } from 'lucide-react';
import { PERMS } from '../../../shared/constants/permissions';
import { usePerm } from '../../../app/rbac/usePerm';
import Button from '../../../shared/ui/Button';
import Badge from '../../../shared/ui/Badge';
import { Card, CardBody } from '../../../shared/ui/Card';
import EmptyState from '../../../shared/ui/EmptyState';
import PageHeader from '../../../shared/ui/PageHeader';
import Skeleton from '../../../shared/ui/Skeleton';
import { Table } from '../../../shared/ui/Table';
import { showToast } from '../../../shared/ui/toastStore';
import ConfirmDialog from '../components/ConfirmDialog';
import FiltersBar from '../components/FiltersBar';
import PaginationBar from '../components/PaginationBar';
import WarehouseFormModal from '../components/WarehouseFormModal';
import { createWarehouse, deleteWarehouse, listWarehouses, updateWarehouse } from '../api/warehouseSetupApi';
import { parseErrorMessage, statusBadgeVariant, statusLabel, truncate } from '../utils/formatters';

export default function WarehousesPage() {
  const canWrite = usePerm(PERMS.WAREHOUSE_SETUP_WRITE);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [qInput, setQInput] = useState('');
  const [q, setQ] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(0);
      setQ(qInput.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [qInput]);

  const fetchRows = async () => {
    setLoading(true);
    try {
      const isActive = isActiveFilter === 'all' ? undefined : isActiveFilter === 'active';
      const data = await listWarehouses({ q, limit, offset, isActive });
      setRows(data.rows || []);
      setTotal(data.total || 0);
    } catch (error) {
      showToast({ type: 'error', message: parseErrorMessage(error, 'Gagal memuat warehouses.') });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, limit, offset, isActiveFilter]);

  const columns = useMemo(() => {
    const base = [
      { key: 'code', title: 'Code' },
      { key: 'name', title: 'Name' },
      { key: 'address', title: 'Address' },
      { key: 'is_active', title: 'Status' },
    ];

    if (canWrite) {
      base.push({ key: 'actions', title: 'Actions' });
    }

    return base;
  }, [canWrite]);

  const openCreate = () => {
    setEditingRow(null);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditingRow(row);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRow(null);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editingRow?.id) {
        await updateWarehouse(editingRow.id, payload);
        showToast({ type: 'success', message: 'Warehouse updated.' });
      } else {
        await createWarehouse(payload);
        showToast({ type: 'success', message: 'Warehouse created.' });
      }

      closeModal();
      await fetchRows();
    } catch (error) {
      showToast({ type: 'error', message: parseErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async (row) => {
    try {
      await updateWarehouse(row.id, { is_active: true });
      showToast({ type: 'success', message: 'Warehouse activated.' });
      await fetchRows();
    } catch (error) {
      showToast({ type: 'error', message: parseErrorMessage(error) });
    }
  };

  const handleDeactivate = async () => {
    if (!deleteTarget?.id) return;

    setDeleting(true);
    try {
      await deleteWarehouse(deleteTarget.id);
      showToast({ type: 'success', message: 'Warehouse deactivated.' });
      setDeleteTarget(null);
      await fetchRows();
    } catch (error) {
      showToast({ type: 'error', message: parseErrorMessage(error) });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="space-y-5">
      <PageHeader
        title="Warehouses"
        description="Manage warehouse master for setup and routing operations."
        actions={canWrite ? <Button onClick={openCreate}>Create Warehouse</Button> : null}
      />

      <Card>
        <CardBody className="space-y-4">
          <FiltersBar
            searchValue={qInput}
            onSearchChange={setQInput}
            searchPlaceholder="Search code or name"
            leftSlot={(
              <label>
                <span className="mb-2 block text-sm font-medium text-slate-900">Status</span>
                <select
                  className="w-[180px] rounded-2xl border px-3 py-2.5 text-sm"
                  value={isActiveFilter}
                  onChange={(event) => {
                    setIsActiveFilter(event.target.value);
                    setOffset(0);
                  }}
                >
                  <option value="all">All</option>
                  <option value="active">Active only</option>
                  <option value="inactive">Inactive only</option>
                </select>
              </label>
            )}
          />

          {loading ? (
            <div className="space-y-3">
              <Skeleton height={40} />
              <Skeleton height={40} />
              <Skeleton height={40} />
            </div>
          ) : rows.length ? (
            <>
              <Table
                columns={columns}
                rows={rows}
                renderRow={(row, column) => {
                  if (column.key === 'address') return truncate(row.address || '-', 56);
                  if (column.key === 'is_active') return <Badge variant={statusBadgeVariant(row.is_active)}>{statusLabel(row.is_active)}</Badge>;

                  if (column.key === 'actions') {
                    return (
                      <div className="flex gap-2">
                        <Button type="button" variant="secondary" onClick={() => openEdit(row)}>
                          Edit
                        </Button>
                        {row.is_active ? (
                          <Button type="button" variant="danger" onClick={() => setDeleteTarget(row)}>
                            Deactivate
                          </Button>
                        ) : (
                          <Button type="button" onClick={() => handleActivate(row)}>
                            Activate
                          </Button>
                        )}
                      </div>
                    );
                  }

                  return row[column.key] || '-';
                }}
              />
              <PaginationBar
                total={total}
                limit={limit}
                offset={offset}
                onLimitChange={(nextLimit) => {
                  setLimit(nextLimit);
                  setOffset(0);
                }}
                onOffsetChange={setOffset}
              />
            </>
          ) : (
            <EmptyState
              icon={Package}
              title="No warehouses yet"
              description="Create a warehouse to start building your storage hierarchy."
              action={canWrite ? <Button onClick={openCreate}>Create Warehouse</Button> : null}
            />
          )}
        </CardBody>
      </Card>

      <WarehouseFormModal open={modalOpen} initialData={editingRow} loading={saving} onClose={closeModal} onSubmit={handleSubmit} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        loading={deleting}
        title="Deactivate this item?"
        description="This will set status to inactive. You can re-activate later in edit."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeactivate}
      />
    </section>
  );
}
