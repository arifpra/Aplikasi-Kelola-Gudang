const ApiError = require('../../shared/utils/apiError');
const { auditLog } = require('../../shared/audit/audit.service');
const repo = require('./warehouseSetup.repo');

function isUniqueViolation(error) {
  return error && error.code === '23505';
}

function formatWritePayload(payload) {
  const next = { ...payload };

  if (typeof next.code === 'string') {
    next.code = next.code.trim().toUpperCase();
  }

  if (typeof next.name === 'string') {
    next.name = next.name.trim();
  }

  if (typeof next.address === 'string') {
    next.address = next.address.trim();
  }

  return next;
}

function ensureFound(record, label = 'Not found') {
  if (!record) throw new ApiError(404, label);
}

async function listWarehouses(query) {
  return repo.listWarehouses(query);
}

async function getWarehouseById(id) {
  const record = await repo.getWarehouseById(id);
  ensureFound(record);
  return record;
}

async function createWarehouse(payload, req) {
  const body = formatWritePayload(payload);

  try {
    const created = await repo.createWarehouse(body);

    await auditLog({
      actorUser: req.user,
      action: 'WAREHOUSE_CREATED',
      entityType: 'WAREHOUSE',
      entityId: created.id,
      meta: { code: created.code, name: created.name },
      req,
    });

    return created;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ApiError(409, 'Code already exists', { field: 'code' });
    }
    throw error;
  }
}

async function updateWarehouse(id, payload, req) {
  await getWarehouseById(id);
  const body = formatWritePayload(payload);

  if (body.is_active === false) {
    const activeChildren = await repo.countActiveLocationsByWarehouseId(id);
    if (activeChildren > 0) throw new ApiError(400, 'Cannot deactivate: has active children');
  }

  try {
    const updated = await repo.updateWarehouse(id, body);
    ensureFound(updated);

    await auditLog({
      actorUser: req.user,
      action: 'WAREHOUSE_UPDATED',
      entityType: 'WAREHOUSE',
      entityId: updated.id,
      meta: { code: updated.code, name: updated.name, changes: Object.keys(payload) },
      req,
    });

    return updated;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ApiError(409, 'Code already exists', { field: 'code' });
    }
    throw error;
  }
}

async function softDeleteWarehouse(id, req) {
  const existing = await getWarehouseById(id);

  const activeChildren = await repo.countActiveLocationsByWarehouseId(id);
  if (activeChildren > 0) throw new ApiError(400, 'Cannot deactivate: has active children');

  const deleted = await repo.softDeleteWarehouse(id);
  ensureFound(deleted);

  await auditLog({
    actorUser: req.user,
    action: 'WAREHOUSE_DELETED',
    entityType: 'WAREHOUSE',
    entityId: deleted.id,
    meta: { code: existing.code, name: existing.name },
    req,
  });

  return deleted;
}

async function listLocations(query) {
  return repo.listLocations(query);
}

async function getLocationById(id) {
  const record = await repo.getLocationById(id);
  ensureFound(record);
  return record;
}

async function createLocation(payload, req) {
  const body = formatWritePayload(payload);

  const warehouse = await repo.getWarehouseById(body.warehouse_id);
  if (!warehouse || !warehouse.is_active) throw new ApiError(404, 'Warehouse not found or inactive');

  try {
    const created = await repo.createLocation(body);

    await auditLog({
      actorUser: req.user,
      action: 'LOCATION_CREATED',
      entityType: 'LOCATION',
      entityId: created.id,
      meta: { code: created.code, name: created.name, warehouse_id: created.warehouse_id },
      req,
    });

    return created;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ApiError(409, 'Code already exists', { field: 'code' });
    }
    throw error;
  }
}

async function updateLocation(id, payload, req) {
  await getLocationById(id);
  const body = formatWritePayload(payload);

  if (body.is_active === false) {
    const activeChildren = await repo.countActiveZonesByLocationId(id);
    if (activeChildren > 0) throw new ApiError(400, 'Cannot deactivate: has active children');
  }

  try {
    const updated = await repo.updateLocation(id, body);
    ensureFound(updated);

    await auditLog({
      actorUser: req.user,
      action: 'LOCATION_UPDATED',
      entityType: 'LOCATION',
      entityId: updated.id,
      meta: { code: updated.code, name: updated.name, changes: Object.keys(payload) },
      req,
    });

    return updated;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ApiError(409, 'Code already exists', { field: 'code' });
    }
    throw error;
  }
}

async function softDeleteLocation(id, req) {
  const existing = await getLocationById(id);

  const activeChildren = await repo.countActiveZonesByLocationId(id);
  if (activeChildren > 0) throw new ApiError(400, 'Cannot deactivate: has active children');

  const deleted = await repo.softDeleteLocation(id);
  ensureFound(deleted);

  await auditLog({
    actorUser: req.user,
    action: 'LOCATION_DELETED',
    entityType: 'LOCATION',
    entityId: deleted.id,
    meta: { code: existing.code, name: existing.name, warehouse_id: existing.warehouse_id },
    req,
  });

  return deleted;
}

async function listZones(query) {
  return repo.listZones(query);
}

async function getZoneById(id) {
  const record = await repo.getZoneById(id);
  ensureFound(record);
  return record;
}

async function createZone(payload, req) {
  const body = formatWritePayload(payload);

  const location = await repo.getLocationById(body.location_id);
  if (!location || !location.is_active) throw new ApiError(404, 'Location not found or inactive');

  try {
    const created = await repo.createZone(body);

    await auditLog({
      actorUser: req.user,
      action: 'ZONE_CREATED',
      entityType: 'ZONE',
      entityId: created.id,
      meta: { code: created.code, name: created.name, location_id: created.location_id },
      req,
    });

    return created;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ApiError(409, 'Code already exists', { field: 'code' });
    }
    throw error;
  }
}

async function updateZone(id, payload, req) {
  await getZoneById(id);
  const body = formatWritePayload(payload);

  try {
    const updated = await repo.updateZone(id, body);
    ensureFound(updated);

    await auditLog({
      actorUser: req.user,
      action: 'ZONE_UPDATED',
      entityType: 'ZONE',
      entityId: updated.id,
      meta: { code: updated.code, name: updated.name, changes: Object.keys(payload) },
      req,
    });

    return updated;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ApiError(409, 'Code already exists', { field: 'code' });
    }
    throw error;
  }
}

async function softDeleteZone(id, req) {
  const existing = await getZoneById(id);
  const deleted = await repo.softDeleteZone(id);
  ensureFound(deleted);

  await auditLog({
    actorUser: req.user,
    action: 'ZONE_DELETED',
    entityType: 'ZONE',
    entityId: deleted.id,
    meta: { code: existing.code, name: existing.name, location_id: existing.location_id },
    req,
  });

  return deleted;
}

module.exports = {
  listWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  softDeleteWarehouse,
  listLocations,
  getLocationById,
  createLocation,
  updateLocation,
  softDeleteLocation,
  listZones,
  getZoneById,
  createZone,
  updateZone,
  softDeleteZone,
};
