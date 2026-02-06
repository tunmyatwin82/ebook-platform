const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware - အားလုံးကို လက်ခံဖို့ CORS ကို origin: '*' ထားပါမယ်
app.use(cors({ origin: '*' }));
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// DB Check
pool.query('SELECT NOW()', (err) => {
  if (err) console.error('❌ DB Connection Error:', err.message);
  else console.log('✅ Order DB Connected');
});

// Create Order Route
app.post('/orders', async (req, res) => {
  console.log('📩 Request Received:', req.body); // ဘာ data ဝင်လာလဲ စစ်ဖို့

  // Frontend က ပို့လာမယ့် ဖြစ်နိုင်ခြေရှိသော နာမည်များအားလုံးကို ညှိပေးထားခြင်း
  const name = req.body.customer_name || req.body.name || 'Anonymous';
  const email = req.body.customer_email || req.body.email || 'no-email';
  const bookId = req.body.book_id || req.body.bookId || 0;
  const price = req.body.amount || req.body.price || 0;

  try {
    const result = await pool.query(
      'INSERT INTO orders (customer_name, customer_email, book_id, amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, parseInt(bookId), parseFloat(price), 'pending']
    );
    console.log('✅ Order Saved:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ DB Error:', err.message);
    res.status(500).json({ error: 'Database error occurred' });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Order Service running on port ${PORT}`);
});
