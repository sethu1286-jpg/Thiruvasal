// src/screens/BusinessScreen.jsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { subscribeToBusinesses, addBusiness, toggleBusiness } from "../services/firebase";
import { Card, ModalSheet, Field, EmptyState } from "../components/UI";
import { colors } from "../styles/theme";

const CATEGORIES = ["🌸 மலர்", "🍱 உணவு", "🪔 பூஜை", "✨ அலங்காரம்", "🎵 இசை", "📷 புகைப்படம்", "🚗 போக்குவரத்து", "💈 மற்றவை"];

export default function BusinessScreen() {
  const { profile, isAdmin } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [showReg, setShowReg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", service: "", price: "", phone: "", category: CATEGORIES[0], plan: "free" });

  useEffect(() => {
    const unsub = subscribeToBusinesses(setBusinesses);
    return unsub;
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleRegister = async () => {
    if (!form.name || !form.service || !form.phone) {
      toast.error("அனைத்து தகவல்களும் தேவை");
      return;
    }
    setLoading(true);
    const { error } = await addBusiness({ ...form, ownerId: profile?.uid });
    if (error) { toast.error(error); } else { toast.success("வணிகம் பதிவு செய்யப்பட்டது! 🎉"); setShowReg(false); setForm({ name: "", service: "", price: "", phone: "", category: CATEGORIES[0], plan: "free" }); }
    setLoading(false);
  };

  const handleToggle = async (id, current) => {
    const { error } = await toggleBusiness(id, !current);
    if (error) toast.error(error);
    else toast.success(!current ? "இயக்கப்பட்டது" : "முடக்கப்பட்டது");
  };

  const premium = businesses.filter((b) => b.plan === "paid");
  const free    = businesses.filter((b) => b.plan === "free");

  return (
    <div style={{ background: "#0F1B3D", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        background: "radial-gradient(ellipse at 50% 0%, #0A2040 0%, #0F1B3D 70%)",
        padding: "20px 20px 22px",
        borderBottom: "1px solid rgba(74,159,255,0.18)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#4A9FFF", fontFamily: "'Cinzel', serif" }}>🛒 வர்த்தகம்</div>
            <div style={{ color: colors.text.muted, fontSize: 11, marginTop: 2 }}>வணிக பட்டியல் — {businesses.length} வணிகங்கள்</div>
          </div>
          <button className="btn-sun" style={{ padding: "9px 14px", fontSize: 13 }} onClick={() => setShowReg(true)}>
            ➕ பதிவு
          </button>
        </div>

        {/* Premium promo */}
        <div style={{
          marginTop: 16, padding: "13px 15px",
          background: "linear-gradient(135deg, rgba(255,140,0,0.1), rgba(10,22,40,0.9))",
          border: "1px solid rgba(255,140,0,0.25)", borderRadius: 13,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ color: "#FFA833", fontWeight: 800, fontSize: 13 }}>⭐ Premium பட்டியல்</div>
            <div style={{ color: colors.text.muted, fontSize: 11, marginTop: 2 }}>முன்னிலையில் காட்சி • அதிக வாடிக்கையாளர்கள்</div>
          </div>
          <div className="shimmer-text" style={{ fontSize: 18, fontWeight: 900 }}>₹299<span style={{ fontSize: 11, WebkitTextFillColor: colors.text.muted }}>/மாதம்</span></div>
        </div>
      </div>

      <div style={{ padding: "14px 16px 90px" }} className="scroll-y">

        {/* Premium section */}
        {premium.length > 0 && (
          <>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "rgba(255,168,51,0.6)", fontWeight: 700, marginBottom: 10 }}>⭐ PREMIUM பட்டியல்கள்</div>
            <div className="stagger-children">
              {premium.map((b) => (
                <BusinessCard key={b.id} b={b} isAdmin={isAdmin} onToggle={handleToggle} />
              ))}
            </div>
          </>
        )}

        {/* Free section */}
        {free.length > 0 && (
          <>
            <div style={{ fontSize: 10, letterSpacing: 2, color: colors.text.muted, fontWeight: 700, marginBottom: 10, marginTop: premium.length > 0 ? 18 : 0 }}>
              🆓 இலவச பட்டியல்கள்
            </div>
            <div className="stagger-children">
              {free.map((b) => (
                <BusinessCard key={b.id} b={b} isAdmin={isAdmin} onToggle={handleToggle} />
              ))}
            </div>
          </>
        )}

        {businesses.length === 0 && (
          <EmptyState icon="🛒" text="வணிகங்கள் இல்லை — முதலில் பதிவு செய்யுங்கள்!" />
        )}
      </div>

      {/* Registration Modal */}
      <ModalSheet open={showReg} onClose={() => setShowReg(false)} title="வணிகம் பதிவு செய்க">
        <div style={{ color: colors.text.muted, fontSize: 12, marginBottom: 18 }}>உங்கள் வணிக விவரங்களை உள்ளிடுக</div>

        <Field label="வணிக பெயர் *"><input className="field-input" placeholder="உங்கள் கடை பெயர்" value={form.name} onChange={set("name")} /></Field>
        <Field label="சேவை / பொருள் *"><input className="field-input" placeholder="என்ன விற்கிறீர்கள்?" value={form.service} onChange={set("service")} /></Field>
        <Field label="விலை"><input className="field-input" placeholder="₹100 முதல்" value={form.price} onChange={set("price")} /></Field>
        <Field label="தொலைபேசி *"><input className="field-input" placeholder="9XXXXXXXXX" type="tel" maxLength={10} value={form.phone} onChange={set("phone")} /></Field>

        <Field label="வகை">
          <select className="field-input" value={form.category} onChange={set("category")} style={{ appearance: "none" }}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <Field label="திட்டம்">
          <div style={{ display: "flex", gap: 8 }}>
            {[["free", "🆓 இலவசம்", "அடிப்படை காட்சி"], ["paid", "⭐ Premium", "₹299/மாதம்"]].map(([val, label, sub]) => (
              <div key={val} onClick={() => setForm((f) => ({ ...f, plan: val }))} style={{
                flex: 1, padding: "11px 8px", borderRadius: 11, cursor: "pointer", textAlign: "center",
                border: `1.5px solid ${form.plan === val ? "#FF8C00" : "rgba(255,140,0,0.18)"}`,
                background: form.plan === val ? "rgba(255,140,0,0.1)" : "transparent",
                transition: "all 0.2s",
              }}>
                <div style={{ fontWeight: 700, color: form.plan === val ? "#FFA833" : colors.text.muted, fontSize: 13 }}>{label}</div>
                <div style={{ fontSize: 10, color: colors.text.muted, marginTop: 2 }}>{sub}</div>
              </div>
            ))}
          </div>
        </Field>

        <button className="btn-sun" disabled={loading} style={{ width: "100%", padding: "14px", fontSize: 15, marginTop: 6 }} onClick={handleRegister}>
          {loading ? "பதிவு செய்கிறது..." : "✅ பதிவு செய்க"}
        </button>
      </ModalSheet>
    </div>
  );
}

// ── Business Card ─────────────────────────────────────
function BusinessCard({ b, isAdmin, onToggle }) {
  return (
    <Card style={{ borderLeft: b.plan === "paid" ? `3px solid #FF8C00` : `3px solid rgba(74,159,255,0.3)` }}>
      {b.plan === "paid" && <div style={{ marginBottom: 8 }}><span className="badge-premium">⭐ Premium</span></div>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flex: 1 }}>
          <div style={{ fontSize: 26 }}>{b.category?.split(" ")[0] || "🛒"}</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: colors.text.primary, fontWeight: 700, fontSize: 14 }}>{b.name}</div>
            <div style={{ color: colors.text.muted, fontSize: 12, marginTop: 1 }}>{b.service}</div>
            <div style={{ fontSize: 11, color: colors.text.muted, marginTop: 2 }}>{b.category}</div>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div className="shimmer-text" style={{ fontWeight: 800, fontSize: 13 }}>{b.price || "—"}</div>
          <div style={{ color: "#4A9FFF", fontSize: 12, marginTop: 4 }}>📞 {b.phone}</div>
          {isAdmin && (
            <button
              onClick={() => onToggle(b.id, b.isActive)}
              style={{
                marginTop: 6, padding: "3px 10px", borderRadius: 6,
                background: b.isActive ? colors.errorBg : colors.successBg,
                border: `1px solid ${b.isActive ? colors.errorBorder : colors.successBorder}`,
                color: b.isActive ? colors.error : colors.success,
                fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}
            >{b.isActive ? "முடக்கு" : "இயக்கு"}</button>
          )}
        </div>
      </div>
    </Card>
  );
}
