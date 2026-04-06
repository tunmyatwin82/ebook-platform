import axios from 'axios';

// Environment variables များမှ ယူရန် ပြင်ဆင်ခြင်း
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://db.drtunmyatwin.com';
const API_TOKEN = process.env.NEXT_PUBLIC_NOCODB_TOKEN;

const BOOKS_TABLE_ID = process.env.NEXT_PUBLIC_BOOK_TABLE_ID;
const ORDERS_TABLE_ID = process.env.NEXT_PUBLIC_ORDERS_TABLE_ID;
const REQUESTS_TABLE_ID = process.env.NEXT_PUBLIC_REQUESTS_TABLE_ID;

const TELEGRAM_BOT_TOKEN = '8397404315:AAGaa-B3fxn2NsjWOUl0jKFp3Ad9vhuxa00';
const TELEGRAM_CHAT_ID = '@shopdrtunmyatwin';

const nocoApi = axios.create({
    baseURL: BASE_URL,
    headers: { 'xc-token': API_TOKEN, 'Content-Type': 'application/json' }
});

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
export const fetchOrders = async () => {
    try {
        const res = await nocoApi.get(`/api/v2/tables/${ORDERS_TABLE_ID}/records`, {
            params: { limit: 100 }
        });
        return normalizeList(res);
    } catch (e) { return []; }
};

export const checkOrderStatus = async (phone) => {
    try {
        const inputPhone = String(phone).trim();
        const res = await nocoApi.get(`/api/v2/tables/${ORDERS_TABLE_ID}/records`, {
            params: { limit: 100 }
        });

        const allOrders = normalizeList(res);
        const cleanPhone = inputPhone.startsWith('0') ? inputPhone.substring(1) : inputPhone;
        const filteredOrders = allOrders.filter(order => {
            const orderPhone = String(order.phone || '').trim();
            return orderPhone.includes(cleanPhone) || orderPhone.includes(inputPhone);
        });

        const orders = filteredOrders.sort((a, b) => (b.id || 0) - (a.id || 0));

        if (orders.length > 0) {
            const order = orders[0];
            const currentStatus = String(order.status || '').toLowerCase().trim();

            if (order.book_id) {
                try {
                    const bookRes = await nocoApi.get(`/api/v2/tables/${BOOKS_TABLE_ID}/records/${order.book_id}`);
                    order.book_title = bookRes.data.title || 'Unknown Book';
                    order.download_url = currentStatus === 'completed' ? bookRes.data.file_url : null;
                } catch (err) {
                    order.book_title = 'Book #' + order.book_id;
                }
            }
            return [order];
        }
        return [];
    } catch (e) { return []; }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        const res = await nocoApi.patch(`/api/v2/tables/${ORDERS_TABLE_ID}/records`, {
            id: orderId,
            status: status
        });
        return res;
    } catch (e) { throw e; }
};

// --- 3. Submit Order (Modified for Telegram Buttons) ---
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
                const filePath = uploadRes.data[0].path;
                attachmentData = JSON.stringify([{ path: filePath }]);
                screenshotUrl = `${BASE_URL}/${filePath}`;
            }
        }

        const payload = {
            customer_name: orderData.name,
            phone: String(orderData.phone).trim(),
            payment_method: orderData.paymentMethod,
            amount: orderData.amount,
            book_id: Number(orderData.book_id),
            screenshot: attachmentData,
            status: 'pending'
        };

        const response = await nocoApi.post(`/api/v2/tables/${ORDERS_TABLE_ID}/records`, payload);

        if (response.data) {
            const orderId = response.data.Id || response.data.id;

            const msg = `<b>📦 Order အသစ်ရောက်ရှိပါသည်။</b>\n\n` +
                `👤 <b>အမည်:</b> ${orderData.name}\n` +
                `📱 <b>ဖုန်း:</b> ${orderData.phone}\n` +
                `💰 <b>ပမာဏ:</b> ${orderData.amount} MMK\n` +
                `💳 <b>ငွေပေးချေမှု:</b> ${orderData.paymentMethod}\n` +
                `📚 <b>Book ID:</b> ${orderData.book_id}`;

            // Approve နှင့် Reject ခလုတ်များ
            const reply_markup = {
                inline_keyboard: [
                    [
                        { text: "✅ Approve", callback_data: `approve_${orderId}` },
                        { text: "❌ Reject", callback_data: `reject_${orderId}` }
                    ]
                ]
            };

            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
            await axios.post(url, {
                chat_id: TELEGRAM_CHAT_ID,
                photo: screenshotUrl,
                caption: msg,
                parse_mode: 'HTML',
                reply_markup: reply_markup
            });
        }
        return response;
    } catch (e) { throw e; }
};

// --- 4. Community ---
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
                    inline_keyboard: [[{ text: "🗳 Vote on Website", url: "https://shop.drtunmyatwin.com/community" }]]
                }
            });
        } catch (error) {}
    }
    return response;
};

export const voteRequest = async (reqId, currentVotes) => {
    return await nocoApi.patch(`/api/v2/tables/${REQUESTS_TABLE_ID}/records`, {
        id: reqId,
        votes: (Number(currentVotes) || 0) + 1
    });
};
