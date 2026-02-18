const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Ambil koneksi dari db.js

const app = express();

// Middleware (Penerjemah JSON)
app.use(cors());
app.use(express.json());

// --- FITUR 1: TAMBAH BARANG (CREATE) ---
app.post('/products', async (req, res) => {
  try {
    const { sku, name, category, stock } = req.body;
    
    const newProduct = await pool.query(
      "INSERT INTO products (sku, name, category, stock) VALUES ($1, $2, $3, $4) RETURNING *",
      [sku, name, category, stock]
    );

    res.status(201).json(newProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error: Pastikan SKU tidak duplikat!");
  }
});

// --- FITUR 2: LIHAT SEMUA BARANG (READ) ---
app.get('/products', async (req, res) => {
  try {
    const allProducts = await pool.query("SELECT * FROM products ORDER BY id DESC");
    res.json(allProducts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post('/transactions', async (req, res) => {
  try {
    const { product_id, quantity, type } = req.body;

    // --- LANGKAH 1: Validasi Stok (Hanya jika barang keluar) ---
    if (type === 'out') {
      const product = await pool.query("SELECT stock FROM products WHERE id = $1", [product_id]);
      
      if (product.rows.length === 0) {
        return res.status(404).send("Produk tidak ditemukan!");
      }

      const currentStock = product.rows[0].stock;
      if (currentStock < quantity) {
        // Jika stok kurang, kirim error 400 dan BERHENTI di sini
        return res.status(400).send("Maaf, stok tidak cukup untuk melakukan pengeluaran!");
      }
    }

    // --- LANGKAH 2: Simpan Riwayat ---
    await pool.query(
      "INSERT INTO stock_movements (product_id, quantity, type) VALUES ($1, $2, $3)",
      [product_id, quantity, type]
    );

    // --- LANGKAH 3: Update Stok di Tabel Products ---
    let queryUpdate = "";
    if (type === 'in') {
      queryUpdate = "UPDATE products SET stock = stock + $1 WHERE id = $2";
    } else {
      queryUpdate = "UPDATE products SET stock = stock - $1 WHERE id = $2";
    }

    await pool.query(queryUpdate, [quantity, product_id]);

    res.status(201).send(`Berhasil mencatat barang ${type}!`);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Gagal mencatat transaksi.");
  }
});

// --- FITUR 4: LIHAT RIWAYAT TRANSAKSI (READ WITH JOIN) ---
app.get('/transactions', async (req, res) => {
  try {
    const history = await pool.query(`
      SELECT 
        sm.id, 
        p.name as product_name, 
        p.sku, 
        sm.quantity, 
        sm.type, 
        sm.created_at
      FROM stock_movements sm
      JOIN products p ON sm.product_id = p.id
      ORDER BY sm.created_at DESC
    `);
    
    res.json(history.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error saat mengambil riwayat.");
  }
});

// --- FITUR 5: EDIT DATA BARANG (UPDATE) ---
app.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;

    await pool.query(
      "UPDATE products SET name = $1, category = $2 WHERE id = $3",
      [name, category, id]
    );

    res.send("Data barang berhasil diperbarui!");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- FITUR 6: HAPUS BARANG (DELETE) ---
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah ada transaksi terkait barang ini
    const check = await pool.query("SELECT * FROM stock_movements WHERE product_id = $1", [id]);
    
    if (check.rows.length > 0) {
      return res.status(400).send("Gagal hapus! Barang ini sudah memiliki riwayat transaksi.");
    }

    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.send("Barang berhasil dihapus!");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});