// src/lib/api.js (Super Debug Version)
import axios from 'axios';

// --- CONFIG (Your details are correct) ---
const BASE_URL = 'https://db.drtunmyatwin.com';
const API_TOKEN = 'jk9vhwA4eEU_TO6w1hlS4dQD6KJpzLsLR-H6dFEZ';
const ORDERS_TABLE_ID = 'mc5yx33qmli9mwu'; 
const BOOKS_TABLE_ID = 'mr399coumyy2i0e'; 
const REQUESTS_TABLE_ID = 'mdjoi907siejqoe'; 
const TELEGRAM_BOT_TOKEN = '8397404315:AAGaa-B3fxn2NsjWOUl0jKFp3Ad9vhuxa00';
const TELEGRAM_CHAT_ID = '@shopdrtunmyatwin';

const nocoApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'xc-token': API_TOKEN }
});

// --- Unchanged Functions ---
export const fetchBooks = async () => { /*...*/ };
export const submitOrder = async (orderData) => { /*...*/ };
export const checkOrderStatus = async (phone) => { /*...*/ };
export const fetchOrders = async () => { /*...*/ };
export const updateOrderStatus = async (id, status) => { /*...*/ };
export const voteRequest = async (id, currentVotes) => { /*...*/ };
export const fetchRequests = async () => { try { const res = await nocoApi.get(`/api/v2/tables/${REQUESTS_TABLE_ID}/records`); return res.data.list; } catch (e) { return []; } };


// ==========================================================
// ★★★ DEBUGGING THIS FUNCTION ★★★
// ==========================================================
export const submitRequest = async (data) => {
  // 1. Prepare NocoDB data payload
  const nocoPayload = {
    book_name: data.bookName,
    author: data.author,
    requested_by: data.userName,
    votes: 1, 
    status: 'pending'
  };
  
  // LOG 1: What are we sending to NocoDB?
  console.log("DEBUG: Step 1 - Preparing to send data to NocoDB:", nocoPayload);

  try {
    // 2. Attempt to POST to NocoDB
    const res = await nocoApi.post(`/api/v2/tables/${REQUESTS_TABLE_ID}/records`, nocoPayload);
    
    // LOG 2: If NocoDB call is successful
    console.log("DEBUG: Step 2 - NocoDB submission successful!", res.data);

    // 3. Prepare Telegram message payload
    const messageText = `🔥 New Request\n\nBook: ${data.bookName}\nBy: ${data.userName}\n\nVote here: https://shop.drtunmyatwin.com/community`;
    const telegramPayload = {
      chat_id: TELEGRAM_CHAT_ID,
      text: messageText,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: [[{ text: "🗳️ Vote on Website", url: "https://shop.drtunmyatwin.com/community" }]] }
    };
    
    // LOG 3: What are we sending to Telegram?
    console.log("DEBUG: Step 3 - Preparing to send message to Telegram:", telegramPayload);
    
    // 4. Attempt to POST to Telegram
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, telegramPayload);
    
    // LOG 4: If Telegram call is successful
    console.log("DEBUG: Step 4 - Telegram message sent successfully!");

    return res.data;

  } catch (error) {
    // LOG 5: THIS IS THE MOST IMPORTANT LOG!
    // It captures ANY error from NocoDB or Telegram.
    console.error("DEBUG: CRITICAL ERROR during submit process!", error.response ? error.response.data : error.message);
    
    // Re-throw the error so the UI can know something went wrong
    throw error;
  }
};
