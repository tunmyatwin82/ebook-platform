import axios from 'axios';

const BASE_URL = 'https://db.drtunmyatwin.com';
const API_TOKEN = 'jk9vhwA4eEU_TO6w1hlS4dQD6KJpzLsLR-H6dFEZ'; 
const TABLE_ID = 'mc5yx33qmli9mwu'; 
const BOOKS_TABLE_PATH = '/api/v1/db/data/v1/p84l8ttjqwnrch0/books';

const nocoApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'xc-token': API_TOKEN }
});

// ၁။ စာအုပ်စာရင်းများ ခေါ်ယူခြင်း
export const fetchBooks = async () => {
  try {
    const response = await nocoApi.get(BOOKS_TABLE_PATH);
    return response.data.list || [];
  } catch (error) {
    console.error("စာအုပ်များ ခေါ်ယူ၍မရပါ:", error);
    return [];
  }
};

// ၂။ အော်ဒါတင်ခြင်း
export const submitOrder = async (orderData) => {
  try {
    const fileFormData = new FormData();
    fileFormData.append('file', orderData.screenshot);

    const uploadRes = await fetch(`${BASE_URL}/api/v1/db/storage/upload`, {
      method: 'POST',
      headers: { 'xc-token': API_TOKEN },
      body: fileFormData
    });

    if (!uploadRes.ok) {
      const errorMsg = await uploadRes.text();
      throw new Error(`Upload Failed: ${errorMsg}`);
    }

    const uploadData = await uploadRes.json();
    const screenshotPayload = JSON.stringify(uploadData);

    const response = await nocoApi.post(`/api/v2/tables/${TABLE_ID}/records`, {
      customer_name: orderData.name,
      phone: orderData.phone,
      payment_method: orderData.paymentMethod,
      screenshot: screenshotPayload, 
      book_id: orderData.book_id,
      status: 'pending',
      amount: Number(orderData.amount) || 0,
      customer_email: orderData.email || 'test@example.com'
    });

    return response.data;
  } catch (error) {
    console.error("Order Submit Details:", error.response?.data || error.message);
    throw error;
  }
};

// ၃။ အော်ဒါအခြေအနေစစ်ဆေးခြင်း (Download Link Fix)
export const checkOrderStatus = async (phone) => {
  try {
    const orderRes = await nocoApi.get(`/api/v2/tables/${TABLE_ID}/records`, {
      params: {
        where: `(phone,eq,${phone})`,
        sort: '-id',
        limit: 1
      }
    });

    const order = orderRes.data.list?.[0];
    if (!order) return null;

    // အခြေအနေ အောင်မြင်ပြီး book_id ပါမှ Link ရှာမယ်
    if (order.status === 'completed' && order.book_id) {
      try {
        // စာအုပ် ID တစ်ခုတည်းကို ခေါ်တဲ့ URL format ကို ပြင်ထားတယ်
        const bookRes = await nocoApi.get(`${BOOKS_TABLE_PATH}/${order.book_id}`);
        
        // database ထဲက file_url column name နဲ့ အတိအကျ ယူရမယ်
        if (bookRes.data && bookRes.data.file_url) {
          order.download_url = bookRes.data.file_url;
        }
      } catch (e) {
        console.error("Book Detail Fetch Error:", e.response?.data || e.message);
      }
    }

    return order;
  } catch (error) {
    console.error("Check Order Error:", error.response?.data || error.message);
    return null;
  }
};

// ၄။ အော်ဒါအားလုံးကို ပြန်ခေါ်ခြင်း
export const fetchOrders = async () => {
  try {
    const response = await nocoApi.get(`/api/v2/tables/${TABLE_ID}/records`, {
      params: { 
        sort: '-id', 
        limit: 50 
      }
    });
    return response.data.list || [];
  } catch (error) {
    console.error("Orders Fetch Error:", error.response?.data || error.message);
    return [];
  }
};

// ၅။ အော်ဒါ Status ပြောင်းလဲခြင်း
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await nocoApi.patch(`/api/v2/tables/${TABLE_ID}/records`, {
      id: id, 
      status: status
    });
    return response.data;
  } catch (error) {
    console.error("Update Status Error:", error.response?.data || error.message);
    throw error;
  }
};
