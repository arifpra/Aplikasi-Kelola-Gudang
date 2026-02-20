const transactionService = require('./transactions.service');
const { sendSuccess } = require('../../utils/apiResponse');

const createTransaction = async (req, res) => {
  await transactionService.createTransaction(req.body);
  return sendSuccess(res, null, 201, `Berhasil mencatat barang ${req.body.type}!`);
};

const getTransactions = async (_req, res) => {
  const transactions = await transactionService.listTransactions();
  return sendSuccess(res, transactions);
};

module.exports = {
  createTransaction,
  getTransactions,
};
