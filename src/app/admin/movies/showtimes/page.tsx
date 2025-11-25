"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  inputStyle,
  primaryButton,
  secondaryButton,
  titleStyle,
  cardStyle,
  pageStyle,
  messageStyle,
  UGA,
} from "../adminMovieStyles";

interface MovieOption {
  id: string;
  title: string;
  duration: number;
}

interface ShowroomOption {
  id: string;
  name: string;
  seats?: string[];
}

interface ShowtimeFormState {
  movieId: string;
  showroomId: string;
  date: string;
  time: string;
  childTicketPrice: string;
  adultTicketPrice: string;
  seniorTicketPrice: string;
}

export default function CreateShowtimePage() {
  const router = useRouter();

  const [movies, setMovies] = useState<MovieOption[]>([]);
  const [showrooms, setShowrooms] = useState<ShowroomOption[]>([]);
  const [form, setForm] = useState<ShowtimeFormState>({
    movieId: "",
    showroomId: "",
    date: "",
    time: "",
    childTicketPrice: "8.50",
    adultTicketPrice: "12.00",
    seniorTicketPrice: "9.00",
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load movies + showrooms on mount
  useEffect(() => {
    const load = async () => {
      try {
        setInitialLoading(true);

        // Movies
        const moviesRes = await fetch("/api/movies");
        const moviesJson = await moviesRes.json();

        if (!moviesRes.ok || !moviesJson.success) {
          throw new Error(moviesJson.error || "Failed to load movies");
        }

        const moviesData: MovieOption[] = (moviesJson.data || []).map(
          (m: any) => ({
            id: m.id,
            title: m.title,
            duration: m.duration ?? 0,
          })
        );

        setMovies(moviesData);

        // Showrooms
        const showroomsRes = await fetch("/api/showrooms");
        const showroomsJson = await showroomsRes.json();

        if (!showroomsRes.ok || !showroomsJson.success) {
          throw new Error(showroomsJson.error || "Failed to load showrooms");
        }

        const showroomsData: ShowroomOption[] = (
          showroomsJson.showrooms || []
        ).map((sr: any) => ({
          id: sr.id,
          name: sr.name,
          seats: sr.seats,
        }));

        setMovies(moviesData);
        setShowrooms(showroomsData);

        // If there is at least one movie/showroom, preselect them
        setForm((prev) => ({
          ...prev,
          movieId: prev.movieId || (moviesData[0]?.id ?? ""),
          showroomId: prev.showroomId || (showroomsData[0]?.id ?? ""),
        }));
      } catch (err: any) {
        console.error("Admin CreateShowtime – init error:", err);
        setError(
          err?.message ||
            "Failed to load initial data (movies/showrooms). Please try again."
        );
      } finally {
        setInitialLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!form.movieId || !form.showroomId || !form.date || !form.time) {
      setError("Please select a movie, showroom, date, and time.");
      return;
    }

    const startDateTime = `${form.date}T${form.time}`;

    setLoading(true);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken");
        if (token) headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/admin/showtimes", {
        method: "POST",
        headers,
        body: JSON.stringify({
          movieId: form.movieId,
          showroomId: form.showroomId,
          startDateTime,
          childTicketPrice: Number(form.childTicketPrice),
          adultTicketPrice: Number(form.adultTicketPrice),
          seniorTicketPrice: Number(form.seniorTicketPrice),
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to create showtime");
      }

      setMessage("Showtime created successfully.");
      setError(null);

      // Reset time + date but keep movie/showroom for quick creation
      setForm((prev) => ({
        ...prev,
        date: "",
        time: "",
      }));
    } catch (err: any) {
      console.error("Create showtime error:", err);
      setError(err?.message || "Failed to create showtime. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedMovie = movies.find((m) => m.id === form.movieId);
  const selectedShowroom = showrooms.find((sr) => sr.id === form.showroomId);

  const availableSeatCount =
    selectedShowroom?.seats && Array.isArray(selectedShowroom.seats)
      ? selectedShowroom.seats.length
      : 0;

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1 style={titleStyle}>Create Movie Showtime</h1>
        <p style={{ color: UGA.gray, marginBottom: 16 }}>
          As an admin, you can schedule a showtime by selecting a movie,
          choosing a showroom, and setting the start date, time, and ticket
          prices. The system will automatically compute{" "}
          <strong>end time</strong>, populate <strong>available seats</strong>{" "}
          from the showroom, and link the showtime to the movie and showroom in
          Firestore.
        </p>

        <div style={cardStyle}>
          {initialLoading ? (
            <p style={{ color: UGA.gray }}>Loading movies and showrooms…</p>
          ) : (
            <form onSubmit={handleSubmit}>
              {message && <div style={messageStyle}>{message}</div>}
              {error && (
                <div
                  style={{
                    ...messageStyle,
                    background: "#4b1a1a",
                    color: "#ffe2e2",
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    color: "#cbd5df",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Movie
                </label>
                <select
                  name="movieId"
                  value={form.movieId}
                  onChange={handleChange}
                  style={{ ...inputStyle, width: "100%" }}
                >
                  {movies.length === 0 && (
                    <option value="">No movies available</option>
                  )}
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.duration} min)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    color: "#cbd5df",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Showroom
                </label>
                <select
                  name="showroomId"
                  value={form.showroomId}
                  onChange={handleChange}
                  style={{ ...inputStyle, width: "100%" }}
                >
                  {showrooms.length === 0 && (
                    <option value="">No showrooms available</option>
                  )}
                  {showrooms.map((sr) => (
                    <option key={sr.id} value={sr.id}>
                      {sr.name}
                      {sr.seats && ` – ${sr.seats.length} seats`}
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 16,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: 160 }}>
                  <label
                    style={{
                      color: "#cbd5df",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 160 }}>
                  <label
                    style={{
                      color: "#cbd5df",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>

              <h3
                style={{
                  color: UGA.gray,
                  fontWeight: 600,
                  margin: "8px 0 4px",
                }}
              >
                Ticket Prices
              </h3>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 16,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: 120 }}>
                  <label
                    style={{
                      color: "#cbd5df",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Child
                  </label>
                  <input
                    type="number"
                    name="childTicketPrice"
                    value={form.childTicketPrice}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    style={inputStyle}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 120 }}>
                  <label
                    style={{
                      color: "#cbd5df",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Adult
                  </label>
                  <input
                    type="number"
                    name="adultTicketPrice"
                    value={form.adultTicketPrice}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    style={inputStyle}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 120 }}>
                  <label
                    style={{
                      color: "#cbd5df",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Senior
                  </label>
                  <input
                    type="number"
                    name="seniorTicketPrice"
                    value={form.seniorTicketPrice}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div
                style={{
                  marginBottom: 16,
                  padding: 12,
                  borderRadius: 8,
                  background: UGA.nearBlack,
                  border: `1px solid ${UGA.border}`,
                  fontSize: 13,
                  color: UGA.gray,
                }}
              >
                <div>
                  <strong>Summary</strong>
                </div>
                <div>
                  {selectedMovie ? (
                    <>
                      Movie: <strong>{selectedMovie.title}</strong> (
                      {selectedMovie.duration} min)
                      <br />
                    </>
                  ) : (
                    <>Movie: —</>
                  )}
                </div>
                <div>
                  {selectedShowroom ? (
                    <>
                      Showroom: <strong>{selectedShowroom.name}</strong> (
                      {availableSeatCount} seats)
                    </>
                  ) : (
                    <>Showroom: —</>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 12,
                  marginTop: 8,
                }}
              >
                <button
                  type="button"
                  style={secondaryButton}
                  onClick={() => router.back()}
                >
                  Cancel
                </button>
                <button type="submit" style={primaryButton} disabled={loading}>
                  {loading ? "Creating…" : "Create Showtime"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
