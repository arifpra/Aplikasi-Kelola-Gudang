const express = require('express');
const auth = require('../../middlewares/auth');
const requirePerm = require('../../middlewares/requirePerm');
const PERMISSIONS = require('../../shared/constants/permissions');
const iamController = require('./iam.controller');

const router = express.Router();

router.get('/roles', auth, requirePerm(PERMISSIONS.MASTERDATA_READ), iamController.listRoles);
router.get('/permissions', auth, requirePerm(PERMISSIONS.MASTERDATA_READ), iamController.listPermissions);

module.exports = router;
