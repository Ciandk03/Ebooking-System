'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

const UGA = {
  black: '#000000',
  nearBlack: '#0b0b0b',
  dark: '#151515',
  gray: '#d1d5db',
  white: '#ffffff',
  red: '#ba0c2f',
  redDark: '#8a0a23',
  border: '#2a2a2a',
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: UGA.black,
    minHeight: '100vh',
    padding: 24,
    color: UGA.white,
    borderTop: `4px solid ${UGA.red}`,
    fontFamily:
      'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  },
  container: {
    maxWidth: 880,
    margin: '0 auto',
    background: UGA.nearBlack,
    border: `1px solid ${UGA.border}`,
    borderRadius: 16,
    boxShadow: '0 1px 6px rgba(0,0,0,0.35)',
    overflow: 'hidden',
  },
  header: {
    padding: '20px 24px',
    borderBottom: `1px solid ${UGA.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: UGA.dark,
  },
  title: { fontSize: 26, fontWeight: 900, letterSpacing: -0.25 },
  body: { padding: 24, display: 'grid', gap: 18 },
  label: { fontSize: 13, color: UGA.gray, marginBottom: 6, fontWeight: 700 },
  input: {
    padding: '10px 12px',
    borderRadius: 12,
    border: `1px solid ${UGA.border}`,
    background: UGA.black,
    color: UGA.white,
    width: '100%',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 16,
  },
  sectionTitle: { fontWeight: 900, marginTop: 8 },
  pillsRow: { display: 'flex', flexWrap: 'wrap', gap: 10 },
  pill: {
    padding: '10px 14px',
    borderRadius: 999,
    border: `1px solid ${UGA.border}`,
    background: UGA.black,
    color: UGA.white,
    cursor: 'pointer',
    fontWeight: 700,
  },
  pillActive: {
    border: `1px solid ${UGA.red}`,
    background: UGA.red,
    color: UGA.white,
  },
  submit: {
    marginTop: 8,
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    border: 'none',
    background: UGA.red,
    color: UGA.white,
    fontWeight: 800,
    cursor: 'pointer',
  },
  summary: {
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    background: '#111418',
    border: `1px solid ${UGA.border}`,
  },
  summaryTitle: { fontSize: 16, fontWeight: 800, marginBottom: 6 },
  muted: { color: UGA.gray },
};

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
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) % 1_000_000) / 1_000_000; // [0,1)
  };
}
function isoForDayOffset(offset: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}
function labelForISO(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'numeric',
    day: 'numeric',
  });
}
function randomDates(seedKey: string, lookaheadDays = 21): string[] {
  const seed = hashString(seedKey || 'booking');
  const rand = seededRand(seed);
  const count = 3 + Math.floor(rand() * 6); // 3..8 dates
  const set = new Set<number>();
  while (set.size < count) {
    const r = Math.floor(Math.pow(rand(), 1.7) * lookaheadDays);
    set.add(r);
  }
  return Array.from(set).sort((a, b) => a - b).map(isoForDayOffset);
}
// END OF SAME HELPERS AS IN Movie.tsx TO KEEP DATES CONSISTENT

// keep these in sync with Movie
const SHOWTIMES = ['2:00 PM', '5:00 PM', '8:00 PM'];

export default function BookingPage() {
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    movieTitle: '',
    date: '',
    showtime: '',
    seats: '',
    customerName: '',
    email: '',
    phone: '',
  });

  // derive movie identity for deterministic dates
  const movieId = searchParams.get('movieId') || '';
  const preTitle = searchParams.get('title') || '';
  const preDate = searchParams.get('date') || '';
  const preShow = searchParams.get('showtime') || '';

  const dateOptions = useMemo(() => {
    const key = movieId || preTitle || 'booking';
    return randomDates(key);
  }, [movieId, preTitle]);

  // Pre-fill form with URL parameters & sensible defaults
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      movieTitle: preTitle || prev.movieTitle,
      date: preDate || dateOptions[0] || prev.date,
      showtime: preShow || prev.showtime || '', // let user pick if not provided
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preTitle, preDate, preShow, dateOptions.join('|')]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation for this demo
    if (!formData.date || !formData.showtime) {
      alert('Please select a date and showtime.');
      return;
    }
    console.log('Booking form submitted:', formData);
    alert('Booking submitted! (This is a demo)');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const setDate = (iso: string) =>
    setFormData((p) => ({ ...p, date: iso }));
  const setShow = (t: string) =>
    setFormData((p) => ({ ...p, showtime: t }));

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>🎟️ Book Your Seats</h1>
          <div style={{ fontWeight: 800, color: UGA.gray }}>
            {formData.movieTitle || 'Select a movie'}
          </div>
        </header>

        <form onSubmit={handleSubmit} style={styles.body}>
          {/* PICKERS */}
          <section>
            <div style={styles.sectionTitle}>Select Date</div>
            <div style={styles.pillsRow}>
              {dateOptions.map((iso) => {
                const active = formData.date === iso;
                return (
                  <button
                    type="button"
                    key={iso}
                    style={{ ...styles.pill, ...(active ? styles.pillActive : {}) }}
                    onClick={() => setDate(iso)}
                    aria-label={`Select date ${labelForISO(iso)}`}
                  >
                    {labelForISO(iso)}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <div style={styles.sectionTitle}>Select Showtime</div>
            <div style={styles.pillsRow}>
              {SHOWTIMES.map((t) => {
                const active = formData.showtime === t;
                return (
                  <button
                    type="button"
                    key={t}
                    style={{ ...styles.pill, ...(active ? styles.pillActive : {}) }}
                    onClick={() => setShow(t)}
                    aria-label={`Select showtime ${t}`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </section>

          {/* FORM FIELDS */}
          <div style={styles.grid2}>
            <div>
              <div style={styles.label}>Movie Title</div>
              <input
                type="text"
                id="movieTitle"
                name="movieTitle"
                value={formData.movieTitle}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter movie title"
                required
              />
            </div>

            <div>
              <div style={styles.label}>Number of Seats</div>
              <input
                type="number"
                id="seats"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter number of seats"
                min={1}
                max={10}
                required
              />
            </div>

            <div>
              <div style={styles.label}>Full Name</div>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <div style={styles.label}>Email Address</div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <div style={styles.label}>Phone Number</div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <button type="submit" style={styles.submit}>
            Confirm Booking
          </button>

          {/* SUMMARY */}
          <div style={styles.summary}>
            <div style={styles.summaryTitle}>📋 Booking Summary</div>
            <div style={styles.muted}>
              <p>
                <strong>Movie:</strong> {formData.movieTitle || 'Not selected'}
              </p>
              <p>
                <strong>Date:</strong>{' '}
                {formData.date ? labelForISO(formData.date) : 'Not selected'}
              </p>
              <p>
                <strong>Showtime:</strong> {formData.showtime || 'Not selected'}
              </p>
              <p>
                <strong>Seats:</strong> {formData.seats || 'Not specified'}
              </p>
              <p>
                <strong>Customer:</strong> {formData.customerName || 'Not provided'}
              </p>
              <p>
                <strong>Email:</strong> {formData.email || 'Not provided'}
              </p>
              <p>
                <strong>Phone:</strong> {formData.phone || 'Not provided'}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
