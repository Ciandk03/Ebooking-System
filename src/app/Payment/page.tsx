"use client";

import React, { useEffect, useState } from "react";
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
    maxWidth: 600,
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
  card: {
    background: "radial-gradient(circle at top, #1b1f27 0, #050608 55%)",
    borderRadius: 16,
    border: `1px solid ${UGA.border}`,
    padding: 20,
    boxShadow: "0 18px 45px rgba(0,0,0,0.6)",
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 16,
    borderBottom: `1px solid ${UGA.border}`,
    paddingBottom: 12,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
    fontSize: 14,
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: 700,
    marginTop: 12,
    paddingTop: 12,
    borderTop: `1px dashed ${UGA.border}`,
    fontSize: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    fontWeight: 600,
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: `1px solid ${UGA.border}`,
    background: "#050608",
    color: UGA.white,
    fontSize: 14,
  },
  radioGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
    padding: 12,
    borderRadius: 8,
    border: `1px solid ${UGA.border}`,
    background: "#111318",
  },
  radioSelected: {
    borderColor: UGA.red,
    background: "#1a0508",
  },
  primaryButton: {
    width: "100%",
    padding: "14px",
    borderRadius: 999,
    border: "none",
    background: UGA.red,
    color: UGA.white,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 10px 28px rgba(186,12,47,0.45)",
    marginTop: 12,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  error: {
    padding: 10,
    borderRadius: 8,
    background: "#231016",
    border: `1px solid ${UGA.red}`,
    color: "#f9ccd6",
    fontSize: 13,
    marginBottom: 16,
  },
  muted: {
    color: UGA.gray,
    fontSize: 13,
  },
};

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const movieId = searchParams.get("movieId");
  const showId = searchParams.get("showId");
  const seatsStr = searchParams.get("seats");
  const adultTickets = parseInt(searchParams.get("adultTickets") || "0");
  const childTickets = parseInt(searchParams.get("childTickets") || "0");
  const seniorTickets = parseInt(searchParams.get("seniorTickets") || "0");
  const totalPrice = parseFloat(searchParams.get("totalPrice") || "0");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"saved" | "new">("new");

  // New card state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    // Check login and fetch profile for saved card
    const checkUser = async () => {
      try {
        const stored = localStorage.getItem("user");
        if (!stored) {
          router.push("/Login");
          return;
        }
        const userData = JSON.parse(stored);

        // Fetch full profile to get payment info
        const res = await fetch("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
          },
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setUser(json.data);
            // If user has saved cards, default to 'saved'
            if (json.data.paymentCards && json.data.paymentCards.length > 0) {
              setPaymentMethod("saved");
            }
          }
        } else {
          // Fallback to basic local storage user if API fails (though payment won't be available)
          setUser(userData);
        }
      } catch (err) {
        console.error("Payment: error checking user", err);
      }
    };
    checkUser();
  }, [router]);

  const handlePayment = async () => {
    if (!user || !movieId || !showId) return;

    // Basic validation
    if (paymentMethod === "new") {
      if (!cardNumber || !cardName || !expiry || !cvv) {
        setError("Please fill in all payment fields.");
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      const body = {
        userId: user.id,
        movieId,
        showtimeId: showId,
        seats: seatsStr ? JSON.parse(seatsStr) : [],
        adultTickets,
        childTickets,
        seniorTickets,
        totalPrice,
        status: "confirmed",
        bookingDate: new Date().toISOString(),
        paymentDetails:
          paymentMethod === "saved"
            ? { type: "saved" }
            : { type: "new", last4: cardNumber.slice(-4) },
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(
          json.error || json.message || "Failed to create booking"
        );
      }

      // Success – send to booking confirmation with order info
      const bookingId = json?.data?.id || "";

      const params = new URLSearchParams({
        bookingId,
        movieId: movieId || "",
        showId: showId || "",
        seats: seatsStr || "[]",
        adultTickets: adultTickets.toString(),
        childTickets: childTickets.toString(),
        seniorTickets: seniorTickets.toString(),
        totalPrice: totalPrice.toString(),
      });

      router.push(`/BookingConfirmation?${params.toString()}`);
    } catch (err: any) {
      console.error("Payment: booking error", err);
      setError(err?.message || "Failed to complete booking");
    } finally {
      setLoading(false);
    }
  };

  if (!movieId || !showId) {
    return (
      <div style={styles.page}>
        <div style={styles.content}>
          <div style={styles.error}>
            Invalid booking session. Please start over.
          </div>
          <button onClick={() => router.push("/")} style={styles.primaryButton}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const hasSavedCard = user?.paymentCards && user.paymentCards.length > 0;

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        <header style={styles.header}>
          <h1 style={styles.title}>💳 Checkout</h1>
          <div style={styles.muted}>Complete your purchase</div>
        </header>

        {/* ORDER SUMMARY */}
        <section style={styles.card}>
          <div style={styles.cardTitle}>Order Summary</div>
          <div style={styles.row}>
            <span>Tickets</span>
            <span>
              {adultTickets + childTickets + seniorTickets} (
              {[
                adultTickets > 0 ? `${adultTickets} Adult` : null,
                childTickets > 0 ? `${childTickets} Child` : null,
                seniorTickets > 0 ? `${seniorTickets} Senior` : null,
              ]
                .filter(Boolean)
                .join(", ")}
              )
            </span>
          </div>
          <div style={styles.row}>
            <span>Seats</span>
            <span>{seatsStr ? JSON.parse(seatsStr).join(", ") : "None"}</span>
          </div>
          <div style={styles.totalRow}>
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </section>

        {/* PAYMENT METHOD */}
        <section style={styles.card}>
          <div style={styles.cardTitle}>Payment Method</div>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.radioGroup}>
            {hasSavedCard && (
              <label
                style={{
                  ...styles.radioLabel,
                  ...(paymentMethod === "saved" ? styles.radioSelected : {}),
                }}
                onClick={() => setPaymentMethod("saved")}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "saved"}
                  onChange={() => setPaymentMethod("saved")}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>Saved Card</div>
                  <div style={styles.muted}>
                    {user.paymentCards[0].cardNumber} •{" "}
                    {user.paymentCards[0].cardHolderName}
                  </div>
                </div>
              </label>
            )}

            <label
              style={{
                ...styles.radioLabel,
                ...(paymentMethod === "new" ? styles.radioSelected : {}),
              }}
              onClick={() => setPaymentMethod("new")}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "new"}
                onChange={() => setPaymentMethod("new")}
              />
              <div style={{ fontWeight: 600 }}>New Credit/Debit Card</div>
            </label>
          </div>

          {paymentMethod === "new" && (
            <div style={{ marginTop: 20 }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Card Number</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  style={styles.input}
                  value={cardNumber}
                  maxLength={19}
                  onChange={(e) => {
                    // Allow only digits
                    const val = e.target.value.replace(/\D/g, "");
                    // Limit to 16 digits
                    const truncated = val.slice(0, 16);
                    // Add spaces every 4 digits
                    const formatted = truncated.replace(
                      /(\d{4})(?=\d)/g,
                      "$1 "
                    );
                    setCardNumber(formatted);
                  }}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  style={styles.input}
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    style={styles.input}
                    value={expiry}
                    maxLength={5}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      if (val.length > 4) val = val.slice(0, 4);

                      if (val.length > 2) {
                        val = `${val.slice(0, 2)}/${val.slice(2)}`;
                      }
                      setExpiry(val);
                    }}
                  />
                </div>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    style={styles.input}
                    value={cvv}
                    maxLength={4}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setCvv(val.slice(0, 4));
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        <button
          onClick={handlePayment}
          disabled={loading}
          style={{
            ...styles.primaryButton,
            ...(loading ? styles.primaryButtonDisabled : {}),
          }}
        >
          {loading ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
        </button>

        <button
          onClick={() => router.back()}
          style={{
            ...styles.primaryButton,
            background: "transparent",
            border: `1px solid ${UGA.border}`,
            boxShadow: "none",
            marginTop: 12,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
