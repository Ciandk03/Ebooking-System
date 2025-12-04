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

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: UGA.black,
    minHeight: "100vh",
    padding: 24,
    color: UGA.white,
    borderTop: `4px solid ${UGA.red}`,
    fontFamily:
      "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    display: "flex",
    justifyContent: "center",
  },
  content: {
    width: "100%",
    maxWidth: 1100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  subtitle: {
    color: UGA.gray,
    fontSize: 14,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)",
    gap: 24,
  },
  card: {
    background: "radial-gradient(circle at top, #1b1f27 0, #050608 55%)",
    borderRadius: 16,
    border: `1px solid ${UGA.border}`,
    padding: 20,
    boxShadow: "0 18px 45px rgba(0,0,0,0.6)",
  },
  cardTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
  },
  screenBar: {
    textAlign: "center",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.18,
    color: UGA.gray,
    marginBottom: 8,
  },
  screen: {
    height: 4,
    background:
      "linear-gradient(90deg, rgba(186,12,47,0.3), rgba(255,255,255,0.7), rgba(186,12,47,0.3))",
    borderRadius: 999,
    marginBottom: 18,
  },
  seatGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  seatRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  rowLabel: {
    width: 20,
    textAlign: "center",
    fontSize: 12,
    color: UGA.gray,
  },
  seat: {
    width: 26,
    height: 26,
    borderRadius: 6,
    border: `1px solid ${UGA.border}`,
    fontSize: 11,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition:
      "transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease, background 0.12s ease",
    background: "#101318",
  },
  seatSelected: {
    background: UGA.red,
    borderColor: UGA.redDark,
    boxShadow: "0 0 0 1px rgba(255,255,255,0.18)",
  },
  seatTaken: {
    background: "#181b20",
    color: "#555",
    borderColor: "#3a3a3a",
    cursor: "not-allowed",
    opacity: 0.55,
  },
  seatHoverable: {
    // used via inline spread when not disabled
  },
  legendRow: {
    display: "flex",
    gap: 14,
    marginTop: 16,
    fontSize: 11,
    color: UGA.gray,
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  legendSwatch: {
    width: 16,
    height: 16,
    borderRadius: 4,
    border: `1px solid ${UGA.border}`,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    fontWeight: 600,
  },
  inputRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  pill: {
    background: "#111318",
    borderRadius: 999,
    padding: "2px 10px",
    border: `1px solid ${UGA.border}`,
    fontSize: 11,
    color: UGA.gray,
  },
  numberInput: {
    width: 60,
    padding: "6px 8px",
    borderRadius: 6,
    border: `1px solid ${UGA.border}`,
    background: "#050608",
    color: UGA.white,
    fontSize: 13,
  },
  summaryBox: {
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
    background: "#0d1016",
    border: `1px solid ${UGA.border}`,
    fontSize: 13,
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 4,
    fontSize: 13,
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: 700,
    marginTop: 4,
    paddingTop: 4,
    borderTop: `1px dashed ${UGA.border}`,
  },
  muted: { color: UGA.gray, fontSize: 12 },
  error: {
    padding: 10,
    borderRadius: 8,
    background: "#231016",
    border: `1px solid ${UGA.red}`,
    color: "#f9ccd6",
    fontSize: 13,
    marginBottom: 10,
  },
  actionsRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
  },
  backButton: {
    padding: "10px 14px",
    borderRadius: 999,
    border: `1px solid ${UGA.border}`,
    background: "#07090d",
    color: UGA.gray,
    fontSize: 13,
    cursor: "pointer",
  },
  primaryButton: {
    padding: "10px 18px",
    borderRadius: 999,
    border: "none",
    background: UGA.red,
    color: UGA.white,
    fontWeight: 600,
    letterSpacing: 0.4,
    fontSize: 13,
    cursor: "pointer",
    boxShadow: "0 10px 28px rgba(186,12,47,0.45)",
  },
  primaryButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
    boxShadow: "none",
  },
};

interface ShowDoc {
  id: string;
  name: string;
  movie: string;
  showroom: string;
  date: string;
  startTime: string;
  endTime: string;
  availableSeats: string[]; // array like ["A1","A2","B5"...]
  adultTicketPrice: number;
  childTicketPrice: number;
  seniorTicketPrice: number;
}

interface BookingResponse {
  success: boolean;
  data?: { id: string };
  error?: string;
  message?: string;
}

