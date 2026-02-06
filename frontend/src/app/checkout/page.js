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
    book_id: searchParams.get('id')
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
      alert("အော်ဒါတင်ခြင်း အောင်မြင်ပါသည်။ ခဏအတွင်း လူကြီးမင်း၏ ဖုန်းနံပါတ်သို့ ဆက်သွယ်ပေးပါမည်။");
      router.push('/');
    } catch (err) {
      alert("အော်ဒါတင်ခြင်း မအောင်မြင်ပါ။ အင်တာနက်လိုင်း ပြန်စစ်ပြီး ထပ်မံကြိုးစားကြည့်ပါ။");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        
        {/* Header Section */}
        <div style={{ backgroundColor: '#3b82f6', padding: '30px 20px', textAlign: 'center', color: 'white' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>Confirm Payment</h2>
          <p style={{ margin: '10px 0 0', opacity: '0.9', fontSize: '0.9rem' }}>ငွေပေးချေမှု အချက်အလက်များကို ဖြည့်စွက်ပါ</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '25px' }}>
          
          {/* User Info Section */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>ဝယ်ယူသူအမည်</label>
            <input 
              type="text" 
              placeholder="ဥပမာ - မောင်မောင်"
              required 
              style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '1rem', outline: 'none' }} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>ဖုန်းနံပါတ် (Viber/Telegram)</label>
            <input 
              type="tel" 
              placeholder="09123456789"
              required 
              style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '1rem', outline: 'none' }}
              onChange={(e) => setFormData({...formData, phone: e.target.value})} 
            />
            <small style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '5px', display: 'block' }}>* စာအုပ် link ပို့ပေးရန်အတွက် ဖြစ်သည်။</small>
          </div>

          {/* Payment Details Section */}
          <div style={{ padding: '20px', backgroundColor: '#eff6ff', borderRadius: '15px', marginBottom: '25px', border: '1px dashed #3b82f6' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '700', color: '#1e40af' }}>Payment Method ရွေးချယ်ပါ</label>
            <select 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '1rem', marginBottom: '15px' }} 
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
            >
              <option>K Pay</option>
              <option>Wave Pay</option>
              <option>AYA Pay</option>
              <option>CB Pay</option>
            </select>
            
            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '10px' }}>
              <p style={{ margin: '5px 0', fontSize: '0.8rem', color: '#6b7280' }}>{formData.paymentMethod} နံပါတ်</p>
              <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: '800', color: '#111827' }}>
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
              style={{ fontSize: '0.9rem', color: '#4b5563' }}
              onChange={(e) => setFormData({...formData, screenshot: e.target.files[0]})} 
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '16px', 
              backgroundColor: loading ? '#93c5fd' : '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '15px', 
              fontWeight: '700', 
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Processing...' : 'Confirm Order'}
          </button>
          
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#9ca3af', marginTop: '20px' }}>
            Secured Manual Payment System
          </p>
        </form>
      </div>
    </div>
  );
}

// Suspense သည် useSearchParams အသုံးပြုရာတွင် build error မတက်စေရန် လိုအပ်ပါသည်
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
