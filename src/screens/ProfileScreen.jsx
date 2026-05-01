// src/screens/ProfileScreen.jsx
import React from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/UI";
import { colors } from "../styles/theme";

export default function ProfileScreen() {
  const { profile, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("வெளியேறினீர்கள்");
  };

  const infoRows = [
    { label: "பெயர்",     value: profile?.name  || "—" },
    { label: "கைபேசி",   value: profile?.phone || "—" },
    { label: "மின்னஞ்சல்", value: profile?.email || "—" },
    { label: "பாத்திரம்",  value: profile?.role === "admin" ? "⚙️ நிர்வாகி" : "🙏 நன்கொடையாளர்" },
  ];

  return (
    <div style={{ background: "#0F1B3D", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{
        background: "radial-gradient(ellipse at 50% 0%, #1A2F5C 0%, #0F1B3D 70%)",
        padding: "32px 20px 36px",
        textAlign: "center",
        borderBottom: "1px solid rgba(255,140,0,0.15)",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 36,
          background: "linear-gradient(135deg, #FF8C00, #FFA833)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 30, margin: "0 auto 16px",
          boxShadow: "0 0 28px rgba(255,140,0,0.55)",
          animation: "sunRise 0.6s ease forwards",
        }}>🙏</div>
        <div className="shimmer-text" style={{ fontSize: 22, fontWeight: 800 }}>
          {profile?.name || "பெயர் இல்லை"}
        </div>
        <div style={{ color: colors.text.muted, fontSize: 13, marginTop: 4 }}>
          {profile?.role === "admin" ? "⚙️ நிர்வாகி" : "🙏 நன்கொடையாளர்"}
        </div>
      </div>

      <div style={{ padding: "18px 16px 90px" }}>
        {/* Info Card */}
        <Card style={{ marginBottom: 12, animation: "fadeUp 0.4s 0.1s both" }}>
          <div style={{ color: colors.text.muted, fontSize: 10, letterSpacing: 2, fontWeight: 700, marginBottom: 14 }}>
            என் விவரங்கள்
          </div>
          {infoRows.map((r, i) => (
            <React.Fragment key={r.label}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                <span style={{ color: colors.text.muted, fontSize: 13 }}>{r.label}</span>
                <span style={{ color: colors.text.primary, fontWeight: 600, fontSize: 13 }}>{r.value}</span>
              </div>
              {i < infoRows.length - 1 && <div className="divider" style={{ margin: "4px 0" }} />}
            </React.Fragment>
          ))}
        </Card>

        {/* Notification settings */}
        <Card style={{ marginBottom: 12, animation: "fadeUp 0.4s 0.2s both" }}>
          <div style={{ color: colors.text.muted, fontSize: 10, letterSpacing: 2, fontWeight: 700, marginBottom: 12 }}>
            நினைவூட்டல் அமைப்பு
          </div>
          {[
            { l: "1 மாதம் முன்பு", v: "✅ இயக்கப்பட்டது", c: colors.success },
            { l: "1 வாரம் முன்பு", v: "✅ இயக்கப்பட்டது", c: colors.success },
            { l: "அதே தேதி",       v: "✅ இயக்கப்பட்டது", c: colors.success },
          ].map((r) => (
            <div key={r.l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: colors.text.muted, fontSize: 13 }}>{r.l}</span>
              <span style={{ color: r.c, fontWeight: 700, fontSize: 13 }}>{r.v}</span>
            </div>
          ))}
        </Card>

        {/* App info */}
        <div style={{
          padding: "14px", background: "rgba(255,140,0,0.04)",
          border: "1px dashed rgba(255,140,0,0.15)", borderRadius: 12,
          textAlign: "center", marginBottom: 16,
          animation: "fadeUp 0.4s 0.3s both",
        }}>
          <div className="shimmer-text" style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>திருவாசல் v1.0</div>
          <div style={{ color: colors.text.muted, fontSize: 11 }}>AyyaAkilam Platform • பயனர்களுக்கு இலவசம்</div>
        </div>

        <button
          className="btn-outline"
          style={{ width: "100%", padding: "14px", fontSize: 14, color: colors.error, borderColor: colors.errorBorder }}
          onClick={handleLogout}
        >
          🚪 வெளியேறு
        </button>
      </div>
    </div>
  );
}
