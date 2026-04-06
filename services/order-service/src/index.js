const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Database Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// DB Connection Check
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('❌ DB Connection Error:', err.message);
  } else {
    console.log('✅ Order DB Connected Successfully');
  }
});

/**
 * Create Order Route
 * /api/orders ရော /orders ရော နှစ်ခုလုံးကို Support လုပ်ပေးထားပါတယ်
 */
const createOrder = async (req, res) => {
  console.log('📩 Request Received:', req.body);

  const name = req.body.customer_name || req.body.name || 'Anonymous';
  const email = req.body.customer_email || req.body.email || 'no-email';
  const bookId = req.body.book_id || req.body.bookId || 0;
  const price = req.body.amount || req.body.price || 0;

  try {
    const result = await pool.query(
      'INSERT INTO orders (customer_name, customer_email, book_id, amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, parseInt(bookId), parseFloat(price), 'pending']
    );
    console.log('✅ Order Saved to DB:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ DB Error:', err.message);
    res.status(500).json({ error: 'Database error occurred', details: err.message });
  }
};

// Route Definitions
app.post('/api/orders', createOrder);
app.post('/orders', createOrder);

app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Root route for health check
app.get('/', (req, res) => {
  res.send('Order Service is running...');
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Order Service is actively listening on port ${PORT}`);
});
