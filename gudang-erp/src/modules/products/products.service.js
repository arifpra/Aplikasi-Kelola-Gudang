const ApiError = require('../../utils/apiError');
const productRepository = require('./products.repository');
const { validateCreateProduct, validateUpdateProduct } = require('./products.validator');

const createProduct = async (payload) => {
  const data = validateCreateProduct(payload);
  try {
    return await productRepository.create(data);
  } catch (err) {
    if (err.code === '23505') {
      throw new ApiError(409, 'SKU sudah digunakan.');
    }
    throw err;
  }
};

const listProducts = async () => productRepository.findAll();

const updateProduct = async (id, payload) => {
  const data = validateUpdateProduct(payload);
  const updated = await productRepository.updateById(id, data);
  if (!updated) {
    throw new ApiError(404, 'Produk tidak ditemukan.');
  }
  return updated;
};

const deleteProduct = async (id) => {
  const hasHistory = await productRepository.hasMovements(id);
  if (hasHistory) {
    throw new ApiError(400, 'Gagal hapus! Barang ini sudah memiliki riwayat transaksi.');
  }

  const deleted = await productRepository.removeById(id);
  if (!deleted) {
    throw new ApiError(404, 'Produk tidak ditemukan.');
  }
};

module.exports = {
  createProduct,
  listProducts,
  updateProduct,
  deleteProduct,
};
