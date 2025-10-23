'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    maxWidth: 400,
    margin: "0 auto",
    paddingTop: 60,
  },
  header: {
    textAlign: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 900,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    color: UGA.gray,
    fontSize: 16,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    background: UGA.nearBlack,
    padding: 24,
    borderRadius: 12,
    border: `1px solid ${UGA.border}`,
  },
  input: {
    padding: "12px 14px",
    borderRadius: 8,
    border: `1px solid ${UGA.border}`,
    background: UGA.dark,
    color: UGA.white,
    fontSize: 16,
  },
  button: {
    background: UGA.red,
    border: "none",
    color: UGA.white,
    padding: "12px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 16,
    marginTop: 8,
  },
  buttonDisabled: {
    background: UGA.redDark,
    cursor: "not-allowed",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    accentColor: UGA.red,
  },
  checkboxLabel: {
    fontSize: 14,
    color: UGA.gray,
  },
  message: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 16,
  },
  error: {
    color: UGA.red,
  },
  success: {
    color: "#22c55e",
  },
  link: {
    color: UGA.red,
    textDecoration: "none",
    fontSize: 14,
  },
  linkHover: {
    textDecoration: "underline",
  },
  footer: {
    textAlign: "center",
    marginTop: 24,
    color: UGA.gray,
    fontSize: 14,
  },
  backButton: {
    padding: "8px 16px",
    borderRadius: 8,
    border: `1px solid ${UGA.border}`,
    background: UGA.dark,
    color: UGA.white,
    cursor: "pointer",
    fontWeight: 600,
    marginBottom: 16,
  },
};

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      setSuccess("Login successful!");
      
      // Store session data
      if (result.data.token) {
        localStorage.setItem('authToken', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }

      // Navigate to home screen after login
      setTimeout(() => {
        router.push('/');
      }, 1000);

    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button 
            style={styles.backButton} 
            onClick={() => router.push('/')}
          >
            ← Home
          </button>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="rememberMe"
              style={styles.checkbox}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe" style={styles.checkboxLabel}>
              Remember me
            </label>
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button
              type="button"
              onClick={handleForgotPassword}
              style={{
                ...styles.link,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Forgot your password?
            </button>
          </div>

          {error && <p style={{ ...styles.message, ...styles.error }}>{error}</p>}
          {success && <p style={{ ...styles.message, ...styles.success }}>{success}</p>}
        </form>

        <div style={styles.footer}>
          <p>
            Don't have an account?{' '}
            <Link href="/Registration" style={styles.link}>
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
