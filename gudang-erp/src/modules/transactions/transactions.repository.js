const pool = require('../../config/db');

const findAll = async () => {
  const result = await pool.query(`
    SELECT
      sm.id,
      p.name AS product_name,
      p.sku,
      sm.quantity,
      sm.type,
      sm.created_at
    FROM stock_movements sm
    JOIN products p ON sm.product_id = p.id
    ORDER BY sm.created_at DESC
  `);

  return result.rows;
};

const createMovementAndUpdateStock = async ({ product_id, quantity, type }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const productResult = await client.query(
      'SELECT stock FROM products WHERE id = $1 FOR UPDATE',
      [product_id]
    );

    if (productResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return { status: 'NOT_FOUND' };
    }

    const currentStock = productResult.rows[0].stock;
    if (type === 'out' && currentStock < quantity) {
      await client.query('ROLLBACK');
      return { status: 'INSUFFICIENT_STOCK' };
    }

    await client.query(
      'INSERT INTO stock_movements (product_id, quantity, type) VALUES ($1, $2, $3)',
      [product_id, quantity, type]
    );

    const updateQuery = type === 'in'
      ? 'UPDATE products SET stock = stock + $1 WHERE id = $2'
      : 'UPDATE products SET stock = stock - $1 WHERE id = $2';

    await client.query(updateQuery, [quantity, product_id]);
    await client.query('COMMIT');
    return { status: 'OK' };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  findAll,
  createMovementAndUpdateStock,
};
