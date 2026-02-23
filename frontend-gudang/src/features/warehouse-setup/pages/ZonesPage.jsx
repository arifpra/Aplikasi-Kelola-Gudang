import { useEffect, useMemo, useState } from 'react';
import { Grid3X3 } from 'lucide-react';
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
import ZoneFormModal from '../components/ZoneFormModal';
import { createZone, deleteZone, listLocations, listWarehouses, listZones, updateZone } from '../api/warehouseSetupApi';
import { parseErrorMessage, statusBadgeVariant, statusLabel } from '../utils/formatters';

export default function ZonesPage() {
  const canWrite = usePerm(PERMS.WAREHOUSE_SETUP_WRITE);
  const navigate = useNavigate();

  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [allActiveLocations, setAllActiveLocations] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');

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

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [warehousesData, locationsData] = await Promise.all([
          listWarehouses({ limit: 200, offset: 0, isActive: true }),
          listLocations({ limit: 200, offset: 0, isActive: true }),
        ]);

        setWarehouseOptions(warehousesData.rows || []);
        setAllActiveLocations(locationsData.rows || []);
      } catch (error) {
        showToast({ type: 'error', message: parseErrorMessage(error, 'Gagal memuat master data zones.') });
      }
    };

    fetchMeta();
  }, []);

  useEffect(() => {
    if (!selectedWarehouseId) {
      setLocationOptions([]);
      setSelectedLocationId('');
      return;
    }

    const nextLocations = allActiveLocations.filter((location) => location.warehouse_id === selectedWarehouseId);
    setLocationOptions(nextLocations);

    if (!nextLocations.some((location) => location.id === selectedLocationId)) {
      setSelectedLocationId(nextLocations[0]?.id || '');
    }
  }, [selectedWarehouseId, allActiveLocations, selectedLocationId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(0);
      setQ(qInput.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [qInput]);

  const fetchRows = async () => {
    if (!selectedLocationId) {
      setRows([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    try {
      const isActive = isActiveFilter === 'all' ? undefined : isActiveFilter === 'active';
      const data = await listZones({ locationId: selectedLocationId, q, limit, offset, isActive });
      setRows(data.rows || []);
      setTotal(data.total || 0);
    } catch (error) {
      showToast({ type: 'error', message: parseErrorMessage(error, 'Gagal memuat zones.') });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocationId, q, limit, offset, isActiveFilter]);

  const locationNameById = useMemo(() => {
    const map = new Map();
    allActiveLocations.forEach((location) => {
      map.set(location.id, `${location.code} - ${location.name}`);
    });
    return map;
  }, [allActiveLocations]);

  const columns = useMemo(() => {
    const base = [
      { key: 'code', title: 'Code' },
      { key: 'name', title: 'Name' },
      { key: 'location', title: 'Location' },
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
        await updateZone(editingRow.id, payload);
        showToast({ type: 'success', message: 'Zone updated.' });
      } else {
        await createZone(payload);
        showToast({ type: 'success', message: 'Zone created.' });
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
      await updateZone(row.id, { is_active: true });
      showToast({ type: 'success', message: 'Zone activated.' });
      await fetchRows();
    } catch (error) {
      showToast({ type: 'error', message: parseErrorMessage(error) });
    }
  };

  const handleDeactivate = async () => {
    if (!deleteTarget?.id) return;

    setDeleting(true);
    try {
      await deleteZone(deleteTarget.id);
      showToast({ type: 'success', message: 'Zone deactivated.' });
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
        title="Zones"
        description="Manage zones inside selected location."
        actions={canWrite ? <Button onClick={openCreate} disabled={!locationOptions.length}>Create Zone</Button> : null}
      />

      <Card>
        <CardBody className="space-y-4">
          <FiltersBar
            searchValue={qInput}
            onSearchChange={setQInput}
            searchPlaceholder="Search code or name"
            leftSlot={(
              <div className="flex flex-wrap gap-3">
                <label className="min-w-[220px]">
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
                      </option>
                    ))}
                  </select>
                </label>

                <label className="min-w-[220px]">
                  <span className="mb-2 block text-sm font-medium text-slate-900">Location</span>
                  <select
                    className="w-full rounded-2xl border px-3 py-2.5 text-sm"
                    value={selectedLocationId}
                    onChange={(event) => {
                      setSelectedLocationId(event.target.value);
                      setOffset(0);
                    }}
                    disabled={!selectedWarehouseId}
                  >
                    <option value="">Select location</option>
                    {locationOptions.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.code} - {location.name}
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

          {!selectedLocationId ? (
            <>
              {canWrite && selectedWarehouseId && !locationOptions.length ? (
                <p className="text-sm text-slate-500">Tidak ada location aktif. Buat/aktifkan location terlebih dulu.</p>
              ) : null}
              <EmptyState
                icon={Grid3X3}
                title="Select a location"
                description="Select warehouse and active location to view zones."
              />
            </>
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
                  if (column.key === 'location') {
                    return locationNameById.get(row.location_id) || row.location_code || '-';
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
              icon={Grid3X3}
              title="No zones yet"
              description="Create zone for this location."
              action={canWrite ? <Button onClick={openCreate}>Create Zone</Button> : null}
            />
          )}
        </CardBody>
      </Card>

      <ZoneFormModal
        open={modalOpen}
        initialData={editingRow}
        warehouses={warehouseOptions}
        locations={allActiveLocations}
        defaultWarehouseId={selectedWarehouseId}
        defaultLocationId={selectedLocationId}
        loading={saving}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onGoLocations={() => navigate('/warehouse-setup/locations')}
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
