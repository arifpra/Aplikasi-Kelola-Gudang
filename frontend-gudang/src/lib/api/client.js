import axios from 'axios';
import { clearAccessToken, getAccessToken } from '../../app/auth/token';
import { showToast } from '../../shared/ui/toastStore';

const rawApiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const API_BASE_URL = String(rawApiBaseUrl).replace(/\/+$/, '');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

if (import.meta.env.DEV) {
  console.info('[API] baseURL:', apiClient.defaults.baseURL);
}

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
    const status = error.response?.status || null;
    const details = error.response?.data?.details || null;
    const backendMessage = error.response?.data?.message;
    const method = (error.config?.method || 'GET').toUpperCase();
    const urlPart = error.config?.url || '';
    const basePart = error.config?.baseURL || apiClient.defaults.baseURL || '';
    const fullUrl = `${String(basePart).replace(/\/+$/, '')}${String(urlPart).startsWith('/') ? '' : '/'}${urlPart}`;

    if (status === 401) {
      showToast({ type: 'error', message: 'Unauthorized (401). Silakan login ulang.' });
      clearAccessToken();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    if (status === 404 && import.meta.env.DEV) {
      console.warn('[API] 404 on:', method, fullUrl);
    }

    const normalizedBackendMessage = String(backendMessage || '').toLowerCase();
    let message = backendMessage || error.message || 'Terjadi kesalahan.';

    if (!error.response) {
      message = 'Network error: backend tidak menyala / CORS / koneksi.';
    } else if (status === 403) {
      message = 'Anda tidak punya akses.';
    } else if (status === 404) {
      if (normalizedBackendMessage === 'not found' || normalizedBackendMessage.includes('not found or inactive')) {
        message = 'Parent tidak ditemukan atau sudah nonaktif. Aktifkan kembali atau pilih parent lain.';
      } else {
        message = `Endpoint/API tidak ditemukan (404). Periksa backend route. [${method} ${urlPart}]`;
      }
    } else if (status === 401) {
      message = 'Unauthorized (401). Silakan login ulang.';
    }

    const parsedError = new Error(message);
    parsedError.status = status;
    parsedError.details = details;
    parsedError.raw = error.response?.data || null;
    parsedError.method = method;
    parsedError.url = urlPart;
    parsedError.fullUrl = fullUrl;

    return Promise.reject(parsedError);
  },
);

export default apiClient;
