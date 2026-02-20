const express = require('express');
const productsController = require('./products.controller');
const asyncHandler = require('../../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(productsController.getProducts));
router.post('/', asyncHandler(productsController.createProduct));
router.put('/:id', asyncHandler(productsController.updateProduct));
router.delete('/:id', asyncHandler(productsController.deleteProduct));

module.exports = router;
