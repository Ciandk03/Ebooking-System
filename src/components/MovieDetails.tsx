'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface MovieDetailsProps {
  id: string;
  title: string;
  poster: string;
  rating: number;
  details: string;
  trailer: string;
  genres: string[];
  duration?: number;
  releaseDate?: string;
  currentlyRunning?: boolean;
  comingSoon?: boolean;
  cast?: string[];
  director?: string;
  producer?: string;
}

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
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: 32,
    marginBottom: 32,
  },
  posterSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  poster: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  },
  posterPlaceholder: {
    width: "100%",
    height: 600,
    background: UGA.dark,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: UGA.gray,
    fontSize: 18,
    border: `1px solid ${UGA.border}`,
  },
  detailsSection: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 900,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  rating: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: UGA.red,
    padding: "6px 12px",
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 700,
  },
  status: {
    padding: "6px 12px",
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 700,
    background: UGA.dark,
    border: `1px solid ${UGA.border}`,
  },
  statusRunning: {
    background: "#065f46",
    color: "#10b981",
    border: "1px solid #10b981",
  },
  statusComing: {
    background: "#78350f",
    color: "#fbbf24",
    border: "1px solid #fbbf24",
  },
  genres: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  genre: {
    padding: "4px 12px",
    borderRadius: 16,
    background: UGA.dark,
    border: `1px solid ${UGA.border}`,
    fontSize: 12,
    fontWeight: 600,
  },
  description: {
    fontSize: 16,
    lineHeight: 1.6,
    color: UGA.gray,
    marginBottom: 24,
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: UGA.gray,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 600,
  },
  creditsSection: {
    padding: 24,
    borderRadius: 16,
    border: `1px solid ${UGA.border}`,
    background: UGA.nearBlack,
    marginBottom: 24,
  },
  creditsTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 16,
  },
  creditsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },
  castChips: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  castChip: {
    padding: "6px 12px",
    borderRadius: 999,
    background: UGA.dark,
    border: `1px solid ${UGA.border}`,
    fontSize: 13,
    fontWeight: 600,
  },
  actions: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
  },
  btnPrimary: {
    padding: "12px 24px",
    borderRadius: 12,
    border: `1px solid ${UGA.red}`,
    background: UGA.red,
    color: UGA.white,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 16,
    textDecoration: "none",
    display: "inline-block",
  },
  btnSecondary: {
    padding: "12px 24px",
    borderRadius: 12,
    border: `1px solid ${UGA.border}`,
    background: UGA.dark,
    color: UGA.white,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 16,
    textDecoration: "none",
    display: "inline-block",
  },
  trailerSection: {
    marginTop: 32,
    padding: 24,
    background: UGA.nearBlack,
    borderRadius: 16,
    border: `1px solid ${UGA.border}`,
  },
  trailerTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 16,
  },
  trailerContainer: {
    position: "relative",
    width: "100%",
    paddingBottom: "56.25%",
    background: UGA.black,
    borderRadius: 8,
    overflow: "hidden",
  },
  trailerIframe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "none",
  },

  // Dates + Showtimes sections (matching UGA style)
  showtimesSection: {
    marginTop: 32,
    padding: 24,
    background: UGA.nearBlack,
    borderRadius: 16,
    border: `1px solid ${UGA.border}`,
  },
  showtimesTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 12,
  },
  pillsRow: { display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  pill: {
    padding: '10px 14px',
    borderRadius: 999,
    border: `1px solid ${UGA.border}`,
    background: UGA.dark,
    color: UGA.white,
    cursor: 'pointer',
    fontWeight: 700,
  },
  pillActive: {
    border: `1px solid ${UGA.red}`,
    background: UGA.red,
    color: UGA.white,
  },
  showtimesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: 12,
  },
  showtimeBtn: {
    padding: "12px 16px",
    borderRadius: 8,
    border: `1px solid ${UGA.border}`,
    background: UGA.dark,
    color: UGA.white,
    cursor: "pointer",
    fontWeight: 600,
    textAlign: "center",
    transition: "all 0.2s",
  },
  showtimeBtnHover: {
    background: UGA.red,
    borderColor: UGA.red,
  },
};

// keep in sync with Booking/MovieCard
const SHOWTIMES = ["2:00 PM", "5:00 PM", "8:00 PM"];

// SAME HELPERS AS IN Movie.tsx TO KEEP DATES CONSISTENT
function hashString(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function seededRand(seed: number) {
  let x = seed || 123456789;
  return () => {
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    return ((x >>> 0) % 1_000_000) / 1_000_000;
  };
}
function isoForDayOffset(offset: number) {
  const d = new Date();
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0,10);
}
function labelForISO(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short", month: "numeric", day: "numeric" });
}
function randomDatesForMovie(seedKey: string, lookaheadDays = 21): string[] {
  const seed = hashString(seedKey || 'movie');
  const rand = seededRand(seed);
  const count = 3 + Math.floor(rand() * 6); // 3..8
  const set = new Set<number>();
  while (set.size < count) {
    const r = Math.floor(Math.pow(rand(), 1.7) * lookaheadDays);
    set.add(r);
  }
  return Array.from(set).sort((a,b)=>a-b).map(isoForDayOffset);
}
// END OF SAME HELPERS AS IN Movie.tsx TO KEEP DATES CONSISTENT

