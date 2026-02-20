const pool = require('../../config/db');

const create = async ({ sku, name, category, stock }) => {
  const result = await pool.query(
    'INSERT INTO products (sku, name, category, stock) VALUES ($1, $2, $3, $4) RETURNING *',
    [sku, name, category, stock]
  );
  return result.rows[0];
};

const findAll = async () => {
  const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
  return result.rows;
};

const updateById = async (id, { name, category }) => {
  const result = await pool.query(
    'UPDATE products SET name = $1, category = $2 WHERE id = $3 RETURNING *',
    [name, category, id]
  );
  return result.rows[0] || null;
};

const removeById = async (id) => {
  const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
  return Boolean(result.rows[0]);
};

const hasMovements = async (id) => {
  const result = await pool.query('SELECT 1 FROM stock_movements WHERE product_id = $1 LIMIT 1', [id]);
  return result.rows.length > 0;
};

module.exports = {
  create,
  findAll,
  updateById,
  removeById,
  hasMovements,
};
