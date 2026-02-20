const ApiError = require('../../utils/apiError');

const isNonNegativeInteger = (value) => Number.isInteger(value) && value >= 0;

const validateCreateProduct = (payload) => {
  const { sku, name, category, stock } = payload;
  if (
    typeof sku !== 'string' || !sku.trim() ||
    typeof name !== 'string' || !name.trim() ||
    typeof category !== 'string' || !category.trim() ||
    !isNonNegativeInteger(stock)
  ) {
    throw new ApiError(400, 'Data produk tidak valid.');
  }

  return {
    sku: sku.trim(),
    name: name.trim(),
    category: category.trim(),
    stock,
  };
};

const validateUpdateProduct = (payload) => {
  const { name, category } = payload;
  if (
    typeof name !== 'string' || !name.trim() ||
    typeof category !== 'string' || !category.trim()
  ) {
    throw new ApiError(400, 'Data update tidak valid.');
  }

  return {
    name: name.trim(),
    category: category.trim(),
  };
};

module.exports = {
  validateCreateProduct,
  validateUpdateProduct,
};
