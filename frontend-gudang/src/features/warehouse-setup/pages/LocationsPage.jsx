import { useEffect, useMemo, useState } from 'react';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import LocationFormModal from '../components/LocationFormModal';
import { createLocation, deleteLocation, listLocations, listWarehouses, updateLocation } from '../api/warehouseSetupApi';
import { parseErrorMessage, statusBadgeVariant, statusLabel } from '../utils/formatters';

export default function LocationsPage() {
  const canWrite = usePerm(PERMS.WAREHOUSE_SETUP_WRITE);
  const navigate = useNavigate();

  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [qInput, setQInput] = useState('');
  const [q, setQ] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const activeWarehouseOptions = useMemo(() => warehouseOptions.filter((warehouse) => warehouse.is_active), [warehouseOptions]);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data = await listWarehouses({ limit: 200, offset: 0 });
        setWarehouseOptions(data.rows || []);
      } catch (error) {
        showToast({ type: 'error', message: parseErrorMessage(error, 'Gagal memuat daftar warehouse.') });
      }
    };

    fetchWarehouses();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(0);
      setQ(qInput.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [qInput]);

  const fetchRows = async () => {
    if (!selectedWarehouseId) {
      setRows([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    try {
      const isActive = isActiveFilter === 'all' ? undefined : isActiveFilter === 'active';
      const data = await listLocations({ warehouseId: selectedWarehouseId, q, limit, offset, isActive });
      setRows(data.rows || []);
      setTotal(data.total || 0);
    } catch (error) {
      showToast({ type: 'error', message: parseErrorMessage(error, 'Gagal memuat locations.') });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWarehouseId, q, limit, offset, isActiveFilter]);

  const warehouseNameById = useMemo(() => {
    const map = new Map();
    warehouseOptions.forEach((warehouse) => {
      map.set(warehouse.id, `${warehouse.code} - ${warehouse.name}`);
    });
    return map;
  }, [warehouseOptions]);

  const columns = useMemo(() => {
    const base = [
      { key: 'code', title: 'Code' },
      { key: 'name', title: 'Name' },
      { key: 'warehouse', title: 'Warehouse' },
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
        await updateLocation(editingRow.id, payload);
        showToast({ type: 'success', message: 'Location updated.' });
      } else {
        await createLocation(payload);
        showToast({ type: 'success', message: 'Location created.' });
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
      await updateLocation(row.id, { is_active: true });
      showToast({ type: 'success', message: 'Location activated.' });
      await fetchRows();
    } catch (error) {
      showToast({ type: 'error', message: parseErrorMessage(error) });
    }
  };

  const handleDeactivate = async () => {
    if (!deleteTarget?.id) return;

    setDeleting(true);
    try {
      await deleteLocation(deleteTarget.id);
      showToast({ type: 'success', message: 'Location deactivated.' });
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
        title="Locations"
        description="Manage locations inside a selected warehouse."
        actions={canWrite ? <Button onClick={openCreate} disabled={!activeWarehouseOptions.length}>Create Location</Button> : null}
      />

      <Card>
        <CardBody className="space-y-4">
          <FiltersBar
            searchValue={qInput}
            onSearchChange={setQInput}
            searchPlaceholder="Search code or name"
            leftSlot={(
              <div className="flex flex-wrap items-end gap-3">
                <label className="min-w-[240px]">
                  <span className="mb-2 block text-sm font-medium text-slate-900">Warehouse</span>
                  <select
                    className="w-full rounded-2xl border px-3 py-2.5 text-sm"
                    value={selectedWarehouseId}
                    onChange={(event) => {
                      setSelectedWarehouseId(event.target.value);
                      setOffset(0);
                    }}
                  >
                    <option value="">Select warehouse</option>
                    {warehouseOptions.map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.code} - {warehouse.name}
                        {warehouse.is_active ? '' : ' (Inactive)'}
                      </option>
                    ))}
                  </select>
                </label>

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
              </div>
            )}
          />

          {!selectedWarehouseId ? (
            <EmptyState
              icon={MapPin}
              title="Select a warehouse"
              description="Select a warehouse to view locations."
            />
          ) : loading ? (
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
                  if (column.key === 'warehouse') {
                    return warehouseNameById.get(row.warehouse_id) || row.warehouse_code || '-';
                  }

                  if (column.key === 'is_active') {
                    return <Badge variant={statusBadgeVariant(row.is_active)}>{statusLabel(row.is_active)}</Badge>;
                  }

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
              icon={MapPin}
              title="No locations yet"
              description="Create location for this warehouse."
              action={canWrite ? <Button onClick={openCreate}>Create Location</Button> : null}
            />
          )}
        </CardBody>
      </Card>

      <LocationFormModal
        open={modalOpen}
        initialData={editingRow}
        warehouses={warehouseOptions}
        defaultWarehouseId={selectedWarehouseId}
        loading={saving}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onGoWarehouses={() => navigate('/warehouse-setup/warehouses')}
      />

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
