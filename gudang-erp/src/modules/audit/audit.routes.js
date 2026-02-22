const express = require('express');
const auth = require('../../middlewares/auth');
const requirePerm = require('../../middlewares/requirePerm');
const validate = require('../../middlewares/validate');
const PERMISSIONS = require('../../shared/constants/permissions');
const auditController = require('./audit.controller');
const { validateListLogsQuery } = require('./audit.schema');

const router = express.Router();

router.get('/logs', auth, requirePerm(PERMISSIONS.COMPLIANCE_READ), validate(validateListLogsQuery), auditController.listLogs);

module.exports = router;
