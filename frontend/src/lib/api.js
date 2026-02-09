import axios from 'axios';

const BASE_URL = 'https://db.drtunmyatwin.com';
const API_TOKEN = 'ksQr7hW63EpuDi4CV0x58W1h2EaXHJIllmJtv9tQ';

const ORDERS_TABLE_ID = 'mbqom60ofxn8skz'; 
const BOOKS_TABLE_ID = 'mq1vecqh3omezlh'; 
const REQUESTS_TABLE_ID = 'mlznoyczgo8q4t9'; 

const TELEGRAM_BOT_TOKEN = '8397404315:AAGaa-B3fxn2NsjWOUl0jKFp3Ad9vhuxa00';
const TELEGRAM_CHAT_ID = '@shopdrtunmyatwin';

const nocoApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'xc-token': API_TOKEN }
});

// --- Books Function ---
export const fetchBooks = async () => {
  try {
    const res = await nocoApi.get(`/api/v2/tables/${BOOKS_TABLE_ID}/records`);
    return (res.data.list || []).map(book => {
      // NocoDB ရဲ့ System ID (1, 2, 3...) ကို ယူခြင်း
      const nocoId = book.Id || book.id; 
      
      let finalImageUrl = "";
      if (book.cover_image && Array.isArray(book.cover_image) && book.cover_image.length > 0) {
        finalImageUrl = `${BASE_URL}/${book.cover_image[0].path}`;
      } else if (typeof book.cover_image === 'string' && book.cover_image.startsWith('http')) {
        finalImageUrl = book.cover_image;
      }
      return {
        ...book,
        id: nocoId, // frontend navigation အတွက်
        book_id: nocoId, // order တင်တဲ့အခါ သုံးရန်
        title: book.title || book.book_name,
        cover_image: finalImageUrl
      };
    });
  } catch (e) { 
    console.error("Fetch books error:", e);
    return []; 
  }
};

// --- Orders Functions ---
export const submitOrder = async (orderData) => {
  try {
    let attachmentData = null;

    if (orderData.screenshot) {
      const formData = new FormData();
      formData.append('file', orderData.screenshot);
      
      try {
        const uploadRes = await nocoApi.post(`/api/v2/storage/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if (uploadRes.data && uploadRes.data[0]) {
          attachmentData = [{
            path: uploadRes.data[0].path,
            mimetype: uploadRes.data[0].mimetype,
            size: uploadRes.data[0].size,
            title: uploadRes.data[0].title
          }];
        }
      } catch (uploadErr) {
        console.error("Screenshot upload failed:", uploadErr);
      }
    }

    const payload = {
      customer_name: orderData.name,
      phone: String(orderData.phone),
      payment_method: orderData.paymentMethod,
      amount: orderData.amount,
      book_id: orderData.book_id,
      screenshot: attachmentData,
      status: 'pending'
    };

    const res = await nocoApi.post(`/api/v2/tables/${ORDERS_TABLE_ID}/records`, payload);
    return res.data;
  } catch (e) { 
    console.error("Submit order error:", e.response?.data || e.message);
    throw e; 
  }
};

export const checkOrderStatus = async (phone) => {
  try {
    const res = await nocoApi.get(`/api/v2/tables/${ORDERS_TABLE_ID}/records`, {
      params: { where: `(phone,eq,${String(phone)})` }
    });
    return (res.data.list || []).reverse();
  } catch (e) { return []; }
};

export const fetchOrders = async () => {
  try {
    const res = await nocoApi.get(`/api/v2/tables/${ORDERS_TABLE_ID}/records`, {
      params: { sort: '-Id', limit: 100 }
    });
    // Admin Dashboard မှာ data ပေါ်လာဖို့ list ကို တိုက်ရိုက်ပြန်ပေးပါသည်
    return res.data.list || res.data || [];
  } catch (e) { 
    console.error("Fetch orders error:", e); 
    return []; 
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    await nocoApi.patch(`/api/v2/tables/${ORDERS_TABLE_ID}/records`, { id, status });
  } catch (e) { 
    console.error("Update status error:", e.response?.data || e.message);
    throw e; 
  }
};

// --- Community/Request Functions ---
export const fetchRequests = async () => {
  try {
    const res = await nocoApi.get(`/api/v2/tables/${REQUESTS_TABLE_ID}/records`, {
      params: { sort: '-votes' }
    });
    return res.data.list || [];
  } catch (e) { return []; }
};

export const submitRequest = async (data) => {
  try {
    const payload = {
      book_name: data.bookName,
      author: data.author,
      requested_by: data.userName,
      votes: 1,
      status: 'pending'
    };
    const res = await nocoApi.post(`/api/v2/tables/${REQUESTS_TABLE_ID}/records`, payload);
    
    try {
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: TELEGRAM_CHAT_ID,
        text: `📚 *New Request*\n\nBook: ${data.bookName}\nBy: ${data.userName}`,
        parse_mode: 'Markdown'
      });
    } catch (tgError) { console.error("Telegram notification failed"); }

    return res.data;
  } catch (error) { throw error; }
};

export const voteRequest = async (id, currentVotes) => {
  try {
    await nocoApi.patch(`/api/v2/tables/${REQUESTS_TABLE_ID}/records`, {
      id: id,
      votes: (Number(currentVotes) || 0) + 1
    });
  } catch (e) { throw e; }
};
