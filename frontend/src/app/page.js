"use client";
import { fetchBooks } from '@/lib/api';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooks().then(data => {
            setBooks(data);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
        });
    }, []);

    const freeBooks = books.filter(book => !book.price || parseFloat(book.price) === 0);
    const premiumBooks = books.filter(book => book.price && parseFloat(book.price) > 0);

    const getImageUrl = (cover_image) => {
        if (!cover_image) return null;
        let rawPath = "";

        if (Array.isArray(cover_image) && cover_image.length > 0) {
            const imgObj = cover_image[0];
            rawPath = imgObj.path ? (imgObj.path.startsWith('http') ? imgObj.path : `https://db.drtunmyatwin.com/${imgObj.path}`) : (imgObj.url || "");
        } else if (typeof cover_image === 'string') {
            // Check if it is a Google Drive link
            if (cover_image.includes('drive.google.com') && cover_image.includes('/d/')) {
                const match = cover_image.match(/\/d\/([a-zA-Z0-9_-]+)/);
                if (match && match[1]) {
                    // Convert to direct view link
                    rawPath = `https://lh3.google.com/u/0/d/${match[1]}`;
                    // Or try simplified version if that fails: `https://drive.google.com/uc?export=view&id=${match[1]}`
                    // Converting to thumbnail link might be safer for images:
                    rawPath = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
                } else {
                    rawPath = cover_image;
                }
            } else {
                rawPath = cover_image;
            }
        }
        return rawPath;
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
            <div style={{ textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto 15px' }}></div>
                <div style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: '600' }}>စာအုပ်များ ရှာဖွေနေသည်...</div>
            </div>
        </div>
    );

    const renderBookSection = (title, bookList, isPremiumSection) => {
        if (bookList.length === 0) return null;
        return (
            <div style={{ marginBottom: '60px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '30px',
                    borderBottom: '2px solid #e2e8f0',
                    paddingBottom: '15px'
                }}>
                    <div style={{
                        backgroundColor: isPremiumSection ? '#1e40af' : '#10b981',
                        width: '5px',
                        height: '35px',
                        borderRadius: '10px',
                        marginRight: '15px'
                    }}></div>
                    <h2 style={{
                        fontSize: '1.8rem',
                        fontWeight: '800',
                        color: '#1e293b',
                        margin: 0
                    }}>
                        {title}
                    </h2>
                    <span style={{
                        marginLeft: '15px',
                        backgroundColor: isPremiumSection ? '#dbeafe' : '#d1fae5',
                        color: isPremiumSection ? '#1e40af' : '#047857',
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '700'
                    }}>
                        {bookList.length} အုပ်
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '35px' }}>
                    {bookList.map(book => {
                        const isFree = !book.price || parseFloat(book.price) === 0;
                        const bookCover = getImageUrl(book.cover_image);

                        return (
                            <div key={book.id} className="fade-in" style={{
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                border: isPremiumSection ? 'none' : '2px solid #10b981'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)'; }}>

                                {/* Image Area */}
                                <div style={{ height: '350px', position: 'relative', backgroundColor: '#f1f5f9' }}>
                                    {bookCover ? (
                                        <img src={bookCover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>No Image</div>
                                    )}
                                    <div style={{ position: 'absolute', top: '15px', right: '15px', background: isFree ? '#10b981' : '#ef4444', color: 'white', padding: '5px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                        {isFree ? 'FREE GIFT' : 'PREMIUM'}
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div style={{ padding: '25px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#1e293b', lineHeight: '1.4' }}>{book.title}</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '15px', fontWeight: '600' }}>✍️ {book.author || 'Dr. Tun Myat Win'}</p>

                                    <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px', flexGrow: 1 }}>
                                        {book.description ? (book.description.length > 100 ? book.description.substring(0, 100) + '...' : book.description) : 'ဤစာအုပ်သည် ကျန်းမာရေးနှင့် ဗဟုသုတဆိုင်ရာ အချက်အလက်များစွာ ပါဝင်သော စာအုပ်ကောင်းတစ်အုပ်ဖြစ်ပါသည်။'}
                                    </p>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 'bold', marginBottom: '2px' }}>PRICE</span>
                                            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: isFree ? '#10b981' : '#1e40af' }}>
                                                {isFree ? 'FREE' : `${Number(book.price).toLocaleString()} MMK`}
                                            </span>
                                        </div>

                                        {isFree ? (
                                            <a href={book.file_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', padding: '12px 20px', borderRadius: '12px', backgroundColor: '#10b981', color: 'white', fontWeight: 'bold', fontSize: '0.9rem', transition: 'background-color 0.2s' }}>
                                                📥 Download
                                            </a>
                                        ) : (
                                            <Link href={`/checkout?id=${book.id}&title=${encodeURIComponent(book.title)}&price=${book.price}`}
                                                style={{ textDecoration: 'none', padding: '12px 20px', borderRadius: '12px', backgroundColor: '#1e40af', color: 'white', fontWeight: 'bold', fontSize: '0.9rem', transition: 'background-color 0.2s' }}>
                                                🛒 Buy Now
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', paddingBottom: '50px' }}>

            {/* Header Section */}
            <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', padding: '70px 20px', textAlign: 'center', color: 'white' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '15px' }}>Dr. Tun Myat Win's Ebook Store</h1>
                <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>ဗဟုသုတနှင့် ကျန်းမာရေးဆိုင်ရာ စာအုပ်ကောင်းများ</p>

                <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/community" style={{ textDecoration: 'none', background: 'white', color: '#1e40af', padding: '12px 25px', borderRadius: '50px', fontWeight: 'bold' }}>
                        🙋‍♂️ စာအုပ်တောင်းဆိုရန်
                    </Link>
                    <Link href="/check-order" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '12px 25px', borderRadius: '50px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(5px)' }}>
                        🔍 Order အခြေအနေစစ်ရန်
                    </Link>
                </div>
            </div>

            {/* Books Container */}
            <div style={{ padding: '50px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                {renderBookSection("ဝယ်ယူရန် စာအုပ်များ", premiumBooks, true)}
                {renderBookSection("အခမဲ့ ရယူနိုင်သော စာအုပ်များ", freeBooks, false)}
            </div>
        </div>
    );
}
