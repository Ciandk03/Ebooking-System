"use client";
import React, { useEffect, useMemo, useState } from "react";
import type { Movie } from "@/types/database";
import MovieCard from "@/components/Movie";
import FilmReelBackground from "@/components/FilmReelBackground";

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
    borderTop: `4px solid ${UGA.red}`,
    padding: 24,
    maxWidth: 1200,
    margin: "0 auto",
    fontFamily:
      "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    background: UGA.black,
    minHeight: "100vh",
    color: UGA.white,
    overflow: "hidden",
    position: "relative",
  },
  header: {
    
    display: "flex",
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: 900, letterSpacing: -0.25 },
  searchRow: {
    display: "grid",
    gridTemplateColumns: "1fr 220px 120px",
    gap: 10,
    width: "100%",
    maxWidth: 700,
  },
  input: {
    padding: "10px 12px",
    borderRadius: 12,
    border: `1px solid ${UGA.border}`,
    background: UGA.dark,
    color: UGA.white,
    boxShadow: `0 0 0 1px transparent`,
  },
  select: {
    padding: "10px 12px",
    borderRadius: 12,
    border: `1px solid ${UGA.border}`,
    background: UGA.dark,
    color: UGA.white,
  },
  ghostBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: `1px solid ${UGA.red}`,
    background: UGA.black,
    color: UGA.white,
    cursor: "pointer",
    fontWeight: 700,
  },
  tabs: { display: "flex", gap: 10, marginTop: 16, marginBottom: 8 },
  tab: (active: boolean): React.CSSProperties => ({
    padding: "8px 16px",
    borderRadius: 999,
    border: `1px solid ${active ? UGA.red : UGA.border}`,
    background: active ? UGA.red : UGA.nearBlack,
    color: UGA.white,
    cursor: "pointer",
    fontWeight: 800,
    letterSpacing: 0.2,
  }),
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 18,
    marginTop: 16,
  },
  empty: { padding: 32, textAlign: "center", color: UGA.gray },
  modalBg: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center", //Test comment
    zIndex: 50,
  },
  modal: {
    width: "min(960px,92vw)",
    aspectRatio: "16/9",
    background: UGA.black,
    borderRadius: 12,
    overflow: "hidden",
    border: `1px solid ${UGA.red}`,
  },
};


function deriveStatus(m: Movie) {
  if (m.currentlyRunning) {
    return "RUNNING";
  } else {
    return "COMING_SOON";
  }
  //if (!m.releaseDate) return "RUNNING";
  //return new Date(m.releaseDate) > new Date() ? "COMING_SOON" : "RUNNING";
}

function ytId(url?: string) {
  if (!url) return;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v") || undefined;
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || undefined;
  } catch {}
}

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("ALL");
  const [tab, setTab] = useState<"RUNNING" | "COMING_SOON">("RUNNING");
  const [trailer, setTrailer] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/movies", { cache: "no-store" });
        if (!r.ok) throw new Error("API error");
        const response = await r.json();
        setMovies(response.data || []); // Extract the data array from the API response
      } catch (e: any) {
        setError(e?.message || "Failed");
        setMovies([]); // if DB down, show empty state
      }
    })();
  }, []);

  const allGenres = useMemo(() => {
    const s = new Set<string>();
    movies?.forEach((m) => m.genres?.forEach((g) => s.add(g)));
    return ["ALL", ...Array.from(s).sort()];
  }, [movies]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (movies || [])
      .filter((m) => deriveStatus(m) === tab)
      .filter((m) => (q ? m.title.toLowerCase().includes(q) : true))
      .filter((m) => (genre === "ALL" ? true : m.genres?.includes(genre)));
  }, [movies, query, genre, tab]);

  const runningCount = (movies || []).filter((m) => deriveStatus(m) === "RUNNING").length;
  const comingCount = (movies || []).filter((m) => deriveStatus(m) === "COMING_SOON").length;

  return (
    <main style={styles.page}>
      <div style={{ position: "relative", zIndex: 1 }}><div style={styles.header}>
        <h1 style={styles.title}>Cinema E-Booking System</h1>
        <div style={styles.searchRow}>
          <input style={styles.input} placeholder="Search by title…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select style={styles.select} value={genre} onChange={(e) => setGenre(e.target.value)}>
            {allGenres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <button style={styles.ghostBtn} onClick={() => { setQuery(""); setGenre("ALL"); }}>Reset</button></div>
      
        </div>
      </div>

      <div style={styles.tabs}>
        <button style={styles.tab(tab === "RUNNING")} onClick={() => setTab("RUNNING")}>Currently Running ({runningCount})</button>
        <button style={styles.tab(tab === "COMING_SOON")} onClick={() => setTab("COMING_SOON")}>Coming Soon ({comingCount})</button>
      </div>

      {!movies ? <div style={styles.empty}>Loading…</div> : null}
      {movies && filtered.length === 0 ? <div style={styles.empty}>No movies found.</div> : null}

      {movies && filtered.length > 0 &&
        <div style={styles.grid}>
          {filtered.map((m) => (
            <MovieCard key={m.id} m={m} onWatchTrailer={(url) => setTrailer(url)} />
          ))}
        </div>
      }

      {trailer && (
        <div style={styles.modalBg} onClick={() => setTrailer(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            {ytId(trailer)
              ? <iframe title="Trailer" width="100%" height="100%" src={`https://www.youtube.com/embed/${ytId(trailer)}?autoplay=1`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              : <video src={trailer} controls style={{ width: "100%", height: "100%" }} />}
          </div>
        </div>
      )}

      {error && <p style={{ marginTop: 12, color: "#9ca3af", fontSize: 12 }}>Note: {error}</p>}
    </main>
  );
}
