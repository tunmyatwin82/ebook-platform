"use client";
import { useState, useEffect } from "react";
import { fetchOrders, updateOrderStatus } from "@/lib/api";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("admin_auth") === "true") setIsLoggedIn(true);
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadOrders();
      const interval = setInterval(loadOrders, 20000); // 20 sec တစ်ခါ refresh
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const handleStatusUpdate = async (id, status) => {
    if (!window.confirm(`${status} လုပ်မှာ သေချာပါသလား?`)) return;
    try {
      await updateOrderStatus(id, status);
      alert("Success!");
      loadOrders();
    } catch (e) { alert("Error updating status!"); }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '100px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h3>Admin Login</h3>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <button onClick={() => { if(password==="tmw3171982") { setIsLoggedIn(true); localStorage.setItem("admin_auth","true"); } else { alert("Wrong password"); } }} style={{ padding: '10px 20px', marginLeft: '10px', cursor: 'pointer' }}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Order Management ({orders.length} orders)</h2>
        <button onClick={loadOrders} disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          {loading ? 'Refreshing...' : '🔄 Refresh Data'}
        </button>
      </div>
      
      <table border="1" style={{ width: "100%", borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#3b82f6', color: 'white' }}>
            <th style={{ padding: '12px' }}>ID</th>
            <th>အမည်</th>
            <th>ဖုန်း</th>
            <th>ငွေပမာဏ</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>No orders found.</td></tr>
          ) : (
            orders.map(o => (
              <tr key={o.Id || o.id} style={{ textAlign: 'center', borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>#{o.Id || o.id}</td>
                <td>{o.customer_name}</td>
                <td>{o.phone}</td>
                <td>{o.amount} MMK</td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem',
                    background: o.status === 'completed' ? '#dcfce7' : o.status === 'pending' ? '#fff7ed' : '#fee2e2',
                    color: o.status === 'completed' ? '#166534' : o.status === 'pending' ? '#9a3412' : '#991b1b'
                  }}>
                    {o.status}
                  </span>
                </td>
                <td>
                  {String(o.status).toLowerCase() === 'pending' && (
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      <button onClick={() => handleStatusUpdate(o.Id || o.id, 'completed')} style={{ background: '#22c55e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Approve</button>
                      <button onClick={() => handleStatusUpdate(o.Id || o.id, 'rejected')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
