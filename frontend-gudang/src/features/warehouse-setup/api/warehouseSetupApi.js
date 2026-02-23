import apiClient from '../../../lib/api/client';

function toQuery(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || typeof value === 'undefined' || value === '' || value === 'all') {
      return;
    }

    searchParams.set(key, String(value));
  });

  return searchParams.toString();
}

async function getList(path, params) {
  const query = toQuery(params);
  const endpoint = query ? `${path}?${query}` : path;
  const response = await apiClient.get(endpoint);
  return response.data?.data || { rows: [], total: 0, limit: 10, offset: 0 };
}

async function post(path, payload) {
  const response = await apiClient.post(path, payload);
  return response.data?.data;
}

async function patch(path, payload) {
  const response = await apiClient.patch(path, payload);
  return response.data?.data;
}

async function remove(path) {
  const response = await apiClient.delete(path);
  return response.data?.data;
}

export function listWarehouses({ q, limit, offset, isActive }) {
  return getList('/warehouse-setup/warehouses', { q, limit, offset, isActive });
}

export function createWarehouse(payload) {
  return post('/warehouse-setup/warehouses', payload);
}

export function updateWarehouse(id, payload) {
  return patch(`/warehouse-setup/warehouses/${id}`, payload);
}

export function deleteWarehouse(id) {
  return remove(`/warehouse-setup/warehouses/${id}`);
}

export function listLocations({ warehouseId, q, limit, offset, isActive }) {
  return getList('/warehouse-setup/locations', { warehouseId, q, limit, offset, isActive });
}

export function createLocation(payload) {
  return post('/warehouse-setup/locations', payload);
}

export function updateLocation(id, payload) {
  return patch(`/warehouse-setup/locations/${id}`, payload);
}

export function deleteLocation(id) {
  return remove(`/warehouse-setup/locations/${id}`);
}

export function listZones({ locationId, q, limit, offset, isActive }) {
  return getList('/warehouse-setup/zones', { locationId, q, limit, offset, isActive });
}

export function createZone(payload) {
  return post('/warehouse-setup/zones', payload);
}

export function updateZone(id, payload) {
  return patch(`/warehouse-setup/zones/${id}`, payload);
}

export function deleteZone(id) {
  return remove(`/warehouse-setup/zones/${id}`);
}
