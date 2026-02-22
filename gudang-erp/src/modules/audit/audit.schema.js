const validateListLogsQuery = (req) => {
  const query = req.query || {};
  const limit = Number(query.limit ?? 50);
  const offset = Number(query.offset ?? 0);
  const action = typeof query.action === 'string' ? query.action.trim() : '';

  if (!Number.isInteger(limit) || limit < 1 || limit > 200) {
    return { error: 'limit must be an integer between 1 and 200' };
  }

  if (!Number.isInteger(offset) || offset < 0) {
    return { error: 'offset must be an integer >= 0' };
  }

  return {
    value: {
      query: {
        limit,
        offset,
        action: action || null,
      },
    },
  };
};

module.exports = {
  validateListLogsQuery,
};
