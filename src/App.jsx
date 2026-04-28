/* eslint-disable */
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

  if (loading) return <FullLoader text="Loading..." />;
  if (!user)   return <LoginScreen />;

  const screenMeta = {
    home:     { title: "Thiruvasal",  sub: "AyyaAkilam" },
    charity:  { title: "Charity",     sub: "Donation Management" },
    business: { title: "Business",    sub: "Listings" },
    profile:  { title: "Profile",     sub: "My Account" },
    admin:    { title: "Admin",       sub: "Dashboard" },
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
              borderRadius: 20,
              padding: "4px 10px",
              color: "#FF9800",
              fontSize: 11,
              fontWeight: 700,
            }}>Bell</div>
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
            <div>Admin access only</div>
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
            fontFamily: "Poppins, sans-serif",
            maxWidth: "360px",
          },
          success: { iconTheme: { primary: "#FF8C00", secondary: "#0F1B3D" } },
          error:   { iconTheme: { primary: "#EF4444", secondary: "#0F1B3D" } },
        }}
      />
    </AuthProvider>
  );
}
