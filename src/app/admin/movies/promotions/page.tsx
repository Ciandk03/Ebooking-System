"use client";

import React, { useState } from "react";
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

interface PromoFormState {
  code: string;
  startDate: string; // e.g., "2025-12-01"
  endDate: string;
  discount: number;
}

export default function PromotionsPage() {
  const router = useRouter();
  const [promoForm, setPromoForm] = useState<PromoFormState>({
    code: "",
    startDate: "",
    endDate: "",
    discount: 10,
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken");
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      }

      const response = await fetch("/api/admin/promotions", {
        method: "POST",
        headers,
        body: JSON.stringify(promoForm),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create promotion");
      }

      const sent = result.emailStats?.sent ?? 0;
      const failed = result.emailStats?.failed ?? 0;

      setMessage(
        result.message ||
          `Promotion created. Emails sent: ${sent}${
            failed ? `, failed: ${failed}` : ""
          }.`
      );

      // Reset form
      setPromoForm({
        code: "",
        startDate: "",
        endDate: "",
        discount: 10,
      });
    } catch (err) {
      console.error("Create promotion error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create promotion. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        ...pageStyle,
        maxWidth: 900,
        margin: "0 auto",
        fontFamily:
          "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <h1 style={titleStyle}>Promotions &amp; Email Blasts</h1>

      <div style={{ ...cardStyle, marginTop: 16 }}>
        <h2
          style={{
            marginTop: 0,
            marginBottom: 12,
            fontSize: 20,
            color: UGA.white,
          }}
        >
          Create a New Promotion
        </h2>

        <p style={{ color: "#9ca3af", marginBottom: 16 }}>
          Add a promotional code and automatically email everyone subscribed to
          promotions.
        </p>

        {(message || error) && (
          <div
            style={{
              ...messageStyle,
              background: error ? "#451010" : UGA.dark,
              color: error ? "#fecaca" : "#d7f3ff",
            }}
          >
            {error || message}
          </div>
        )}

        <form onSubmit={submitPromo} style={{ display: "grid", gap: 12 }}>
          <div>
            <label
              style={{
                display: "block",
                color: "#cbd5df",
                marginBottom: 6,
              }}
            >
              Promo Code
            </label>
            <input
              placeholder="e.g., UGA20OFF"
              value={promoForm.code}
              onChange={(e) =>
                setPromoForm((f) => ({ ...f, code: e.target.value }))
              }
              style={inputStyle}
              required
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  color: "#cbd5df",
                  marginBottom: 6,
                }}
              >
                Start Date
              </label>
              <input
                type="date"
                value={promoForm.startDate}
                onChange={(e) =>
                  setPromoForm((f) => ({ ...f, startDate: e.target.value }))
                }
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  color: "#cbd5df",
                  marginBottom: 6,
                }}
              >
                End Date
              </label>
              <input
                type="date"
                value={promoForm.endDate}
                onChange={(e) =>
                  setPromoForm((f) => ({ ...f, endDate: e.target.value }))
                }
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  color: "#cbd5df",
                  marginBottom: 6,
                }}
              >
                Discount %
              </label>
              <input
                placeholder="Discount %"
                type="number"
                min={0}
                max={100}
                value={promoForm.discount}
                onChange={(e) =>
                  setPromoForm((f) => ({
                    ...f,
                    discount: Number(e.target.value),
                  }))
                }
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "flex-end",
              marginTop: 8,
            }}
          >
            <button
              type="button"
              onClick={() => router.push("/admin/movies/list")}
              style={secondaryButton}
            >
              View Movies
            </button>
            <button type="submit" style={primaryButton} disabled={loading}>
              {loading
                ? "Creating Promotion..."
                : "Create Promotion & Email Subscribers"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
