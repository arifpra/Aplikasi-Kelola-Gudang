export function truncate(value, max = 48) {
  if (!value) return '-';
  if (value.length <= max) return value;
  return `${value.slice(0, max - 3)}...`;
}

export function statusBadgeVariant(isActive) {
  return isActive ? 'success' : 'warning';
}

export function statusLabel(isActive) {
  return isActive ? 'Active' : 'Inactive';
}

export function parseErrorMessage(error, fallback = 'Terjadi kesalahan.') {
  if (!error) return fallback;

  const baseMessage = error.message || fallback;
  const details = error.details;

  if (
    baseMessage.includes('Parent tidak ditemukan') ||
    baseMessage.includes('Endpoint/API tidak ditemukan') ||
    baseMessage.includes('Unauthorized (401)') ||
    baseMessage.includes('Network error')
  ) {
    return baseMessage;
  }

  if (!details) return baseMessage;
  if (typeof details === 'string') return `${baseMessage}: ${details}`;

  if (typeof details === 'object') {
    if (details.field) {
      return `${baseMessage} (${details.field})`;
    }

    try {
      return `${baseMessage}: ${JSON.stringify(details)}`;
    } catch (_error) {
      return baseMessage;
    }
  }

  return baseMessage;
}
