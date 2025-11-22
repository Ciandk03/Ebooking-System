"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { inputStyle, primaryButton, secondaryButton, titleStyle, cardStyle, messageStyle } from '../adminMovieStyles';

export default function PromotionsPage() {
  const router = useRouter();
  const [promoForm, setPromoForm] = useState({ code: '', startDate: '', endDate: '', discount: 10 });
  const [message, setMessage] = useState<string | null>(null);

  const submitPromo = async (e: any) => {
    e.preventDefault(); setMessage(null);
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('/api/promotions', { method: 'POST', headers, body: JSON.stringify(promoForm) });
      const json = await res.json();
      if (res.ok && json.success) {
        setMessage('Promotion created and emails sent to subscribers');
        setPromoForm({ code: '', startDate: '', endDate: '', discount: 10 });
      } else {
        setMessage(json.error || 'Failed to create promotion');
      }
    } catch (err) { setMessage('Failed to create promotion'); }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <button onClick={() => router.push('/admin')} style={{ padding: '8px 12px', borderRadius: 8, background: '#111', color: '#fff', border: '1px solid #222' }}>← Back</button>
        <h1 style={{ fontSize: 28, margin: 0 }}>Create Promotion</h1>
        <div />
      </div>

      <div style={cardStyle}>
        <h1 style={{ ...titleStyle, margin: 0 }}>Create Promotion</h1>
        <p style={{ color: '#9aa6b2', marginTop: 8, marginBottom: 16 }}>Create a promo code and optionally notify all subscribed users.</p>
        {message && <div style={messageStyle}>{message}</div>}

        <form onSubmit={submitPromo} style={{ display: 'grid', gap: 12 }}>
          <div>
            <label style={{ display: 'block', color: '#cbd5df', marginBottom: 6 }}>Code</label>
            <input placeholder="Code" required value={promoForm.code} onChange={e => setPromoForm({ ...promoForm, code: e.target.value })} style={inputStyle} />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#cbd5df', marginBottom: 6 }}>Start Date</label>
              <input placeholder="Start Date" type="date" value={promoForm.startDate} onChange={e => setPromoForm({ ...promoForm, startDate: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#cbd5df', marginBottom: 6 }}>End Date</label>
              <input placeholder="End Date" type="date" value={promoForm.endDate} onChange={e => setPromoForm({ ...promoForm, endDate: e.target.value })} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#cbd5df', marginBottom: 6 }}>Discount %</label>
            <input placeholder="Discount %" type="number" value={promoForm.discount} onChange={e => setPromoForm({ ...promoForm, discount: Number(e.target.value) })} style={inputStyle} />
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" onClick={() => router.push('/admin/movies/list')} style={secondaryButton}>View Movies</button>
            <button type="submit" style={primaryButton}>Create Promotion & Email Subscribers</button>
          </div>
        </form>
      </div>
    </div>
  );
}
