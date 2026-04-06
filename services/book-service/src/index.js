const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection Configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Database ချိတ်ဆက်မှုရှိမရှိ စမ်းသပ်ခြင်း (Startup Check)
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database ချိတ်ဆက်မှု မအောင်မြင်ပါ:', err.message);
  } else {
    console.log('✅ Database ချိတ်ဆက်မှု အောင်မြင်သည် - Server Time:', res.rows[0].now);
  }
});

// ၁။ စာအုပ်အားလုံးကို ခေါ်ယူခြင်း (GET /books)
app.get('/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching books:', err.message);
    res.status(500).json({ error: 'စာအုပ်များ ခေါ်ယူရာတွင် အမှားအယွင်းရှိနေပါသည်' });
  }
});

// ၂။ စာအုပ်အသစ် ထည့်သွင်းခြင်း (POST /books)
app.post('/books', async (req, res) => {
  const { title, author, price, category, file_url, cover_image } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO books (title, author, price, category, file_url, cover_image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, author, price, category, file_url, cover_image]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding book:', err.message);
    res.status(500).json({ error: 'စာအုပ်အသစ်ထည့်သွင်းခြင်း မအောင်မြင်ပါ' });
  }
});

// ၃။ ID ဖြင့် စာအုပ်တစ်အုပ်ချင်းစီ ရှာဖွေခြင်း (GET /books/:id)
app.get('/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'စာအုပ် ရှာမတွေ့ပါ' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server စတင်မောင်းနှင်ခြင်း
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Book Service သည် Port ${PORT} ပေါ်တွင် အလုပ်လုပ်နေပါပြီ`);
});
