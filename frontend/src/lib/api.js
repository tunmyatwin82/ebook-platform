import axios from 'axios';

const BASE_URL = 'https://db.drtunmyatwin.com';
const API_TOKEN = 'jk9vhwA4eEU_TO6w1hlS4dQD6KJpzLsLR-H6dFEZ'; 
const TABLE_ID = 'mc5yx33qmli9mwu'; 

const nocoApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'xc-token': API_TOKEN }
});

// ၁။ စာအုပ်စာရင်းများ (v1 အတိုင်း ထားရှိပါသည်)
export const fetchBooks = async () => {
  try {
    const response = await nocoApi.get(`/api/v1/db/data/v1/p84l8ttjqwnrch0/books`);
    return response.data.list || [];
  } catch (error) {
    console.error("စာအုပ်များ ခေါ်ယူ၍မရပါ:", error);
    return [];
  }
};

// ၂။ အော်ဒါတင်ခြင်း (POST - id စာလုံးသေးဖြင့် ညှိထားသည်)
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
    const filePath = uploadData[0].path;

    const response = await nocoApi.post(`/api/v2/tables/${TABLE_ID}/records`, {
      customer_name: orderData.name,
      phone: orderData.phone,
      payment_method: orderData.paymentMethod,
      screenshot: filePath,
      book_id: orderData.book_id,
      status: 'pending',
      amount: Number(orderData.amount) || 0,
      customer_email: 'test@example.com'
    });

    return response.data;
  } catch (error) {
    console.error("Order Submit Error:", error.response?.data || error.message);
    throw error;
  }
};

// ၃။ အော်ဒါအားလုံးကို ပြန်ခေါ်ခြင်း (sort: '-id' ဟု ပြောင်းလဲထားသည်)
export const fetchOrders = async () => {
  try {
    const response = await nocoApi.get(`/api/v2/tables/${TABLE_ID}/records`, {
      params: { 
        sort: '-id', // id စာလုံးသေးဖြင့် ပြင်လိုက်ပါပြီ
        limit: 25 
      }
    });
    
    // v2 records array ကို ဆွဲထုတ်ခြင်း
    const data = response.data.list || response.data.records || response.data || [];
    return Array.isArray(data) ? data : (data.list || []);
  } catch (error) {
    console.error("Orders Fetch Error:", error.response?.data || error.message);
    return [];
  }
};

// ၄။ အော်ဒါ Status ပြောင်းလဲခြင်း
export const updateOrderStatus = async (id, status) => {
  try {
    // PATCH တွင်လည်း id စာလုံးသေးကို သုံးရပါမည်
    await nocoApi.patch(`/api/v2/tables/${TABLE_ID}/records`, {
      id: id, 
      status: status
    });
  } catch (error) {
    console.error("Update Status Error:", error.response?.data || error.message);
  }
};
