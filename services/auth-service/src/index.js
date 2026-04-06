const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Database Connection
const pool = new Pool({
  host: 'ebook-postgres', // Infrastructure ထဲက နာမည်
  database: 'auth_db',
  user: 'admin',
  password: 'your_secure_password', // သင်ပေးခဲ့တဲ့ password
  port: 5432,
});

// Root Route
app.get('/', (req, res) => res.send('Auth Service is Running!'));

// Register Route
app.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email',
      [email, hashedPassword, role || 'customer']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'User already exists or DB error' });
  }
});

app.listen(3000, () => console.log('Auth Service on port 3000'));
