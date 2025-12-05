"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  },
  content: {
    maxWidth: 880,
    margin: "0 auto",
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
  muted: {
    fontSize: 14,
    color: UGA.gray,
  },
  card: {
    background: "radial-gradient(circle at top, #1b1f27 0, #050608 55%)",
    borderRadius: 16,
    border: `1px solid ${UGA.border}`,
    padding: 20,
    boxShadow: "0 18px 45px rgba(0,0,0,0.6)",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 12,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 14,
    marginBottom: 6,
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 16,
    fontWeight: 700,
    marginTop: 10,
    paddingTop: 10,
    borderTop: `1px dashed ${UGA.border}`,
  },
  discountRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 14,
    marginTop: 6,
    color: "#facc15",
  },
  promoSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTop: `1px dashed ${UGA.border}`,
  },
  promoRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginTop: 6,
  },
  promoInput: {
    flex: 1,
    padding: "8px 10px",
    borderRadius: 999,
    border: `1px solid ${UGA.border}`,
    background: "#050608",
    color: UGA.white,
    fontSize: 13,
  },
  promoButton: {
    padding: "8px 14px",
    borderRadius: 999,
    border: "none",
    background: UGA.red,
    color: UGA.white,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  promoNote: {
    fontSize: 12,
    color: UGA.gray,
    marginTop: 6,
  },
  promoError: {
    fontSize: 12,
    color: "#f97373",
    marginTop: 6,
  },
  promoSuccess: {
    fontSize: 12,
    color: "#4ade80",
    marginTop: 6,
  },
  radioGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 12,
  },
  radioLabel: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    padding: 10,
    borderRadius: 10,
    border: `1px solid ${UGA.border}`,
    cursor: "pointer",
  },
  radioSelected: {
    borderColor: UGA.red,
    background: "#111827",
  },
  formGroupRow: {
    display: "flex",
    gap: 12,
  },
  formGroup: {
    marginBottom: 12,
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
    outline: "none",
  },
  footer: {
    marginTop: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  primaryButton: {
    padding: "10px 18px",
    borderRadius: 999,
    border: "none",
    background: UGA.red,
    color: UGA.white,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(186,12,47,0.45)",
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
    marginTop: 12,
  },
  error: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 13,
    color: "#f97373",
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
  const [paymentMethod, setPaymentMethod] = useState<string>("new");
  const [saveCard, setSaveCard] = useState(true);

  // Promo state
  const [canUsePromotions, setCanUsePromotions] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);
  // Promo / tax state
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  const TAX_RATE = 0.09;

  const subtotalAfterDiscount = useMemo(() => {
    return Math.max(0, totalPrice - discountAmount);
  }, [totalPrice, discountAmount]);

  const finalTotal = useMemo(() => {
    return Number((subtotalAfterDiscount * (1 + TAX_RATE)).toFixed(2));
  }, [subtotalAfterDiscount]);

  // New card state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const hasSavedCard = useMemo(
    () =>
      !!(
        user &&
        user.paymentCards &&
        Array.isArray(user.paymentCards) &&
        user.paymentCards.length > 0
      ),
    [user]
  );

  const hasDiscount =
    discountPercent > 0 && discountAmount > 0 && finalTotal < totalPrice;

  // Fetch user profile
  useEffect(() => {
    const checkUser = async () => {
      try {
        const stored = localStorage.getItem("user");
        if (!stored) {
          router.push("/Login");
          return;
        }

        const res = await fetch("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
          },
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setUser(json.data);
            setCanUsePromotions(!!json.data.subscribeToPromotions);

            if (json.data.paymentCards && json.data.paymentCards.length > 0) {
              setPaymentMethod("saved-0");
            }
          }
        } else {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        }
      } catch (err) {
        console.error("Payment: error checking user", err);
      }
    };

    checkUser();
  }, [router]);

  const handleApplyPromo = async () => {
    if (!user) {
      setPromoError("You must be logged in to use a promo code.");
      setPromoSuccess(null);
      return;
    }

    if (!canUsePromotions) {
      setPromoError(
        "This account is not subscribed to promotions. Enable promotional emails in your profile to use promo codes."
      );
      setPromoSuccess(null);
      return;
    }

    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code.");
      setPromoSuccess(null);
      return;
    }

    try {
      setPromoError(null);
      setPromoSuccess(null);

      const res = await fetch("/api/promotions/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
        body: JSON.stringify({
          userId: user.id,
          code: promoCode.trim(),
          totalPrice,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(
          json.error || json.message || "Promo code is not valid"
        );
      }

      const {
        discountPercent: dp,
        discountAmount: da,
        finalTotal: ft,
      } = json.data;

      setDiscountPercent(dp);
      setDiscountAmount(da);
      setPromoSuccess(`Promo applied: -$${da.toFixed(2)} (${dp}% off).`);
    } catch (err: any) {
      console.error("Payment: promo error", err);
      setDiscountPercent(0);
      setDiscountAmount(0);
      setPromoError(
        err?.message || "Could not apply this promo code right now."
      );
    }
  };

  const handlePayment = async () => {
    if (!user || !movieId || !showId) return;

    if (paymentMethod === "new") {
      if (!cardNumber || !cardName || !expiry || !cvv) {
        setError("Please fill in all payment fields.");
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      const seats = seatsStr ? JSON.parse(seatsStr) : [];

      // Handle saving new card
      if (paymentMethod === "new" && saveCard && user) {
        try {
          const newCard = {
            cardNumber: cardNumber.replace(/\s/g, ""),
            cardHolderName: cardName,
            expiryMonth: expiry.split("/")[0],
            expiryYear: "20" + expiry.split("/")[1],
            cvv: cvv,
          };

          const currentCards = user.paymentCards || [];
          // Avoid duplicates (simple check)
          const isDuplicate = currentCards.some(
            (c: any) => c.cardNumber.slice(-4) === newCard.cardNumber.slice(-4)
          );

          if (!isDuplicate) {
            const updatedCards = [...currentCards, newCard];

            // Update profile
            await fetch("/api/users/profile", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
              },
              body: JSON.stringify({
                paymentCards: updatedCards,
              }),
            });
          }
        } catch (saveErr) {
          console.error("Payment: failed to save card", saveErr);
          // Continue with booking even if save fails
        }
      }

      const body = {
        userId: user.id,
        movieId,
        showtimeId: showId,
        seats,
        adultTickets,
        childTickets,
        seniorTickets,
        totalPrice: finalTotal,
        status: "confirmed",
        bookingDate: new Date().toISOString(),
        paymentDetails:
          paymentMethod.startsWith("saved")
            ? { type: "saved", index: parseInt(paymentMethod.split("-")[1]) }
            : {
              type: "new",
              last4: cardNumber.replace(/\s/g, "").slice(-4),
            },
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

      const bookingId = json?.data?.id || "";

      const params = new URLSearchParams({
        bookingId,
        movieId,
        showId,
        seats: JSON.stringify(seats),
        adultTickets: adultTickets.toString(),
        childTickets: childTickets.toString(),
        seniorTickets: seniorTickets.toString(),
        totalPrice: finalTotal.toString(),
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
            Invalid booking request. Please start again from the movie page.
          </div>
          <button style={styles.primaryButton} onClick={() => router.push("/")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        <header style={styles.header}>
          <h1 style={styles.title}>💳 Checkout</h1>
          <div style={styles.muted}>Complete your purchase</div>
        </header>

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

          <div style={styles.promoSection}>
            <div style={styles.row}>
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            {hasDiscount && (
              <div style={styles.discountRow}>
                <span>Promotion ({discountPercent}% off)</span>
                <span>- ${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div style={styles.row}>
              <span>Sales Tax (9%)</span>
              <span>${(subtotalAfterDiscount * TAX_RATE).toFixed(2)}</span>
            </div>


            <div style={styles.promoRow}>
              <input
                type="text"
                placeholder="Promo code"
                style={styles.promoInput}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              />
              <button
                type="button"
                style={styles.promoButton}
                onClick={handleApplyPromo}
                disabled={loading}
              >
                Apply
              </button>
            </div>

            {promoError && <div style={styles.promoError}>{promoError}</div>}
            {promoSuccess && (
              <div style={styles.promoSuccess}>{promoSuccess}</div>
            )}
            {!promoError && !promoSuccess && (
              <div style={styles.promoNote}>
                Promo codes are available for users subscribed to promotional
                emails in their profile.
              </div>
            )}

            <div style={styles.totalRow}>
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardTitle}>Payment Method</div>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.radioGroup}>
            {hasSavedCard && user.paymentCards.map((card: any, index: number) => (
              <label
                key={index}
                style={{
                  ...styles.radioLabel,
                  ...(paymentMethod === `saved-${index}` ? styles.radioSelected : {}),
                }}
                onClick={() => setPaymentMethod(`saved-${index}`)}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === `saved-${index}`}
                  onChange={() => setPaymentMethod(`saved-${index}`)}
                  style={{ marginTop: 3 }}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>Saved Card {index + 1}</div>
                  <div style={styles.muted}>
                    {card.cardNumber} • {card.cardHolderName}
                  </div>
                </div>
              </label>
            ))}

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
                style={{ marginTop: 3 }}
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
                    const val = e.target.value.replace(/\D/g, "");
                    const truncated = val.slice(0, 16);
                    const formatted = truncated.replace(
                      /(\d{4})(?=\d)/g,
                      "$1 "
                    );
                    setCardNumber(formatted);
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Name on Card</label>
                <input
                  type="text"
                  placeholder="Full name"
                  style={styles.input}
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>

              <div style={styles.formGroupRow}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Expiry (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    style={styles.input}
                    value={expiry}
                    maxLength={5}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      if (val.length >= 3) {
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

        <div style={styles.footer}>
          <button
            style={styles.primaryButton}
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay & Confirm Booking"}
          </button>
          <button
            style={styles.secondaryButton}
            type="button"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
