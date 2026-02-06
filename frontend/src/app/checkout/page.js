"use client";
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { submitOrder } from '../../lib/api';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    paymentMethod: 'K Pay',
    screenshot: null,
    book_id: searchParams.get('id'),
    amount: searchParams.get('price') || 0 // URL မှ Price ကို လက်ခံရန် ထည့်သွင်းထားသည်
  });

  const paymentNumbers = {
    'K Pay': '09 123 456 789 (U Tun Tun)',
    'Wave Pay': '09 123 456 789 (U Tun Tun)',
    'AYA Pay': '09 123 456 789 (U Tun Tun)',
    'CB Pay': '09 123 456 789 (U Tun Tun)'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.screenshot) return alert("ငွေလွှဲ Screenshot တင်ပေးပါဦး။");
    
    setLoading(true);
    try {
      await submitOrder(formData);
      // Success Page သို့ လွှဲပြောင်းပေးခြင်း
      router.push('/order-success');
    } catch (err) {
      alert("အော်ဒါတင်ခြင်း မအောင်မြင်ပါ။ အင်တာနက်လိုင်း ပြန်စစ်ပြီး ထပ်မံကြိုးစားကြည့်ပါ။");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '25px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>

        {/* Header Section */}
        <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', padding: '40px 20px', textAlign: 'center', color: 'white' }}>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800' }}>Confirm Payment</h2>
          <div style={{ marginTop: '12px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'inline-block', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem' }}>
            ကျသင့်ငွေ: <b>{formData.amount} MMK</b>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '30px' }}>

          {/* User Info Section */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>ဝယ်ယူသူအမည်</label>
            <input 
              type="text" 
              placeholder="ဥပမာ - မောင်မောင်"
              required 
              style={{ width: '100%', padding: '14px 15px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>ဖုန်းနံပါတ် (Viber/Telegram)</label>
            <input 
              type="tel" 
              placeholder="09123456789"
              required 
              style={{ width: '100%', padding: '14px 15px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '1rem', outline: 'none' }}
              onChange={(e) => setFormData({...formData, phone: e.target.value})} 
            />
            <small style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '6px', display: 'block' }}>* စာအုပ် link ပို့ပေးရန်အတွက် ဖြစ်သည်။</small>
          </div>

          {/* Payment Details Section */}
          <div style={{ padding: '20px', backgroundColor: '#eff6ff', borderRadius: '18px', marginBottom: '25px', border: '1px dashed #3b82f6' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '700', color: '#1e40af' }}>Payment Method ရွေးချယ်ပါ</label>
            <select 
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #bfdbfe', fontSize: '1rem', marginBottom: '15px', cursor: 'pointer' }} 
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
            >
              <option>K Pay</option>
              <option>Wave Pay</option>
              <option>AYA Pay</option>
              <option>CB Pay</option>
            </select>

            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'white', borderRadius: '12px' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: '#6b7280', fontWeight: '600' }}>{formData.paymentMethod} နံပါတ်</p>
              <p style={{ margin: '0', fontSize: '1.2rem', fontWeight: '800', color: '#111827' }}>
                {paymentNumbers[formData.paymentMethod]}
              </p>
            </div>
          </div>

          {/* Screenshot Upload */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>ငွေလွှဲ Screenshot တင်ပါ</label>
            <input 
              type="file" 
              required 
              accept="image/*" 
              style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '0.85rem', color: '#4b5563' }}
              onChange={(e) => setFormData({...formData, screenshot: e.target.files[0]})} 
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '18px', 
              backgroundColor: loading ? '#93c5fd' : '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '15px', 
              fontWeight: '700', 
              fontSize: '1.1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.3s'
            }}
          >
            {loading ? 'Processing...' : 'Confirm Order'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#9ca3af', marginTop: '25px' }}>
            Secured Manual Payment System
          </p>
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
