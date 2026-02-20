import { useCallback, useEffect, useState } from 'react';
import { getProducts } from './products.api';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Gagal mengambil data produk.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  return {
    products,
    loading,
    error,
    refreshProducts,
  };
}
