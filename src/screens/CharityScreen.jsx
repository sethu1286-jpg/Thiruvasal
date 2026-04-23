// src/screens/CharityScreen.jsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  subscribeToDonors, addDonor, updateDonorStatus,
  updateDonor, deleteDonor, formatDate,
} from "../services/firebase";
import {
  TopBar, Card, ModalSheet, Field, EmptyState,
  ConfirmDialog, StatBox,
} from "../components/UI";
import { colors } from "../styles/theme";

// ── Donor Form ────────────────────────────────────────
function DonorForm({ initial = {}, onSave, onCancel, loading }) {
  const [form, setForm] = useState({
    name: "", phone: "", amount: "", purpose: "", donationDate: "", ...initial
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="stagger-children">
      <Field label="பெயர் *"><input className="field-input" placeholder="நன்கொடையாளர் பெயர்" value={form.name} onChange={set("name")} /></Field>
      <Field label="கைபேசி *"><input className="field-input" placeholder="9XXXXXXXXX" type="tel" maxLength={10} value={form.phone} onChange={set("phone")} /></Field>
      <Field label="தொகை (₹) *"><input className="field-input" placeholder="5000" type="number" value={form.amount} onChange={set("amount")} /></Field>
      <Field label="நோக்கம் *"><input className="field-input" placeholder="கார்த்திகை விழா" value={form.purpose} onChange={set("purpose")} /></Field>
      <Field label="நன்கொடை தேதி *"><input className="field-input" type="date" value={form.donationDate} onChange={set("donationDate")} /></Field>
      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <button className="btn-sun" disabled={loading} style={{ flex: 1, padding: "13px", fontSize: 14 }} onClick={() => onSave(form)}>
          {loading ? "சேமிக்கிறது..." : "✅ சேமி"}
        </button>
        <button className="btn-outline" style={{ flex: 1, padding: "13px", fontSize: 14 }} onClick={onCancel}>
          ❌ ரத்து
        </button>
      </div>
    </div>
  );
}

// ── Donor Detail View ─────────────────────────────────
function DonorDetail({ donor, isAdmin, onBack, onStatusChange, onDelete }) {
  const [confirm, setConfirm] = useState(null); // "yes" | "no" | "delete"
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveEdit = async (form) => {
    setLoading(true);
    const { error } = await updateDonor(donor.id, { ...form, amount: Number(form.amount) });
    if (error) { toast.error(error); } else { toast.success("புதுப்பிக்கப்பட்டது!"); setEditing(false); }
    setLoading(false);
  };

  const handleStatus = async (confirmed) => {
    const status = confirmed ? "paid" : "pending";
    setLoading(true);
    const { error } = await updateDonorStatus(donor.id, status);
    if (error) { toast.error(error); } else {
      toast.success(confirmed ? "நன்கொடை உறுதிப்படுத்தப்பட்டது! ✅" : "நிலை புதுப்பிக்கப்பட்டது");
      onStatusChange();
    }
    setLoading(false);
    setConfirm(null);
  };

  const handleDelete = async () => {
    setLoading(true);
    const { error } = await deleteDonor(donor.id);
    if (error) { toast.error(error); } else { toast.success("நீக்கப்பட்டது"); onDelete(); }
    setLoading(false);
    setConfirm(null);
  };

  return (
    <div className="animate-fadeUp">
      <TopBar
        title={donor.name}
        subtitle={donor.purpose}
        onBack={onBack}
        rightElement={isAdmin && !editing && (
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn-outline" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => setEditing(true)}>✏️</button>
            <button className="btn-outline" style={{ padding: "6px 12px", fontSize: 12, color: colors.error, borderColor: colors.errorBorder }} onClick={() => setConfirm("delete")}>🗑️</button>
          </div>
        )}
      />

      <div style={{ padding: "18px 16px", paddingBottom: 80 }} className="scroll-y">
        {editing ? (
          <Card>
            <div className="shimmer-text" style={{ fontWeight: 700, marginBottom: 16 }}>விவரங்களை திருத்து</div>
            <DonorForm initial={donor} onSave={handleSaveEdit} onCancel={() => setEditing(false)} loading={loading} />
          </Card>
        ) : (
          <>
            {/* Profile card */}
            <Card style={{ textAlign: "center", marginBottom: 12, background: "linear-gradient(135deg, rgba(255,140,0,0.12), rgba(22,35,71,0.9))", borderColor: "rgba(255,140,0,0.3)" }}>
              <div style={{
                width: 64, height: 64, borderRadius: 32,
                background: "linear-gradient(135deg, #FF8C00, #FFA833)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26, margin: "0 auto 12px",
                boxShadow: "0 0 22px rgba(255,140,0,0.5)",
              }}>🙏</div>
              <div className="shimmer-text" style={{ fontSize: 20, fontWeight: 800 }}>{donor.name}</div>
              <div style={{ color: colors.text.muted, fontSize: 12, marginTop: 4 }}>📞 {donor.phone}</div>
              <div className="divider" />
              {[
                { l: "நன்கொடை தொகை",  v: `₹${Number(donor.amount || 0).toLocaleString()}` },
                { l: "நோக்கம்",        v: donor.purpose },
                { l: "தேதி",           v: formatDate(donor.donationDate) },
                { l: "அடுத்த நினைவூட்டல்", v: formatDate(donor.nextReminderDate) },
              ].map((r) => (
                <div key={r.l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ color: colors.text.muted, fontSize: 13 }}>{r.l}</span>
                  <span style={{ color: colors.text.primary, fontWeight: 700, fontSize: 13 }}>{r.v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: colors.text.muted, fontSize: 13 }}>நிலை</span>
                {donor.status === "paid"
                  ? <span className="badge-paid">✅ செலுத்தியது</span>
                  : <span className="badge-pending">⏳ நிலுவை</span>}
              </div>
            </Card>

            {/* Confirmation card */}
            {donor.status === "pending" && (
              <Card>
                <div style={{ color: colors.text.primary, fontWeight: 700, textAlign: "center", marginBottom: 6 }}>நன்கொடை உறுதிப்படுத்தல்</div>
                <div style={{ color: colors.text.muted, fontSize: 12, textAlign: "center", marginBottom: 16 }}>
                  இந்த ஆண்டு ₹{Number(donor.amount).toLocaleString()} வழங்குவீர்களா?
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn-sun" style={{ flex: 1, padding: "13px", fontSize: 14 }} disabled={loading} onClick={() => setConfirm("yes")}>✅ ஆம்</button>
                  <button className="btn-outline" style={{ flex: 1, padding: "13px", fontSize: 14, color: colors.error, borderColor: colors.errorBorder }} disabled={loading} onClick={() => setConfirm("no")}>❌ இல்லை</button>
                </div>
              </Card>
            )}

            {donor.status === "paid" && (
              <div style={{ padding: 20, background: colors.successBg, border: `1px solid ${colors.successBorder}`, borderRadius: 14, textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
                <div style={{ color: colors.success, fontWeight: 700 }}>நன்கொடை செலுத்தப்பட்டது!</div>
                <div style={{ fontSize: 12, color: colors.text.muted, marginTop: 4 }}>
                  அடுத்த நினைவூட்டல்: {formatDate(donor.nextReminderDate)}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={confirm === "yes"}
        message={`₹${Number(donor.amount).toLocaleString()} நன்கொடை உறுதிப்படுத்துகிறீர்களா?`}
        onYes={() => handleStatus(true)}
        onNo={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === "delete"}
        message={`${donor.name} -ஐ நீக்கவா? இந்த செயல் மீட்கப்பட முடியாது.`}
        onYes={handleDelete}
        onNo={() => setConfirm(null)}
      />
    </div>
  );
}

// ── Main Charity Screen ───────────────────────────────
export default function CharityScreen() {
  const { isAdmin, profile } = useAuth();
  const [donors, setDonors] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    const unsub = subscribeToDonors(setDonors);
    return unsub;
  }, []);

  const filtered = donors.filter((d) =>
    filter === "all" ? true : d.status === filter
  );

  const selected = donors.find((d) => d.id === selectedId);

  const handleAdd = async (form) => {
    if (!form.name || !form.phone || !form.amount || !form.donationDate) {
      toast.error("அனைத்து தகவல்களும் தேவை");
      return;
    }
    setAddLoading(true);
    const { error } = await addDonor({ ...form, amount: Number(form.amount), addedBy: profile?.uid });
    if (error) { toast.error(error); } else { toast.success("நன்கொடையாளர் சேர்க்கப்பட்டார்! 🎉"); setShowAdd(false); }
    setAddLoading(false);
  };

  // ── Detail view ───────────────────────────────────
  if (selectedId && selected) {
    return (
      <DonorDetail
        donor={selected}
        isAdmin={isAdmin}
        onBack={() => setSelectedId(null)}
        onStatusChange={() => {}} // real-time updates via onSnapshot
        onDelete={() => setSelectedId(null)}
      />
    );
  }

  const paid    = donors.filter((d) => d.status === "paid");
  const pending = donors.filter((d) => d.status === "pending");
  const total   = paid.reduce((s, d) => s + (d.amount || 0), 0);

  return (
    <div style={{ background: "#0F1B3D", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        background: "radial-gradient(ellipse at 50% 0%, #1E3060 0%, #0F1B3D 70%)",
        padding: "20px 20px 26px",
        borderBottom: "1px solid rgba(255,140,0,0.18)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="shimmer-text" style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Cinzel', serif" }}>🏛️ தருமநிலயம்</div>
            <div style={{ color: colors.text.muted, fontSize: 11, marginTop: 2 }}>நன்கொடை மேலாண்மை</div>
          </div>
          {isAdmin && (
            <button className="btn-sun" style={{ padding: "9px 16px", fontSize: 13 }} onClick={() => setShowAdd(true)}>
              ➕ சேர்
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <StatBox icon="✅" label="செலுத்தியது" value={paid.length} color={colors.success} />
          <StatBox icon="⏳" label="நிலுவை"     value={pending.length} color="#FF9800" />
          <StatBox icon="💰" label="மொத்தம்"    value={`₹${(total/1000).toFixed(0)}K`} />
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: 7, marginTop: 14 }}>
          {[["all", "அனைத்தும்"], ["pending", "⏳ நிலுவை"], ["paid", "✅ செலுத்தியது"]].map(([f, label]) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "6px 13px", borderRadius: 20, border: "none",
              background: filter === f ? "linear-gradient(135deg,#FF8C00,#FFA833)" : "rgba(255,140,0,0.1)",
              color: filter === f ? "#0A1628" : colors.text.muted,
              fontWeight: 700, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
              boxShadow: filter === f ? "0 2px 10px rgba(255,140,0,0.35)" : "none",
              transition: "all 0.2s",
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Donor List */}
      <div style={{ padding: "14px 16px 90px" }} className="scroll-y stagger-children">
        {filtered.length === 0 ? (
          <EmptyState icon="🏛️" text="நன்கொடையாளர்கள் இல்லை" />
        ) : filtered.map((d) => (
          <Card key={d.id} onClick={() => setSelectedId(d.id)}
            style={{ borderLeft: d.status === "paid" ? `3px solid ${colors.success}` : `3px solid rgba(255,152,0,0.5)` }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 21, flexShrink: 0,
                  background: "linear-gradient(135deg, rgba(255,140,0,0.25), rgba(255,140,0,0.08))",
                  border: "1px solid rgba(255,140,0,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                }}>🙏</div>
                <div>
                  <div style={{ color: colors.text.primary, fontWeight: 700, fontSize: 14 }}>{d.name}</div>
                  <div style={{ color: colors.text.muted, fontSize: 11, marginTop: 1 }}>{d.purpose}</div>
                  <div style={{ color: colors.text.muted, fontSize: 11 }}>📅 {formatDate(d.donationDate)}</div>
                </div>
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
          </Card>
        ))}
      </div>

      {/* Add Donor Modal */}
      <ModalSheet open={showAdd} onClose={() => setShowAdd(false)} title="புதிய நன்கொடையாளர்">
        <div style={{ color: colors.text.muted, fontSize: 12, marginBottom: 18 }}>விவரங்களை உள்ளிடுக</div>
        <DonorForm onSave={handleAdd} onCancel={() => setShowAdd(false)} loading={addLoading} />
      </ModalSheet>
    </div>
  );
}
