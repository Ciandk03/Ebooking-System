'use client';

import { useState, useEffect } from 'react';
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
  green: "#22c55e",
  yellow: "#f59e0b",
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: UGA.black,
    minHeight: "100vh",
    color: UGA.white,
    padding: 24,
  },
  container: {
    maxWidth: 800,
    margin: "0 auto",
    paddingTop: 20,
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
    gap: 24,
    background: UGA.nearBlack,
    padding: 32,
    borderRadius: 12,
    border: `1px solid ${UGA.border}`,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: UGA.white,
    marginBottom: 8,
    borderBottom: `2px solid ${UGA.red}`,
    paddingBottom: 8,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  inputRow: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
  },
  inputRowItem: {
    flex: 1,
    minWidth: 200,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: UGA.white,
    marginBottom: 4,
  },
  required: {
    color: UGA.red,
  },
  input: {
    padding: "12px 14px",
    borderRadius: 8,
    border: `1px solid ${UGA.border}`,
    background: UGA.dark,
    color: UGA.white,
    fontSize: 16,
    width: "100%",
  },
  inputError: {
    borderColor: UGA.red,
  },
  textarea: {
    padding: "12px 14px",
    borderRadius: 8,
    border: `1px solid ${UGA.border}`,
    background: UGA.dark,
    color: UGA.white,
    fontSize: 16,
    width: "100%",
    minHeight: 80,
    resize: "vertical",
  },
  button: {
    background: UGA.red,
    border: "none",
    color: UGA.white,
    padding: "12px 24px",
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
  buttonSecondary: {
    background: UGA.dark,
    border: `1px solid ${UGA.border}`,
    color: UGA.white,
    padding: "12px 24px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 16,
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
    padding: 12,
    borderRadius: 8,
  },
  error: {
    color: UGA.red,
    background: "rgba(186, 12, 47, 0.1)",
    border: `1px solid ${UGA.red}`,
  },
  success: {
    color: UGA.green,
    background: "rgba(34, 197, 94, 0.1)",
    border: `1px solid ${UGA.green}`,
  },
  warning: {
    color: UGA.yellow,
    background: "rgba(245, 158, 11, 0.1)",
    border: `1px solid ${UGA.yellow}`,
  },
  link: {
    color: UGA.red,
    textDecoration: "none",
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
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  cardItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    background: UGA.dark,
    borderRadius: 8,
    border: `1px solid ${UGA.border}`,
  },
  cardInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: 600,
    color: UGA.white,
  },
  cardDetails: {
    fontSize: 14,
    color: UGA.gray,
  },
  removeButton: {
    background: UGA.red,
    border: "none",
    color: UGA.white,
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
  },
  addCardButton: {
    background: UGA.dark,
    border: `2px dashed ${UGA.border}`,
    color: UGA.gray,
    padding: "16px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    textAlign: "center",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
};

interface PaymentCard {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  billingAddress?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentCards: PaymentCard[];
  subscribeToPromotions: boolean;
  role: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([]);
  const [subscribeToPromotions, setSubscribeToPromotions] = useState(false);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  
  // New card form state
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState<PaymentCard>({
    cardNumber: "",
    cardHolderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    billingAddress: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/Login');
        return;
      }

      const response = await fetch('/api/users/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch profile');
      }

