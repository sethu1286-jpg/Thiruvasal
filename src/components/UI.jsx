/* eslint-disable */
import React from "react";

const SUN = "#FF8C00";
const SUN2 = "#FFA833";
const MUTED = "#5A7AB5";

// ☀️ Sun Icon
export function SunIcon({ size = 100 }) {
  const c = size / 2;
  const r = size * 0.26;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={c} cy={c} r={r} fill="orange" />
    </svg>
  );
}

// 🔝 Top Bar
export function TopBar({ title, subtitle, onBack, rightElement }) {
  return (
    <div style={{
      position: "sticky", top: 0, padding: 12,
      display: "flex", justifyContent: "space-between",
      background: "#0F1B3D",
      borderBottom: "1px solid rgba(255,140,0,0.2)"
    }}>
      <div>
        <div className="shimmer-text">{title}</div>
        {subtitle && <div style={{ fontSize: 10, color: MUTED }}>{subtitle}</div>}
      </div>
      {rightElement}
    </div>
  );
}

// 📊 Stat Box
export function StatBox({ icon, label, value, color = "#FFA833" }) {
  return (
    <div style={{
      flex: 1, textAlign: "center", padding: 12,
      background: "rgba(22,35,71,0.6)",
      border: "1px solid rgba(255,140,0,0.2)",
      borderRadius: 12
    }}>
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: "bold", color }}>{value}</div>
      <div style={{ fontSize: 10, color: MUTED }}>{label}</div>
    </div>
  );
}

// 🧾 Card
export function Card({ children, onClick, style }) {
  return (
    <div className="glass-card" onClick={onClick} style={{ padding: 15, marginBottom: 10, ...style }}>
      {children}
    </div>
  );
}

// 🈳 Empty State
export function EmptyState({ message }) {
  return (
    <div className="empty-state">
      <p>{message || "No items found."}</p>
    </div>
  );
}

// 🗨️ Confirm Dialog
export function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 999
    }}>
      <div className="glass-card" style={{ padding: 24, maxWidth: 300, textAlign: "center" }}>
        <p style={{ marginBottom: 20 }}>{message}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onCancel} style={{
            padding: "8px 20px", borderRadius: 8,
            background: "rgba(255,255,255,0.1)", border: "none", color: "#fff"
          }}>ரத்து</button>
          <button onClick={onConfirm} style={{
            padding: "8px 20px", borderRadius: 8,
            background: "#FF8C00", border: "none", color: "#fff", fontWeight: "bold"
          }}>உறுதி</button>
        </div>
      </div>
    </div>
  );
}

// 📋 Modal Sheet
export function ModalSheet({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      zIndex: 999
    }}>
      <div className="glass-card" style={{
        width: "100%", maxWidth: 430,
        borderRadius: "20px 20px 0 0",
        padding: 24, maxHeight: "80vh", overflowY: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <div className="shimmer-text" style={{ fontWeight: 900 }}>{title}</div>
          <button onClick={onClose} style={{
            background: "none", border: "none",
            color: "#FFA833", fontSize: 20, cursor: "pointer"
          }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// 🔄 Full Loader
export function FullLoader({ text = "Loading..." }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#0F1B3D"
    }}>
      <SunIcon size={60} />
      <div className="spinner" />
      <p style={{ color: MUTED }}>{text}</p>
    </div>
  );
}

// 🌌 Particle Background
export function ParticleBg() {
  const particles = Array.from({ length: 15 });
  return (
    <div style={{
      position: "absolute", inset: 0,
      overflow: "hidden", pointerEvents: "none"
    }}>
      {particles.map((_, i) => (
        <div key={i} style={{
          position: "absolute", width: 3, height: 3,
          background: "#FFA833", borderRadius: "50%",
          top: Math.random() * 100 + "%",
          left: Math.random() * 100 + "%",
          opacity: 0.6
        }} />
      ))}
    </div>
  );
}

// 📱 Bottom Navigation
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
      position: "fixed", bottom: 0,
      width: "100%", maxWidth: 430,
      display: "flex", background: "#0F1B3D",
      borderTop: "1px solid rgba(255,140,0,0.2)"
    }}>
      {items.map(item => {
        const active = activeTab === item.id;
        return (
          <button key={item.id} onClick={() => setTab(item.id)} style={{
            flex: 1, background: "none", border: "none",
            color: active ? SUN2 : MUTED, padding: 8
          }}>
            <div>{item.icon}</div>
            <div style={{ fontSize: 10 }}>{item.label}</div>
          </button>
        );
      })}
    </nav>
  );
}
