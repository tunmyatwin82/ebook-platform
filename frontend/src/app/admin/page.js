"use client";
import { useState, useEffect } from 'react';
import { fetchOrders, updateOrderStatus, fetchBooks } from '@/lib/api';
import Link from 'next/link';

export default function AdminPage() {
    const [orders, setOrders] = useState([]);
    const [books, setBooks] = useState({});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);

        // Fetch books first to get book titles
        const booksData = await fetchBooks();
        const booksMap = {};
        booksData.forEach(book => {
            booksMap[book.id] = book;
        });
        setBooks(booksMap);

        // Fetch orders and sort by id descending (newest first)
        const ordersData = await fetchOrders();
        const sortedOrders = ordersData.sort((a, b) => (b.id || 0) - (a.id || 0));
        setOrders(sortedOrders);

        setLoading(false);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        setUpdating(id);
        try {
            await updateOrderStatus(id, newStatus);
            await loadData();
        } catch (err) {
            console.error("Update error:", err);
            alert("Status update မအောင်မြင်ပါ: " + (err.message || 'Unknown error'));
        }
        setUpdating(null);
    };

    const getBookTitle = (bookId) => {
        if (books[bookId]) {
            return books[bookId].title || 'Unknown';
        }
        return 'Book #' + bookId;
    };

    const getBookPrice = (bookId) => {
        if (books[bookId]) {
            return books[bookId].price || 0;
        }
        return 0;
    };

    const getScreenshotUrl = (screenshot) => {
        if (!screenshot || !Array.isArray(screenshot) || screenshot.length === 0) return null;
        const img = screenshot[0];
        if (img.signedPath) {
            return `https://db.drtunmyatwin.com/${img.signedPath}`;
        }
        if (img.path) {
            return img.path.startsWith('http') ? img.path : `https://db.drtunmyatwin.com/${img.path}`;
        }
        return null;
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
            <div style={{ textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto 15px' }}></div>
                <div style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: '600' }}>Orders ရယူနေသည်...</div>
            </div>
        </div>
    );

    return (
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh' }}>

            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', padding: '30px 20px', color: 'white' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '10px', display: 'inline-block' }}>
                        ← ပင်မစာမျက်နှာသို့
                    </Link>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '10px 0 5px' }}>🛠️ Admin Panel</h1>
                    <p style={{ opacity: 0.9 }}>Order များကို စစ်ဆေးပြီး အတည်ပြုပေးပါ (Newest First)</p>
                </div>
            </div>

            {/* Orders Table */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: '#1e293b', fontSize: '1.2rem' }}>📋 Orders ({orders.length})</h2>
                    <button onClick={loadData} style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                        🔄 Refresh
                    </button>
                </div>

                {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '12px', color: '#64748b' }}>
                        <p style={{ fontSize: '1.2rem' }}>📭 Order မရှိသေးပါ</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: '700', color: '#475569' }}>ID</th>
                                    <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Customer</th>
                                    <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Phone</th>
                                    <th style={{ padding: '14px 12px', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Book Title</th>
                                    <th style={{ padding: '14px 12px', textAlign: 'center', fontWeight: '700', color: '#475569' }}>Book ID</th>
                                    <th style={{ padding: '14px 12px', textAlign: 'right', fontWeight: '700', color: '#475569' }}>Price</th>
                                    <th style={{ padding: '14px 12px', textAlign: 'center', fontWeight: '700', color: '#475569' }}>Screenshot</th>
                                    <th style={{ padding: '14px 12px', textAlign: 'center', fontWeight: '700', color: '#475569' }}>Status</th>
                                    <th style={{ padding: '14px 12px', textAlign: 'center', fontWeight: '700', color: '#475569' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => {
                                    const screenshotUrl = getScreenshotUrl(order.screenshot);
                                    const isUpdating = updating === order.id;

                                    return (
                                        <tr key={order.id} style={{
                                            borderBottom: '1px solid #f1f5f9',
                                            backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc'
                                        }}>
                                            {/* ID */}
                                            <td style={{ padding: '12px', fontWeight: '700', color: '#1e40af' }}>
                                                #{order.id}
                                            </td>

                                            {/* Customer Name */}
                                            <td style={{ padding: '12px', color: '#1e293b', fontWeight: '600', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {order.customer_name || 'N/A'}
                                            </td>

                                            {/* Phone */}
                                            <td style={{ padding: '12px', color: '#64748b' }}>
                                                {order.phone || 'N/A'}
                                            </td>

                                            {/* Book Title */}
                                            <td style={{ padding: '12px', color: '#1e293b', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {getBookTitle(order.book_id)}
                                            </td>

                                            {/* Book ID */}
                                            <td style={{ padding: '12px', textAlign: 'center', color: '#64748b' }}>
                                                {order.book_id || '-'}
                                            </td>

                                            {/* Price */}
                                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700', color: '#059669' }}>
                                                {(order.amount || getBookPrice(order.book_id)).toLocaleString()} MMK
                                            </td>

                                            {/* Screenshot */}
                                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                                {screenshotUrl ? (
                                                    <a href={screenshotUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>
                                                        📷 View
                                                    </a>
                                                ) : (
                                                    <span style={{ color: '#94a3b8' }}>-</span>
                                                )}
                                            </td>

                                            {/* Status Badge */}
                                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '4px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700',
                                                    backgroundColor: order.status === 'completed' ? '#dcfce7' : order.status === 'rejected' ? '#fee2e2' : '#fff7ed',
                                                    color: order.status === 'completed' ? '#15803d' : order.status === 'rejected' ? '#991b1b' : '#c2410c'
                                                }}>
                                                    {order.status === 'completed' ? '✅' : order.status === 'rejected' ? '❌' : '⏳'} {order.status || 'pending'}
                                                </span>
                                            </td>

                                            {/* Action Buttons */}
                                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                                    <button
                                                        onClick={() => handleStatusUpdate(order.id, 'completed')}
                                                        disabled={isUpdating || order.status === 'completed'}
                                                        style={{
                                                            padding: '6px 10px',
                                                            backgroundColor: order.status === 'completed' ? '#86efac' : '#10b981',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600',
                                                            cursor: order.status === 'completed' ? 'not-allowed' : 'pointer',
                                                            opacity: order.status === 'completed' ? 0.5 : 1
                                                        }}
                                                    >
                                                        {isUpdating ? '...' : '✓'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(order.id, 'rejected')}
                                                        disabled={isUpdating || order.status === 'rejected'}
                                                        style={{
                                                            padding: '6px 10px',
                                                            backgroundColor: order.status === 'rejected' ? '#fca5a5' : '#ef4444',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600',
                                                            cursor: order.status === 'rejected' ? 'not-allowed' : 'pointer',
                                                            opacity: order.status === 'rejected' ? 0.5 : 1
                                                        }}
                                                    >
                                                        {isUpdating ? '...' : '✗'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(order.id, 'pending')}
                                                        disabled={isUpdating || order.status === 'pending'}
                                                        style={{
                                                            padding: '6px 10px',
                                                            backgroundColor: order.status === 'pending' ? '#fcd34d' : '#f59e0b',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600',
                                                            cursor: order.status === 'pending' ? 'not-allowed' : 'pointer',
                                                            opacity: order.status === 'pending' ? 0.5 : 1
                                                        }}
                                                    >
                                                        {isUpdating ? '...' : '⏳'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