      setProfile(result.data);
      setName(result.data.name);
      setPhone(result.data.phone || '');
      setAddress(result.data.address || '');
      setPaymentCards(result.data.paymentCards || []);
      setSubscribeToPromotions(result.data.subscribeToPromotions || false);
      
    } catch (err) {
      console.error('Fetch profile error:', err);
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (paymentCards.length > 4) {
      setError("Maximum 4 payment cards allowed.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/Login');
        return;
      }

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || undefined,
          address: address.trim() || undefined,
          paymentCards: paymentCards.length > 0 ? paymentCards : undefined,
          subscribeToPromotions,
          currentPassword: newPassword ? currentPassword : undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }

      setSuccess("Profile updated successfully!");
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordSection(false);
      
      // Refresh profile data
      setTimeout(() => {
        fetchProfile();
      }, 1000);

    } catch (err) {
      console.error('Update profile error:', err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const addPaymentCard = () => {
    if (paymentCards.length >= 4) {
      setError("Maximum 4 payment cards allowed.");
      return;
    }

    if (!newCard.cardNumber || !newCard.cardHolderName || !newCard.expiryMonth || !newCard.expiryYear || !newCard.cvv) {
      setError("Please fill in all card fields.");
      return;
    }

    setPaymentCards([...paymentCards, { ...newCard }]);
    setNewCard({
      cardNumber: "",
      cardHolderName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      billingAddress: ""
    });
    setShowAddCard(false);
    setError("");
  };

  const removePaymentCard = (index: number) => {
    setPaymentCards(paymentCards.filter((_, i) => i !== index));
  };

  const formatCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(' ').substring(0, 19);
  };

  const maskCardNumber = (cardNumber: string) => {
    if (!cardNumber || cardNumber.length < 4) return '****';
    return '**** **** **** ' + cardNumber.slice(-4);
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loading}>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.message}>
            <p style={styles.error}>Failed to load profile. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button 
            style={styles.backButton} 
            onClick={() => router.push('/dashboard')}
          >
            ← Back to Dashboard
          </button>
          <h1 style={styles.title}>Edit Profile</h1>
          <p style={styles.subtitle}>Update your personal information</p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Personal Information</h2>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Full Name <span style={styles.required}>*</span>
              </label>
              <input
                style={styles.input}
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                style={{...styles.input, background: UGA.dark, color: UGA.gray, cursor: 'not-allowed'}}
                type="email"
                value={profile.email}
                disabled
                title="Email cannot be changed"
              />
              <p style={{fontSize: 12, color: UGA.gray, margin: 4}}>
                Email address cannot be modified for security reasons
              </p>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                style={styles.input}
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Address Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Billing Address</h2>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Address</label>
              <textarea
                style={styles.textarea}
                placeholder="Enter your billing address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                maxLength={500}
              />
              <p style={{fontSize: 12, color: UGA.gray, margin: 4}}>
                Maximum 1 address allowed
              </p>
            </div>
          </div>

          {/* Payment Cards Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Payment Cards</h2>
            
            <div style={styles.cardContainer}>
              {paymentCards.map((card, index) => (
                <div key={index} style={styles.cardItem}>
                  <div style={styles.cardInfo}>
                    <div style={styles.cardNumber}>
                      {maskCardNumber(card.cardNumber)}
                    </div>
                    <div style={styles.cardDetails}>
                      {card.cardHolderName} • Expires {card.expiryMonth}/{card.expiryYear}
                    </div>
                  </div>
                  <button
                    type="button"
                    style={styles.removeButton}
                    onClick={() => removePaymentCard(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              {paymentCards.length < 4 && (
                <div style={styles.addCardButton} onClick={() => setShowAddCard(true)}>
                  + Add Payment Card ({paymentCards.length}/4)
                </div>
              )}

              {showAddCard && (
                <div style={{...styles.section, background: UGA.dark, padding: 16, borderRadius: 8, border: `1px solid ${UGA.border}`}}>
                  <h3 style={{fontSize: 16, fontWeight: 600, marginBottom: 16}}>Add New Card</h3>
                  
                  <div style={styles.inputRow}>
                    <div style={styles.inputRowItem}>
                      <label style={styles.label}>
                        Card Number <span style={styles.required}>*</span>
                      </label>
                      <input
                        style={styles.input}
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={formatCardNumber(newCard.cardNumber)}
                        onChange={(e) => setNewCard({...newCard, cardNumber: e.target.value.replace(/\D/g, '')})}
                        maxLength={19}
                      />
                    </div>
                    <div style={styles.inputRowItem}>
                      <label style={styles.label}>
                        Cardholder Name <span style={styles.required}>*</span>
                      </label>
                      <input
                        style={styles.input}
                        type="text"
                        placeholder="John Doe"
                        value={newCard.cardHolderName}
                        onChange={(e) => setNewCard({...newCard, cardHolderName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div style={styles.inputRow}>
                    <div style={styles.inputRowItem}>
                      <label style={styles.label}>
                        Expiry Month <span style={styles.required}>*</span>
                      </label>
                      <select
                        style={styles.input}
                        value={newCard.expiryMonth}
                        onChange={(e) => setNewCard({...newCard, expiryMonth: e.target.value})}
                      >
                        <option value="">Month</option>
                        {Array.from({length: 12}, (_, i) => (
                          <option key={i+1} value={String(i+1).padStart(2, '0')}>
                            {String(i+1).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={styles.inputRowItem}>
                      <label style={styles.label}>
                        Expiry Year <span style={styles.required}>*</span>
                      </label>
                      <select
                        style={styles.input}
                        value={newCard.expiryYear}
                        onChange={(e) => setNewCard({...newCard, expiryYear: e.target.value})}
                      >
                        <option value="">Year</option>
                        {Array.from({length: 10}, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div style={styles.inputRowItem}>
                      <label style={styles.label}>
                        CVV <span style={styles.required}>*</span>
                      </label>
                      <input
                        style={styles.input}
                        type="text"
                        placeholder="123"
                        value={newCard.cvv}
                        onChange={(e) => setNewCard({...newCard, cvv: e.target.value.replace(/\D/g, '').substring(0, 4)})}
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Billing Address</label>
                    <textarea
                      style={styles.textarea}
                      placeholder="Enter billing address for this card"
                      value={newCard.billingAddress}
                      onChange={(e) => setNewCard({...newCard, billingAddress: e.target.value})}
                      rows={2}
                    />
                  </div>

                  <div style={{display: 'flex', gap: 12, marginTop: 16}}>
                    <button
                      type="button"
                      style={styles.button}
                      onClick={addPaymentCard}
                    >
                      Add Card
                    </button>
                    <button
                      type="button"
                      style={styles.buttonSecondary}
                      onClick={() => {
                        setShowAddCard(false);
                        setNewCard({
                          cardNumber: "",
                          cardHolderName: "",
                          expiryMonth: "",
                          expiryYear: "",
                          cvv: "",
                          billingAddress: ""
                        });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Password Change Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Security</h2>
            
            {!showPasswordSection ? (
              <button
                type="button"
                style={styles.buttonSecondary}
                onClick={() => setShowPasswordSection(true)}
              >
                Change Password
              </button>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    Current Password <span style={styles.required}>*</span>
                  </label>
                  <input
                    style={styles.input}
                    type="password"
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div style={styles.inputRow}>
                  <div style={styles.inputRowItem}>
                    <label style={styles.label}>
                      New Password <span style={styles.required}>*</span>
                    </label>
                    <input
                      style={styles.input}
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div style={styles.inputRowItem}>
                    <label style={styles.label}>
                      Confirm New Password <span style={styles.required}>*</span>
                    </label>
                    <input
                      style={styles.input}
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{display: 'flex', gap: 12}}>
                  <button
                    type="button"
                    style={styles.buttonSecondary}
                    onClick={() => {
                      setShowPasswordSection(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                  >
                    Cancel Password Change
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Preferences Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Preferences</h2>
            
            <div style={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="promotions"
                style={styles.checkbox}
                checked={subscribeToPromotions}
                onChange={(e) => setSubscribeToPromotions(e.target.checked)}
              />
              <label htmlFor="promotions" style={styles.checkboxLabel}>
                Subscribe to promotional emails and special offers
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(saving ? styles.buttonDisabled : {}),
            }}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          {/* Messages */}
          {error && <div style={{...styles.message, ...styles.error}}>{error}</div>}
          {success && <div style={{...styles.message, ...styles.success}}>{success}</div>}
        </form>
      </div>
    </div>
  );
}

