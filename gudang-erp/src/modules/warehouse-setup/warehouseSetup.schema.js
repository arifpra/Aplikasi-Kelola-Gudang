const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseListQuery(query = {}) {
  const limit = Number(query.limit ?? 50);
  const offset = Number(query.offset ?? 0);

  if (!Number.isInteger(limit) || limit < 1 || limit > 200) {
    return { error: 'limit must be an integer between 1 and 200' };
  }

  if (!Number.isInteger(offset) || offset < 0) {
    return { error: 'offset must be an integer >= 0' };
  }

  const q = typeof query.q === 'string' ? query.q.trim() : '';

  let isActive = undefined;
  if (typeof query.isActive !== 'undefined') {
    const raw = String(query.isActive).toLowerCase();
    if (['true', '1'].includes(raw)) {
      isActive = true;
    } else if (['false', '0'].includes(raw)) {
      isActive = false;
    } else {
      return { error: 'isActive must be boolean' };
    }
  }

  return {
    value: {
      query: {
        limit,
        offset,
        q: q || null,
        isActive,
      },
    },
  };
}

function validateIdParam(req) {
  const { id } = req.params || {};
  if (!id || !UUID_RE.test(id)) {
    return { error: 'id must be a valid uuid' };
  }

  return {
    value: {
      params: { id },
    },
  };
}

function validateListWarehouses(req) {
  return parseListQuery(req.query);
}

function validateCreateWarehouse(req) {
  const body = req.body || {};
  const code = typeof body.code === 'string' ? body.code.trim() : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const address = typeof body.address === 'string' ? body.address.trim() : null;

  if (!code) return { error: 'code is required' };
  if (!name) return { error: 'name is required' };

  return {
    value: {
      body: {
        code,
        name,
        address,
      },
    },
  };
}

function validateUpdateWarehouse(req) {
  const body = req.body || {};
  const payload = {};

  if (typeof body.code !== 'undefined') {
    if (typeof body.code !== 'string' || !body.code.trim()) {
      return { error: 'code must be non-empty string' };
    }
    payload.code = body.code.trim();
  }

  if (typeof body.name !== 'undefined') {
    if (typeof body.name !== 'string' || !body.name.trim()) {
      return { error: 'name must be non-empty string' };
    }
    payload.name = body.name.trim();
  }

  if (typeof body.address !== 'undefined') {
    if (body.address !== null && typeof body.address !== 'string') {
      return { error: 'address must be string or null' };
    }
    payload.address = body.address === null ? null : body.address.trim();
  }

  if (typeof body.is_active !== 'undefined') {
    if (typeof body.is_active !== 'boolean') {
      return { error: 'is_active must be boolean' };
    }
    payload.is_active = body.is_active;
  }

  if (Object.keys(payload).length === 0) {
    return { error: 'at least one field is required' };
  }

  return {
    value: {
      body: payload,
    },
  };
}

function validateListLocations(req) {
  const parsed = parseListQuery(req.query);
  if (parsed.error) return parsed;

  const warehouseId = typeof req.query.warehouseId === 'string' ? req.query.warehouseId.trim() : '';
  if (warehouseId && !UUID_RE.test(warehouseId)) {
    return { error: 'warehouseId must be a valid uuid' };
  }

  return {
    value: {
      query: {
        ...parsed.value.query,
        warehouseId: warehouseId || null,
      },
    },
  };
}

function validateCreateLocation(req) {
  const body = req.body || {};
  const warehouse_id = typeof body.warehouse_id === 'string' ? body.warehouse_id.trim() : '';
  const code = typeof body.code === 'string' ? body.code.trim() : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';

  if (!warehouse_id || !UUID_RE.test(warehouse_id)) return { error: 'warehouse_id must be a valid uuid' };
  if (!code) return { error: 'code is required' };
  if (!name) return { error: 'name is required' };

  return {
    value: {
      body: {
        warehouse_id,
        code,
        name,
      },
    },
  };
}

function validateUpdateLocation(req) {
  const body = req.body || {};
  const payload = {};

  if (typeof body.code !== 'undefined') {
    if (typeof body.code !== 'string' || !body.code.trim()) {
      return { error: 'code must be non-empty string' };
    }
    payload.code = body.code.trim();
  }

  if (typeof body.name !== 'undefined') {
    if (typeof body.name !== 'string' || !body.name.trim()) {
      return { error: 'name must be non-empty string' };
    }
    payload.name = body.name.trim();
  }

  if (typeof body.is_active !== 'undefined') {
    if (typeof body.is_active !== 'boolean') {
      return { error: 'is_active must be boolean' };
    }
    payload.is_active = body.is_active;
  }

  if (Object.keys(payload).length === 0) {
    return { error: 'at least one field is required' };
  }

  return {
    value: {
      body: payload,
    },
  };
}

function validateListZones(req) {
  const parsed = parseListQuery(req.query);
  if (parsed.error) return parsed;

  const locationId = typeof req.query.locationId === 'string' ? req.query.locationId.trim() : '';
  if (locationId && !UUID_RE.test(locationId)) {
    return { error: 'locationId must be a valid uuid' };
  }

  return {
    value: {
      query: {
        ...parsed.value.query,
        locationId: locationId || null,
      },
    },
  };
}

function validateCreateZone(req) {
  const body = req.body || {};
  const location_id = typeof body.location_id === 'string' ? body.location_id.trim() : '';
  const code = typeof body.code === 'string' ? body.code.trim() : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';

  if (!location_id || !UUID_RE.test(location_id)) return { error: 'location_id must be a valid uuid' };
  if (!code) return { error: 'code is required' };
  if (!name) return { error: 'name is required' };

  return {
    value: {
      body: {
        location_id,
        code,
        name,
      },
    },
  };
}

function validateUpdateZone(req) {
  const body = req.body || {};
  const payload = {};

  if (typeof body.code !== 'undefined') {
    if (typeof body.code !== 'string' || !body.code.trim()) {
      return { error: 'code must be non-empty string' };
    }
    payload.code = body.code.trim();
  }

  if (typeof body.name !== 'undefined') {
    if (typeof body.name !== 'string' || !body.name.trim()) {
      return { error: 'name must be non-empty string' };
    }
    payload.name = body.name.trim();
  }

  if (typeof body.is_active !== 'undefined') {
    if (typeof body.is_active !== 'boolean') {
      return { error: 'is_active must be boolean' };
    }
    payload.is_active = body.is_active;
  }

  if (Object.keys(payload).length === 0) {
    return { error: 'at least one field is required' };
  }

  return {
    value: {
      body: payload,
    },
  };
}

module.exports = {
  validateIdParam,
  validateListWarehouses,
  validateCreateWarehouse,
  validateUpdateWarehouse,
  validateListLocations,
  validateCreateLocation,
  validateUpdateLocation,
  validateListZones,
  validateCreateZone,
  validateUpdateZone,
};
