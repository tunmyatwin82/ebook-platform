// src/app/community/page.js
"use client";

import { useState, useEffect } from 'react';
import { fetchRequests, submitRequest, voteRequest } from '@/lib/api';
import Link from 'next/link';

export default function CommunityPage() {
  // Start with null to handle the initial loading state correctly
  const [requests, setRequests] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [votedIds, setVotedIds] = useState(new Set());

  const TELEGRAM_CHANNEL_LINK = "https://t.me/shopdrtunmyatwin"; 

  const [formData, setFormData] = useState({ bookName: '', author: '', userName: '' });

  useEffect(() => {
    // Define an async function inside useEffect to fetch data
    const getInitialData = async () => {
      setLoading(true);
      console.log("DEBUG: Page loading, calling fetchRequests...");
      const data = await fetchRequests();
      
      // LOGGING: See what data the page receives from the API function
      console.log("DEBUG: Data received in page component:", data);

      // Final safety check before setting state
      if (Array.isArray(data)) {
        setRequests(data);
      } else {
        // This case should not happen with the new api.js, but it's a final safeguard
        console.error("DEBUG: CRITICAL! Received non-array data. Setting to empty array to prevent crash.");
        setRequests([]);
      }
      setLoading(false);
    };

    getInitialData();

    // Load voted IDs from localStorage
    const savedVotes = localStorage.getItem('voted_books');
    if (savedVotes) {
      try {
        setVotedIds(new Set(JSON.parse(savedVotes)));
      } catch (e) {
        console.error("Failed to parse voted books from localStorage", e);
      }
    }
  }, []); // Empty dependency array means this runs once on mount

  // ... (handleSubmit and handleVote functions are fine from the previous version)

  return (
    // ... (The main layout div and nav are fine)

    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      {/* ... (Header is fine) */}
      
      <div style={{ display: 'grid', /* ... other styles */ }}>
        {/* ... (Left Column Form is fine) */}

        {/* Right Column: Request List */}
        <div>
          <h3 style={{ margin: '0 0 20px 0', color: '#343a40', fontSize: '1.2rem' }}>🔥 လူကြိုက်အများဆုံး တောင်းဆိုမှုများ</h3>
          
          {/* ======================================= */}
          {/* ★★★ FINAL BULLETPROOF RENDER LOGIC ★★★ */}
          {/* ======================================= */}

          {loading ? (
            <p style={{color: '#6c757d'}}>Loading requests...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              {/* Check if requests is an array AND has items */}
              {Array.isArray(requests) && requests.length > 0 ? (
                requests.map((req) => {
                  const isCompleted = req.status === 'completed';
                  const hasVoted = votedIds.has(req.id);
                  return (
                    // Your card JSX here...
                    <div key={req.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {/* ... card content */}
                    </div>
                  );
                })
              ) : (
                // This will show if loading is false but requests is empty or not an array
                <p style={{ textAlign: 'center', color: '#6c757d', background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                  No requests yet. Be the first to add one!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
