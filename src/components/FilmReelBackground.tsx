"use client";
import React from "react";

export default function FilmReelBackground() {
  return (
    <div
      style={{
        position: "absolute",
        top: "-50%",
        left: "-50%",
        width: "200%",
        height: "200%",
        backgroundImage: `
          repeating-linear-gradient(
            45deg, 
            rgba(255,255,255,0.08) 0px, 
            rgba(255,255,255,0.08) 20px, 
            transparent 20px, 
            transparent 80px
          ),
          repeating-linear-gradient(
            45deg,
            rgba(186, 12, 47, 0.2) 0px,
            rgba(186, 12, 47, 0.2) 10px,
            transparent 10px,
            transparent 40px
          )
        `,
        backgroundSize: "100px 100px",
        transform: "rotate(-15deg)", 
        zIndex: 0,
      }}
    />
  );
}
