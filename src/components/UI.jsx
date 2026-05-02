/* eslint-disable */
import React from "react";

const SUN = "#FF8C00";
const SUN2 = "#FFA833";
const MUTED = "#5A7AB5";
const TEXT = "#F0F6FF";

// ─────────────────────────────────────────
// 🌞 Sun Icon
// ─────────────────────────────────────────
export function SunIcon({ size = 100 }) {
  const c = size / 2;
  const r = size * 0.26;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="sunCore">
          <stop offset="0%" stopColor="#FFF8DC" />
          <stop offset="40%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FF8C00" />
        </radialGradient>
      </defs>

      <g style={{ transformOrigin: `${c}px ${c}px`, animation: "rayRotate 20s linear infinite" }}>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={c + Math.cos(angle) * r}
              y1={c + Math.sin(angle) * r}
              x2={c + Math.cos(angle) * r * 2}
              y2={c + Math.sin(angle) * r * 2}
              stroke="orange"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
      </g>

      <circle cx={c} cy={c} r={r} fill="url(#sunCore)" />
    </svg>
  );
}

// ─────────────────────────────────────────
// 🔝 Top Bar
// ─────────────────────────────────────────
export function TopBar({ title, subtitle, onBack, rightElement }) {
  return (
    <div style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      padding: "12px",
      display: "flex",
      justifyContent: "space-between",
      background: "#0F1B3D",
      borderBottom: "1px solid rgba(255,140,0,0.2)"
    }}>
      <div style={{ display: "flex", gap: 10 }}>
        {onBack && (
          <button onClick={onBack} className="btn-outline">←</button>
        )}

        <div>
          <div className="shimmer-text">{title}</div>
          {subtitle && <div style={{ fontSize: 10, color: MUTED }}>{subtitle}</div>}
        </div>
      </div>

      {rightElement}
    </div>
  );
}

// ─────────────────────────────────────────
// 📊 Stat Box (🔥 FIX ADDED)
// ─────────────────────────────────────────
export function StatBox({ icon, label, value, color = SUN2 }) {
  return (
    <div style={{
      flex: 1,
      textAlign: "center",
      padding: "12px",
      background: "rgba(22,35,71,0.6)",
      border: "1px solid rgba(255,140,0,0.2)",
      borderRadius: 12
    }}>
      <div style={{ fontSize: 18 }}>{icon}</div>
      <div style={{ fontWeight: "bold", color }}>{value}</div>
      <div style={{ fontSize: 10, color: MUTED }}>{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────
// ✨ Particle Background (🔥 FIX ADDED)
// ─────────────────────────────────────────
export function ParticleBg() {
  const particles = Array.from({ length: 12 });

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {particles.map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "rgba(255,200,80,0.7)",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${2 + Math.random() * 3}s infinite`
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// 📦 Card
// ─────────────────────────────────────────
export function Card({ children, onClick }) {
  return (
    <div
      className="glass-card"
      onClick={onClick}
      style={{ padding: 15, marginBottom: 10 }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────
// ⏳ Loader
// ─────────────────────────────────────────
export function FullLoader({ text = "Loading..." }) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#0F1B3D"
    }}>
      <SunIcon size={60} />
      <div className="spinner" />
      <p style={{ color: TEXT }}>{text}</p>
    </div>
  );
}

// ─────────────────────────────────────────
// 🔻 Bottom Navigation
// ─────────────────────────────────────────
export function BottomNav({ activeTab, setTab, isAdmin }) {
  const items = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "charity", label: "Charity", icon: "🏛️" },
    { id: "business", label: "Business", icon: "🛒" },
    { id: "profile", label: "Profile", icon: "👤" },
    ...(isAdmin ? [{ id: "admin", label: "Admin", icon: "⚙️" }] : [])
  ];

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      width: "100%",
      maxWidth: 430,
      display: "flex",
      background: "#0F1B3D",
      borderTop: "1px solid rgba(255,140,0,0.2)"
    }}>
      {items.map(item => {
        const active = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              padding: 10,
              color: active ? SUN2 : MUTED
            }}
          >
            <div>{item.icon}</div>
            <div style={{ fontSize: 10 }}>{item.label}</div>
          </button>
        );
      })}
    </nav>
  );
}
