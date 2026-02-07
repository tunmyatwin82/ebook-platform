"use client";
import { useState } from "react";
import { checkOrderStatus } from "@/lib/api";

export default function CheckOrder() {
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await checkOrderStatus(phone);
      console.log("Order Data:", data); 
      setOrder(data);
    } catch (error) {
      console.error("Search Error:", error);
    }
    setSearched(true);
    setLoading(false);
  };

  // အရေးကြီးဆုံးပြင်ဆင်ချက် - Status ကို အကြီးအသေးမရွေး စစ်ဆေးခြင်း
  const isCompleted = order?.status?.toLowerCase() === 'completed';

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#1e293b' }}>အော်ဒါအခြေအနေစစ်ဆေးရန်</h2>
      <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px' }}>ဝယ်ယူစဉ်က အသုံးပြုခဲ့သော ဖုန်းနံပါတ်ကို ရိုက်ထည့်ပါ</p>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="09xxxxxxxxx" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', color: '#333' }}
          required
        />
        <button type="submit" style={{ padding: '12px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? 'စစ်ဆေးနေဆဲ...' : 'ရှာပါ'}
        </button>
      </form>

      {searched && (
        <div style={{ padding: '20px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          {!order ? (
            <p style={{ textAlign: 'center', color: '#ef4444' }}>ဤဖုန်းနံပါတ်ဖြင့် အော်ဒါမတွေ့ရှိပါ။</p>
          ) : (
            <div>
              <p>📌 <strong>Order ID:</strong> #{order.id}</p>
              <p>👤 <strong>အမည်:</strong> {order.customer_name}</p>
              <p>📊 <strong>အခြေအနေ:</strong> 
                <span style={{ 
                  marginLeft: '10px', padding: '4px 8px', borderRadius: '5px', fontSize: '12px',
                  background: isCompleted ? '#dcfce7' : '#fef3c7',
                  color: isCompleted ? '#15803d' : '#b45309'
                }}>
                  {isCompleted ? 'အောင်မြင်သည်' : 'စောင့်ဆိုင်းဆဲ'}
                </span>
              </p>

              <hr style={{ margin: '20px 0', border: '0.5px solid #e2e8f0' }} />

              {isCompleted ? (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#15803d', fontWeight: 'bold', marginBottom: '15px' }}>✅ ငွေလွှဲမှု အောင်မြင်ပါသည်။</p>
                  
                  {order.download_url ? (
                    <a 
                      href={order.download_url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        display: 'block', background: '#059669', color: 'white', 
                        padding: '15px', borderRadius: '8px', textDecoration: 'none', 
                        fontWeight: 'bold', marginBottom: '15px', textAlign: 'center' 
                      }}
                    >
                      📥 Download Ebook ရယူရန်နှိပ်ပါ
                    </a>
                  ) : (
                    <p style={{ color: '#ef4444', fontSize: '13px' }}>⚠️ Download Link မတွေ့ပါ။ ခေတ္တစောင့်ပေးပါ။</p>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#b45309' }}>
                  <p>⏳ ခေတ္တစောင့်ဆိုင်းပါ၊ ငွေလွှဲစစ်ဆေးနေပါသည်...</p>
                  <p style={{ fontSize: '12px' }}>၁၅ မိနစ်မှ ၃၀ မိနစ်အတွင်း အတည်ပြုပေးပါမည်။</p>
                </div>
              )}

              <div style={{ marginTop: '20px', padding: '15px', background: '#eff6ff', borderRadius: '8px', textAlign: 'center', border: '1px dashed #2563eb' }}>
                <p style={{ fontSize: '13px', marginBottom: '10px', color: '#1e40af' }}>🎁 စာအုပ်အသစ်များနှင့် အခမဲ့စာအုပ်များ ရယူရန်</p>
                <a 
                  href="https://t.me/your_channel_link" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }}
                >
                  🔵 Join Telegram Channel
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
