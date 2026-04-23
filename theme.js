// src/styles/theme.js
// Design tokens — Blue + Orange Sun palette

export const colors = {
  // ── Background Blues ──────────────────────────────
  bg: {
    base:   "#0A1628",   // deepest blue-black
    deep:   "#0F1B3D",   // main app background
    mid:    "#162347",   // card backgrounds
    surface:"#1C2D5A",   // elevated surfaces
    overlay:"#223068",   // modals, overlays
    card:   "rgba(22,35,71,0.85)", // semi-transparent card
  },

  // ── Orange Sun Accents ────────────────────────────
  sun: {
    core:   "#FF8C00",   // pure sun orange
    bright: "#FFA833",   // warm highlight
    light:  "#FFD080",   // soft gold-orange
    pale:   "#FFF3D6",   // very light tint
    glow:   "rgba(255,140,0,0.35)",
    glow2:  "rgba(255,140,0,0.12)",
  },

  // ── Blue Accents ──────────────────────────────────
  blue: {
    bright: "#4A9FFF",
    mid:    "#2D7FE8",
    soft:   "rgba(74,159,255,0.15)",
    border: "rgba(74,159,255,0.25)",
  },

  // ── Status ────────────────────────────────────────
  success: "#22C55E",
  successBg: "rgba(34,197,94,0.12)",
  successBorder: "rgba(34,197,94,0.25)",
  warning: "#FF9800",
  warningBg: "rgba(255,152,0,0.12)",
  warningBorder: "rgba(255,152,0,0.25)",
  error: "#EF4444",
  errorBg: "rgba(239,68,68,0.12)",
  errorBorder: "rgba(239,68,68,0.25)",

  // ── Text ──────────────────────────────────────────
  text: {
    primary:  "#F0F6FF",
    secondary:"#9BB5E0",
    muted:    "#5A7AB5",
    accent:   "#FFA833",
    onSun:    "#0A1628",
  },

  // ── Borders ───────────────────────────────────────
  border: {
    default: "rgba(255,140,0,0.2)",
    bright:  "rgba(255,140,0,0.45)",
    blue:    "rgba(74,159,255,0.2)",
  },
};

export const fonts = {
  display: "'Cinzel', serif",
  body:    "'Noto Sans Tamil', 'Poppins', sans-serif",
};

export const shadows = {
  sunGlow:  "0 0 30px rgba(255,140,0,0.3), 0 0 60px rgba(255,140,0,0.12)",
  sunGlow2: "0 0 50px rgba(255,140,0,0.45), 0 0 90px rgba(255,140,0,0.18)",
  card:     "0 4px 24px rgba(0,0,0,0.35)",
  modal:    "0 20px 60px rgba(0,0,0,0.7)",
  btn:      "0 4px 20px rgba(255,140,0,0.45)",
};

export const radii = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  xxl:"28px",
  full:"9999px",
};

export const breakpoints = {
  mobile: "430px",
};
