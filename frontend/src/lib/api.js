import axios from 'axios';

const BASE_URL = 'https://db.drtunmyatwin.com';
const API_TOKEN = 'jk9vhwA4eEU_TO6w1hlS4dQD6KJpzLsLR-H6dFEZ'; 
const PROJECT_ID = 'p84l8ttjqwnrch0';

// ၁။ စာအုပ်စာရင်းများ ခေါ်ယူခြင်း
export const fetchBooks = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/db/data/v1/${PROJECT_ID}/books`, {
      headers: { 'xc-token': API_TOKEN }
    });
    return response.data.list || [];
  } catch (error) {
    console.error("စာအုပ်များ ခေါ်ယူ၍မရပါ:", error);
    return [];
  }
};

// ၂။ အော်ဒါတင်ခြင်း (Customer ဘက်ခြမ်း)
export const submitOrder = async (orderData) => {
  try {
    const fileFormData = new FormData();
    fileFormData.append('file', orderData.screenshot);

    const uploadRes = await fetch(`${BASE_URL}/api/v1/db/storage/upload`, {
      method: 'POST',
      headers: { 'xc-token': API_TOKEN },
      body: fileFormData
    });

    if (!uploadRes.ok) throw new Error("Screenshot upload failed");
    const uploadData = await uploadRes.json();
    const filePath = uploadData[0].path;

    const response = await fetch(`${BASE_URL}/api/v1/db/data/v1/${PROJECT_ID}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xc-token': API_TOKEN
      },
      body: JSON.stringify({
        customer_name: orderData.name,
        phone: orderData.phone,
        payment_method: orderData.paymentMethod,
        screenshot: [{ path: filePath }],
        book_id: orderData.book_id,
        status: 'pending',
        amount: Number(orderData.amount) || 0, 
        customer_email: 'test@example.com'
      })
    });

    if (!response.ok) throw new Error("Order Submission Failed");
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// -----------------------------------------------------------
// Admin Dashboard အတွက် အသစ်ထည့်သွင်းထားသော Function များ
// -----------------------------------------------------------

// ၃။ အော်ဒါအားလုံးကို ပြန်ခေါ်ခြင်း (Admin အတွက်)
export const fetchOrders = async () => {
  try {
    // sort=-Id က အော်ဒါအသစ်တွေကို ထိပ်ဆုံးကနေ ပြပေးမှာပါ
    const response = await axios.get(`${BASE_URL}/api/v1/db/data/v1/${PROJECT_ID}/orders?sort=-Id`, {
      headers: { 'xc-token': API_TOKEN }
    });
    return response.data.list || [];
  } catch (error) {
    console.error("Orders ခေါ်ယူ၍မရပါ:", error);
    return [];
  }
};

// ၄။ အော်ဒါ Status ကို Update လုပ်ခြင်း (Approve/Reject လုပ်ရန်)
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${BASE_URL}/api/v1/db/data/v1/${PROJECT_ID}/orders/${id}`, 
      { status: status },
      { headers: { 'xc-token': API_TOKEN } }
    );
    return response.data;
  } catch (error) {
    console.error("Status Update လုပ်၍မရပါ:", error);
    throw error;
  }
};
