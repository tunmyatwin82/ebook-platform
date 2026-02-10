import axios from 'axios';

const BASE_URL = 'https://db.drtunmyatwin.com';
const API_TOKEN = 'ksQr7hW63EpuDi4CV0x58W1h2EaXHJIllmJtv9tQ';

const ORDERS_TABLE_ID = 'mbqom60ofxn8skz'; 
const BOOKS_TABLE_ID = 'mq1vecqh3omezlh'; 
const REQUESTS_TABLE_ID = 'mlznoyczgo8q4t9'; 

const nocoApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'xc-token': API_TOKEN, 'Content-Type': 'application/json' }
});

// ✅ Data ပုံစံကို အမြဲတမ်း Array ဖြစ်အောင် ပြုပြင်ပေးမည့် function
const normalizeList = (res) => {
  if (res.data && res.data.list && Array.isArray(res.data.list)) return res.data.list;
  if (Array.isArray(res.data)) return res.data;
  return [];
};

// --- 1. Books ---
export const fetchBooks = async () => {
  try {
    const res = await nocoApi.get(`/api/v2/tables/${BOOKS_TABLE_ID}/records`);
    return normalizeList(res).map(b => ({
      ...b,
      id: b.Id || b.id,
      title: b.title || b.book_name,
      cover_image: b.cover_image
    }));
  } catch (e) { return []; }
};

// --- 2. Orders ---

// ✅ Admin မှာ order တွေ အကုန်ပေါ်အောင် ပြင်ဆင်ထားသည်
export const fetchOrders = async () => {
  try {
    const res = await nocoApi.get(`/api/v2/tables/${ORDERS_TABLE_ID}/records`, {
      params: { sort: '-Id', limit: 100 }
    });
    return normalizeList(res);
  } catch (e) { 
    console.error("Fetch Orders Error:", e);
    return []; 
  }
};

export const checkOrderStatus = async (phone) => {
  try {
    const inputPhone = String(phone).trim();
    // ရှေ့ဆုံးက 0 ကို ဖြုတ်ပြီး ရှာကြည့်ခြင်း (DB ထဲမှာ 9... နဲ့ သိမ်းထားရင်လည်း တွေ့အောင်)
    const cleanPhone = inputPhone.startsWith('0') ? inputPhone.substring(1) : inputPhone;

    const res = await nocoApi.get(`/api/v2/tables/${ORDERS_TABLE_ID}/records`, {
      params: { 
        where: `(phone,like,%${cleanPhone}%)`,
        sort: '-Id'
      }
    });

    const orders = normalizeList(res);
    
    if (orders.length > 0) {
      const order = orders[0];
      const currentStatus = String(order.status || '').toLowerCase().trim();
      
      // ✅ Logic အမှန်: 'completed' ဖြစ်မှသာ download link ထည့်ပေးမည်
      if (currentStatus === 'completed' && order.book_id) {
        try {
          const bookRes = await nocoApi.get(`/api/v2/tables/${BOOKS_TABLE_ID}/records/${order.book_id}`);
          order.download_url = bookRes.data.file_url;
        } catch (err) { order.download_url = null; }
      } else {
        order.download_url = null;
      }
      return [order];
    }
    return [];
  } catch (e) { return []; }
};

export const updateOrderStatus = async (id, status) => {
  try {
    // NocoDB PATCH မှာ record ID ကို body ထဲမှာ Id (စာလုံးကြီး) နဲ့ ပို့ရတတ်သည်
    return await nocoApi.patch(`/api/v2/tables/${ORDERS_TABLE_ID}/records`, {
      Id: id,
      status: status
    });
  } catch (e) { throw e; }
};

export const submitOrder = async (orderData) => {
  try {
    let attachmentData = null;
    if (orderData.screenshot) {
      const formData = new FormData();
      formData.append('file', orderData.screenshot);
      const uploadRes = await nocoApi.post(`/api/v2/storage/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (uploadRes.data?.[0]) attachmentData = [{ path: uploadRes.data[0].path }];
    }

    const payload = {
      customer_name: orderData.name,
      phone: String(orderData.phone).trim(),
      payment_method: orderData.paymentMethod,
      amount: orderData.amount,
      book_id: Number(orderData.book_id),
      screenshot: attachmentData,
      status: 'pending' // Order တင်ခါစမှာ အမြဲ pending ဖြစ်ရမည်
    };
    return await nocoApi.post(`/api/v2/tables/${ORDERS_TABLE_ID}/records`, payload);
  } catch (e) { throw e; }
};

// --- 3. Community ---
export const fetchRequests = async () => {
  try {
    const res = await nocoApi.get(`/api/v2/tables/${REQUESTS_TABLE_ID}/records`, {
        params: { sort: '-votes', limit: 50 }
    });
    return normalizeList(res);
  } catch (e) { return []; }
};

export const submitRequest = async (data) => {
  const payload = { 
    book_name: data.bookName, 
    author: data.author, 
    requested_by: data.userName, 
    votes: 1, 
    status: 'pending' 
  };
  return await nocoApi.post(`/api/v2/tables/${REQUESTS_TABLE_ID}/records`, payload);
};

export const voteRequest = async (id, currentVotes) => {
  return await nocoApi.patch(`/api/v2/tables/${REQUESTS_TABLE_ID}/records`, { 
    Id: id, 
    votes: (Number(currentVotes) || 0) + 1 
  });
};
