'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

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
  loading: {
    textAlign: "center",
    padding: 48,
    color: UGA.gray,
    fontSize: 18,
  },
  error: {
    textAlign: "center",
    padding: 48,
    color: UGA.red,
    fontSize: 18,
  },
};

//write the page
export default function RegistrationPage() {
    //backend stuff
    const params = useParams();
    const router = useRouter();
    
    //frontend stuff
    return(
        <div></div>
    );
}