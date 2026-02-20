const ApiError = require('../../utils/apiError');

const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;

const validateCreateTransaction = (payload) => {
  const { product_id, quantity, type } = payload;

  if (!isPositiveInteger(product_id) || !isPositiveInteger(quantity) || !['in', 'out'].includes(type)) {
    throw new ApiError(400, 'Data transaksi tidak valid.');
  }

  return {
    product_id,
    quantity,
    type,
  };
};

module.exports = {
  validateCreateTransaction,
};
