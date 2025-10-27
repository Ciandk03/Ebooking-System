"use client";
import React, { useEffect, useMemo, useState } from "react";
import type { Movie } from "@/types/database";
import MovieCard from "@/components/Movie";
import FilmReelBackground from "@/components/FilmReelBackground";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: 900, letterSpacing: -0.25 },
  registerBtn: {
    padding: "10px 18px",
    borderRadius: 12,
    border: "none",
    background: UGA.red,
    color: UGA.white,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 16
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
  tab: {
    padding: "8px 16px",
    borderRadius: 999,
    color: UGA.white,
    cursor: "pointer",
    fontWeight: 800,
    letterSpacing: 0.2,
  },
  tabActive: {
    border: `1px solid ${UGA.red}`,
    background: UGA.red,
  },
  tabInactive: {
    border: `1px solid ${UGA.border}`,
    background: UGA.nearBlack,
  },
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
    justifyContent: "center",
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

// SAME HELPERS AS IN Movie.tsx TO KEEP DATES CONSISTENT ---
function hashString(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function seededRand(seed: number) {
  // xorshift32
  let x = seed || 123456789;
  return () => {
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    // map to [0,1)
    return ((x >>> 0) % 1_000_000) / 1_000_000;
  };
}
function isoForDayOffset(offset: number) {
  const d = new Date();
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0,10); // YYYY-MM-DD
}
function labelForISO(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short", month: "numeric", day: "numeric" }); // e.g., Mon 10/27
}
function randomDatesForMovie(m: Movie, lookaheadDays = 21): string[] {
  const seed = hashString(String(m.id ?? m.title ?? "movie"));
  const rand = seededRand(seed);
  const count = 3 + Math.floor(rand() * 6); // 3..8 dates
  const set = new Set<number>();
  // bias toward nearer dates a bit
  while (set.size < count) {
    const r = Math.floor(Math.pow(rand(), 1.7) * lookaheadDays); // 0..20 skewed low
    set.add(r);
  }
  return Array.from(set).sort((a,b)=>a-b).map(isoForDayOffset);
}
// END OF SAME HELPERS AS IN Movie.tsx TO KEEP DATES CONSISTENT ---

function deriveStatus(m: Movie) {
  if (m.currentlyRunning) {
    return "RUNNING";
  } else {
    return "COMING_SOON";
  }
}

function ytId(url?: string) {
  if (!url) return;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com"))
      return u.searchParams.get("v") || undefined;
    if (u.hostname.includes("youtu.be"))
      return u.pathname.slice(1) || undefined;
  } catch {}
}

export default function HomePage() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("ALL");

  // day filter state
  const [day, setDay] = useState<string>("ALL");

  const [tab, setTab] = useState<"RUNNING" | "COMING_SOON">("RUNNING");
  const [trailer, setTrailer] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    (async () => {
      try {
        const r = await fetch("/api/movies", { cache: "no-store" });
        if (!r.ok) throw new Error("API error");
        const response = await r.json();
        setMovies(response.data || []);
      } catch (e: any) {
        setError(e?.message || "Failed");
        setMovies([]);
      }
    })();
  }, []);

  const allGenres = useMemo(() => {
    const s = new Set<string>();
    movies?.forEach((m) => m.genres?.forEach((g) => s.add(g)));
    return ["ALL", ...Array.from(s).sort()];
  }, [movies]);

  // precompute a date map per movie for filtering 
  const datesById = useMemo(() => {
    const map = new Map<string, string[]>();
    (movies || []).forEach(m => {
      const key = String(m.id);
      map.set(key, randomDatesForMovie(m));
    });
    return map;
  }, [movies]);

  // list of selectable days (next 21 days) 
  const selectableDays = useMemo(() => {
    const days: { value: string; label: string }[] = [{ value: "ALL", label: "ALL DAYS" }];
    for (let i = 0; i < 21; i++) {
      const iso = isoForDayOffset(i);
      days.push({ value: iso, label: labelForISO(iso) });
    }
    return days;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (movies || [])
      .filter((m) => deriveStatus(m) === tab)
      .filter((m) => (q ? m.title.toLowerCase().includes(q) : true))
      .filter((m) => (genre === "ALL" ? true : m.genres?.includes(genre)))
      // filter by day if selected
      .filter((m) => {
        if (day === "ALL") return true;
        const ds = datesById.get(String(m.id)) || [];
        return ds.includes(day);
      });
  }, [movies, query, genre, tab, day, datesById]);

  const runningCount = (movies || []).filter(
    (m) => deriveStatus(m) === "RUNNING"
  ).length;
  const comingCount = (movies || []).filter(
    (m) => deriveStatus(m) === "COMING_SOON"
  ).length;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <main style={styles.page}>
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={styles.header}>
          <h1 style={styles.title}>Cinema E-Booking System</h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <input
              style={styles.input}
              placeholder="Search by title…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              style={styles.select}
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              {allGenres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            {/* Day filter */}
            <select
              style={styles.select}
              value={day}
              onChange={(e) => setDay(e.target.value)}
              aria-label="Filter by day"
            >
              {selectableDays.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>

            <button
              style={{ ...styles.ghostBtn, marginLeft: 4 }}
              onClick={() => {
                setQuery("");
                setGenre("ALL");
                setDay("ALL"); // reset day too
              }}
            >
              Reset
            </button>

            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, color: UGA.gray }}>
                  Welcome, {user.name}
                </span>
                <button
                  style={styles.ghostBtn}
                  onClick={() =>
                    router.push(user.role === "admin" ? "/admin" : "/dashboard")
                  }
                >
                  {user.role === "admin" ? "Admin Panel" : "Account"}
                </button>
                <button style={styles.registerBtn} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Link
                  href="/Login"
                  style={{
                    ...styles.ghostBtn,
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Login
                </Link>
                <button
                  style={styles.registerBtn}
                  onClick={() => router.push("/Registration")}
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(tab === "RUNNING" ? styles.tabActive : styles.tabInactive),
          }}
          onClick={() => setTab("RUNNING")}
        >
          Currently Running ({runningCount})
        </button>
        <button
          style={{
            ...styles.tab,
            ...(tab === "COMING_SOON" ? styles.tabActive : styles.tabInactive),
          }}
          onClick={() => setTab("COMING_SOON")}
        >
          Coming Soon ({comingCount})
        </button>
      </div>

      {!movies ? <div style={styles.empty}>Loading…</div> : null}
      {movies && filtered.length === 0 ? (
        <div style={styles.empty}>No movies found.</div>
      ) : null}

      {movies && filtered.length > 0 && (
        <div style={styles.grid}>
          {filtered.map((m) => (
            <MovieCard
              key={m.id}
              m={m}
              onWatchTrailer={(url) => setTrailer(url)}
            />
          ))}
        </div>
      )}

      {trailer && (
        <div style={styles.modalBg} onClick={() => setTrailer(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            {ytId(trailer) ? (
              <iframe
                title="Trailer"
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${ytId(
                  trailer
                )}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={trailer}
                controls
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </div>
        </div>
      )}

      {error && (
        <p style={{ marginTop: 12, color: "#9ca3af", fontSize: 12 }}>
          Note: {error}
        </p>
      )}
    </main>
  );
}
