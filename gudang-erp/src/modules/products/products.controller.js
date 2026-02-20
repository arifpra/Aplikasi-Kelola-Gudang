const productService = require('./products.service');
const { sendSuccess } = require('../../utils/apiResponse');

const createProduct = async (req, res) => {
  const product = await productService.createProduct(req.body);
  return sendSuccess(res, product, 201, 'Produk berhasil dibuat.');
};

const getProducts = async (_req, res) => {
  const products = await productService.listProducts();
  return sendSuccess(res, products);
};

const updateProduct = async (req, res) => {
  const updated = await productService.updateProduct(req.params.id, req.body);
  return sendSuccess(res, updated, 200, 'Data barang berhasil diperbarui!');
};

const deleteProduct = async (req, res) => {
  await productService.deleteProduct(req.params.id);
  return sendSuccess(res, null, 200, 'Barang berhasil dihapus!');
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
