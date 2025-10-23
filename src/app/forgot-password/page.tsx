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

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send reset email');
      }

      setSuccess("Password reset instructions have been sent to your email.");
      setEmail("");

    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err instanceof Error ? err.message : "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button 
            style={styles.backButton} 
            onClick={() => router.push('/')}
          >
            ← Home
          </button>
          <button 
            style={styles.backButton} 
            onClick={() => router.back()}
          >
            ← Back
          </button>
        </div>

        <div style={styles.header}>
          <h1 style={styles.title}>Reset Password</h1>
          <p style={styles.subtitle}>
            Enter your email address and we'll send you instructions to reset your password.
          </p>
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

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Instructions"}
          </button>

          {error && <p style={{ ...styles.message, ...styles.error }}>{error}</p>}
          {success && <p style={{ ...styles.message, ...styles.success }}>{success}</p>}
        </form>

        <div style={styles.footer}>
          <p>
            Remember your password?{' '}
            <Link href="/Login" style={styles.link}>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
