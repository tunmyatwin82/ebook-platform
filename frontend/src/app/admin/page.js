"use client";
import { useState, useEffect } from 'react';
import { fetchOrders, updateOrderStatus } from '../../lib/api';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // အရိုးရှင်းဆုံး Password စနစ် (နောင်တွင် ပိုမိုကောင်းမွန်အောင် ပြင်နိုင်သည်)
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin1234') { // ဒီနေရာမှာ သင်နှစ်သက်ရာ Password ပြောင်းပါ
      setIsAuthenticated(true);
    } else {
      alert("Password မှားယွင်းနေပါသည်။");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    const data = await fetchOrders();
    setOrders(data);
  };

  const handleStatusUpdate = async (id, status) => {
    await updateOrderStatus(id, status);
    loadOrders(); // List ကို Update ပြန်လုပ်ရန်
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' }}>
        <form onSubmit={handleLogin} style={{ padding: '30px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3>Admin Login</h3>
          <input 
            type="password" 
            placeholder="Enter Admin Password" 
            style={{ padding: '10px', width: '100%', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#1e293b' }}>Order Management</h1>
        <button onClick={() => setIsAuthenticated(false)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>Logout</button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f1f5f9' }}>
            <tr>
              <th style={{ padding: '15px' }}>ဝယ်ယူသူ</th>
              <th style={{ padding: '15px' }}>ဖုန်းနံပါတ်</th>
              <th style={{ padding: '15px' }}>စာအုပ် ID</th>
              <th style={{ padding: '15px' }}>ကျသင့်ငွေ</th>
              <th style={{ padding: '15px' }}>Screenshot</th>
              <th style={{ padding: '15px' }}>Status</th>
              <th style={{ padding: '15px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '15px' }}>{order.customer_name}</td>
                <td style={{ padding: '15px' }}>{order.phone}</td>
                <td style={{ padding: '15px' }}>{order.book_id}</td>
                <td style={{ padding: '15px' }}>{order.amount} MMK</td>
                <td style={{ padding: '15px' }}>
                  <a href={`https://db.drtunmyatwin.com/${order.screenshot?.[0]?.path}`} target="_blank" style={{ color: '#3b82f6' }}>View Image</a>
                </td>
                <td style={{ padding: '15px' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem',
                    backgroundColor: order.status === 'pending' ? '#fef3c7' : '#dcfce7',
                    color: order.status === 'pending' ? '#92400e' : '#166534'
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  {order.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button onClick={() => handleStatusUpdate(order.id, 'completed')} style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Approve</button>
                      <button onClick={() => handleStatusUpdate(order.id, 'rejected')} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
