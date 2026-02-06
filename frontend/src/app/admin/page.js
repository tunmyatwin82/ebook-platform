"use client";
import { useState, useEffect } from "react";
// API functions တွေကို import သေချာပြန်စစ်ပါ
import { fetchOrders, updateOrderStatus } from "@/lib/api";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://db.drtunmyatwin.com";

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setOrders([]);
    }
    setLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "tmw3171982") {
      setIsAuthenticated(true);
    } else {
      alert("Wrong Password");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      await loadOrders(); // အောင်မြင်ရင် data ပြန်ခေါ်မယ်
    } catch (err) {
      alert("Status update failed!");
    }
  };

  const getImageUrl = (screenshotData) => {
    if (!screenshotData) return null;
    let path = "";
    if (typeof screenshotData === 'object' && screenshotData[0]) {
      path = screenshotData[0].path || screenshotData[0].url;
    } else if (typeof screenshotData === 'string') {
      path = screenshotData;
    }
    return path ? `${BASE_URL}/${path}` : null;
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f1f5f9', fontFamily: 'sans-serif' }}>
        <form onSubmit={handleLogin} style={{ background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '300px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1e293b' }}>ADMIN LOGIN</h2>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} 
            placeholder="Password" 
          />
          <button type="submit" style={{ width: '100%', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>LOGIN</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      minHeight: '100vh', 
      background: 'white', 
      zIndex: 9999, 
      fontFamily: 'sans-serif',
      display: 'block' 
    }}>
      {/* Header */}
      <div style={{ background: '#1e293b', color: 'white', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '18px' }}>ORDER MANAGEMENT (V4.1-FIXED)</h1>
        <button onClick={loadOrders} style={{ padding: '8px 15px', background: '#2563eb', border: 'none', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>REFRESH</button>
      </div>

      {/* Main Table Container */}
      <div style={{ padding: '20px' }}>
        <div style={{ border: '1px solid #eee', borderRadius: '10px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '15px' }}>ID</th>
                <th style={{ padding: '15px' }}>CUSTOMER</th>
                <th style={{ padding: '15px' }}>AMOUNT</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>SCREENSHOT</th>
                <th style={{ padding: '15px' }}>STATUS</th>
                <th style={{ padding: '15px' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center' }}>Loading Data...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center' }}>No orders found.</td></tr>
              ) : (
                orders.map((o) => {
                  const imgUrl = getImageUrl(o.screenshot);
                  return (
                    <tr key={o.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                      <td style={{ padding: '15px', color: '#94a3b8' }}>#{o.id}</td>
                      <td style={{ padding: '15px' }}>
                        <div style={{ fontWeight: 'bold' }}>{o.customer_name || 'N/A'}</div>
                        <div style={{ color: '#2563eb', fontSize: '12px' }}>{o.phone || '-'}</div>
                      </td>
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>{o.amount?.toLocaleString()} MMK</td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        {imgUrl ? (
                          <img 
                            src={imgUrl} 
                            style={{ width: '60px', height: '85px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #ddd', cursor: 'pointer' }} 
                            onClick={() => window.open(imgUrl, '_blank')}
                            alt="Receipt"
                          />
                        ) : <span style={{ color: '#ccc', fontSize: '12px' }}>No Image</span>}
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '20px', 
                          fontSize: '11px', 
                          fontWeight: 'bold',
                          background: o.status === 'completed' ? '#dcfce7' : '#fef3c7',
                          color: o.status === 'completed' ? '#15803d' : '#b45309'
                        }}>
                          {o.status || 'pending'}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <select 
                          value={o.status || 'pending'} 
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Approve</option>
                          <option value="rejected">Reject</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
