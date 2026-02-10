"use client";
import Link from 'next/link';

export default function OrderSuccess() {
    return (
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div className="fade-in" style={{ backgroundColor: 'white', borderRadius: '25px', padding: '50px 40px', textAlign: 'center', maxWidth: '450px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>

                <div style={{ width: '80px', height: '80px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 25px', fontSize: '2.5rem' }}>
                    ✅
                </div>

                <h1 style={{ color: '#15803d', fontSize: '1.8rem', marginBottom: '15px' }}>အော်ဒါတင်ပြီးပါပြီ!</h1>

                <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.7', marginBottom: '30px' }}>
                    သင့်အော်ဒါကို Admin မှ စစ်ဆေးပြီးပါက စာအုပ် download link ကို ဖုန်းနံပါတ်ဖြင့် စစ်ဆေးနိုင်ပါသည်။
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                    {/* Telegram Button */}
                    <a href="tg://resolve?domain=shopdrtunmyatwin"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px', backgroundColor: '#0088cc', color: 'white', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', textDecoration: 'none', boxShadow: '0 4px 15px rgba(0, 136, 204, 0.2)' }}>
                        <span style={{ fontSize: '1.2rem' }}>📢</span> Telegram Channel သို့ဝင်ရန်
                    </a>

                    <Link href="/check-order" style={{ display: 'block', padding: '16px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', textDecoration: 'none' }}>
                        🔍 Order အခြေအနေ စစ်ဆေးရန်
                    </Link>
                    <Link href="/" style={{ display: 'block', padding: '16px', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', textDecoration: 'none' }}>
                        🏠 ပင်မစာမျက်နှာသို့
                    </Link>
                </div>
            </div>
        </div>
    );
}
