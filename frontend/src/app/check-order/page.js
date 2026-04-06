"use client";
import { useState } from "react";
import { checkOrderStatus } from "@/lib/api";
import Link from "next/link";

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
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '20px' }}>
            <div style={{ maxWidth: '450px', margin: '50px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>

                <Link href="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#3b82f6', fontSize: '0.9rem', fontWeight: '600' }}>
                    ← ပင်မစာမျက်နှာသို့
                </Link>

                <h3 style={{ textAlign: 'center', color: '#1e40af', marginBottom: '25px', fontSize: '1.4rem' }}>🔍 အော်ဒါအခြေအနေ စစ်ဆေးရန်</h3>

                <form onSubmit={handleSearch} style={{ marginBottom: '25px' }}>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="ဝယ်ယူစဉ်က အသုံးပြုခဲ့သော ဖုန်းနံပါတ်"
                        style={{ width: '100%', padding: '14px', marginBottom: '12px', borderRadius: '12px', border: '1px solid #e5e7eb', outline: 'none', boxSizing: 'border-box', fontSize: '1rem' }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ width: '100%', padding: '14px', background: loading ? '#93c5fd' : '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', transition: 'background-color 0.2s' }}
                    >
                        {loading ? "ရှာဖွေနေပါသည်..." : "အခြေအနေ စစ်ဆေးမည်"}
                    </button>
                </form>

                {searched && (
                    <div className="fade-in" style={{ marginTop: '20px', padding: '25px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        {!order ? (
                            <div style={{ textAlign: 'center', color: '#64748b' }}>
                                <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>❌ ဤဖုန်းနံပါတ်ဖြင့် အော်ဒါမရှိသေးပါ။</p>
                                <p style={{ fontSize: '0.85rem' }}>ဖုန်းနံပါတ် မှန်ကန်စွာ ရိုက်ထည့်ထားခြင်း ရှိမရှိ ပြန်လည်စစ်ဆေးပေးပါ။</p>
                            </div>
                        ) : (
                            <div>
                                {/* Order ID */}
                                <div style={{ textAlign: 'center', marginBottom: '20px', padding: '15px', backgroundColor: '#eff6ff', borderRadius: '12px' }}>
                                    <p style={{ margin: '0', fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>ORDER ID</p>
                                    <p style={{ margin: '5px 0 0', fontSize: '1.5rem', fontWeight: '800', color: '#1e40af' }}>#{order.id}</p>
                                </div>

                                {/* Order Details */}
                                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '18px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ marginBottom: '15px' }}>
                                        <p style={{ margin: '0', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>မှာယူသူ အမည်</p>
                                        <p style={{ margin: '5px 0 0', fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>{order.customer_name || 'N/A'}</p>
                                    </div>
                                    <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '15px' }}>
                                        <p style={{ margin: '0', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>စာအုပ်အမည်</p>
                                        <p style={{ margin: '5px 0 0', fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>📚 {order.book_title || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Status */}
                                <div style={{ marginBottom: '20px' }}>
                                    <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>လက်ရှိအခြေအနေ:</p>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '10px 20px',
                                        borderRadius: '25px',
                                        fontSize: '0.95rem',
                                        fontWeight: 'bold',
                                        backgroundColor: order.status === 'completed' ? '#dcfce7' : order.status === 'rejected' ? '#fee2e2' : '#fff7ed',
                                        color: order.status === 'completed' ? '#15803d' : order.status === 'rejected' ? '#991b1b' : '#c2410c'
                                    }}>
                                        {order.status === 'completed' ? '✅ အတည်ပြုပြီးပါပြီ' :
                                            order.status === 'rejected' ? '❌ ငွေလွှဲမှု မအောင်မြင်ပါ' :
                                                '⏳ Admin မှ စစ်ဆေးနေဆဲ'}
                                    </span>
                                </div>

                                {/* Download Button - Status 'completed' ဖြစ်မှသာ Link ပေါ်မည် */}
                                {order.status === 'completed' && order.download_url ? (
                                    <a
                                        href={order.download_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'block',
                                            textAlign: 'center',
                                            padding: '16px',
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            color: 'white',
                                            textDecoration: 'none',
                                            borderRadius: '12px',
                                            fontWeight: 'bold',
                                            fontSize: '1rem',
                                            boxShadow: '0 6px 15px rgba(16, 185, 129, 0.3)'
                                        }}
                                    >
                                        📥 စာအုပ်ဒေါင်းလုဒ်လုပ်ရန် နှိပ်ပါ
                                    </a>
                                ) : order.status === 'completed' && !order.download_url ? (
                                    <p style={{ color: '#ef4444', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center' }}>* ဒေါင်းလုဒ် Link ရှာမတွေ့ပါ။ Admin ကို ဆက်သွယ်ပါ။</p>
                                ) : null}

                                {/* Telegram Channel Button */}
                                <div style={{ marginTop: '25px', borderTop: '1px dashed #e2e8f0', paddingTop: '20px', textAlign: 'center' }}>
                                    <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6' }}>
                                        📢 စာအုပ်များ တောင်းဆိုရန်၊ မေးမြန်းဆွေးနွေးရန်နှင့်<br />
                                        နောက်ဆုံးရ သတင်းအချက်အလက်များကို သိရှိရန်<br />
                                        ကျွန်ုပ်တို့၏ <b style={{ color: '#0088cc' }}>Telegram Channel</b> သို့ ဝင်ရောက်ပါ။
                                    </p>

                                    <a href="tg://resolve?domain=shopdrtunmyatwin"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            padding: '12px 25px',
                                            backgroundColor: '#0088cc',
                                            color: 'white',
                                            textDecoration: 'none',
                                            borderRadius: '50px',
                                            fontWeight: 'bold',
                                            fontSize: '1rem',
                                            boxShadow: '0 4px 15px rgba(0, 136, 204, 0.25)',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            width: '100%',
                                            maxWidth: '300px'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 136, 204, 0.35)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 136, 204, 0.25)'; }}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.944 0C5.352 0 0 5.352 0 11.944C0 18.536 5.352 23.888 11.944 23.888C18.536 23.888 23.888 18.536 23.888 11.944C23.888 5.352 18.536 0 11.944 0ZM17.656 8.52L15.936 17.528C15.808 18.096 15.464 18.232 14.992 17.96L10.88 14.928L8.896 16.84C8.68 17.056 8.496 17.24 8.08 17.24L8.376 13.064L15.976 6.192C16.304 5.896 15.904 5.728 15.472 6.016L6.08 11.928L2.04 10.664C1.16 10.392 1.144 9.784 2.224 9.36L17.24 3.576C17.936 3.328 18.544 3.744 17.656 8.52Z" />
                                        </svg>
                                        Join Telegram Channel
                                    </a>
                                    <p style={{ marginTop: '10px', fontSize: '0.8rem', color: '#94a3b8' }}>
                                        (VPN ဖွင့်ထားရန် လိုအပ်နိုင်ပါသည်)
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
