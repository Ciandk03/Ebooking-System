"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { inputStyle, primaryButton, secondaryButton, titleStyle, cardStyle, messageStyle } from '../adminMovieStyles';
import { Movie } from '@/types/database';

export default function AddMoviePage() {
  const router = useRouter();
  const [movieForm, setMovieForm] = useState({
    title: '', poster: '', rating: 8.5, details: '', genres: '', duration: 120, trailer: '', releaseDate: '',
    cast: '', director: '', producer: '', currentlyRunning: true, comingSoon: false, createdAt: '', updatedAt: ''
  });
  const [message, setMessage] = useState<string | null>(null);

  const submitMovie = async (e: any) => {
    e.preventDefault();
    setMessage(null);
    try {
      const body: Movie = {
        title: movieForm.title,
        poster: movieForm.poster,
        rating: Number(movieForm.rating),
        details: movieForm.details,
        genres: movieForm.genres ? movieForm.genres.split(',').map((s: string) => s.trim()) : [],
        duration: Number(movieForm.duration),
        trailer: movieForm.trailer,
        releaseDate: movieForm.releaseDate,
        cast: movieForm.cast ? movieForm.cast.split(',').map((s: string) => s.trim()) : [],
        director: movieForm.director,
        producer: movieForm.producer,
        currentlyRunning: Boolean(movieForm.currentlyRunning),
        comingSoon: Boolean(movieForm.comingSoon),
      };

      const headers: any = { 'Content-Type': 'application/json' };
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('/api/movies', { method: 'POST', headers, body: JSON.stringify(body) });
      const json = await res.json();
      if (res.ok && json.success) {
        setMessage('Movie added successfully');
        setMovieForm({ title: '', poster: '', rating: 8.5, details: '', genres: '', duration: 120, trailer: '', releaseDate: '', cast: '', director: '', producer: '', currentlyRunning: true, comingSoon: false, createdAt: '', updatedAt: '' });
      } else {
        setMessage(json.error || 'Failed to add movie');
      }
    } catch (err) {
      setMessage('Failed to add movie');
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <button onClick={() => router.push('/admin')} style={{ padding: '8px 12px', borderRadius: 8, background: '#111', color: '#fff', border: '1px solid #222' }}>← Back</button>
        <h1 style={{ ...titleStyle, margin: 0 }}>Add Movie</h1>
        <div />
      </div>

      <div style={cardStyle}>
        <p style={{ color: '#9aa6b2', marginTop: 0, marginBottom: 16 }}>Fill all fields. For array fields (cast, genres) enter comma-separated values.</p>
        {message && <div style={messageStyle}>{message}</div>}

        <form onSubmit={submitMovie}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5df', marginBottom: 6 }}>Title</label>
              <input placeholder="Title" required value={movieForm.title} onChange={e => setMovieForm({ ...movieForm, title: e.target.value })} style={inputStyle} />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5df', marginBottom: 6 }}>Poster URL</label>
              <input placeholder="Poster URL" value={movieForm.poster} onChange={e => setMovieForm({ ...movieForm, poster: e.target.value })} style={inputStyle} />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5df', marginBottom: 6 }}>Rating</label>
              <input placeholder="Rating" type="number" step="0.1" value={movieForm.rating} onChange={e => setMovieForm({ ...movieForm, rating: Number(e.target.value) })} style={inputStyle} />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5df', marginBottom: 6 }}>Genres (comma separated)</label>
              <input placeholder="Action,Drama" value={movieForm.genres} onChange={e => setMovieForm({ ...movieForm, genres: e.target.value })} style={inputStyle} />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5df', marginBottom: 6 }}>Duration (minutes)</label>
              <input placeholder="Duration" type="number" value={movieForm.duration} onChange={e => setMovieForm({ ...movieForm, duration: Number(e.target.value) })} style={inputStyle} />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5df', marginBottom: 6 }}>Trailer URL</label>
              <input placeholder="Trailer URL" value={movieForm.trailer} onChange={e => setMovieForm({ ...movieForm, trailer: e.target.value })} style={inputStyle} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', color: '#cbd5df', marginBottom: 6 }}>Release Date (freeform)</label>
              <input placeholder="e.g. 6-15-2005" value={movieForm.releaseDate} onChange={e => setMovieForm({ ...movieForm, releaseDate: e.target.value })} style={inputStyle} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', color: '#cbd5df', marginBottom: 6 }}>Cast (comma separated)</label>
              <textarea placeholder="Johnny Depp, Geoffrey Rush" value={movieForm.cast} onChange={e => setMovieForm({ ...movieForm, cast: e.target.value })} style={{ ...inputStyle, minHeight: 80 }} />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5df', marginBottom: 6 }}>Director</label>
              <input placeholder="Director" value={movieForm.director} onChange={e => setMovieForm({ ...movieForm, director: e.target.value })} style={inputStyle} />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5df', marginBottom: 6 }}>Producer</label>
              <input placeholder="Producer" value={movieForm.producer} onChange={e => setMovieForm({ ...movieForm, producer: e.target.value })} style={inputStyle} />
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <label style={{ color: '#cbd5df' }}><input type="checkbox" checked={movieForm.currentlyRunning} onChange={e => setMovieForm({ ...movieForm, currentlyRunning: e.target.checked })} /> Currently running</label>
              <label style={{ color: '#cbd5df' }}><input type="checkbox" checked={movieForm.comingSoon} onChange={e => setMovieForm({ ...movieForm, comingSoon: e.target.checked })} /> Coming soon</label>
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5df', marginBottom: 6 }}>Optional createdAt</label>
              <input placeholder="YYYY-MM-DD or ISO" value={movieForm.createdAt} onChange={e => setMovieForm({ ...movieForm, createdAt: e.target.value })} style={inputStyle} />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5df', marginBottom: 6 }}>Optional updatedAt</label>
              <input placeholder="YYYY-MM-DD or ISO" value={movieForm.updatedAt} onChange={e => setMovieForm({ ...movieForm, updatedAt: e.target.value })} style={inputStyle} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', color: '#cbd5df', marginBottom: 6 }}>Details / Synopsis</label>
              <textarea placeholder="Details" value={movieForm.details} onChange={e => setMovieForm({ ...movieForm, details: e.target.value })} style={{ ...inputStyle, minHeight: 120 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => router.push('/admin/movies/list')} style={secondaryButton}>View Movies</button>
            <button type="submit" style={primaryButton}>Add Movie</button>
          </div>
        </form>
      </div>
    </div>
  );
}