function groupSeatsByRow(seats: string[]) {
  const map = new Map<string, string[]>();

  seats.forEach((seat) => {
    // crude parse: row = first letter(s) before first digit
    const match = seat.match(/^([A-Za-z]+)(\d+)$/);
    const row = match ? match[1] : seat.charAt(0);
    const existing = map.get(row) || [];
    existing.push(seat);
    map.set(row, existing);
  });

  // sort rows alphabetically; seats inside row numerically if possible
  const rows = Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));

  return rows.map(([rowLabel, rowSeats]) => {
    const sortedSeats = [...rowSeats].sort((a, b) => {
      const ma = a.match(/\d+/);
      const mb = b.match(/\d+/);
      if (!ma || !mb) return a.localeCompare(b);
      const na = parseInt(ma[0], 10);
      const nb = parseInt(mb[0], 10);
      if (na === nb) return a.localeCompare(b);
      return na - nb;
    });
    return { rowLabel, seats: sortedSeats };
  });
}

export default function SeatSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const showId = searchParams.get("showId") || "";
  const movieId = searchParams.get("movieId") || "";
  const movieTitle = searchParams.get("title") || "";

  const [show, setShow] = useState<ShowDoc | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [allSeats, setAllSeats] = useState<string[]>([]);
  const [showroomName, setShowroomName] = useState<string | null>(null);

  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [seniorCount, setSeniorCount] = useState(0);

  // Fetch show details using movieId + showId
  useEffect(() => {
    const load = async () => {
      if (!movieId || !showId) {
        setError("Missing movie or showtime information.");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // reuse same endpoint as Booking page
        const res = await fetch(`/api/movies/${movieId}/shows`);
        const text = await res.text();
        let json: any;
        try {
          json = text ? JSON.parse(text) : null;
        } catch (e) {
          console.error("SeatSelection: invalid JSON from /shows:", text);
          throw new Error("Invalid response from showtimes API");
        }

        if (!res.ok || !json?.success) {
          throw new Error(json?.error || "Failed to load showtime");
        }

        const showList: ShowDoc[] = (json.data || []) as ShowDoc[];
        const found = showList.find((s) => s.id === showId);

        if (!found) {
          setError("This showtime was not found for the selected movie.");
          return;
        }

        // normalize availableSeats to an array
        const seats =
          Array.isArray(found.availableSeats) && found.availableSeats.length > 0
            ? found.availableSeats
            : [];

        setShow({ ...found, availableSeats: seats });
      } catch (err: any) {
        console.error("SeatSelection: error loading show", err);
        setError(err?.message || "Failed to load showtime");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [movieId, showId]);

  useEffect(() => {
    const fetchShowroomSeats = async () => {
      if (!show?.showroom) return;

      try {
        const res = await fetch("/api/showrooms");
        const json = await res.json();

        if (!res.ok || !json?.success) {
          throw new Error(json?.error || "Failed to load showrooms");
        }

        const showrooms: any[] = json.showrooms || [];
        const showroom = showrooms.find((sr) => sr.id === show.showroom);

        if (showroom) {
          const seats: string[] = Array.isArray(showroom.seats)
            ? showroom.seats
            : [];
          setAllSeats(seats);
          setShowroomName(showroom.name || showroom.id);
        } else {
          // 🔁 Fallback – still show something, but this *will* collapse seats if used
          setAllSeats(show.availableSeats || []);
          setShowroomName(show.showroom);
        }
      } catch (err) {
        console.error("SeatSelection: failed to load showroom seats", err);
        // Fallback to avoid blank screen
        setAllSeats(show?.availableSeats || []);
        setShowroomName(show?.showroom || "");
      }
    };

    if (show) {
      fetchShowroomSeats();
    }
  }, [show]);

  const groupedSeats = useMemo(
    () => (allSeats.length > 0 ? groupSeatsByRow(allSeats) : []),
    [allSeats]
  );

  const availableSeatSet = useMemo(
    () => new Set(show?.availableSeats || []),
    [show]
  );

  const totalTickets = adultCount + childCount + seniorCount;
  const totalSelectedSeats = selectedSeats.length;

  const totalPrice = useMemo(() => {
    if (!show) return 0;
    return (
      adultCount * show.adultTicketPrice +
      childCount * show.childTicketPrice +
      seniorCount * show.seniorTicketPrice
    );
  }, [show, adultCount, childCount, seniorCount]);

  const canConfirm =
    !!show &&
    totalTickets > 0 &&
    totalSelectedSeats > 0 &&
    totalTickets === totalSelectedSeats &&
    !bookingLoading;

  const handleSeatToggle = (seat: string) => {
    if (!show) return;

    // For now, treat all availableSeats as free; no explicit taken state here.
    // If we wanted to compute taken seats from bookings, this is where we'd block them.

    const already = selectedSeats.includes(seat);

    if (already) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seat));
      return;
    }

    if (totalTickets > 0 && selectedSeats.length >= totalTickets) {
      // Just replace the last one to keep UX simple
      setSelectedSeats((prev) => [...prev.slice(1), seat]);
    } else {
      setSelectedSeats((prev) => [...prev, seat]);
    }
  };

  const handleCheckout = () => {
    if (!show || !movieId) return;

    if (totalTickets === 0) {
      alert("Please specify at least one ticket.");
      return;
    }
    if (totalTickets !== totalSelectedSeats) {
      alert(
        `Ticket count (${totalTickets}) must match selected seats (${totalSelectedSeats}).`
      );
      return;
    }

    // Get user info from localStorage (set on login / edit-profile)
    let userId: string | null = null;
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        userId = parsed?.id || null;
      }
    } catch {
      // ignore
    }

    if (!userId) {
      alert("Please log in to complete your booking.");
      router.push("/Login");
      return;
    }

    // Redirect to Payment page with booking details
    const params = new URLSearchParams({
      movieId,
      showId: show.id,
      seats: JSON.stringify(selectedSeats),
      adultTickets: adultCount.toString(),
      childTickets: childCount.toString(),
      seniorTickets: seniorCount.toString(),
      totalPrice: totalPrice.toString(),
    });

    router.push(`/Payment?${params.toString()}`);
  };

  const disabledText =
    !show || totalTickets === 0
      ? "Select tickets and seats to continue"
      : totalTickets !== totalSelectedSeats
        ? "Ticket count must match selected seats"
        : "";

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        <header style={styles.header}>
          <h1 style={styles.title}>🍿 Select Your Seats</h1>
          <div style={styles.subtitle}>
            {movieTitle && (
              <span style={{ fontWeight: 600 }}>{movieTitle}</span>
            )}
            {show && (
              <>
                {" "}
                • {show.date} • {show.startTime} – {show.endTime}
              </>
            )}
          </div>
        </header>

        <div style={styles.layout}>
          {/* LEFT: SEAT MAP */}
          <section style={styles.card}>
            <div style={styles.cardTitleRow}>
              <div style={styles.cardTitle}>Seat Map</div>
              <div style={styles.pill}>
                Showroom:{" "}
                <strong>{showroomName ?? show?.showroom ?? "TBA"}</strong>
              </div>
            </div>

            {loading && <div style={styles.muted}>Loading seats…</div>}

            {error && <div style={styles.error}>{error}</div>}

            {!loading && !error && show && groupedSeats.length === 0 && (
              <div style={styles.muted}>
                No seat layout found for this showtime.
              </div>
            )}

            {!loading && !error && show && groupedSeats.length > 0 && (
              <>
                <div style={styles.screenBar}>Screen</div>
                <div style={styles.screen} />

                <div style={styles.seatGrid}>
                  {groupedSeats.map(({ rowLabel, seats }) => (
                    <div key={rowLabel} style={styles.seatRow}>
                      <div style={styles.rowLabel}>{rowLabel}</div>
                      {seats.map((seat) => {
                        const isAvailable = availableSeatSet.has(seat);
                        const isSelected = selectedSeats.includes(seat);
                        const isReserved = !isAvailable; // in layout but not in availableSeats

                        let seatStyle: React.CSSProperties = { ...styles.seat };

                        if (isReserved) {
                          seatStyle = { ...seatStyle, ...styles.seatTaken }; // grey / disabled
                        } else if (isSelected) {
                          seatStyle = { ...seatStyle, ...styles.seatSelected }; // red
                        }

                        return (
                          <button
                            key={seat}
                            type="button"
                            disabled={isReserved}
                            onClick={() => {
                              if (!isReserved) handleSeatToggle(seat);
                            }}
                            style={seatStyle}
                          >
                            {seat.replace(/^[A-Za-z]+/, "")}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div style={styles.legendRow}>
                  <div style={styles.legendItem}>
                    <div
                      style={{
                        ...styles.legendSwatch,
                        background: "#101318",
                      }}
                    />
                    <span>Available</span>
                  </div>
                  <div style={styles.legendItem}>
                    <div
                      style={{
                        ...styles.legendSwatch,
                        background: UGA.red,
                        borderColor: UGA.redDark,
                      }}
                    />
                    <span>Selected</span>
                  </div>
                  <div style={styles.legendItem}>
                    <div
                      style={{
                        ...styles.legendSwatch,
                        background: "#181b20",
                        borderColor: "#3a3a3a",
                      }}
                    />
                    <span>Reserved</span>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* RIGHT: TICKET & SUMMARY */}
          <section style={styles.card}>
            <div style={styles.cardTitleRow}>
              <div style={styles.cardTitle}>Tickets & Summary</div>
            </div>

            {!show && !loading && !error && (
              <div style={styles.muted}>
                Select a valid showtime from the previous page to continue.
              </div>
            )}

            {show && (
              <>
                <div style={styles.formGroup}>
                  <div style={styles.label}>Tickets</div>
                  <div style={styles.inputRow}>
                    <div>
                      <div style={styles.muted}>Adult</div>
                      <input
                        type="number"
                        min={0}
                        value={adultCount}
                        onChange={(e) =>
                          setAdultCount(
                            Math.max(0, Number(e.target.value) || 0)
                          )
                        }
                        style={styles.numberInput}
                      />
                    </div>
                    <div>
                      <div style={styles.muted}>Child</div>
                      <input
                        type="number"
                        min={0}
                        value={childCount}
                        onChange={(e) =>
                          setChildCount(
                            Math.max(0, Number(e.target.value) || 0)
                          )
                        }
                        style={styles.numberInput}
                      />
                    </div>
                    <div>
                      <div style={styles.muted}>Senior</div>
                      <input
                        type="number"
                        min={0}
                        value={seniorCount}
                        onChange={(e) =>
                          setSeniorCount(
                            Math.max(0, Number(e.target.value) || 0)
                          )
                        }
                        style={styles.numberInput}
                      />
                    </div>
                  </div>
                  <div style={{ ...styles.muted, marginTop: 4 }}>
                    Total tickets: <strong>{totalTickets}</strong> • Selected
                    seats: <strong>{totalSelectedSeats}</strong>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <div style={styles.label}>Selected Seats</div>
                  <div style={styles.summaryBox}>
                    {selectedSeats.length === 0 ? (
                      <span style={styles.muted}>
                        Click on seats in the map to select them.
                      </span>
                    ) : (
                      <span>{selectedSeats.join(", ")}</span>
                    )}
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <div style={styles.label}>Pricing</div>
                  <div style={styles.summaryBox}>
                    <div style={styles.priceRow}>
                      <span>Adult x {adultCount}</span>
                      <span>
                        ${show.adultTicketPrice.toFixed(2)} each • $
                        {(adultCount * show.adultTicketPrice).toFixed(2)}
                      </span>
                    </div>
                    <div style={styles.priceRow}>
                      <span>Child x {childCount}</span>
                      <span>
                        ${show.childTicketPrice.toFixed(2)} each • $
                        {(childCount * show.childTicketPrice).toFixed(2)}
                      </span>
                    </div>
                    <div style={styles.priceRow}>
                      <span>Senior x {seniorCount}</span>
                      <span>
                        ${show.seniorTicketPrice.toFixed(2)} each • $
                        {(seniorCount * show.seniorTicketPrice).toFixed(2)}
                      </span>
                    </div>
                    <div style={styles.totalRow}>
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {info && (
                  <div style={{ ...styles.muted, marginTop: 4 }}>{info}</div>
                )}
                {error && <div style={styles.error}>{error}</div>}
              </>
            )}

            <div style={styles.actionsRow}>
              <button
                type="button"
                onClick={() => router.back()}
                style={styles.backButton}
              >
                ⬅ Back
              </button>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={!canConfirm}
                style={{
                  ...styles.primaryButton,
                  ...(!canConfirm ? styles.primaryButtonDisabled : {}),
                }}
              >
                Checkout
              </button>
            </div>

            {!canConfirm && disabledText && (
              <div style={{ ...styles.muted, marginTop: 6 }}>
                {disabledText}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
