const express = require('express');
const auth = require('../../middlewares/auth');
const requirePerm = require('../../middlewares/requirePerm');
const validate = require('../../middlewares/validate');
const PERMISSIONS = require('../../shared/constants/permissions');
const controller = require('./warehouseSetup.controller');
const schema = require('./warehouseSetup.schema');

const router = express.Router();

router.use(auth);

router.get('/warehouses', requirePerm(PERMISSIONS.WAREHOUSE_SETUP_READ), validate(schema.validateListWarehouses), controller.listWarehouses);
router.post('/warehouses', requirePerm(PERMISSIONS.WAREHOUSE_SETUP_WRITE), validate(schema.validateCreateWarehouse), controller.createWarehouse);
router.get('/warehouses/:id', requirePerm(PERMISSIONS.WAREHOUSE_SETUP_READ), validate(schema.validateIdParam), controller.getWarehouseById);
router.patch('/warehouses/:id', requirePerm(PERMISSIONS.WAREHOUSE_SETUP_WRITE), validate(schema.validateIdParam), validate(schema.validateUpdateWarehouse), controller.updateWarehouse);
router.delete('/warehouses/:id', requirePerm(PERMISSIONS.WAREHOUSE_SETUP_WRITE), validate(schema.validateIdParam), controller.deleteWarehouse);

router.get('/locations', requirePerm(PERMISSIONS.WAREHOUSE_SETUP_READ), validate(schema.validateListLocations), controller.listLocations);
router.post('/locations', requirePerm(PERMISSIONS.WAREHOUSE_SETUP_WRITE), validate(schema.validateCreateLocation), controller.createLocation);
router.get('/locations/:id', requirePerm(PERMISSIONS.WAREHOUSE_SETUP_READ), validate(schema.validateIdParam), controller.getLocationById);
router.patch('/locations/:id', requirePerm(PERMISSIONS.WAREHOUSE_SETUP_WRITE), validate(schema.validateIdParam), validate(schema.validateUpdateLocation), controller.updateLocation);
router.delete('/locations/:id', requirePerm(PERMISSIONS.WAREHOUSE_SETUP_WRITE), validate(schema.validateIdParam), controller.deleteLocation);

router.get('/zones', requirePerm(PERMISSIONS.WAREHOUSE_SETUP_READ), validate(schema.validateListZones), controller.listZones);
router.post('/zones', requirePerm(PERMISSIONS.WAREHOUSE_SETUP_WRITE), validate(schema.validateCreateZone), controller.createZone);
router.get('/zones/:id', requirePerm(PERMISSIONS.WAREHOUSE_SETUP_READ), validate(schema.validateIdParam), controller.getZoneById);
router.patch('/zones/:id', requirePerm(PERMISSIONS.WAREHOUSE_SETUP_WRITE), validate(schema.validateIdParam), validate(schema.validateUpdateZone), controller.updateZone);
router.delete('/zones/:id', requirePerm(PERMISSIONS.WAREHOUSE_SETUP_WRITE), validate(schema.validateIdParam), controller.deleteZone);

module.exports = router;
