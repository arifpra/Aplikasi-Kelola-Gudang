const asyncHandler = require('../../shared/utils/asyncHandler');
const { sendSuccess } = require('../../shared/utils/apiResponse');
const service = require('./warehouseSetup.service');

const listWarehouses = asyncHandler(async (req, res) => {
  const { q, limit, offset, isActive } = req.query;
  const result = await service.listWarehouses({ q, limit, offset, isActive });

  return sendSuccess(res, {
    rows: result.rows,
    total: result.total,
    limit,
    offset,
  });
});

const getWarehouseById = asyncHandler(async (req, res) => {
  const data = await service.getWarehouseById(req.params.id);
  return sendSuccess(res, data);
});

const createWarehouse = asyncHandler(async (req, res) => {
  const data = await service.createWarehouse(req.body, req);
  return sendSuccess(res, data, 201, 'Created');
});

const updateWarehouse = asyncHandler(async (req, res) => {
  const data = await service.updateWarehouse(req.params.id, req.body, req);
  return sendSuccess(res, data, 200, 'Updated');
});

const deleteWarehouse = asyncHandler(async (req, res) => {
  const data = await service.softDeleteWarehouse(req.params.id, req);
  return sendSuccess(res, data, 200, 'Deleted');
});

const listLocations = asyncHandler(async (req, res) => {
  const { q, warehouseId, limit, offset, isActive } = req.query;
  const result = await service.listLocations({ q, warehouseId, limit, offset, isActive });

  return sendSuccess(res, {
    rows: result.rows,
    total: result.total,
    limit,
    offset,
  });
});

const getLocationById = asyncHandler(async (req, res) => {
  const data = await service.getLocationById(req.params.id);
  return sendSuccess(res, data);
});

const createLocation = asyncHandler(async (req, res) => {
  const data = await service.createLocation(req.body, req);
  return sendSuccess(res, data, 201, 'Created');
});

const updateLocation = asyncHandler(async (req, res) => {
  const data = await service.updateLocation(req.params.id, req.body, req);
  return sendSuccess(res, data, 200, 'Updated');
});

const deleteLocation = asyncHandler(async (req, res) => {
  const data = await service.softDeleteLocation(req.params.id, req);
  return sendSuccess(res, data, 200, 'Deleted');
});

const listZones = asyncHandler(async (req, res) => {
  const { q, locationId, limit, offset, isActive } = req.query;
  const result = await service.listZones({ q, locationId, limit, offset, isActive });

  return sendSuccess(res, {
    rows: result.rows,
    total: result.total,
    limit,
    offset,
  });
});

const getZoneById = asyncHandler(async (req, res) => {
  const data = await service.getZoneById(req.params.id);
  return sendSuccess(res, data);
});

const createZone = asyncHandler(async (req, res) => {
  const data = await service.createZone(req.body, req);
  return sendSuccess(res, data, 201, 'Created');
});

const updateZone = asyncHandler(async (req, res) => {
  const data = await service.updateZone(req.params.id, req.body, req);
  return sendSuccess(res, data, 200, 'Updated');
});

const deleteZone = asyncHandler(async (req, res) => {
  const data = await service.softDeleteZone(req.params.id, req);
  return sendSuccess(res, data, 200, 'Deleted');
});

module.exports = {
  listWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  listLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  listZones,
  getZoneById,
  createZone,
  updateZone,
  deleteZone,
};
