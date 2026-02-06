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

// ၂။ အော်ဒါတင်ခြင်း (Amount ပြဿနာကို ဖြေရှင်းထားသည်)
export const submitOrder = async (orderData) => {
  try {
    // Screenshot ပုံကို NocoDB Storage ထဲ အရင်တင်ခြင်း
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

    // အချက်အလက်များကို orders table ထဲသို့ ပို့ခြင်း
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
        // အရေးကြီးဆုံးအချက် - URL မှလာသော price ကို Number အဖြစ်ပြောင်း၍ သိမ်းခြင်း
        amount: Number(orderData.amount) || 0, 
        customer_email: 'test@example.com'
      })
    });

    if (!response.ok) {
      const errorDetail = await response.json();
      console.error("NocoDB Response Error:", errorDetail);
      throw new Error("Order Submission Failed");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
