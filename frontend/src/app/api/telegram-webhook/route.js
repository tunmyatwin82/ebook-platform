import { updateOrderStatus } from '@/lib/api';

export async function POST(req) {
    try {
        const body = await req.json();

        // Telegram က ခလုတ်နှိပ်လိုက်တဲ့အခါ
        if (body.callback_query) {
            const callbackData = body.callback_query.data; 
            const [action, orderId] = callbackData.split('_');
            const chatId = body.callback_query.message.chat.id;
            const messageId = body.callback_query.message.message_id;
            const currentCaption = body.callback_query.message.caption || "";

            let newStatus = "";
            let statusEmoji = "";
            let statusText = "";

            if (action === 'approve') {
                newStatus = 'completed';
                statusEmoji = "✅";
                statusText = "Approved";
            } else if (action === 'reject') {
                newStatus = 'rejected';
                statusEmoji = "❌";
                statusText = "Rejected";
            }

            if (newStatus) {
                // 1. NocoDB မှာ Status ကို Update လုပ်ခြင်း
                await updateOrderStatus(orderId, newStatus);

                // 2. Telegram Message ကို Update ပြန်လုပ်ပေးခြင်း (ခလုတ်တွေဖျောက်ပြီး status စာသားတိုးခြင်း)
                return Response.json({
                    method: "editMessageCaption",
                    chat_id: chatId,
                    message_id: messageId,
                    caption: `${currentCaption}\n\n${statusEmoji} <b>${statusText} via Telegram</b>`,
                    parse_mode: 'HTML'
                });
            }
        }
        
        return Response.json({ ok: true });
    } catch (error) {
        console.error("❌ Webhook Error:", error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
