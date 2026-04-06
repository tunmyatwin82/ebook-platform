"use client";
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { submitOrder } from '../../lib/api';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false); // Loading state ထပ်ထည့်ထားတယ်
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    paymentMethod: 'K Pay',
    screenshot: null,
    book_id: searchParams.get('id'),
    amount: searchParams.get('price') || 0
  });

  const paymentNumbers = {
    'K Pay': '09 421 068 582 (U Tun Myat Win)',
    'Wave Pay': '09 421 068 582 (U Tun Myat Win)',
    'AYA Pay': '09 421 068 582 (U Tun Myat Win)',
    'CB Pay': '09 421 068 582 (U Tun Myat Win)'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.screenshot) return alert("ငွေလွှဲ Screenshot တင်ပေးပါဦး။");
    
    setLoading(true); // ခလုတ်နှိပ်လိုက်တာနဲ့ Loading ပြမယ်
    try {
      await submitOrder(formData); // V4 ရဲ့ မူလ Logic အတိုင်းပဲ ပို့မယ်
      router.push('/order-success');
    } catch (err) {
      alert("အော်ဒါတင်ခြင်း မအောင်မြင်ပါ။ အင်တာနက်လိုင်း ပြန်စစ်ပြီး ထပ်မံကြိုးစားကြည့်ပါ။");
      setLoading(false); // Error ဖြစ်ရင် Loading ပိတ်မယ်
    }
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* ၁။ Loading Overlay: Processing ဖြစ်နေစဉ် Screen ကို အုပ်ထားမည် */}
      {loading && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{ 
            border: '4px solid #f3f3f3', borderTop: '4px solid #3b82f6', 
            borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' 
          }}></div>
          <p style={{ color: 'white', marginTop: '15px', fontWeight: '600' }}>
            အော်ဒါတင်နေပါသည်၊ ခေတ္တစောင့်ပေးပါ...
          </p>
        </div>
      )}

      <style>{` @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } `}</style>

      <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '25px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>

        {/* Header Section */}
        <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', padding: '40px 20px', textAlign: 'center', color: 'white' }}>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800' }}>Confirm Payment</h2>
          <div style={{ marginTop: '12px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'inline-block', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem' }}>
            ကျသင့်ငွေ: <b>{formData.amount} MMK</b>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>ဝယ်ယူသူအမည်</label>
            <input type="text" placeholder="ဥပမာ - မောင်မောင်" required style={{ width: '100%', padding: '14px 15px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>ဖုန်းနံပါတ် (Viber/Telegram)</label>
            <input type="tel" placeholder="09123456789" required style={{ width: '100%', padding: '14px 15px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            <small style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '6px', display: 'block' }}>* စာအုပ် link ပို့ပေးရန်အတွက် ဖြစ်သည်။</small>
          </div>

          <div style={{ padding: '20px', backgroundColor: '#eff6ff', borderRadius: '18px', marginBottom: '25px', border: '1px dashed #3b82f6' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '700', color: '#1e40af' }}>Payment Method ရွေးချယ်ပါ</label>
            <select style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #bfdbfe', fontSize: '1rem', marginBottom: '15px', cursor: 'pointer' }} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}>
              <option>K Pay</option><option>Wave Pay</option><option>AYA Pay</option><option>CB Pay</option>
            </select>

            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'white', borderRadius: '12px' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: '#6b7280', fontWeight: '600' }}>{formData.paymentMethod} နံပါတ်</p>
              <p style={{ margin: '0', fontSize: '1.2rem', fontWeight: '800', color: '#111827' }}>{paymentNumbers[formData.paymentMethod]}</p>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>ငွေလွှဲ Screenshot တင်ပါ</label>
            <input type="file" required accept="image/*" style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '0.85rem', color: '#4b5563', boxSizing: 'border-box' }} onChange={(e) => setFormData({...formData, screenshot: e.target.files[0]})} />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '18px', backgroundColor: loading ? '#93c5fd' : '#3b82f6', color: 'white', border: 'none', borderRadius: '15px', fontWeight: '700', fontSize: '1.1rem', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)', transition: 'all 0.3s' }}>
            {loading ? 'Processing...' : 'Confirm Order'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px', fontFamily: 'sans-serif' }}>Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
