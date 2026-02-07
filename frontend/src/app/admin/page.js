"use client";
import { useState, useEffect } from "react";
import { fetchOrders, updateOrderStatus } from "@/lib/api";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const savedLogin = localStorage.getItem("admin_auth");
    if (savedLogin === "true") setIsLoggedIn(true);
  }, []);

  const loadOrders = async () => {
    const data = await fetchOrders();
    setOrders(data);
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadOrders();
      const interval = setInterval(loadOrders, 10000); 
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "tmw3171982") {
      setIsLoggedIn(true);
      localStorage.setItem("admin_auth", "true");
    } else {
      alert("Password မှားနေပါသည်!");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const confirmMsg = newStatus === 'completed' ? "Approve လုပ်မှာ သေချာပါသလား?" : "Reject လုပ်မှာ သေချာပါသလား?";
    if (!window.confirm(confirmMsg)) return;

    try {
      await updateOrderStatus(id, newStatus);
      loadOrders(); 
    } catch (error) {
      alert("Error updating status");
    }
  };

  const getScreenshotUrl = (screenshotData) => {
    try {
      if (!screenshotData) return null;
      const data = typeof screenshotData === 'string' ? JSON.parse(screenshotData) : screenshotData;
      return Array.isArray(data) ? `https://db.drtunmyatwin.com/${data[0].path}` : null;
    } catch (e) { return null; }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f1f5f9' }}>
        <div style={{ padding: '40px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ textAlign: "center", marginBottom: '20px' }}>Admin Login</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", width: '250px', color: '#333' }} />
            <button type="submit" style={{ padding: "12px", background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", fontFamily: 'sans-serif' }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: '30px' }}>
        <h2>Admin Dashboard</h2>
        <button onClick={() => { localStorage.removeItem("admin_auth"); setIsLoggedIn(false); }} style={{ background: "#ef4444", color: "white", border: "none", padding: "8px 20px", borderRadius: "6px", cursor: "pointer" }}>Logout</button>
      </div>
      
      <table style={{ width: "100%", borderCollapse: "collapse", background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
        <thead style={{ background: "#1e293b", color: 'white' }}>
          <tr>
            <th style={{ padding: '15px' }}>ID</th>
            <th style={{ padding: '15px' }}>အမည်</th>
            <th style={{ padding: '15px' }}>ဖုန်း</th>
            <th style={{ padding: '15px' }}>ပြေစာ</th>
            <th style={{ padding: '15px' }}>အခြေအနေ</th>
            <th style={{ padding: '15px' }}>လုပ်ဆောင်ချက်</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} style={{ textAlign: "center", borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '15px' }}>#{order.id}</td>
              <td style={{ padding: '15px' }}>{order.customer_name}</td>
              <td style={{ padding: '15px' }}>{order.phone}</td>
              <td style={{ padding: '15px' }}>
                {getScreenshotUrl(order.screenshot) ? (
                  <a href={getScreenshotUrl(order.screenshot)} target="_blank" rel="noopener noreferrer">
                    <img src={getScreenshotUrl(order.screenshot)} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} alt="receipt" />
                  </a>
                ) : "No Image"}
              </td>
              <td style={{ padding: '15px' }}>
                <span style={{ 
                  padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase',
                  background: order.status === 'completed' ? '#dcfce7' : order.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                  color: order.status === 'completed' ? '#15803d' : order.status === 'rejected' ? '#b91c1c' : '#b45309'
                }}>
                  {order.status}
                </span>
              </td>
              <td style={{ padding: "15px" }}>
                {order.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                    <button onClick={() => handleStatusUpdate(order.id, 'completed')} style={{ background: "#22c55e", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: '11px' }}>Approve</button>
                    <button onClick={() => handleStatusUpdate(order.id, 'rejected')} style={{ background: "#ef4444", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: '11px' }}>Reject</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
