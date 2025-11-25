"use client";

import { useState, useEffect, useMemo } from "react";
import type { Showtime } from "@/types/database";
import { useRouter, useSearchParams } from "next/navigation";

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
  backButton: {
    padding: "8px 14px",
    background: "transparent",
    border: `1px solid ${UGA.red}`,
    borderRadius: 8,
    color: UGA.red,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
    transition: "0.2s ease",
  },
  backButtonHover: {
    background: UGA.red,
    color: UGA.white,
  },
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

interface ShowDoc extends Showtime {
  id: string;
}

export default function FindShowtimePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const movieId = searchParams.get("movieId") || "";
  const movieTitle = searchParams.get("title") || "";

  const [shows, setShows] = useState<ShowDoc[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedShowId, setSelectedShowId] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch shows from /api/movies/[id]/shows
  useEffect(() => {
    if (!movieId) return;

    const fetchShows = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/movies/${movieId}/shows`);

        const text = await res.text(); // read raw body once
        let json: any;
        try {
          json = text ? JSON.parse(text) : null;
        } catch (parseErr) {
          console.error("Booking: non-JSON response from /shows:", text);
          throw new Error("Invalid response from showtimes API");
        }

        if (!res.ok || !json?.success) {
          throw new Error(json?.error || "Failed to load showtimes");
        }

        setShows(json.data || []);
      } catch (err: any) {
        console.error("Booking: error loading showtimes", err);
        setError(err?.message || "Failed to load showtimes");
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [movieId]);

  // Unique list of dates from shows
  const dateOptions = useMemo(() => {
    const unique = Array.from(new Set(shows.map((s) => s.date)));
    unique.sort();
    return unique;
  }, [shows]);

  // When we first get dates, default to the first one
  useEffect(() => {
    if (!selectedDate && dateOptions.length > 0) {
      setSelectedDate(dateOptions[0]);
    }
  }, [dateOptions, selectedDate]);

  // Shows for currently selected date
  const showsForSelectedDate = useMemo(
    () => (selectedDate ? shows.filter((s) => s.date === selectedDate) : []),
    [shows, selectedDate]
  );

  // Keep selectedShowId in sync when date or shows change
  useEffect(() => {
    if (!selectedDate) {
      setSelectedShowId("");
      return;
    }

    if (showsForSelectedDate.length === 0) {
      setSelectedShowId("");
      return;
    }

    if (
      !selectedShowId ||
      !showsForSelectedDate.some((s) => s.id === selectedShowId)
    ) {
      setSelectedShowId(showsForSelectedDate[0].id);
    }
  }, [selectedDate, showsForSelectedDate, selectedShowId]);

  const selectedShow = useMemo(
    () => shows.find((s) => s.id === selectedShowId) || null,
    [shows, selectedShowId]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!movieId) {
      alert("Missing movie information.");
      return;
    }

    if (!selectedDate || !selectedShowId || !selectedShow) {
      alert("Select a date and showtime.");
      return;
    }

    // Go to uncreated seat selection page
    router.push(
      `/SeatSelection?showId=${encodeURIComponent(
        selectedShowId
      )}&movieId=${encodeURIComponent(movieId)}&title=${encodeURIComponent(
        movieTitle
      )}`
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>🎥 Choose a Showtime</h1>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              onClick={() => router.back()}
              style={styles.backButton}
              onMouseEnter={(e) => (
                (e.currentTarget.style.background = UGA.red),
                (e.currentTarget.style.color = UGA.white)
              )}
              onMouseLeave={(e) => (
                (e.currentTarget.style.background = "transparent"),
                (e.currentTarget.style.color = UGA.red)
              )}
            >
              ⬅ Back
            </button>

            <div style={{ fontWeight: 800, color: UGA.gray }}>{movieTitle}</div>
          </div>
        </header>

        <form onSubmit={handleSubmit}>
          <div style={styles.body}>
            {/* MOVIE TITLE (READ-ONLY) */}
            <div>
              <div style={styles.label}>Movie</div>
              <input
                type="text"
                style={styles.input}
                value={movieTitle}
                readOnly
              />
            </div>

            {/* ERROR / LOADING STATE */}
            {loading && (
              <div style={{ ...styles.muted, fontSize: 13 }}>
                Loading showtimes for this movie…
              </div>
            )}
            {error && (
              <div
                style={{
                  marginTop: 4,
                  padding: 10,
                  borderRadius: 8,
                  background: "#4b1a1a",
                  color: "#ffe2e2",
                  fontSize: 13,
                }}
              >
                {error}
              </div>
            )}
            {!loading && !error && shows.length === 0 && (
              <div style={{ ...styles.muted, fontSize: 13 }}>
                There are currently no scheduled showtimes for this movie.
              </div>
            )}

            {/* DATE DROPDOWN */}
            {shows.length > 0 && (
              <>
                <div>
                  <div style={styles.label}>Select Date</div>
                  <select
                    style={styles.input}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  >
                    {dateOptions.length === 0 && (
                      <option value="">No dates available</option>
                    )}
                    {dateOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SHOWTIME DROPDOWN */}
                <div>
                  <div style={styles.label}>Select Showtime</div>
                  <select
                    style={styles.input}
                    value={selectedShowId}
                    onChange={(e) => setSelectedShowId(e.target.value)}
                    disabled={showsForSelectedDate.length === 0}
                  >
                    <option value="">Choose a time...</option>
                    {showsForSelectedDate.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.startTime} – {s.endTime}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              style={styles.submit}
              disabled={shows.length === 0}
            >
              Continue
            </button>

            {/* SUMMARY */}
            <div style={styles.summary}>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>
                📋 Selection Summary
              </div>
              <div style={styles.muted}>
                <p>
                  <strong>Movie:</strong> {movieTitle}
                </p>
                <p>
                  <strong>Date:</strong> {selectedDate || "Not selected"}
                </p>
                <p>
                  <strong>Showtime:</strong>{" "}
                  {selectedShow
                    ? `${selectedShow.startTime} – ${selectedShow.endTime}`
                    : "Not selected"}
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
