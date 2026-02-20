const express = require('express');
const transactionsController = require('./transactions.controller');
const asyncHandler = require('../../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(transactionsController.getTransactions));
router.post('/', asyncHandler(transactionsController.createTransaction));

module.exports = router;
