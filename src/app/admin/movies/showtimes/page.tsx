"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { inputStyle, primaryButton, titleStyle, cardStyle, messageStyle } from '../adminMovieStyles';

export default function CreateShowtimePage() {
  const router = useRouter();
  const [movies, setMovies] = useState<any[]>([]);
  const [showtimeForm, setShowtimeForm] = useState({ movieId: '', date: '', time: '', theater: '', availableSeats: 100, totalSeats: 100, price: 10 });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => { loadMovies(); }, []);

  const loadMovies = async () => {
    try {
      const res = await fetch('/api/movies');
      const j = await res.json();
      if (j.success) setMovies(j.data || []);
    } catch (e) { console.error(e); }
  };

  const submitShowtime = async (e: any) => {
    e.preventDefault(); setMessage(null);
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('/api/showtimes', { method: 'POST', headers, body: JSON.stringify(showtimeForm) });
      const json = await res.json();
      if (res.ok && json.success) {
        setMessage('Showtime created successfully');
        setShowtimeForm({ movieId: '', date: '', time: '', theater: '', availableSeats: 100, totalSeats: 100, price: 10 });
      } else {
        setMessage(json.error || 'Failed to create showtime');
      }
    } catch (err) { setMessage('Failed to create showtime'); }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <button onClick={() => router.push('/admin')} style={{ padding: '8px 12px', borderRadius: 8, background: '#111', color: '#fff', border: '1px solid #222' }}>← Back</button>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ ...titleStyle, margin: 0 }}>Create Showtime</h1>
          <p style={{ color: '#9aa6b2', margin: 0 }}>Select movie, date, time and showroom. Overlap checks enforced server-side.</p>
        </div>
        <div />
      </div>

      <div style={cardStyle}>
        {message && <div style={messageStyle}>{message}</div>}

        <form onSubmit={submitShowtime} style={{ display: 'grid', gap: 12 }}>
          <div>
            <label style={{ color: '#cbd5df', display: 'block', marginBottom: 6 }}>Movie</label>
            <select required value={showtimeForm.movieId} onChange={e => setShowtimeForm({ ...showtimeForm, movieId: e.target.value })} style={inputStyle}>
              <option value="">Select movie</option>
              {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: '#cbd5df', display: 'block', marginBottom: 6 }}>Date (YYYY-MM-DD)</label>
              <input placeholder="Date (YYYY-MM-DD)" value={showtimeForm.date} onChange={e => setShowtimeForm({ ...showtimeForm, date: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ width: 160 }}>
              <label style={{ color: '#cbd5df', display: 'block', marginBottom: 6 }}>Time (HH:MM)</label>
              <input placeholder="Time (HH:MM)" value={showtimeForm.time} onChange={e => setShowtimeForm({ ...showtimeForm, time: e.target.value })} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: '#cbd5df', display: 'block', marginBottom: 6 }}>Theater / Showroom</label>
              <input placeholder="Theater / Showroom" value={showtimeForm.theater} onChange={e => setShowtimeForm({ ...showtimeForm, theater: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ width: 160 }}>
              <label style={{ color: '#cbd5df', display: 'block', marginBottom: 6 }}>Price</label>
              <input placeholder="Price" type="number" value={showtimeForm.price} onChange={e => setShowtimeForm({ ...showtimeForm, price: Number(e.target.value) })} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: '#cbd5df', display: 'block', marginBottom: 6 }}>Available Seats</label>
              <input placeholder="Available Seats" type="number" value={showtimeForm.availableSeats} onChange={e => setShowtimeForm({ ...showtimeForm, availableSeats: Number(e.target.value) })} style={inputStyle} />
            </div>
            <div style={{ width: 160 }}>
              <label style={{ color: '#cbd5df', display: 'block', marginBottom: 6 }}>Total Seats</label>
              <input placeholder="Total Seats" type="number" value={showtimeForm.totalSeats} onChange={e => setShowtimeForm({ ...showtimeForm, totalSeats: Number(e.target.value) })} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="submit" style={primaryButton}>Create Showtime</button>
          </div>
        </form>
      </div>
    </div>
  );
}
