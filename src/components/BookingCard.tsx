"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export interface BookingCardProps {
  movieTitle: string;
  showDate: string;
  price: number;
}

export default function BookingCard({ movieTitle, showDate, price }: BookingCardProps) {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ width: "100%" }}
    >
      <div
        style={{
          background: "#0b0b0b",
          padding: 16,
          borderRadius: 12,
          border: "1px solid #2a2a2a",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
        onClick={() => router.push("/admin")}
      >
        <span style={{ fontSize: 16, fontWeight: 600, color: "#ffffff" }}>{movieTitle}</span>
        <span style={{ color: "#d1d5db", fontSize: 14 }}>{showDate}</span>
        <span style={{ color: "#ffffff", fontWeight: 600 }}>${price.toFixed(2)}</span>
      </div>
    </motion.div>
  );
}
