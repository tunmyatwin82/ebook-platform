"use client";
import Link from 'next/link';

export default function OrderSuccess() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f8fafc',
      fontFamily: 'sans-serif',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '500px', 
        width: '100%', 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '24px', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        {/* Success Icon */}
        <div style={{ 
          width: '80px', 
          height: '80px', 
          backgroundColor: '#ecfdf5', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 24px auto'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h1 style={{ color: '#111827', fontSize: '1.8rem', fontWeight: '800', marginBottom: '16px' }}>
          Order Received!
        </h1>
        
        <p style={{ color: '#4b5563', lineHeight: '1.6', marginBottom: '32px' }}>
          ဝယ်ယူအားပေးမှုကို ကျေးဇူးတင်ပါသည်။ သင်၏ ငွေလွှဲပြေစာကို ကျွန်ုပ်တို့ လက်ခံရရှိပါပြီ။ 
          Admin မှ စစ်ဆေးပြီးနောက် စာအုပ်ဖတ်ရန် Link ကို သင်၏ Viber သို့မဟုတ် ဖုန်းနံပါတ်သို့ (၂၄) နာရီအတွင်း ပေးပို့ပေးပါမည်။
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link href="/" style={{ 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            padding: '14px', 
            borderRadius: '12px', 
            textDecoration: 'none', 
            fontWeight: '600',
            transition: 'background 0.2s'
          }}>
            Ebook Store သို့ ပြန်သွားရန်
          </Link>
          
          <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
            အကူအညီလိုအပ်ပါက viber: 09123456789 သို့ ဆက်သွယ်နိုင်ပါသည်။
          </p>
        </div>
      </div>
    </div>
  );
}
