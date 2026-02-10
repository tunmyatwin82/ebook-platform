"use client";
import { fetchBooks } from '../lib/api';
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

  const getImageUrl = (cover_image) => {
    if (!cover_image) return null;
    let rawPath = "";
    if (Array.isArray(cover_image) && cover_image.length > 0) {
      const imgObj = cover_image[0];
      rawPath = imgObj.path ? (imgObj.path.startsWith('http') ? imgObj.path : `https://db.drtunmyatwin.com/${imgObj.path}`) : (imgObj.url || "");
    } else if (typeof cover_image === 'string') {
      rawPath = cover_image;
    }
    return rawPath;
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #3b82f6', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 15px' }}></div>
        <div style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: '600' }}>စာအုပ်များ ရှာဖွေနေသည်...</div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Header Section */}
      <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', padding: '70px 20px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '15px' }}>Dr. Tun Myat Win's Ebook Store</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>ဗဟုသုတနှင့် ကျန်းမာရေးဆိုင်ရာ စာအုပ်ကောင်းများ</p>
        
        <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/community" style={{ textDecoration: 'none', background: 'white', color: '#1e40af', padding: '12px 25px', borderRadius: '50px', fontWeight: 'bold' }}>
            🙋‍♂️ စာအုပ်တောင်းဆိုရန်
          </Link>
          {/* Link ပြင်ဆင်ချက်: /status မှ /check-order သို့ */}
          <Link href="/check-order" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '12px 25px', borderRadius: '50px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(5px)' }}>
            🔍 Order အခြေအနေစစ်ရန်
          </Link>
        </div>
      </div>

      {/* Book Grid */}
      <div style={{ padding: '50px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '35px' }}>
          {books.map(book => {
            const isFree = !book.price || parseFloat(book.price) === 0;
            const bookCover = getImageUrl(book.cover_image);
            
            return (
              <div key={book.id} style={{ backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' }}>
                
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
                  
                  {/* Description ပေါ်လာစေရန် ထည့်သွင်းထားသည် */}
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
                      <a href={book.file_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', padding: '12px 20px', borderRadius: '12px', backgroundColor: '#10b981', color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        📥 Download
                      </a>
                    ) : (
                      /* Link ပြင်ဆင်ချက်: /order မှ /checkout သို့ */
                      <Link href={`/checkout?id=${book.id}&title=${encodeURIComponent(book.title)}&price=${book.price}`}
                            style={{ textDecoration: 'none', padding: '12px 20px', borderRadius: '12px', backgroundColor: '#1e40af', color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>
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
    </div>
  );
}
