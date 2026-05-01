// src/screens/LoginScreen.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import { registerUser, loginUser } from "../services/firebase";
import { SunIcon, ParticleBg, Field } from "../components/UI";
import { colors } from "../styles/theme";

export default function LoginScreen() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", role: "donor" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      toast.error("மின்னஞ்சல் மற்றும் கடவுச்சொல் தேவை");
      return;
    }
    if (mode === "register" && !form.name) {
      toast.error("பெயர் தேவை");
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        const { error } = await registerUser(form);
        if (error) { toast.error(error); return; }
        toast.success("கணக்கு உருவாக்கப்பட்டது! 🎉");
      } else {
        const { error } = await loginUser({ email: form.email, password: form.password });
        if (error) { toast.error(error); return; }
        toast.success("வணக்கம்! 🙏");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 30%, #162347 0%, #0F1B3D 40%, #0A1020 100%)",
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
    }}>
      <ParticleBg />

      {/* Blue horizon glow */}
      <div style={{
        position: "absolute", bottom: "38%", left: "50%", transform: "translateX(-50%)",
        width: "120%", height: 80,
        background: "linear-gradient(180deg, transparent 0%, rgba(255,140,0,0.06) 100%)",
        borderRadius: "50%",
        filter: "blur(20px)",
        pointerEvents: "none",
      }} />

      {/* Sun Hero Section */}
      <div style={{ padding: "52px 24px 24px", textAlign: "center", position: "relative" }}>
        {/* Pulse rings behind sun */}
        {[100, 140, 180].map((size, i) => (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            width: size, height: size,
            transform: "translate(-50%, -70%)",
            borderRadius: "50%",
            border: `1px solid rgba(255,140,0,${0.25 - i * 0.07})`,
            animation: `ringExpand ${3 + i * 0.7}s ease-out infinite`,
            animationDelay: `${i * 0.9}s`,
            pointerEvents: "none",
          }} />
        ))}

        {/* Horizon line */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,140,0,0.35), transparent)",
        }} />

        <div style={{ display: "inline-block", animation: "sunRise 0.8s cubic-bezier(0.22,1,0.36,1) forwards" }}>
          <SunIcon size={110} />
        </div>

        <div style={{ marginTop: 18, animation: "fadeUp 0.6s 0.3s both" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "rgba(255,168,51,0.6)", marginBottom: 6, fontFamily: "'Cinzel', serif" }}>
            ஐயா அகிலம் • AYYAAKILAM
          </div>
          <div className="shimmer-text" style={{ fontSize: 36, fontWeight: 900, fontFamily: "'Cinzel', serif", lineHeight: 1.1 }}>
            திருவாசல்
          </div>
          <div style={{ color: "rgba(155,181,224,0.6)", fontSize: 13, marginTop: 8 }}>
            கோயில் நன்கொடை மேலாண்மை தளம்
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div style={{
        flex: 1,
        background: "linear-gradient(180deg, rgba(22,35,71,0) 0%, rgba(15,27,61,0.98) 12%)",
        borderRadius: "28px 28px 0 0",
        padding: "28px 22px 44px",
        marginTop: "auto",
        animation: "slideUp 0.5s 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
        borderTop: "1px solid rgba(255,140,0,0.18)",
      }}>
        {/* Mode Toggle */}
        <div style={{
          display: "flex", gap: 0,
          background: "rgba(10,22,40,0.6)",
          borderRadius: 12, padding: 4,
          marginBottom: 22,
          border: "1px solid rgba(255,140,0,0.15)",
        }}>
          {[["login", "உள்நுழைக"], ["register", "பதிவு செய்க"]].map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: "9px", borderRadius: 9,
              border: "none", cursor: "pointer",
              fontFamily: "inherit", fontWeight: 700, fontSize: 13,
              background: mode === m
                ? "linear-gradient(135deg, #FF8C00, #FFA833)"
                : "transparent",
              color: mode === m ? "#0A1628" : colors.text.muted,
              transition: "all 0.25s",
              boxShadow: mode === m ? "0 2px 10px rgba(255,140,0,0.35)" : "none",
            }}>{label}</button>
          ))}
        </div>

        <div className="stagger-children">
          {mode === "register" && (
            <Field label="பெயர் / Name">
              <input className="field-input" placeholder="உங்கள் முழு பெயர்"
                value={form.name} onChange={set("name")} />
            </Field>
          )}
          {mode === "register" && (
            <Field label="கைபேசி / Mobile">
              <input className="field-input" placeholder="9XXXXXXXXX" type="tel" maxLength={10}
                value={form.phone} onChange={set("phone")} />
            </Field>
          )}
          <Field label="மின்னஞ்சல் / Email">
            <input className="field-input" placeholder="you@email.com" type="email"
              value={form.email} onChange={set("email")} />
          </Field>
          <Field label="கடவுச்சொல் / Password">
            <input className="field-input" placeholder="••••••••" type="password"
              value={form.password} onChange={set("password")} />
          </Field>

          {mode === "register" && (
            <Field label="பாத்திரம் / Role">
              <div style={{ display: "flex", gap: 8 }}>
                {[["donor", "🙏 நன்கொடையாளர்"], ["admin", "⚙️ நிர்வாகி"]].map(([val, label]) => (
                  <button key={val} onClick={() => setForm(f => ({ ...f, role: val }))} style={{
                    flex: 1, padding: "10px 8px", borderRadius: 10,
                    border: `1.5px solid ${form.role === val ? "#FF8C00" : "rgba(255,140,0,0.2)"}`,
                    background: form.role === val ? "rgba(255,140,0,0.12)" : "transparent",
                    color: form.role === val ? "#FFA833" : colors.text.muted,
                    fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}>{label}</button>
                ))}
              </div>
            </Field>
          )}
        </div>

        <button
          className="btn-sun"
          disabled={loading}
          onClick={handleSubmit}
          style={{ width: "100%", padding: "15px", fontSize: 16, marginTop: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          {loading ? <><div className="spinner" style={{ width: 18, height: 18, borderTopColor: "#0A1628" }} /> <span>காத்திருக்கவும்...</span></> :
            mode === "login" ? "🔓 உள்நுழைக" : "✨ கணக்கு உருவாக்கு"}
        </button>

        {/* Security note */}
        <div style={{
          marginTop: 20, padding: "11px 14px",
          background: "rgba(255,140,0,0.05)",
          border: "1px dashed rgba(255,140,0,0.18)",
          borderRadius: 10, textAlign: "center",
        }}>
          <div style={{ fontSize: 11, color: colors.text.muted }}>
            🔒 உங்கள் தரவு Firebase மூலம் பாதுகாப்பாக சேமிக்கப்படும்
          </div>
        </div>
      </div>
    </div>
  );
}
