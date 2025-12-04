"use client";

import React, { useEffect, useMemo, useState } from "react";
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

const styles: { [k: string]: React.CSSProperties } = {
  page: {
    background: UGA.black,
    minHeight: "100vh",
    padding: 24,
    color: UGA.white,
    borderTop: `4px solid ${UGA.red}`,
    fontFamily:
      "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  },
  content: {
    maxWidth: 880,
    margin: "0 auto",
  },
  header: {
    marginBottom: 24,
  },
  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  muted: {
    fontSize: 14,
    color: UGA.gray,
  },
  card: {
    background:
      "radial-gradient(circle at top, #1b1f27 0, #050608 55%)",
    borderRadius: 16,
    border: `1px solid ${UGA.border}`,
    padding: 20,
    boxShadow: "0 18px 45px rgba(0,0,0,0.6)",
    marginBottom: 20,
  },
  cardTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  badge: {
    background: "#052911",
    color: "#bbf7d0",
    fontSize: 11,
    padding: "4px 10px",
    borderRadius: 999,
    border: "1px solid #166534",
    textTransform: "uppercase",
    letterSpacing: 0.08,
  },
  bookingNumber: {
    fontSize: 14,
    color: UGA.gray,
    marginTop: 4,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
    marginBottom: 4,
  },
  label: {
    color: UGA.gray,
  },
  value: {
    fontWeight: 500,
  },
  tagRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 6,
  },
  tag: {
    fontSize: 12,
    padding: "4px 8px",
    borderRadius: 999,
    border: `1px solid ${UGA.border}`,
    background: "#050608",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTop: `1px dashed ${UGA.border}`,
  },
  totalLabel: {
    fontSize: 13,
    color: UGA.gray,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 800,
  },
  buttonRow: {
    marginTop: 20,
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
  },
  primaryButton: {
    padding: "10px 18px",
    borderRadius: 999,
    border: "none",
    background: UGA.red,
    color: UGA.white,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "10px 18px",
    borderRadius: 999,
    border: `1px solid ${UGA.border}`,
    background: "transparent",
    color: UGA.gray,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  },
};

export default function BookingConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("bookingId") || "";
  const movieId = searchParams.get("movieId") || "";
  const totalPriceStr = searchParams.get("totalPrice") || "0";
  const seatsStr = searchParams.get("seats") || "[]";
  const adultTickets = parseInt(searchParams.get("adultTickets") || "0");
  const childTickets = parseInt(searchParams.get("childTickets") || "0");
  const seniorTickets = parseInt(searchParams.get("seniorTickets") || "0");

  const [movieTitle, setMovieTitle] = useState<string | null>(null);

  const seats = useMemo(() => {
    try {
      const parsed = JSON.parse(seatsStr);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [seatsStr]);

  const totalPrice = useMemo(
    () => Number.isFinite(Number(totalPriceStr)) ? parseFloat(totalPriceStr) : 0,
    [totalPriceStr],
  );

  // Fetch movie title for nicer order details
  useEffect(() => {
    if (!movieId) return;

    const fetchMovie = async () => {
      try {
        const res = await fetch(`/api/movies/${movieId}`);
        if (!res.ok) return;
        const json = await res.json();
        if (json.success && json.data?.title) {
          setMovieTitle(json.data.title as string);
        }
      } catch (err) {
        console.error("BookingConfirmation: failed to fetch movie title", err);
      }
    };

    fetchMovie();
  }, [movieId]);

  const hasTickets =
    adultTickets + childTickets + seniorTickets > 0;

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        <header style={styles.header}>
          <div style={styles.titleRow}>
            <div>
              <h1 style={styles.title}>Booking Confirmed 🎉</h1>
              <div style={styles.muted}>
                Your tickets are all set – a confirmation email has been sent to your address.
              </div>
            </div>
          </div>
        </header>

        <div style={styles.card}>
          <div style={styles.cardTitleRow}>
            <span style={styles.badge}>Success</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>
                {movieTitle || "Your booking"}
              </div>
              {bookingId && (
                <div style={styles.bookingNumber}>
                  Booking number: <strong>#{bookingId}</strong>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            {hasTickets && (
              <>
                <div style={styles.row}>
                  <span style={styles.label}>Tickets</span>
                  <span style={styles.value}>
                    {adultTickets > 0 && `${adultTickets} Adult${adultTickets > 1 ? "s" : ""}`}
                    {childTickets > 0 &&
                      `${adultTickets > 0 ? " · " : ""}${childTickets} Child${childTickets > 1 ? "ren" : ""}`}
                    {seniorTickets > 0 &&
                      `${adultTickets + childTickets > 0 ? " · " : ""}${seniorTickets} Senior${seniorTickets > 1 ? "s" : ""}`}
                  </span>
                </div>

                <div style={styles.row}>
                  <span style={styles.label}>Seats</span>
                  <span style={styles.value}>
                    {seats.length ? seats.join(", ") : "Assigned at box office"}
                  </span>
                </div>
              </>
            )}

            <div style={styles.totalRow}>
              <div>
                <div style={styles.totalLabel}>Order total</div>
              </div>
              <div style={styles.totalValue}>
                ${totalPrice.toFixed(2)}
              </div>
            </div>
          </div>

          <div style={styles.buttonRow}>
            <button
              style={styles.primaryButton}
              onClick={() => router.push("/dashboard")}
            >
              View my bookings
            </button>
            <button
              style={styles.secondaryButton}
              onClick={() => router.push("/")}
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
