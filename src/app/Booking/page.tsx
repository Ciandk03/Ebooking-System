'use client';

import { useState, useEffect, useMemo } from "react";
import type { Theater } from '@/types/database';
import { useSearchParams } from "next/navigation";

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

const styles = {
  page: {
    background: UGA.black,
    minHeight: "100vh",
    padding: 24,
    color: UGA.white,
    borderTop: `4px solid ${UGA.red}`,
    fontFamily:
      "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  },
  container: {
    maxWidth: 880,
    margin: "0 auto",
    background: UGA.nearBlack,
    border: `1px solid ${UGA.border}`,
    borderRadius: 16,
    boxShadow: "0 1px 6px rgba(0,0,0,0.35)",
    overflow: "hidden",
  },
  header: {
    padding: "20px 24px",
    borderBottom: `1px solid ${UGA.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: UGA.dark,
  },
  title: { fontSize: 26, fontWeight: 900, letterSpacing: -0.25 },
  body: { padding: 24, display: "grid", gap: 18 },
  label: { fontSize: 13, color: UGA.gray, marginBottom: 6, fontWeight: 700 },
  input: {
    padding: "10px 12px",
    borderRadius: 12,
    border: `1px solid ${UGA.border}`,
    background: UGA.black,
    color: UGA.white,
    width: "100%",
  },
  sectionTitle: { fontWeight: 900, marginTop: 8 },
  submit: {
    marginTop: 8,
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    border: "none",
    background: UGA.red,
    color: UGA.white,
    fontWeight: 800,
    cursor: "pointer",
  },
  summary: {
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    background: "#111418",
    border: `1px solid ${UGA.border}`,
  },
  muted: { color: UGA.gray },
};

const THEATERS: Theater[] = [
  //fetch theaters via API call
];

/** Showtimes — fetch based on theater/showrooms/shows + movie */
const SHOWTIMES = ["12:00 PM", "2:30 PM", "5:00 PM", "8:15 PM"];

export default function FindShowtimePage() {
  const searchParams = useSearchParams();

  const movieTitle = searchParams.get("title") || "";

  const [theaterQuery, setTheaterQuery] = useState("");
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [filteredTheaters, setFilteredTheaters] = useState<Theater[]>([]);

  const [showtime, setShowtime] = useState("");

  useEffect(() => {
    if (!theaterQuery.trim()) {
      setFilteredTheaters([] as Theater[]);
      return;
    }

    const q = theaterQuery.toLowerCase();
    setFilteredTheaters(
      THEATERS.filter(
        (t) => t.name.toLowerCase().includes(q) || t.address.toLowerCase().includes(q)
      )
    );
  }, [theaterQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTheater || !showtime) {
      alert("Select a theater and showtime.");
      return;
    }
    alert("Showtime selected! (Demo)");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>🎥 Find a Showing</h1>
          <div style={{ fontWeight: 800, color: UGA.gray }}>{movieTitle}</div>
        </header>

        <form style={styles.body} onSubmit={handleSubmit}>
          {/* THEATER AUTOCOMPLETE */}
          <div>
            <div style={styles.label}>Search for a Theater</div>
            <input
              type="text"
              placeholder="Start typing a name or address..."
              style={styles.input}
              value={theaterQuery}
              onChange={(e) => {
                setTheaterQuery(e.target.value);
                setSelectedTheater(null);
              }}
            />

            {filteredTheaters.length > 0 && !selectedTheater && (
              <div style={{ marginTop: 8, background: UGA.dark, borderRadius: 8 }}>
                {filteredTheaters.map((t) => (
                  <div
                    key={t.name}
                    onClick={() => {
                      setSelectedTheater(t);
                      setTheaterQuery(`${t.name} (${t.address})`);
                      setFilteredTheaters([]);
                    }}
                    style={{ padding: 10, cursor: "pointer", borderBottom: `1px solid ${UGA.border}` }}
                  >
                    <strong>{t.name}</strong>
                    <div style={{ fontSize: 12, color: UGA.gray }}>{t.address}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MOVIE TITLE (READ-ONLY) */}
          <div>
            <div style={styles.label}>Movie Title</div>
            <input type="text" style={styles.input} value={movieTitle} readOnly />
          </div>

          {/* SHOWTIME DROPDOWN */}
          <div>
            <div style={styles.label}>Select Showtime</div>
            <select
              style={styles.input}
              value={showtime}
              onChange={(e) => setShowtime(e.target.value)}
            >
              <option value="">Choose a time...</option>
              {SHOWTIMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" style={styles.submit}>
            Continue
          </button>

          {/* SUMMARY */}
          <div style={styles.summary}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>
              📋 Selection Summary
            </div>
            <div style={styles.muted}>
              <p>
                <strong>Theater:</strong> {selectedTheater ? selectedTheater.name : "Not selected"}
              </p>
              <p>
                <strong>Movie:</strong> {movieTitle}
              </p>
              <p>
                <strong>Showtime:</strong> {showtime || "Not selected"}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
