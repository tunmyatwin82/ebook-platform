import axios from 'axios';

const BASE_URL = 'https://db.drtunmyatwin.com';
const API_TOKEN = 'jk9vhwA4eEU_TO6w1hlS4dQD6KJpzLsLR-H6dFEZ'; 

const ORDERS_TABLE_ID = 'mc5yx33qmli9mwu'; 
const BOOKS_TABLE_ID = 'mr399coumyy2i0e'; 

const nocoApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'xc-token': API_TOKEN }
});

export const fetchBooks = async () => {
  try {
    const response = await nocoApi.get(`/api/v2/tables/${BOOKS_TABLE_ID}/records`);
    return response.data.list || [];
  } catch (error) { return []; }
};

export const submitOrder = async (orderData) => {
  try {
    const fileFormData = new FormData();
    fileFormData.append('file', orderData.screenshot);
    const uploadRes = await fetch(`${BASE_URL}/api/v1/db/storage/upload`, {
      method: 'POST',
      headers: { 'xc-token': API_TOKEN },
      body: fileFormData
    });
    const uploadData = await uploadRes.json();
    
    return (await nocoApi.post(`/api/v2/tables/${ORDERS_TABLE_ID}/records`, {
      customer_name: orderData.name,
      phone: orderData.phone,
      payment_method: orderData.paymentMethod,
      screenshot: JSON.stringify(uploadData), 
      book_id: orderData.book_id,
      status: 'pending',
      amount: Number(orderData.amount) || 0,
      customer_email: orderData.email || 'test@example.com'
    })).data;
  } catch (error) { throw error; }
};

// ဒီ function က အသက်ပဲ!
export const checkOrderStatus = async (phone) => {
  try {
    const orderRes = await nocoApi.get(`/api/v2/tables/${ORDERS_TABLE_ID}/records`, {
      params: { where: `(phone,eq,${phone})`, sort: '-id', limit: 1 }
    });

    const order = orderRes.data.list?.[0];
    if (!order) return null;

    const currentStatus = order.status ? order.status.toLowerCase() : '';

    if (currentStatus === 'completed' && order.book_id) {
      // Frontend အတွက် status ကို uniform ဖြစ်အောင် လုပ်ပေးမယ်
      order.status = 'completed';

      try {
        // book_id က string ဖြစ်နေနိုင်လို့ number သေချာပြောင်းမယ်
        const targetBookId = Number(order.book_id);

        // Filter (id,eq,...) ကို သုံးပြီး စာအုပ်ကို ရှာမယ်
        const bookRes = await nocoApi.get(`/api/v2/tables/${BOOKS_TABLE_ID}/records`, {
          params: {
            where: `(id,eq,${targetBookId})`,
            limit: 1
          }
        });

        const bookData = bookRes.data.list?.[0];
        if (bookData && bookData.file_url) {
          // ရှာတွေ့တဲ့ file_url ကို order object ထဲ အတင်းထည့်ပေးလိုက်ပြီ
          order.download_url = bookData.file_url;
        }
      } catch (e) {
        console.error("Book Search Error:", e);
      }
    }
    return order;
  } catch (error) {
    return null;
  }
};

export const fetchOrders = async () => {
  try {
    const res = await nocoApi.get(`/api/v2/tables/${ORDERS_TABLE_ID}/records`, { params: { sort: '-id', limit: 100 } });
    return res.data.list || [];
  } catch (e) { return []; }
};

export const updateOrderStatus = async (id, status) => {
  try {
    return (await nocoApi.patch(`/api/v2/tables/${ORDERS_TABLE_ID}/records`, { id, status })).data;
  } catch (e) { throw e; }
};
