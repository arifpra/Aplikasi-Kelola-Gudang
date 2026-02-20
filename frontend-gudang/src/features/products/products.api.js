import apiClient from '../../lib/api/client';

const unwrapData = (response) => response.data?.data ?? response.data;

export const getProducts = async () => {
  const response = await apiClient.get('/products');
  return unwrapData(response);
};

export const createProduct = async (payload) => {
  const response = await apiClient.post('/products', payload);
  return unwrapData(response);
};

export const deleteProductById = async (id) => {
  await apiClient.delete(`/products/${id}`);
};
