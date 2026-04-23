// src/screens/HomeScreen.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { subscribeToDonors } from "../services/firebase";
import { SunIcon, StatBox, Card, ParticleBg } from "../components/UI";
import { colors } from "../styles/theme";

export default function HomeScreen({ setTab }) {
  const { profile } = useAuth();
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    const unsub = subscribeToDonors(setDonors);
    return unsub;
  }, []);

  const paid    = donors.filter((d) => d.status === "paid");
  const pending = donors.filter((d) => d.status === "pending");
  const total   = paid.reduce((s, d) => s + (d.amount || 0), 0);

  const myDonations = donors.filter(
    (d) => d.phone === profile?.phone
  );
  const myPaid    = myDonations.filter((d) => d.status === "paid");
  const myTotal   = myPaid.reduce((s, d) => s + (d.amount || 0), 0);

  return (
    <div className="scroll-y" style={{ minHeight: "calc(100vh - 60px)", paddingBottom: 90 }}>

      {/* ── Hero Section ───────────────────────────── */}
      <div style={{
        background: "radial-gradient(ellipse at 50% 0%, #1E2F5C 0%, #0F1B3D 55%, #0A1020 100%)",
        padding: "28px 20px 36px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <ParticleBg />

        {/* Horizon glow */}
        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "140%", height: 60,
          background: "linear-gradient(0deg, rgba(255,140,0,0.08) 0%, transparent 100%)",
          borderRadius: "50%", filter: "blur(12px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,140,0,0.4), transparent)",
        }} />

        {/* App identity */}
        <div style={{ fontSize: 9, letterSpacing: 4, color: "rgba(255,168,51,0.5)", marginBottom: 12, fontFamily: "'Cinzel', serif" }}>
          ஐயா அகிலம் • AYYAAKILAM
        </div>

        {/* Animated Sun */}
        <div className="sun-glow" style={{
          display: "inline-block", borderRadius: "50%",
          animation: "sunRise 0.7s ease forwards, sunPulse 4s 0.7s ease-in-out infinite",
        }}>
          <SunIcon size={96} />
        </div>

        <div style={{ marginTop: 14, animation: "fadeUp 0.5s 0.2s both" }}>
          <div className="shimmer-text" style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Cinzel', serif" }}>
            திருவாசல்
          </div>
          <div style={{ color: "rgba(155,181,224,0.55)", fontSize: 12, marginTop: 4 }}>
            வணக்கம், {profile?.name || "நண்பரே"} 🙏
          </div>
        </div>

        {/* Global Stats Row */}
        <div style={{ display: "flex", gap: 9, marginTop: 22, animation: "fadeUp 0.5s 0.35s both" }}>
          <StatBox icon="👥" label="நன்கொடையாளர்" value={donors.length} />
          <StatBox icon="⏳" label="நிலுவை" value={pending.length} color="#FF9800" />
          <StatBox icon="💰" label="வசூல்" value={`₹${total >= 1000 ? (total/1000).toFixed(0)+"K" : total}`} />
        </div>
      </div>

      {/* ── My Donor Card ──────────────────────────── */}
      <div style={{ padding: "18px 16px 0" }}>
        <Card glow style={{
          background: "linear-gradient(135deg, rgba(255,140,0,0.14) 0%, rgba(22,35,71,0.9) 100%)",
          borderColor: "rgba(255,140,0,0.35)",
          animation: "fadeUp 0.45s 0.1s both",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 25,
              background: "linear-gradient(135deg, #FF8C00, #FFA833)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, flexShrink: 0,
              boxShadow: "0 0 18px rgba(255,140,0,0.5)",
            }}>🙏</div>
            <div style={{ flex: 1 }}>
              <div className="shimmer-text" style={{ fontWeight: 800, fontSize: 16 }}>
                {profile?.name || "பெயர் இல்லை"}
              </div>
              <div style={{ color: colors.text.muted, fontSize: 11, marginTop: 1 }}>
                📞 {profile?.phone || "—"} &nbsp;•&nbsp; {profile?.role === "admin" ? "⚙️ நிர்வாகி" : "🙏 நன்கொடையாளர்"}
              </div>
            </div>
          </div>

          <div className="divider" />

          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {[
              { l: "என் நன்கொடை", v: `₹${myTotal.toLocaleString()}`, c: "#FF8C00" },
              { l: "வழங்கியது",   v: myPaid.length,   c: colors.success },
              { l: "நிலுவை",     v: myDonations.length - myPaid.length, c: "#FF9800" },
            ].map((s) => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 19, fontWeight: 900, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: 10, color: colors.text.muted, marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Main Feature Tiles ─────────────────── */}
        <div style={{ fontSize: 10, letterSpacing: 2, color: colors.text.muted, fontWeight: 700, marginBottom: 10, marginTop: 6 }}>
          முதன்மை சேவைகள்
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
          {[
            { icon: "🏛️", title: "தருமநிலயம்", sub: "நன்கொடை நிர்வாகம்", tab: "charity",  accent: "#FF8C00",  border: "rgba(255,140,0,0.3)",  bg: "rgba(255,140,0,0.06)" },
            { icon: "🛒", title: "வர்த்தகம்",  sub: "வணிக பட்டியல்",     tab: "business", accent: "#4A9FFF",  border: "rgba(74,159,255,0.25)", bg: "rgba(74,159,255,0.05)" },
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => setTab(item.tab)}
              style={{
                background: item.bg,
                border: `1px solid ${item.border}`,
                borderRadius: 17, padding: "20px 14px",
                cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                transition: "transform 0.2s, box-shadow 0.2s",
                animation: "fadeUp 0.4s 0.2s both",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${item.border}`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ fontSize: 30, marginBottom: 10 }}>{item.icon}</div>
              <div style={{ fontWeight: 800, color: item.accent, fontSize: 14, marginBottom: 3 }}>{item.title}</div>
              <div style={{ fontSize: 11, color: colors.text.muted }}>{item.sub}</div>
            </button>
          ))}
        </div>

        {/* ── Pending Alert ──────────────────────── */}
        {pending.length > 0 && (
          <div
            onClick={() => setTab("charity")}
            className="animate-fadeUp"
            style={{
              marginTop: 12, padding: "14px 16px", borderRadius: 14,
              background: "rgba(255,152,0,0.08)",
              border: "1px solid rgba(255,152,0,0.3)",
              borderLeft: "3px solid #FF9800",
              cursor: "pointer",
              display: "flex", alignItems: "center", gap: 12,
            }}
          >
            <div style={{ fontSize: 24, animation: "bounce 2s ease-in-out infinite" }}>🔔</div>
            <div>
              <div style={{ fontWeight: 700, color: "#FF9800", fontSize: 13 }}>
                {pending.length} நிலுவை நன்கொடைகள்
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,152,0,0.6)", marginTop: 1 }}>
                உறுதிப்படுத்தல் தேவை — தொடர்க →
              </div>
            </div>
          </div>
        )}

        {/* ── Inspirational Quote ────────────────── */}
        <div style={{
          marginTop: 12, padding: "16px",
          background: "rgba(255,140,0,0.04)",
          border: "1px dashed rgba(255,140,0,0.18)",
          borderRadius: 13, textAlign: "center",
          animation: "fadeUp 0.4s 0.4s both",
        }}>
          <div style={{ fontSize: 20, marginBottom: 6 }}>🪔</div>
          <div style={{ color: "rgba(255,168,51,0.75)", fontSize: 12, fontStyle: "italic", lineHeight: 1.7 }}>
            "கொடுப்பவன் கோடி இன்பம் பெறுவான்"
          </div>
        </div>
      </div>
    </div>
  );
}
