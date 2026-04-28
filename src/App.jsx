// src/App.jsx
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { FullLoader, TopBar, BottomNav } from "./components/UI";
import LoginScreen    from "./screens/LoginScreen";
import HomeScreen     from "./screens/HomeScreen";
import CharityScreen  from "./screens/CharityScreen";
import BusinessScreen from "./screens/BusinessScreen";
import ProfileScreen  from "./screens/ProfileScreen";
import AdminScreen    from "./screens/AdminScreen";
import "./styles/global.css";

function InnerApp() {
  const { user, loading, isAdmin } = useAuth();
  const [tab, setTab] = useState("home");

  if (loading) return <FullLoader text="திருவாசல் ஏற்றுகிறது..." />;
  if (!user)   return <LoginScreen />;

  const screenMeta = {
    home:     { title: "திருவாசல்",      sub: "ஐயா அகிலம் • AyyaAkilam" },
    charity:  { title: "🏛️ தருமநிலயம்", sub: "நன்கொடை மேலாண்மை" },
    business: { title: "🛒 வர்த்தகம்",   sub: "வணிக பட்டியல்" },
    profile:  { title: "👤 சுயவிவரம்",   sub: "என் கணக்கு" },
    admin:    { title: "⚙️ நிர்வாகம்",   sub: "Admin Dashboard" },
  };
  const meta = screenMeta[tab] || screenMeta.home;

  return (
    <div className="app-shell">
      <TopBar
        title={meta.title}
        subtitle={meta.sub}
        rightElement={
          <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
            <div style={{
              background: "rgba(255,152,0,0.15)",
              border: "1px solid rgba(255,152,0,0.35)",
              borderRadius: 20, padding: "4px 10px",
              color: "#FF9800", fontSize: 11, fontWeight: 700,
            }}>🔔</div>
            <button className="btn-outline" style={{ padding: "5px 9px", fontSize: 10 }}>EN</button>
          </div>
        }
      />

      <div style={{ paddingBottom: 62, minHeight: "calc(100vh - 52px)" }}>
        {tab === "home"     && <HomeScreen setTab={setTab} />}
        {tab === "charity"  && <CharityScreen />}
        {tab === "business" && <BusinessScreen />}
        {tab === "profile"  && <ProfileScreen />}
        {tab === "admin"    && isAdmin  && <AdminScreen />}
        {tab === "admin"    && !isAdmin && (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#5A7AB5" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
            <div>நிர்வாகி மட்டும் அணுக முடியும்</div>
          </div>
        )}
      </div>

      <BottomNav activeTab={tab} setTab={setTab} isAdmin={isAdmin} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <InnerApp />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#162347",
            color: "#F0F6FF",
            border: "1px solid rgba(255,140,0,0.3)",
            borderRadius: "12px",
            fontSize: "14px",
            fontFamily: "'Noto Sans Tamil', 'Poppins', sans-serif",
            maxWidth: "360px",
          },
          success: { iconTheme: { primary: "#FF8C00", secondary: "#0F1B3D" } },
          error:   { iconTheme: { primary: "#EF4444", secondary: "#0F1B3D" } },
        }}
      />
    </AuthProvider>
  );
}  const pendingCount = 0; // will be populated via context if needed

  return (
    <div className="app-shell">
      {/* Global Top Bar */}
      <TopBar
        title={meta.title}
        subtitle={meta.sub}
        rightElement={
          <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
            {/* Notification badge */}
            <div style={{
              background: "rgba(255,152,0,0.15)",
              border: "1px solid rgba(255,152,0,0.35)",
              borderRadius: 20, padding: "4px 10px",
              color: "#FF9800", fontSize: 11, fontWeight: 700,
            }}>🔔</div>
            {/* Language toggle */}
            <button className="btn-outline" style={{ padding: "5px 9px", fontSize: 10 }}>EN</button>
          </div>
        }
      />

      {/* Screen Switcher */}
      <div style={{ paddingBottom: 62, minHeight: "calc(100vh - 52px)" }}>
        {tab === "home"     && <HomeScreen setTab={setTab} />}
        {tab === "charity"  && <CharityScreen />}
        {tab === "business" && <BusinessScreen />}
        {tab === "profile"  && <ProfileScreen />}
        {tab === "admin"    && isAdmin && <AdminScreen />}
        {tab === "admin"    && !isAdmin && (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#5A7AB5" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
            <div>நிர்வாகி மட்டும் அணுக முடியும்</div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={tab} setTab={setTab} isAdmin={isAdmin} />
    </div>
  );
}

// ── Root App with Providers ───────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <InnerApp />

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#162347",
            color: "#F0F6FF",
            border: "1px solid rgba(255,140,0,0.3)",
            borderRadius: "12px",
            fontSize: "14px",
            fontFamily: "'Noto Sans Tamil', 'Poppins', sans-serif",
            maxWidth: "360px",
          },
          success: {
            iconTheme: { primary: "#FF8C00", secondary: "#0F1B3D" },
          },
          error: {
            iconTheme: { primary: "#EF4444", secondary: "#0F1B3D" },
          },
        }}
      />
    </AuthProvider>
  );
}
