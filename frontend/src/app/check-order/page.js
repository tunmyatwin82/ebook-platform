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
                        fontWeight: 'bold', marginBottom: '15px', textAlign: 'center',
                        boxShadow: '0 4px 6px rgba(5, 150, 105, 0.2)'
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

              {/* Telegram Channel Section (Updated Design) */}
              <div style={{ marginTop: '25px', padding: '20px', background: 'linear-gradient(to right, #eff6ff, #ffffff)', borderRadius: '12px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', marginBottom: '15px', color: '#1e40af', lineHeight: '1.6' }}>
                  🎁 <strong>နောက်ထပ် စာအုပ်အသစ်များနှင့် Discount များ ရယူရန်</strong> <br/>
                  ကျွန်ုပ်တို့၏ Telegram Channel သို့ Join ထားနိုင်ပါသည်။
                </p>
                
                <a 
                  href="https://t.me/shopdrtunmyatwin" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    background: '#0088cc', color: 'white', 
                    padding: '12px 24px', borderRadius: '50px', 
                    textDecoration: 'none', fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0, 136, 204, 0.2)',
                    transition: 'transform 0.2s',
                    width: 'fit-content',
                    margin: '0 auto'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.119.098.152.228.166.319.016.095.008.192.003.265z"/>
                  </svg>
                  Join Telegram Channel
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
