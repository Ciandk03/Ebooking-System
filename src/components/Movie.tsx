"use client";
import { useRouter } from "next/navigation";
import type { Movie } from "@/types/database";

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
  card: {
    background: UGA.nearBlack,
    border: `1px solid ${UGA.border}`,
    borderRadius: 16,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 1px 6px rgba(0,0,0,0.35)",
  },
  posterWrap: {
    position: "relative",
    width: "100%",
    paddingBottom: "150%",
    background: "#111",
  },
  cardBody: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    color: UGA.white,
  },
  title: { fontSize: 18, fontWeight: 900, letterSpacing: -0.2 },
  meta: { fontSize: 12, color: UGA.gray },
  tagsRow: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 },
  tag: {
    fontSize: 11,
    background: UGA.black,
    border: `1px solid ${UGA.border}`,
    borderRadius: 999,
    padding: "4px 10px",
    color: UGA.white,
  },
  tagSoon: {
    fontSize: 11,
    background: UGA.red,
    color: UGA.white,
    borderRadius: 999,
    padding: "4px 10px",
    fontWeight: 800,
  },
  row: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 },
  btnPrimary: {
    padding: "10px 14px",
    borderRadius: 12,
    border: `1px solid ${UGA.red}`,
    background: UGA.red,
    color: UGA.white,
    cursor: "pointer",
    fontWeight: 800,
  },
  btnGhost: {
    padding: "10px 14px",
    borderRadius: 12,
    border: `1px solid ${UGA.border}`,
    background: UGA.black,
    color: UGA.white,
    cursor: "pointer",
    fontWeight: 700,
  },
  subhead: { marginTop: 14, fontWeight: 900, color: UGA.white },
};

const SHOWTIMES = ["2:00 PM", "5:00 PM", "8:00 PM"];

// RANDOM DATE GENERATOR DELETE WHEN ADDING ACTUAL DATES FROM DB
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
function randomDatesForMovie(m: Movie, lookaheadDays = 21): string[] {
  const seed = hashString(String(m.id ?? m.title ?? "movie"));
  const rand = seededRand(seed);
  const count = 3 + Math.floor(rand() * 6); // 3..8
  const set = new Set<number>();
  while (set.size < count) {
    const r = Math.floor(Math.pow(rand(), 1.7) * lookaheadDays);
    set.add(r);
  }
  return Array.from(set).sort((a,b)=>a-b).map(isoForDayOffset);
}
// END OF RANDOM DATE GENERATOR LOOK FOR NEW WAY TO GET DATES FROM DB 

function deriveStatus(m: Movie) {
  if (m.currentlyRunning) return m.currentlyRunning ? "RUNNING" : "COMING_SOON";
  if (!m.releaseDate) return "RUNNING";
  const rel = new Date(m.releaseDate);
  return rel > new Date() ? "COMING_SOON" : "RUNNING";
}

export default function MovieCard({
  m,
  onWatchTrailer,
}: {
  m: Movie;
  onWatchTrailer: (url: string) => void;
}) {
  const router = useRouter();
  const dates = randomDatesForMovie(m);

  return (
    <article style={styles.card}>
      <div style={styles.posterWrap}>
        {m.poster ? (
          <img
            src={m.poster}
            alt={`${m.title} poster`}
            style={{ objectFit: "cover", width: "100%", height: "100%", position: "absolute", inset: 0 }}
          />
        ) : null}
      </div>
      <div style={styles.cardBody}>
        <div style={styles.title}>{m.title}</div>
        <div style={styles.meta}>
          {m.rating ? `${m.rating} • ` : ""}{m.genres?.join(" / ")}
        </div>
        {m.details && <p style={{ fontSize: 13, color: "#d1d5db" }}>{m.details}</p>}
        <div>
          {m.genres?.slice(0, 3).map((g) => <span key={g} style={styles.tag}>{g}</span>)}
          {deriveStatus(m) === "COMING_SOON" && (
            <span style={{ ...styles.tag, background: "#78350f", color: "#fef3c7", border: "1px solid #fbbf24" }}>
              Coming Soon
            </span>
          )}
        </div>

        <div style={styles.row}>
          <button style={styles.btnPrimary} onClick={() => router.push(`/movies/${m.id}`)}>Details</button>
          {m.trailer ? <button style={styles.btnGhost} onClick={() => onWatchTrailer(m.trailer!)}>Watch Trailer</button> : null}
        </div>

        {/* Dates row */}
        <div style={{ marginTop: 12, fontWeight: 700 }}>Dates</div>
        <div style={styles.row}>
          {dates.map((iso) => (
            <button
              key={iso}
              style={styles.btnGhost}
              onClick={() =>
                router.push(
                  `/Booking?movieId=${encodeURIComponent(m.id)}&title=${encodeURIComponent(
                    m.title
                  )}&date=${encodeURIComponent(iso)}`
                )
              }
              aria-label={`Select date ${labelForISO(iso)}`}
            >
              {labelForISO(iso)}
            </button>
          ))}
        </div>

        {/* Showtimes row */}
        <div style={{ marginTop: 12, fontWeight: 700 }}>Showtimes</div>
        <div style={styles.row}>
          {SHOWTIMES.map((t) => (
            <button
              key={t}
              style={styles.btnGhost}
              onClick={() =>
                router.push(
                  `/Booking?movieId=${encodeURIComponent(m.id)}&title=${encodeURIComponent(
                    m.title
                  )}&showtime=${encodeURIComponent(t)}`
                )
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

