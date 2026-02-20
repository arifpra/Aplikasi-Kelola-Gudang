const ApiError = require('../../utils/apiError');
const transactionRepository = require('./transactions.repository');
const { validateCreateTransaction } = require('./transactions.validator');

const createTransaction = async (payload) => {
  const data = validateCreateTransaction(payload);
  const result = await transactionRepository.createMovementAndUpdateStock(data);

  if (result.status === 'NOT_FOUND') {
    throw new ApiError(404, 'Produk tidak ditemukan!');
  }

  if (result.status === 'INSUFFICIENT_STOCK') {
    throw new ApiError(400, 'Maaf, stok tidak cukup untuk melakukan pengeluaran!');
  }
};

const listTransactions = async () => transactionRepository.findAll();

module.exports = {
  createTransaction,
  listTransactions,
};
