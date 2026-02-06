import axios from 'axios';

const BASE_URL = 'https://db.drtunmyatwin.com';
const API_TOKEN = 'jk9vhwA4eEU_TO6w1hlS4dQD6KJpzLsLR-H6dFEZ'; 
const TABLE_ID = 'mc5yx33qmli9mwu'; 

const nocoApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'xc-token': API_TOKEN }
});

// ၁။ စာအုပ်စာရင်းများ ခေါ်ယူခြင်း
export const fetchBooks = async () => {
  try {
    const response = await nocoApi.get(`/api/v1/db/data/v1/p84l8ttjqwnrch0/books`);
    return response.data.list || [];
  } catch (error) {
    console.error("စာအုပ်များ ခေါ်ယူ၍မရပါ:", error);
    return [];
  }
};

// ၂။ အော်ဒါတင်ခြင်း (POST - ပုံတင်ခြင်းနှင့် Record တည်ဆောက်ခြင်း)
export const submitOrder = async (orderData) => {
  try {
    // A. Screenshot ကို Storage ထဲအရင် Upload တင်မယ်
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
    
    // B. NocoDB Attachment Field အတွက် JSON format ပြင်ဆင်ခြင်း
    // NocoDB က ပုံကို Array structure [ { "path": "..." } ] အနေနဲ့ သိမ်းတာပါ
    const screenshotPayload = JSON.stringify(uploadData);

    // C. Table ထဲသို့ Record အသစ်ထည့်ခြင်း
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
    // Console မှာ error အပြည့်အစုံကို ထုတ်ပြမယ် (Debug လုပ်ဖို့)
    console.error("Order Submit Details:", error.response?.data || error.message);
    throw error;
  }
};

// ၃။ အော်ဒါအားလုံးကို ပြန်ခေါ်ခြင်း (Admin Dashboard အတွက်)
export const fetchOrders = async () => {
  try {
    const response = await nocoApi.get(`/api/v2/tables/${TABLE_ID}/records`, {
      params: { 
        sort: '-id', 
        limit: 50 
      }
    });
    
    // NocoDB v2 က list ထဲမှာ data ပြန်ပေးပါတယ်
    return response.data.list || [];
  } catch (error) {
    console.error("Orders Fetch Error:", error.response?.data || error.message);
    return [];
  }
};

// ၄။ အော်ဒါ Status ပြောင်းလဲခြင်း (Approve/Reject)
export const updateOrderStatus = async (id, status) => {
  try {
    // NocoDB v2 PATCH record (id နဲ့ status ကို ပို့ပေးရုံပါပဲ)
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
