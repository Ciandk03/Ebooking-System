'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  },
  content: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 24,
  },
  card: {
    background: UGA.nearBlack,
    padding: 24,
    borderRadius: 12,
    border: `1px solid ${UGA.border}`,
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
  adminBadge: {
    background: UGA.red,
    color: UGA.white,
    padding: "4px 8px",
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    marginLeft: 8,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    background: UGA.dark,
    padding: 16,
    borderRadius: 8,
    border: `1px solid ${UGA.border}`,
    textAlign: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 700,
    color: UGA.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: UGA.gray,
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

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMovies: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/Login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setUser(parsedUser);
      loadStats();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/Login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const loadStats = async () => {
    try {
      // In a real application, you would fetch actual stats from your API
      setStats({
        totalUsers: 150,
        totalMovies: 25,
        totalBookings: 1200,
        totalRevenue: 45000,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      router.push('/Login');
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
          <p>Please log in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <button 
              style={styles.backButton} 
              onClick={() => router.push('/')}
            >
              ← Home
            </button>
            <h1 style={styles.title}>
              Admin Panel
              <span style={styles.adminBadge}>ADMIN</span>
            </h1>
          </div>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.totalUsers}</div>
            <div style={styles.statLabel}>Total Users</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.totalMovies}</div>
            <div style={styles.statLabel}>Movies</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.totalBookings}</div>
            <div style={styles.statLabel}>Bookings</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>${stats.totalRevenue.toLocaleString()}</div>
            <div style={styles.statLabel}>Revenue</div>
          </div>
        </div>

        <div style={styles.content}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>User Management</h2>
            <div style={styles.cardContent}>
              <p>Manage user accounts, roles, and permissions.</p>
              <button
                style={{
                  ...styles.logoutButton,
                  marginTop: 16,
                  background: UGA.dark,
                  border: `1px solid ${UGA.border}`,
                }}
                onClick={() => router.push('/admin/users')}
              >
                Manage Users
              </button>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Movie Management</h2>
            <div style={styles.cardContent}>
              <p>Add, edit, and manage movie listings.</p>
              <button
                style={{
                  ...styles.logoutButton,
                  marginTop: 16,
                  background: UGA.dark,
                  border: `1px solid ${UGA.border}`,
                }}
                onClick={() => router.push('/admin/movies')}
              >
                Manage Movies
              </button>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Booking Management</h2>
            <div style={styles.cardContent}>
              <p>View and manage all bookings and reservations.</p>
              <button
                style={{
                  ...styles.logoutButton,
                  marginTop: 16,
                  background: UGA.dark,
                  border: `1px solid ${UGA.border}`,
                }}
                onClick={() => router.push('/admin/bookings')}
              >
                Manage Bookings
              </button>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>System Settings</h2>
            <div style={styles.cardContent}>
              <p>Configure system settings and preferences.</p>
              <button
                style={{
                  ...styles.logoutButton,
                  marginTop: 16,
                  background: UGA.dark,
                  border: `1px solid ${UGA.border}`,
                }}
                onClick={() => router.push('/admin/settings')}
              >
                System Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