function deriveStatus(movie: MovieDetailsProps) {
  if (movie.currentlyRunning) return "RUNNING";
  if (movie.comingSoon) return "COMING_SOON";
  if (!movie.releaseDate) return "RUNNING";
  return new Date(movie.releaseDate) > new Date() ? "COMING_SOON" : "RUNNING";
}

function ytId(url?: string) {
  if (!url) return;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v") || undefined;
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || undefined;
  } catch {}
}

const MovieDetails: React.FC<MovieDetailsProps> = ({
  id,
  title,
  poster,
  rating,
  details,
  trailer,
  genres,
  duration,
  releaseDate,
  currentlyRunning,
  comingSoon,
  cast,
  director,
  producer
}) => {
  const router = useRouter();
  const [hoveredShowtime, setHoveredShowtime] = useState<string | null>(null);
  const status = deriveStatus({ id, title, poster, rating, details, trailer, genres, duration, releaseDate, currentlyRunning, comingSoon });

  // Dates + selected date
  const dateOptions = useMemo(() => randomDatesForMovie(id || title || 'movie'), [id, title]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    if (!selectedDate && dateOptions.length) setSelectedDate(dateOptions[0]);
  }, [dateOptions, selectedDate]);

  const handleBookShowtime = (showtime: string) => {
    router.push(
      `/Booking?movieId=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}&date=${encodeURIComponent(selectedDate)}&showtime=${encodeURIComponent(showtime)}`
    );
  };

  return (
    <div>
      <div style={styles.container}>
        <div style={styles.posterSection}>
          {poster ? (
            <img
              src={poster}
              alt={`${title} poster`}
              style={styles.poster}
            />
          ) : (
            <div style={styles.posterPlaceholder}>
              No Poster Available
            </div>
          )}
        </div>

        <div style={styles.detailsSection}>
          <h1 style={styles.title}>{title}</h1>

          <div style={styles.meta}>
            {rating > 0 && (
              <div style={styles.rating}>
                ⭐ {rating}/10
              </div>
            )}
            <div style={{
              ...styles.status,
              ...(status === "RUNNING" ? styles.statusRunning : styles.statusComing)
            }}>
              {status === "RUNNING" ? "Now Playing" : "Coming Soon"}
            </div>
          </div>

          <div style={styles.genres}>
            {genres.map((genre) => (
              <span key={genre} style={styles.genre}>
                {genre}
              </span>
            ))}
          </div>

          {details && (
            <p style={styles.description}>{details}</p>
          )}

          <div style={styles.infoGrid}>
            {duration && (
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Duration</span>
                <span style={styles.infoValue}>{duration} minutes</span>
              </div>
            )}
            {releaseDate && (
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Release Date</span>
                <span style={styles.infoValue}>
                  {new Date(releaseDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          <div style={styles.actions}>
            <button
              style={styles.btnPrimary}
              onClick={() => router.push(`/Booking?movieId=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}`)}
            >
              Book Tickets
            </button>
            {trailer && (
              <button
                style={styles.btnSecondary}
                onClick={() => {
                  const videoId = ytId(trailer);
                  if (videoId) {
                    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
                  }
                }}
              >
                Watch Trailer
              </button>
            )}
          </div>

          {/* Always show the credits section; show placeholders when data is missing so admins/users can see the fields */}
          <div style={styles.creditsSection}>
            <h3 style={styles.creditsTitle}>Behind the Scenes</h3>
            <div style={styles.creditsGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Director</span>
                <span style={styles.infoValue}>{director || '—'}</span>
              </div>

              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Producer</span>
                <span style={styles.infoValue}>{producer || '—'}</span>
              </div>

              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Cast</span>
                {cast && cast.length > 0 ? (
                  <div style={styles.castChips}>
                    {cast.map((member) => (
                      <span key={member} style={styles.castChip}>
                        {member}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={styles.infoValue}>—</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {trailer && (
        <div style={styles.trailerSection}>
          <h3 style={styles.trailerTitle}>Trailer</h3>
          <div style={styles.trailerContainer}>
            {ytId(trailer) ? (
              <iframe
                style={styles.trailerIframe}
                src={`https://www.youtube.com/embed/${ytId(trailer)}`}
                title={`${title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                style={styles.trailerIframe}
                src={trailer}
                controls
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
