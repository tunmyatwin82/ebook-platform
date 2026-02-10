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
        console.log("📋 Fetching all orders...");
        const res = await nocoApi.get(`/api/v2/tables/${ORDERS_TABLE_ID}/records`, {
            params: { limit: 100 }
        });
        console.log("📋 Raw API Response:", res.data);
        const orders = normalizeList(res);
        console.log("📋 Normalized Orders:", orders);
        return orders;
    } catch (e) {
        console.error("❌ Fetch Orders Error:", e.response?.data || e.message);
        return [];
    }
};

export const checkOrderStatus = async (phone) => {
    try {
        const inputPhone = String(phone).trim();
        console.log("🔍 Searching for phone:", inputPhone);

        // ပထမဆုံး order အားလုံး ယူမယ်၊ ပြီးမှ filter မယ်
        const res = await nocoApi.get(`/api/v2/tables/${ORDERS_TABLE_ID}/records`, {
            params: { limit: 100 }
        });

        console.log("🔍 Raw API Response:", res.data);
        const allOrders = normalizeList(res);
        console.log("🔍 All Orders:", allOrders);

        // Client-side filter လုပ်မယ်
        const cleanPhone = inputPhone.startsWith('0') ? inputPhone.substring(1) : inputPhone;
        const filteredOrders = allOrders.filter(order => {
            const orderPhone = String(order.phone || '').trim();
            return orderPhone.includes(cleanPhone) || orderPhone.includes(inputPhone);
        });

        // ✅ နောက်ဆုံး order (id အကြီးဆုံး) ကို ပြအောင် sort descending
        const orders = filteredOrders.sort((a, b) => (b.id || 0) - (a.id || 0));

        console.log("🔍 Filtered & Sorted Orders (latest first):", orders);

        if (orders.length > 0) {
            const order = orders[0]; // ✅ နောက်ဆုံး order (id အကြီးဆုံး)
            const currentStatus = String(order.status || '').toLowerCase().trim();

            // ✅ Book info ယူမယ် (title နဲ့ download link)
            if (order.book_id) {
                try {
                    const bookRes = await nocoApi.get(`/api/v2/tables/${BOOKS_TABLE_ID}/records/${order.book_id}`);
                    order.book_title = bookRes.data.title || 'Unknown Book';
                    // completed ဖြစ်မှသာ download link ထည့်ပေးမည်
                    if (currentStatus === 'completed') {
                        order.download_url = bookRes.data.file_url;
                    } else {
                        order.download_url = null;
                    }
                } catch (err) {
                    order.book_title = 'Book #' + order.book_id;
                    order.download_url = null;
                }
            } else {
                order.book_title = 'N/A';
                order.download_url = null;
            }
            return [order];
        }
        return [];
    } catch (e) {
        console.error("❌ Check Order Error:", e.response?.data || e.message);
        return [];
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        console.log("🔄 Updating order:", orderId, "to status:", status);
        // NocoDB PATCH - record တစ်ခုချင်း update
        const res = await nocoApi.patch(`/api/v2/tables/${ORDERS_TABLE_ID}/records`, {
            id: orderId,
            status: status
        });
        console.log("✅ Update response:", res.data);
        return res;
    } catch (e) {
        console.error("❌ Update Error:", e.response?.data || e.message);
        throw e;
    }
};

// --- 4. Telegram Notification ---
const sendTelegramNotification = async (message, photoUrl = null) => {
    try {
        if (photoUrl) {
            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
            await axios.post(url, {
                chat_id: TELEGRAM_CHAT_ID,
                photo: photoUrl,
                caption: message,
                parse_mode: 'HTML'
            });
        } else {
            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
            await axios.post(url, {
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            });
        }
    } catch (error) {
        console.error('Telegram Error:', error.message);
    }
};

export const submitOrder = async (orderData) => {
    try {
        let attachmentData = null;
        let screenshotUrl = null;
        if (orderData.screenshot) {
            const formData = new FormData();
            formData.append('file', orderData.screenshot);
            const uploadRes = await nocoApi.post(`/api/v2/storage/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (uploadRes.data?.[0]) {
                attachmentData = [{ path: uploadRes.data[0].path }];
                // Construct full URL for Telegram message if needed
                screenshotUrl = `https://db.drtunmyatwin.com/${uploadRes.data[0].path}`;
            }
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

        const response = await nocoApi.post(`/api/v2/tables/${ORDERS_TABLE_ID}/records`, payload);

        // Send Notification to Telegram Channel
        if (response.data) {
            const msg = `<b>📦 New Order Received!</b>\n\n` +
                `👤 <b>Name:</b> ${orderData.name}\n` +
                `📱 <b>Phone:</b> ${orderData.phone}\n` +
                `💰 <b>Amount:</b> ${orderData.amount} MMK\n` +
                `💳 <b>Payment:</b> ${orderData.paymentMethod}\n` +
                `📚 <b>Book ID:</b> ${orderData.book_id}`;

            // Pass screenshotUrl to send photo
            sendTelegramNotification(msg, screenshotUrl);
        }

        return response;
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

    const response = await nocoApi.post(`/api/v2/tables/${REQUESTS_TABLE_ID}/records`, payload);

    // Send Notification to Telegram Channel with Inline Button
    if (response) {
        const msg = `<b>🙋‍♂️ New Book Request!</b>\n\n` +
            `📚 <b>Title:</b> ${data.bookName}\n` +
            `✍️ <b>Author:</b> ${data.author || 'Unknown'}\n` +
            `👤 <b>Requested by:</b> ${data.userName}`;

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        try {
            await axios.post(url, {
                chat_id: TELEGRAM_CHAT_ID,
                text: msg,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "🗳 Vote on Website", url: "https://shop.drtunmyatwin.com/community" }
                        ]
                    ]
                }
            });
        } catch (error) {
            console.error('Telegram Request Notification Error:', error.message);
        }
    }

    return response;
};

export const voteRequest = async (reqId, currentVotes) => {
    return await nocoApi.patch(`/api/v2/tables/${REQUESTS_TABLE_ID}/records`, {
        id: reqId,
        votes: (Number(currentVotes) || 0) + 1
    });
};
