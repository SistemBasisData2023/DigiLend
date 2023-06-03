const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // Import modul pg
const app = express();
const dotenv = require('dotenv');
dotenv.config();

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

testDatabaseConnection();

// Import routes from route.js
require('./route.js')(app, pool);