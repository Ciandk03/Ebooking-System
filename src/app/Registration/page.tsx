'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { validateCardNumber } from '../../utils/encryption';

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
    maxWidth: 600,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
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
  title: {
    fontSize: 32,
    fontWeight: 900,
    letterSpacing: -0.5,
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
  },
  buttonDisabled: {
    background: UGA.redDark,
    cursor: "not-allowed",
  },
  message: {
    textAlign: "center",
    fontSize: 16,
  },
  error: {
    color: UGA.red,
  },
  success: {
    color: "#22c55e",
  },
};

export default function RegistrationPage() {
  
  const params = useParams();
  const router = useRouter();

  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    
    if (cardNumber && !validateCardNumber(cardNumber)) {
      setError("Please enter a valid card number.");
      return;
    }

    setLoading(true);
    try {
      
      let paymentCardData = null;
      if (cardNumber && cardHolderName && expiryMonth && expiryYear && cvv) {
        paymentCardData = {
          cardNumber: cardNumber.replace(/\D/g, ''), 
          cardHolderName,
          expiryMonth,
          expiryYear,
          cvv,
          billingAddress: billingAddress || undefined,
        };
      }

      
      const userData = {
        name: username,
        email,
        password,
        phone: phone || undefined,
        address: address || undefined,
        payment: paymentCardData,
      };

      console.log('Registration: Submitting user data:', { ...userData, password: '[ENCRYPTED]' });

    
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      setSuccess("Account created successfully!");
      setUsername("");
      setEmail("");
      setPassword("");
      setPhone("");
      setAddress("");
      setCardNumber("");
      setCardHolderName("");
      setExpiryMonth("");
      setExpiryYear("");
      setCvv("");
      setBillingAddress("");

      
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backButton} onClick={() => router.back()}>
            ← Back
          </button>
          <h1 style={styles.title}>Create Account</h1>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            style={styles.input}
            type="tel"
            placeholder="Phone Number (Optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            style={styles.input}
            type="text"
            placeholder="Address (Optional)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          
          <div style={{ borderTop: `1px solid ${UGA.border}`, paddingTop: 16, marginTop: 8 }}>
            <h3 style={{ color: UGA.white, marginBottom: 16, fontSize: 18, fontWeight: 600 }}>
              Payment Information (Optional)
            </h3>
            
            <div style={{ padding: '8px 0' }}>
              <input
                style={{
                  ...styles.input,
                  borderColor: cardNumber && !validateCardNumber(cardNumber) ? UGA.red : UGA.border
                }}
                type="text"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                  setCardNumber(value);
                }}
                maxLength={19}
              />
              {cardNumber && !validateCardNumber(cardNumber) && (
                <p style={{ color: UGA.red, fontSize: 14, marginTop: 4 }}>
                  Invalid card number
                </p>
              )}
            </div>

            <div style={{ padding: '8px 0' }}>
              <input
                style={styles.input}
                type="text"
                placeholder="Card Holder Name"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
              />
            </div>

            <div style={{ padding: '8px 0' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <select
                  style={styles.input}
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value)}
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      {String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>

                <select
                  style={styles.input}
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value)}
                >
                  <option value="">Year</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={String(year)}>
                        {year}
                      </option>
                    );
                  })}
                </select>

                <input
                  style={{ ...styles.input, flex: 1 }}
                  type="text"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setCvv(value);
                  }}
                  maxLength={4}
                />
              </div>
            </div>

            <div style={{ padding: '8px 0' }}>
              <input
                style={styles.input}
                type="text"
                placeholder="Billing Address (Optional)"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {error && <p style={{ ...styles.message, ...styles.error }}>{error}</p>}
          {success && <p style={{ ...styles.message, ...styles.success }}>{success}</p>}
        </form>
      </div>
    </div>
  );
}
