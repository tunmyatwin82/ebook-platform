// src/app/community/page.js
"use client";

import { useState, useEffect } from 'react';
import { fetchRequests, submitRequest, voteRequest } from '@/lib/api';
import Link from 'next/link';

export default function CommunityPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [votedIds, setVotedIds] = useState([]);

  // TODO: အစ်ကို့ Channel Link အမှန်ကို ဒီမှာ ထည့်ပေးပါ!
  const TELEGRAM_CHANNEL_LINK = "https://t.me/shopdrtunmyatwin"; 

  const [formData, setFormData] = useState({
    bookName: '',
    author: '',
    userName: ''
  });

  useEffect(() => {
    loadRequests();
    const savedVotes = localStorage.getItem('voted_books');
    if (savedVotes) {
      setVotedIds(JSON.parse(savedVotes));
    }
  }, []);

  const loadRequests = async () => {
    const data = await fetchRequests();
    setRequests(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bookName || !formData.userName) {
      alert("စာအုပ်နာမည်နှင့် တောင်းဆိုသူနာမည် ထည့်ပေးပါ။");
      return;
    }

    setSubmitting(true);
    try {
      await submitRequest(formData);
      alert("စာအုပ် Request လုပ်ခြင်း အောင်မြင်ပါသည်။");
      setFormData({ bookName: '', author: '', userName: '' });
      loadRequests(); 
    } catch (error) {
      console.error(error);
      alert("Request တင်မရဖြစ်နေသည်၊ ထပ်မံကြိုးစားကြည့်ပါ။");
    }
    setSubmitting(false);
  };

  const handleVote = async (id, currentVotes) => {
    if (votedIds.includes(id)) return;

    const updatedRequests = requests.map(req => 
      req.id === id ? { ...req, votes: (req.votes || 0) + 1 } : req
    );
    setRequests(updatedRequests);

    const newVotedIds = [...votedIds, id];
    setVotedIds(newVotedIds);
    localStorage.setItem('voted_books', JSON.stringify(newVotedIds));

    try {
      await voteRequest(id, currentVotes);
    } catch (error) {
      loadRequests();
    }
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      
      {/* 1. Navbar */}
      <nav style={{ background: 'white', padding: '15px 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', fontWeight: '800', fontSize: '1.2rem', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🏥</span> Pharmacy Ebooks
          </Link>
          <Link href="/" style={{ textDecoration: 'none', color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>
            🏠 Home
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', padding: '60px 20px 80px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '15px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Community Requests</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 25px', lineHeight: '1.6' }}>
          မိမိလိုချင်သော စာအုပ်များကို တောင်းဆိုနိုင်ပြီး၊ အခြားသူများ တောင်းဆိုထားသည်များကို Vote ပေးနိုင်ပါသည်။
        </p>
        
        <a 
          href={TELEGRAM_CHANNEL_LINK} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'white', color: '#0088cc', 
            padding: '12px 28px', borderRadius: '50px', 
            textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)', transition: 'transform 0.2s'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#0088cc"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.119.098.152.228.166.319.016.095.008.192.003.265z"/></svg>
          Join Telegram Channel
        </a>
      </div>

      {/* 3. Main Content Grid */}
      <div style={{ maxWidth: '1100px', margin: '-50px auto 40px', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'start' }}>
        
        {/* Left Column: Request Form */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
            ✨ စာအုပ်အသစ် တောင်းဆိုရန်
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', color: '#475569' }}>စာအုပ်နာမည် *</label>
              <input 
                type="text" 
                value={formData.bookName}
                onChange={e => setFormData({...formData, bookName: e.target.value})}
                placeholder="ဥပမာ - Clinical Pharmacology"
                style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', transition: 'border 0.2s', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                required
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', color: '#475569' }}>စာရေးဆရာ (Optional)</label>
              <input 
                type="text" 
                value={formData.author}
                onChange={e => setFormData({...formData, author: e.target.value})}
                placeholder="Author Name"
                style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', color: '#475569' }}>တောင်းဆိုသူ အမည် *</label>
              <input 
                type="text" 
                value={formData.userName}
                onChange={e => setFormData({...formData, userName: e.target.value})}
                placeholder="သင့်နာမည်"
                style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              style={{ width: '100%', padding: '14px', background: submitting ? '#94a3b8' : '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: submitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}
            >
              {submitting ? 'ပေးပို့နေသည်...' : 'Request လုပ်မည် 🚀'}
            </button>
          </form>

          <div style={{ marginTop: '20px', padding: '15px', background: '#f0f9ff', borderRadius: '10px', border: '1px dashed #bae6fd' }}>
            <p style={{ fontSize: '0.85rem', color: '#0369a1', margin: 0, lineHeight: '1.5' }}>
              ℹ️ Request လုပ်လိုက်တာနဲ့ Telegram Channel ထဲမှာ အကြောင်းကြားပေးမှာ ဖြစ်ပြီး၊ မိတ်ဆွေများက Vote လာပေးကြပါလိမ့်မယ်။
            </p>
          </div>
        </div>

        {/* Right Column: Request List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>🔥 လူကြိုက်များသော တောင်းဆိုမှုများ</h3>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b', background: 'white', padding: '6px 12px', borderRadius: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              Top 50
            </span>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
              <div style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid #e2e8f0', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ marginTop: '15px' }}>Loading requests...</p>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {requests.map((req) => {
                const hasVoted = votedIds.includes(req.id);
                const isCompleted = req.status === 'completed';

                return (
                  <div key={req.id} style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                    
                    {/* Status Indicator Stripe */}
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px', background: isCompleted ? '#22c55e' : '#f59e0b' }}></div>

                    <div style={{ paddingLeft: '15px' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.05rem', fontWeight: '700' }}>{req.book_name}</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', fontSize: '0.85rem', color: '#64748b' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>✍️ {req.author || 'Unknown'}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>👤 {req.requested_by}</span>
                      </div>
                      
                      {isCompleted ? (
                        <div style={{ marginTop: '12px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', background: '#dcfce7', color: '#15803d', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                            ✅ ရပါပြီ
                          </span>
                        </div>
                      ) : (
                         <div style={{ marginTop: '12px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', background: '#fff7ed', color: '#c2410c', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                            ⏳ ရှာဖွေနေဆဲ
                          </span>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => !hasVoted && !isCompleted && handleVote(req.id, req.votes)}
                      disabled={isCompleted || hasVoted}
                      style={{ 
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        background: isCompleted ? '#f1f5f9' : hasVoted ? '#eff6ff' : 'white', 
                        border: hasVoted ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                        padding: '0', width: '70px', height: '70px', borderRadius: '14px', 
                        cursor: (isCompleted || hasVoted) ? 'default' : 'pointer', 
                        transition: 'all 0.2s',
                        boxShadow: (isCompleted || hasVoted) ? 'none' : '0 4px 6px rgba(0,0,0,0.05)'
                      }}
                      onMouseOver={(e) => !isCompleted && !hasVoted && (e.currentTarget.style.transform = 'translateY(-2px)')}
                      onMouseOut={(e) => !isCompleted && !hasVoted && (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{isCompleted ? '🎉' : hasVoted ? '❤️' : '👍'}</span>
                      <span style={{ fontWeight: 'bold', color: hasVoted ? '#2563eb' : req.status === 'completed' ? '#94a3b8' : '#475569', fontSize: '0.9rem', marginTop: '4px' }}>
                        {req.votes || 0}
                      </span>
                    </button>
                  </div>
                );
              })}
              
              {requests.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px 20px', background: 'white', borderRadius: '16px', color: '#94a3b8', border: '1px dashed #cbd5e1' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📭</div>
                  <p>မရှိသေးပါ... ပထမဆုံး Request လုပ်သူ ဖြစ်ပါစေ! 🚀</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
