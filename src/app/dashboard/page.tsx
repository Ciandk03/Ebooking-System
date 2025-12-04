// Updated DashboardPage with RecentBookings component
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RecentBookings from "../../components/RecentBookings";

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
    color: UGA.white,
    padding: 24,
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    paddingBottom: 16,
    borderBottom: `1px solid ${UGA.border}`,
  },
  title: {
    fontSize: 32,
    fontWeight: 900,
    letterSpacing: -0.5,
  },
  logoutButton: {
    background: UGA.red,
    border: "none",
    color: UGA.white,
    padding: "8px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    minWidth: 0,
  },
  content: {
    display: "grid",
    gridTemplateColumns: "3fr 1fr", // ⭐ 75% / 25% layout
    gap: 24,
    minWidth: 0,
  },
  card: {
    background: UGA.nearBlack,
    padding: 24,
    borderRadius: 12,
    border: `1px solid ${UGA.border}`,
    minWidth: 189,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 16,
    color: UGA.white,
  },
  cardContent: {
    color: UGA.gray,
    lineHeight: 1.6,
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  infoItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: `1px solid ${UGA.dark}`,
  },
  infoLabel: {
    color: UGA.gray,
    fontSize: 14,
  },
  infoValue: {
    color: UGA.white,
    fontSize: 14,
    fontWeight: 500,
  },
  backButton: {
    padding: "8px 16px",
    borderRadius: 8,
    border: `1px solid ${UGA.border}`,
    background: UGA.dark,
    color: UGA.white,
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isAdminUser = Boolean(user?.isAdmin || user?.role === "admin");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");
    if (!token || !userData) {
      router.push("/Login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/Login");
    } finally {
      setLoading(false);
    }
  }, [router]);

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
      router.push("/Login");
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p>Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <button style={styles.backButton} onClick={() => router.push("/")}>
              ← Home
            </button>
            <h1 style={styles.title}>Account</h1>
          </div>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* ⭐ GRID LAYOUT */}
        <div style={styles.content}>

          {/* LEFT: ACCOUNT INFO (3fr) */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Account Information</h2>

            <div style={styles.userInfo}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Name:</span>
                <span style={styles.infoValue}>{user.name}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Email:</span>
                <span style={styles.infoValue}>{user.email}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Role:</span>
                <span style={styles.infoValue}>{user.role || "User"}</span>
              </div>
              {user.phone && (
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Phone:</span>
                  <span style={styles.infoValue}>{user.phone}</span>
                </div>
              )}
              {user.address && (
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Address:</span>
                  <span style={styles.infoValue}>{user.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: QUICK ACTIONS (1fr) */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Quick Actions</h2>
            <div style={styles.cardContent}>
              <p>Manage your account and browse movies.</p>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 16,
                  flexWrap: "wrap",
                }}
              >
                <button
                  style={{
                    ...styles.logoutButton,
                    background: UGA.red,
                    border: "none",
                  }}
                  onClick={() => router.push("/edit-profile")}
                >
                  Edit Profile
                </button>

                <button
                  style={{
                    ...styles.logoutButton,
                    background: UGA.dark,
                    border: `1px solid ${UGA.border}`,
                  }}
                  onClick={() => router.push("/")}
                >
                  Browse Movies
                </button>

                {isAdminUser && (
                  <button
                    style={{
                      ...styles.logoutButton,
                      background: UGA.dark,
                      border: `1px solid ${UGA.border}`,
                    }}
                    onClick={() => router.push("/admin")}
                  >
                    Admin Panel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ⭐ FULL-WIDTH ROW: RECENT BOOKINGS */}
          <div style={{ gridColumn: "1 / -1", marginTop: 20 }}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Recent Bookings</h2>
              <RecentBookings userId={user.id} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
