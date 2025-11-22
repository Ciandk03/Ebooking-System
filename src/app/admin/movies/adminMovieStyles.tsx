import React from 'react';

export const UGA = {
  black: '#000000',
  nearBlack: '#0b0b0b',
  dark: '#151515',
  gray: '#d1d5db',
  white: '#ffffff',
  red: '#ba0c2f',
  redDark: '#8a0a23',
  border: '#2a2a2a',
};

export const pageStyle: React.CSSProperties = {
  borderTop: `4px solid ${UGA.red}`,
  padding: 24,
  maxWidth: 1200,
  margin: '0 auto',
  background: UGA.black,
  minHeight: '100vh',
  color: UGA.white,
};

export const headerRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 16,
};

export const titleStyle: React.CSSProperties = { fontSize: 28, fontWeight: 900, letterSpacing: -0.25 };

export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 10,
  borderRadius: 8,
  border: `1px solid ${UGA.border}`,
  background: UGA.dark,
  color: UGA.white,
};

export const primaryButton: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: 8,
  background: `linear-gradient(90deg,${UGA.red},${UGA.redDark})`,
  color: '#fff',
  border: 'none',
  fontWeight: 700,
};

export const secondaryButton: React.CSSProperties = {
  padding: '8px 14px',
  borderRadius: 8,
  background: UGA.nearBlack,
  color: '#cfe7f3',
  border: `1px solid ${UGA.border}`,
};

export const cardStyle: React.CSSProperties = {
  background: UGA.nearBlack,
  padding: 20,
  borderRadius: 12,
  boxShadow: '0 6px 18px rgba(2,6,23,0.6)'
};

export const itemCardStyle: React.CSSProperties = {
  background: UGA.dark,
  borderRadius: 10,
  padding: 12,
  display: 'flex',
  gap: 12,
  alignItems: 'flex-start',
};

export const messageStyle: React.CSSProperties = {
  margin: '12px 0',
  padding: 12,
  background: UGA.dark,
  borderRadius: 8,
  color: '#d7f3ff',
};

export default {};
