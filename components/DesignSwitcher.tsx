"use client";

import { useState } from "react";
import Link from "next/link";

interface DesignSwitcherProps {
  current: "concept-1" | "skybloom";
}

export default function DesignSwitcher({ current }: DesignSwitcherProps) {
  const [minimized, setMinimized] = useState(false);

  return (
    <aside
      aria-label="Design Concept Switcher"
      style={{
        position: "fixed",
        top: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: minimized ? "6px 12px" : "6px 8px 6px 14px",
        background: "rgba(11, 19, 32, 0.88)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        borderRadius: "9999px",
        boxShadow: "0 12px 36px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(16, 185, 129, 0.15)",
        fontFamily: "var(--font-display, sans-serif)",
        fontSize: "12px",
        color: "#f1f5f9",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#10b981",
            boxShadow: "0 0 10px #10b981",
            animation: "pulse 2s infinite",
          }}
        />
        {!minimized && (
          <span style={{ fontWeight: 600, letterSpacing: "0.04em", color: "#94a3b8", marginRight: "4px" }}>
            DSR LAB:
          </span>
        )}
      </div>

      {!minimized && (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Link
            href="/"
            style={{
              padding: "5px 12px",
              borderRadius: "9999px",
              textDecoration: "none",
              fontWeight: current === "skybloom" ? 600 : 500,
              fontSize: "12px",
              color: current === "skybloom" ? "#ffffff" : "#94a3b8",
              background:
                current === "skybloom"
                  ? "linear-gradient(135deg, #10b981 0%, #0284c7 100%)"
                  : "transparent",
              boxShadow:
                current === "skybloom"
                  ? "0 2px 12px rgba(16, 185, 129, 0.35)"
                  : "none",
              transition: "all 0.2s ease",
            }}
          >
            🌿 Concept 2: Skybloom (New)
          </Link>

          <Link
            href="/concept-1"
            style={{
              padding: "5px 12px",
              borderRadius: "9999px",
              textDecoration: "none",
              fontWeight: current === "concept-1" ? 600 : 500,
              fontSize: "12px",
              color: current === "concept-1" ? "#ffffff" : "#94a3b8",
              background:
                current === "concept-1"
                  ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                  : "transparent",
              boxShadow:
                current === "concept-1"
                  ? "0 2px 12px rgba(59, 130, 246, 0.35)"
                  : "none",
              transition: "all 0.2s ease",
            }}
          >
            ⚡ Concept 1: Particle Swarm
          </Link>
        </div>
      )}

      <button
        onClick={() => setMinimized(!minimized)}
        title={minimized ? "Expand design switcher" : "Minimize switcher"}
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          border: "none",
          borderRadius: "50%",
          width: "22px",
          height: "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          cursor: "pointer",
          fontSize: "10px",
          marginLeft: "2px",
        }}
      >
        {minimized ? "➕" : "✕"}
      </button>
    </aside>
  );
}
