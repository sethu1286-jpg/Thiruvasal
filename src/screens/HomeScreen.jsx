import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { subscribeToDonors } from "../services/firebase";
import { SunIcon, StatBox, Card, ParticleBg } from "../components/UI";
import { colors } from "../styles/theme";
import { StatBox } from "../components/UI.jsx";

export default function HomeScreen({ setTab }) {
  const { profile = {} } = useAuth(); // ✅ safe default
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    const unsub = subscribeToDonors((data) => setDonors(data || []));
    return () => unsub && unsub(); // ✅ safe cleanup
  }, []);

  // ✅ Optimized calculations
  const stats = useMemo(() => {
    const paid = donors.filter(d => d.status === "paid");
    const pending = donors.filter(d => d.status === "pending");
    const total = paid.reduce((s, d) => s + (d.amount || 0), 0);

    const myDonations = donors.filter(d => d.phone === profile.phone);
    const myPaid = myDonations.filter(d => d.status === "paid");
    const myTotal = myPaid.reduce((s, d) => s + (d.amount || 0), 0);

    return {
      paid,
      pending,
      total,
      myDonations,
      myPaid,
      myTotal
    };
  }, [donors, profile.phone]);

  return (
    <div className="scroll-y" style={{ minHeight: "calc(100vh - 60px)", paddingBottom: 90 }}>

      {/* HERO */}
      <div style={{
        background: "radial-gradient(ellipse at 50% 0%, #1E2F5C 0%, #0F1B3D 55%, #0A1020 100%)",
        padding: "28px 20px 36px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <ParticleBg />

        <div className="sun-glow animate-fadeUp">
          <SunIcon size={96} />
        </div>

        <div style={{ marginTop: 14 }}>
          <div className="shimmer-text" style={{ fontSize: 28, fontWeight: 900 }}>
            திருவாசல்
          </div>
          <div style={{ color: "rgba(155,181,224,0.55)", fontSize: 12 }}>
            வணக்கம், {profile.name || "நண்பரே"} 🙏
          </div>
        </div>

        {/* STATS */}
        <div style={{ display: "flex", gap: 9, marginTop: 22 }}>
          <StatBox icon="👥" label="நன்கொடையாளர்" value={donors.length} />
          <StatBox icon="⏳" label="நிலுவை" value={stats.pending.length} color="#FF9800" />
          <StatBox
            icon="💰"
            label="வசூல்"
            value={`₹${stats.total >= 1000 ? (stats.total / 1000).toFixed(0) + "K" : stats.total}`}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "18px 16px 0" }}>

        {/* PROFILE CARD */}
        <Card style={{
          background: "linear-gradient(135deg, rgba(255,140,0,0.14), rgba(22,35,71,0.9))",
          borderColor: "rgba(255,140,0,0.35)"
        }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 25,
              background: "linear-gradient(135deg, #FF8C00, #FFA833)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>🙏</div>

            <div style={{ flex: 1 }}>
              <div className="shimmer-text">{profile.name || "பெயர் இல்லை"}</div>
              <div style={{ fontSize: 11, color: colors.text.muted }}>
                📞 {profile.phone || "—"}
              </div>
            </div>
          </div>

          <div className="divider" />

          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <StatMini label="என் நன்கொடை" value={`₹${stats.myTotal}`} />
            <StatMini label="வழங்கியது" value={stats.myPaid.length} />
            <StatMini label="நிலுவை" value={stats.myDonations.length - stats.myPaid.length} />
          </div>
        </Card>

        {/* ACTIONS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
          <ActionTile icon="🏛️" title="தருமநிலயம்" onClick={() => setTab("charity")} />
          <ActionTile icon="🛒" title="வர்த்தகம்" onClick={() => setTab("business")} />
        </div>

        {/* ALERT */}
        {stats.pending.length > 0 && (
          <div onClick={() => setTab("charity")} className="animate-fadeUp" style={{
            marginTop: 12, padding: 14, borderRadius: 14,
            background: "rgba(255,152,0,0.08)",
            border: "1px solid rgba(255,152,0,0.3)",
            cursor: "pointer"
          }}>
            🔔 {stats.pending.length} நிலுவை நன்கொடைகள்
          </div>
        )}
      </div>
    </div>
  );
}

/* Small reusable components */

function StatMini({ label, value }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontWeight: 900 }}>{value}</div>
      <div style={{ fontSize: 10 }}>{label}</div>
    </div>
  );
}

function ActionTile({ icon, title, onClick }) {
  return (
    <button onClick={onClick} className="glass-card" style={{ padding: 16 }}>
      <div style={{ fontSize: 26 }}>{icon}</div>
      <div>{title}</div>
    </button>
  );
}
