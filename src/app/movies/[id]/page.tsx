'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Movie } from '@/types/database';
import MovieDetails from '@/components/MovieDetails';

const UGA = {
  black: "#000000",
  nearBlack: "#0b0b0b",
  dark: "#151515",
  gray: "#d1d5db",
  white: "#ffffff",
  red: "#ba0c2f",
  redDark: "#8a0a23",
  border: "#2a2a2a",
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: UGA.black,
    minHeight: "100vh",
    color: UGA.white,
    padding: 24,
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  backButton: {
    padding: "8px 16px",
    borderRadius: 8,
    border: `1px solid ${UGA.border}`,
    background: UGA.dark,
    color: UGA.white,
    cursor: "pointer",
    fontWeight: 600,
  },
  title: {
    fontSize: 32,
    fontWeight: 900,
    letterSpacing: -0.5,
  },
  loading: {
    textAlign: "center",
    padding: 48,
    color: UGA.gray,
    fontSize: 18,
  },
  error: {
    textAlign: "center",
    padding: 48,
    color: UGA.red,
    fontSize: 18,
  },
};

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/movies/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Movie not found');
          }
          throw new Error('Failed to fetch movie');
        }
        
        const data = await response.json();
        setMovie(data.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load movie');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMovie();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loading}>Loading movie details...</div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <button 
              style={styles.backButton} 
              onClick={() => router.back()}
            >
              ← Back
            </button>
          </div>
          <div style={styles.error}>
            {error || 'Movie not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button 
            style={styles.backButton} 
            onClick={() => router.back()}
          >
            ← Back
          </button>
          <h1 style={styles.title}>{movie.title}</h1>
        </div>
        
        <MovieDetails 
          id={movie.id}
          title={movie.title}
          poster={movie.poster || ''}
          rating={movie.rating || 0}
          details={movie.details || ''}
          trailer={movie.trailer || ''}
          genres={movie.genres || []}
          duration={movie.duration}
          releaseDate={movie.releaseDate}
          currentlyRunning={movie.currentlyRunning}
          comingSoon={movie.comingSoon}
        />
      </div>
    </div>
  );
}
