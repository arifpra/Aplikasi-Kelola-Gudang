import axios from 'axios';
import { clearAccessToken, getAccessToken } from '../../app/auth/token';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAccessToken();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    const message = error.response?.data?.message || error.message || 'Terjadi kesalahan.';
    return Promise.reject(new Error(message));
  },
);

export default apiClient;
