const express = require('express');
const { Pool } = require('pg'); // Import modul pg
const app = express();

app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false, // Disable SSL
  });

app.get('/hello', (req, res) => {
    res.send('Halo, dunia!');
  });

app.post('/akun', async (req, res) => {
  try {
    const { id_role, nama, npm, username, password } = req.body;

    const client = await pool.connect();
    const query = `
      INSERT INTO akun (id_role, nama, npm, username, password)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [id_role, nama, npm, username, password];

    const result = await client.query(query, values);
    res.json(result.rows[0]);

    client.release();
  } catch (error) {
    console.error('Kesalahan saat menjalankan query:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

const port = 3000; // Port yang akan digunakan oleh server

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
