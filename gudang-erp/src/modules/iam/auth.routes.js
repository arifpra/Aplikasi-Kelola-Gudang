const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const authController = require('./auth.controller');
const { validateLoginBody } = require('./auth.schema');

const router = express.Router();

router.post('/login', validate(validateLoginBody), authController.login);
router.get('/me', auth, authController.me);

module.exports = router;
