// src/screens/AdminScreen.jsx
import React, { useEffect, useState } from "react";
import {
  subscribeToDonors, subscribeToBusinesses, updateDonorStatus,
  deleteDonor, formatDate,
} from "../services/firebase";
import { Card, StatBox, EmptyState, ConfirmDialog } from "../components/UI";
import { colors } from "../styles/theme";
import toast from "react-hot-toast";

export default function AdminScreen() {
  const [donors, setDonors] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [activeTab, setActiveTab] = useState("overview"); // overview | donors | businesses
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const u1 = subscribeToDonors(setDonors);
    const u2 = subscribeToBusinesses(setBusinesses);
    return () => { u1(); u2(); };
  }, []);

  const paid      = donors.filter((d) => d.status === "paid");
  const pending   = donors.filter((d) => d.status === "pending");
  const totalAmt  = paid.reduce((s, d) => s + (d.amount || 0), 0);
  const premiumB  = businesses.filter((b) => b.plan === "paid");
  const revenue   = premiumB.length * 299;

  const handleMark = async (id, status) => {
    const { error } = await updateDonorStatus(id, status);
    if (error) toast.error(error);
    else toast.success(status === "paid" ? "✅ செலுத்தியது என குறிக்கப்பட்டது" : "⏳ நிலுவை என மாற்றப்பட்டது");
  };

  const handleDelete = async () => {
    const { error } = await deleteDonor(deleteTarget);
    if (error) toast.error(error);
    else toast.success("நீக்கப்பட்டது");
    setDeleteTarget(null);
  };

  const tabs = [
    { id: "overview",   label: "📊 கண்ணோட்டம்" },
    { id: "donors",     label: "👥 நன்கொடையாளர்" },
    { id: "businesses", label: "🛒 வணிகங்கள்" },
  ];

  return (
    <div style={{ background: "#0A1020", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        background: "radial-gradient(ellipse at 50% 0%, #1A0A3C 0%, #0A1020 70%)",
        padding: "20px 20px 22px",
        borderBottom: "1px solid rgba(255,140,0,0.15)",
      }}>
        <div className="shimmer-text" style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Cinzel', serif" }}>⚙️ நிர்வாகம்</div>
        <div style={{ color: colors.text.muted, fontSize: 11, marginTop: 2 }}>Admin Dashboard — உண்மையான நேர தரவு</div>

        {/* Sub-tabs */}
        <div style={{ display: "flex", gap: 6, marginTop: 16, overflowX: "auto" }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: "7px 13px", borderRadius: 20, border: "none", whiteSpace: "nowrap",
              background: activeTab === t.id ? "linear-gradient(135deg,#FF8C00,#FFA833)" : "rgba(255,140,0,0.08)",
              color: activeTab === t.id ? "#0A1628" : colors.text.muted,
              fontWeight: 700, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
              boxShadow: activeTab === t.id ? "0 2px 10px rgba(255,140,0,0.35)" : "none",
              transition: "all 0.2s", flexShrink: 0,
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 16px 90px" }} className="scroll-y">

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="stagger-children">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 4 }}>
              <StatBox icon="✅" label="செலுத்தியது" value={paid.length}    color={colors.success}  bg={colors.successBg}  border={colors.successBorder} />
              <StatBox icon="⏳" label="நிலுவை"     value={pending.length}  color="#FF9800"          bg={colors.warningBg}  border={colors.warningBorder} />
              <StatBox icon="💰" label="வசூல் (₹)"  value={`${totalAmt.toLocaleString()}`} color="#FF8C00" />
              <StatBox icon="🛒" label="வணிகங்கள்"  value={businesses.length} color="#4A9FFF" bg="rgba(74,159,255,0.08)" border="rgba(74,159,255,0.2)" />
            </div>

            {/* Revenue card */}
            <Card style={{ background: "linear-gradient(135deg, rgba(255,140,0,0.1), rgba(10,22,40,0.9))", borderColor: "rgba(255,140,0,0.25)" }}>
              <div style={{ color: colors.text.muted, fontSize: 10, letterSpacing: 2, fontWeight: 700, marginBottom: 10 }}>PLATFORM REVENUE</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div className="shimmer-text" style={{ fontSize: 24, fontWeight: 900 }}>₹{revenue.toLocaleString()}</div>
                  <div style={{ color: colors.text.muted, fontSize: 11, marginTop: 2 }}>மாதாந்திர வருமானம்</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#4A9FFF", fontSize: 18, fontWeight: 800 }}>{premiumB.length}</div>
                  <div style={{ color: colors.text.muted, fontSize: 11, marginTop: 2 }}>Premium கடைகள்</div>
                </div>
              </div>
            </Card>

            {/* Reminder schedule */}
            <Card>
              <div style={{ color: colors.text.muted, fontSize: 10, letterSpacing: 2, fontWeight: 700, marginBottom: 12 }}>
                🔔 தானியங்கி நினைவூட்டல்
              </div>
              {[
                { t: "1 மாதம் முன்பு",  s: "SMS + Push notification" },
                { t: "1 வாரம் முன்பு",  s: "SMS + Push notification" },
                { t: "அதே தேதி",         s: "SMS + Push notification" },
              ].map((r) => (
                <div key={r.t} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: "#FF8C00", flexShrink: 0 }} />
                  <div>
                    <div style={{ color: colors.text.primary, fontSize: 13, fontWeight: 600 }}>{r.t}</div>
                    <div style={{ color: colors.text.muted, fontSize: 11 }}>{r.s}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 8, padding: "8px 10px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8 }}>
                <div style={{ color: colors.success, fontSize: 11, fontWeight: 600 }}>✅ தானியங்கியாக அனுப்பப்படும்</div>
              </div>
            </Card>
          </div>
        )}

        {/* ── DONORS ── */}
        {activeTab === "donors" && (
          <div>
            <div style={{ marginBottom: 10 }}>
              <span className="badge-pending" style={{ marginRight: 8 }}>⏳ நிலுவை: {pending.length}</span>
              <span className="badge-paid">✅ செலுத்தியது: {paid.length}</span>
            </div>
            <div className="stagger-children">
              {donors.length === 0 ? (
                <EmptyState icon="👥" text="நன்கொடையாளர்கள் இல்லை" />
              ) : donors.map((d) => (
                <Card key={d.id} style={{ borderLeft: `3px solid ${d.status === "paid" ? colors.success : "#FF9800"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: colors.text.primary, fontWeight: 700, fontSize: 14 }}>{d.name}</div>
                      <div style={{ color: colors.text.muted, fontSize: 11, marginTop: 1 }}>📞 {d.phone}</div>
                      <div style={{ color: colors.text.muted, fontSize: 11 }}>{d.purpose} • {formatDate(d.donationDate)}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="shimmer-text" style={{ fontWeight: 900, fontSize: 15 }}>₹{Number(d.amount||0).toLocaleString()}</div>
                      <div style={{ marginTop: 4 }}>
                        {d.status === "paid"
                          ? <span className="badge-paid">✅ செலுத்தியது</span>
                          : <span className="badge-pending">⏳ நிலுவை</span>}
                      </div>
                    </div>
                  </div>
                  {/* Admin Actions */}
                  <div style={{ display: "flex", gap: 7, marginTop: 10 }}>
                    {d.status === "pending" ? (
                      <button
                        className="btn-sun"
                        style={{ padding: "6px 12px", fontSize: 11 }}
                        onClick={() => handleMark(d.id, "paid")}
                      >✅ செலுத்தியது என குறி</button>
                    ) : (
                      <button
                        className="btn-outline"
                        style={{ padding: "6px 12px", fontSize: 11 }}
                        onClick={() => handleMark(d.id, "pending")}
                      >⏳ நிலுவை என மாற்று</button>
                    )}
                    <button
                      className="btn-outline"
                      style={{ padding: "6px 10px", fontSize: 11, color: colors.error, borderColor: colors.errorBorder }}
                      onClick={() => setDeleteTarget(d.id)}
                    >🗑️ நீக்கு</button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── BUSINESSES ── */}
        {activeTab === "businesses" && (
          <div className="stagger-children">
            {businesses.length === 0 ? (
              <EmptyState icon="🛒" text="வணிகங்கள் இல்லை" />
            ) : businesses.map((b) => (
              <Card key={b.id} style={{ borderLeft: b.plan === "paid" ? `3px solid #FF8C00` : `3px solid rgba(74,159,255,0.3)` }}>
                {b.plan === "paid" && <div style={{ marginBottom: 6 }}><span className="badge-premium">⭐ Premium</span></div>}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ color: colors.text.primary, fontWeight: 700, fontSize: 14 }}>{b.name}</div>
                    <div style={{ color: colors.text.muted, fontSize: 12 }}>{b.service}</div>
                    <div style={{ color: "#4A9FFF", fontSize: 12, marginTop: 2 }}>📞 {b.phone}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="shimmer-text" style={{ fontWeight: 800 }}>{b.price || "—"}</div>
                    <div style={{ marginTop: 4 }}>
                      <span className={b.isActive ? "badge-paid" : "badge-pending"}>
                        {b.isActive ? "✅ செயலில்" : "⏸ முடக்கம்"}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        message="இந்த நன்கொடையாளரை நீக்கவா? இந்த செயல் மீட்கப்பட முடியாது."
        onYes={handleDelete}
        onNo={() => setDeleteTarget(null)}
      />
    </div>
  );
}
