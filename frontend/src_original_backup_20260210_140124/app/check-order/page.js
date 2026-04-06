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
    if (!phone) return alert("ဖုန်းနံပါတ် ထည့်ပေးပါ");
    
    setLoading(true);
    const data = await checkOrderStatus(phone);
    setOrder(data.length > 0 ? data[0] : null);
    setSearched(true);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '450px', margin: '50px auto', padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
      <h3 style={{ textAlign: 'center', color: '#1e40af', marginBottom: '20px' }}>🔍 အော်ဒါအခြေအနေ စစ်ဆေးရန်</h3>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '25px' }}>
        <input 
          type="text" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          placeholder="ဝယ်ယူစဉ်က အသုံးပြုခဲ့သော ဖုန်းနံပါတ်" 
          style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} 
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "ရှာဖွေနေပါသည်..." : "အခြေအနေ စစ်ဆေးမည်"}
        </button>
      </form>

      {searched && (
        <div style={{ marginTop: '20px', padding: '20px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
          {!order ? (
            <div style={{ textAlign: 'center', color: '#64748b' }}>
              <p>❌ ဤဖုန်းနံပါတ်ဖြင့် အော်ဒါမရှိသေးပါ။</p>
              <p style={{ fontSize: '0.8rem' }}>ဖုန်းနံပါတ် မှန်ကန်စွာ ရိုက်ထည့်ထားခြင်း ရှိမရှိ ပြန်လည်စစ်ဆေးပေးပါ။</p>
            </div>
          ) : (
            <div>
              <div style={{ borderBottom: '1px solid #e2e8f0', marginBottom: '15px', paddingBottom: '10px' }}>
                <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#64748b' }}>Order ID: #{order.Id || order.id}</p>
                <p style={{ margin: '5px 0', fontWeight: 'bold' }}>အမည်: {order.customer_name}</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p style={{ margin: '5px 0' }}>လက်ရှိအခြေအနေ:</p>
                <span style={{ 
                  display: 'inline-block',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  backgroundColor: order.status === 'completed' ? '#dcfce7' : order.status === 'rejected' ? '#fee2e2' : '#fff7ed',
                  color: order.status === 'completed' ? '#15803d' : order.status === 'rejected' ? '#991b1b' : '#c2410c'
                }}>
                  {order.status === 'completed' ? '✅ အတည်ပြုပြီးပါပြီ' : 
                   order.status === 'rejected' ? '❌ ငွေလွှဲမှု မအောင်မြင်ပါ' : 
                   '⏳ Admin မှ စစ်ဆေးနေဆဲ'}
                </span>
              </div>
              
              {/* Status 'completed' ဖြစ်မှသာ Link ပေါ်မည် */}
              {order.status === 'completed' && order.download_url ? (
                <a 
                  href={order.download_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'block', 
                    textAlign: 'center',
                    padding: '12px',
                    background: '#10b981', 
                    color: 'white', 
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  📥 စာအုပ်ဒေါင်းလုဒ်လုပ်ရန် နှိပ်ပါ
                </a>
              ) : order.status === 'completed' && !order.download_url ? (
                <p style={{ color: '#ef4444', fontSize: '0.8rem', fontStyle: 'italic' }}>* ဒေါင်းလုဒ် Link ရှာမတွေ့ပါ။ Admin ကို ဆက်သွယ်ပါ။</p>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
