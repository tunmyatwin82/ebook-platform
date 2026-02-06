"use client";
import { fetchBooks } from '../lib/api';
import { useState, useEffect } from 'react';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks().then(data => {
      setBooks(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ fontSize: '1.2rem', color: '#3b82f6', fontWeight: 'bold' }}>Loading Books...</div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 🚀 Modern Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', 
        padding: '80px 20px', 
        textAlign: 'center', 
        color: 'white',
        marginBottom: '50px',
        boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 10px 0', letterSpacing: '-0.025em' }}>
          Dr. Tun Myat Win's Ebook Store
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: '0.9', maxWidth: '600px', margin: '0 auto' }}>
          ဗဟုသုတနှင့် ကျန်းမာရေးဆိုင်ရာ အသိပညာပေး စာအုပ်ကောင်းများကို တစ်နေရာတည်းတွင် ဝယ်ယူဖတ်ရှုနိုင်ပါသည်။
        </p>
      </div>

      <div style={{ padding: '0 20px 60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {books.map(book => {
            const isFree = !book.price || parseFloat(book.price) === 0;

            return (
              <div key={book.id} style={{ 
                backgroundColor: 'white', 
                borderRadius: '20px', 
                overflow: 'hidden', 
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'default'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
            >
                {/* Book Cover Image */}
                <div style={{ height: '320px', backgroundColor: '#f1f5f9', position: 'relative' }}>
                  {book.cover_image && book.cover_image.length > 0 ? (
                    <img 
                      src={`https://db.drtunmyatwin.com/${book.cover_image[0].path}`} 
                      alt={book.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>No Image</div>
                  )}
                  {/* Category Badge (Optional) */}
                  <div style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', color: '#1e40af' }}>
                    {book.category || 'Ebook'}
                  </div>
                </div>

                <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', lineHeight: '1.4' }}>{book.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '16px', fontWeight: '500' }}>By {book.author || 'Dr. Tun Myat Win'}</p>
                  
                  <p style={{ 
                    fontSize: '0.9rem', color: '#475569', marginBottom: '20px', lineHeight: '1.6',
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                  }}>
                    {book.descriptions || 'စာအုပ်၏ အနှစ်ချုပ်နှင့် အသေးစိတ် အချက်အလက်များကို မကြာမီ ဖြည့်စွက်ပေးပါမည်။'}
                  </p>

                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                       <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>PRICE</span>
                       <span style={{ fontWeight: '800', fontSize: '1.3rem', color: isFree ? '#10b981' : '#3b82f6' }}>
                        {isFree ? 'FREE' : `${book.price} MMK`}
                      </span>
                    </div>

                    {isFree ? (
                      <button 
                        onClick={() => book.file_url && window.open(book.file_url, '_blank')}
                        style={{ 
                          width: '100%', padding: '14px', borderRadius: '12px', border: 'none', 
                          backgroundColor: '#10b981', color: 'white', fontWeight: '700', cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                      >
                        Download / Read Free
                      </button>
                    ) : (
                      <button 
                        onClick={() => window.location.href = `/checkout?id=${book.id}`}
                        style={{ 
                          width: '100%', padding: '14px', borderRadius: '12px', border: 'none', 
                          backgroundColor: '#3b82f6', color: 'white', fontWeight: '700', cursor: 'pointer',
                          transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                        }}
                      >
                        Get It Now
                      </button>
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
