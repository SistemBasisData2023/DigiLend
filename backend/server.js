const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // Import modul pg
const session = require('express-session');
const app = express();
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

// Fungsi untuk menghasilkan token JWT
const generateToken = (akun) => {
  const payload = {
    id_akun: akun.id_akun,
    username: akun.username,
    // Tambahkan data lain yang perlu Anda sertakan dalam token
  };

  const options = {
    expiresIn: '1h', // Waktu kadaluarsa token (misalnya: 1 jam)
  };

  const secretKey = 'secret-key'; // Ganti dengan kunci rahasia yang lebih aman
  const token = jwt.sign(payload, secretKey, options);

  return token;
};

//Mengizinkan semua permintaan dari semua domain/origin
app.use(cors());

// Middleware untuk mengurai body dengan format JSON
app.use(bodyParser.json());

// Middleware untuk mengurai body dengan format URL-encoded
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
    sslmode: 'require',
  },
});

const testDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to the database');
    client.release();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

module.exports = { generateToken };
testDatabaseConnection();

// Import routes from route.js
require('./route.js')(app, pool);