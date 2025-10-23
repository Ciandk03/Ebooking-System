'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
  passwordRequirements: {
    fontSize: 12,
    color: UGA.gray,
    marginTop: 4,
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

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to reset password');
      }

      setSuccess("Password reset successfully! Redirecting to login...");
      
      setTimeout(() => {
        router.push('/Login');
      }, 2000);

    } catch (err) {
      console.error('Reset password error:', err);
      setError(err instanceof Error ? err.message : "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={{ marginBottom: 16 }}>
          <button 
            style={styles.backButton} 
            onClick={() => router.push('/')}
          >
            ← Home
          </button>
        </div>

        <div style={styles.header}>
          <h1 style={styles.title}>Set New Password</h1>
          <p style={styles.subtitle}>
            Enter your new password below.
          </p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div>
            <input
              style={styles.input}
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p style={styles.passwordRequirements}>
              Password must be at least 8 characters long
            </p>
          </div>

          <input
            style={styles.input}
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {error && <p style={{ ...styles.message, ...styles.error }}>{error}</p>}
          {success && <p style={{ ...styles.message, ...styles.success }}>{success}</p>}
        </form>
      </div>
    </div>
  );
}