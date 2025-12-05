"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cardStyle, titleStyle, itemCardStyle } from '../adminMovieStyles';

export default function MoviesListPage() {
  const router = useRouter();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadMovies(); }, []);

  const loadMovies = async () => {
    try {
      const res = await fetch('/api/movies');
      const j = await res.json();
      if (j.success) setMovies(j.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <button onClick={() => router.push('/admin')} style={{ padding: '8px 12px', borderRadius: 8, background: '#111', color: '#fff', border: '1px solid #222' }}>← Back</button>
        <h1 style={{ ...titleStyle, margin: 0 }}>Current Movies</h1>
        <div />
      </div>

      <div style={cardStyle}>
        <p style={{ color: '#9aa6b2' }}>List of movies currently in the database.</p>
        {loading ? <p>Loading...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {movies.map(m => (
              <div key={m.id} style={itemCardStyle}>
                <img src={m.poster} alt={m.title} style={{ width: 84, height: 124, objectFit: 'cover', borderRadius: 6 }} />
                <div style={{ color: '#e6f0f6' }}>
                  <strong style={{ display: 'block', fontSize: 16 }}>{m.title}</strong>
                  <div style={{ color: '#9aa6b2', fontSize: 13 }}>{m.genres && m.genres.join(', ')}</div>
                  <div style={{ marginTop: 8, color: '#cbd5df', fontSize: 13 }}>{m.details && m.details.substring(0, 140)}{m.details && m.details.length > 140 ? '…' : ''}</div>
                  <div style={{ marginTop: 10, color: '#9aa6b2', fontSize: 13 }}>Duration: {m.duration}m</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
