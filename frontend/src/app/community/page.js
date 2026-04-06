"use client";
import { useState, useEffect } from 'react';
import { fetchRequests, submitRequest, voteRequest } from '@/lib/api';
import Link from 'next/link';

export default function CommunityPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        bookName: '',
        author: '',
        userName: ''
    });

    const [votedItems, setVotedItems] = useState([]);

    useEffect(() => {
        loadRequests();
        // Load voted items from localStorage
        const voted = JSON.parse(localStorage.getItem('votedRequests') || '[]');
        setVotedItems(voted);
    }, []);

    const loadRequests = async () => {
        setLoading(true);
        const data = await fetchRequests();
        setRequests(data);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.bookName || !formData.userName) {
            return alert("စာအုပ်အမည်နှင့် သင့်အမည် ထည့်ပေးပါ");
        }
        setSubmitting(true);
        try {
            await submitRequest(formData);
            setFormData({ bookName: '', author: '', userName: '' });
            setShowForm(false);
            await loadRequests();
            alert("တောင်းဆိုချက် အောင်မြင်စွာ တင်ပြီးပါပြီ!");
        } catch (err) {
            alert("တောင်းဆိုချက်တင်ခြင်း မအောင်မြင်ပါ");
        }
        setSubmitting(false);
    };

    const handleVote = async (id, currentVotes) => {
        if (votedItems.includes(id)) {
            return alert("သင် Vote ပေးပြီးသားပါ");
        }

        try {
            // Optimistic Update
            setRequests(prev => prev.map(req => {
                const reqId = req.Id || req.id;
                if (reqId === id) {
                    return { ...req, votes: (Number(req.votes) || 0) + 1 };
                }
                return req;
            }));

            // Save to LocalStorage
            const newVoted = [...votedItems, id];
            setVotedItems(newVoted);
            localStorage.setItem('votedRequests', JSON.stringify(newVoted));

            await voteRequest(id, currentVotes);
            // No need to reload everything, optimistic update handles UI
        } catch (err) {
            alert("Vote မအောင်မြင်ပါ");
            await loadRequests(); // Revert on error
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
            <div style={{ textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto 15px' }}></div>
                <div style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: '600' }}>တောင်းဆိုချက်များ ရယူနေသည်...</div>
            </div>
        </div>
    );

    return (
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh' }}>

            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', padding: '50px 20px', color: 'white', textAlign: 'center' }}>
                <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', display: 'inline-block', marginBottom: '15px' }}>
                    ← ပင်မစာမျက်နှာသို့
                </Link>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '10px' }}>🙋‍♂️ Community Requests</h1>
                <p style={{ opacity: 0.9, marginBottom: '25px' }}>ဖတ်ချင်တဲ့ စာအုပ်ကို တောင်းဆိုပါ၊ Vote ပေးပါ</p>

                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{ padding: '14px 30px', backgroundColor: 'white', color: '#059669', border: 'none', borderRadius: '50px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                >
                    {showForm ? '✕ ပိတ်မည်' : '📚 စာအုပ်အသစ် တောင်းဆိုမည်'}
                </button>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px 20px' }}>

                {/* Request Form */}
                {showForm && (
                    <div className="fade-in" style={{ backgroundColor: 'white', borderRadius: '20px', padding: '30px', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
                        <h3 style={{ color: '#1e293b', marginBottom: '20px' }}>📝 စာအုပ်အသစ် တောင်းဆိုရန်</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>စာအုပ်အမည် *</label>
                                <input
                                    type="text"
                                    value={formData.bookName}
                                    onChange={(e) => setFormData({ ...formData, bookName: e.target.value })}
                                    placeholder="ဥပမာ - အောင်မြင်ခြင်း၏ လျှို့ဝှက်ချက်"
                                    required
                                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '1rem', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>စာရေးဆရာ</label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    placeholder="ဥပမာ - Brian Tracy"
                                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '1rem', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>သင့်အမည် *</label>
                                <input
                                    type="text"
                                    value={formData.userName}
                                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                    placeholder="ဥပမာ - မောင်မောင်"
                                    required
                                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '1rem', boxSizing: 'border-box' }}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                style={{ width: '100%', padding: '16px', backgroundColor: submitting ? '#86efac' : '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: submitting ? 'not-allowed' : 'pointer' }}
                            >
                                {submitting ? 'တင်နေပါသည်...' : '📤 တောင်းဆိုချက် တင်မည်'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Requests List */}
                <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>🔥 လူကြိုက်များသော တောင်းဆိုချက်များ</h2>

                {requests.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', color: '#64748b' }}>
                        <p style={{ fontSize: '1.2rem' }}>📭 တောင်းဆိုချက် မရှိသေးပါ</p>
                        <p>ပထမဆုံး တောင်းဆိုသူ ဖြစ်လိုက်ပါ!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {requests.map((req, index) => {
                            const reqId = req.Id || req.id;
                            const isVoted = votedItems.includes(reqId);

                            return (
                                <div key={reqId} className="fade-in" style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}>

                                    {/* Vote Section */}
                                    <div style={{ textAlign: 'center', minWidth: '70px' }}>
                                        <button
                                            onClick={() => handleVote(reqId, req.votes)}
                                            disabled={isVoted}
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                border: 'none',
                                                backgroundColor: isVoted ? '#3b82f6' : '#eff6ff',
                                                color: isVoted ? 'white' : '#3b82f6',
                                                fontSize: '1.5rem',
                                                cursor: isVoted ? 'default' : 'pointer',
                                                transition: 'all 0.2s',
                                                opacity: isVoted ? 1 : 0.8
                                            }}
                                            onMouseEnter={(e) => { if (!isVoted) { e.target.style.backgroundColor = '#3b82f6'; e.target.style.color = 'white'; } }}
                                            onMouseLeave={(e) => { if (!isVoted) { e.target.style.backgroundColor = '#eff6ff'; e.target.style.color = '#3b82f6'; } }}
                                        >
                                            👍
                                        </button>
                                        <p style={{ margin: '8px 0 0', fontWeight: '800', color: '#3b82f6', fontSize: '1.1rem' }}>{req.votes || 0}</p>
                                    </div>

                                    {/* Content */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                            {index < 3 && <span style={{ fontSize: '1.2rem' }}>{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>}
                                            <h3 style={{ color: '#1e293b', fontSize: '1.1rem', margin: 0 }}>{req.book_name}</h3>
                                        </div>
                                        {req.author && <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 5px' }}>✍️ {req.author}</p>}
                                        <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>တောင်းဆိုသူ: {req.requested_by}</p>
                                    </div>

                                    {/* Status Badge */}
                                    <span style={{
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        backgroundColor: req.status === 'completed' ? '#dcfce7' : '#fff7ed',
                                        color: req.status === 'completed' ? '#15803d' : '#c2410c'
                                    }}>
                                        {req.status === 'completed' ? '✅ ရရှိပြီး' : '⏳ စောင့်ဆိုင်းဆဲ'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
