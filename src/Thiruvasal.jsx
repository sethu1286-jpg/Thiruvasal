import { useState } from "react";

const gold   = "#C9922A";
const goldLt = "#F5DFA0";
const goldDk = "#8B6010";
const cream  = "#FFFDF7";
const white  = "#FFFFFF";
const gray1  = "#F7F4EE";
const gray2  = "#E8E2D6";
const gray3  = "#9A8F7A";
const text   = "#2D2416";

const DONORS = [
  { id:1, name:"அருண்குமார்",     mobile:"9876543210", purpose:"கும்பாபிஷேகம்", amount:5000,  date:"2024-04-14", status:"paid",    reminded:false },
  { id:2, name:"கமலா தேவி",       mobile:"9123456780", purpose:"தீபாராதனை",     amount:2500,  date:"2024-03-08", status:"pending", reminded:true  },
  { id:3, name:"வேலுமுருகன்",     mobile:"9988776655", purpose:"அன்னதானம்",     amount:10000, date:"2024-06-01", status:"paid",    reminded:false },
  { id:4, name:"சரஸ்வதி அம்மாள்", mobile:"9001122334", purpose:"தீபாவளி விழா", amount:1500,  date:"2024-10-23", status:"pending", reminded:true  },
  { id:5, name:"முருகேசன்",        mobile:"9445566778", purpose:"கோபுர நவீகரணம்",amount:25000, date:"2024-12-15", status:"paid",    reminded:false },
];

const BUSINESSES = [
  { id:1, name:"ஸ்ரீ பூஜா ஸ்டோர்",  type:"பூஜை பொருட்கள்", price:"₹50 முதல்",  contact:"9876500001", plan:"paid"  },
  { id:2, name:"அம்பிகா டெக்ஸ்டைல்", type:"கோவில் ஆடைகள்",  price:"₹500 முதல்", contact:"9876500002", plan:"free"  },
  { id:3, name:"வேல் கேட்டரிங்",     type:"அன்னதான சேவை",   price:"₹80/person", contact:"9876500003", plan:"paid"  },
];

const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");

const Badge = ({ paid }) => (
  <span style={{
    fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20,
    background: paid ? "#E8F5E9" : "#FFF3E0",
    color:       paid ? "#2E7D32" : "#E65100",
  }}>
    {paid ? "செலுத்தப்பட்டது" : "நிலுவையில்"}
  </span>
);

const Card = ({ children, style={} }) => (
  <div style={{
    background:white, borderRadius:16, padding:"18px",
    boxShadow:"0 2px 12px rgba(201,146,42,0.10)",
    border:`1px solid ${gray2}`, marginBottom:14, ...style
  }}>{children}</div>
);

const GoldBtn = ({ label, onClick, small, outline }) => (
  <button onClick={onClick} style={{
    background: outline ? white : gold,
    color:       outline ? gold  : white,
    border:      outline ? `2px solid ${gold}` : "none",
    borderRadius:12, padding: small ? "8px 18px" : "14px 28px",
    fontSize: small ? 14 : 16, fontWeight:700,
    cursor:"pointer", width: small ? "auto" : "100%",
    boxShadow: outline ? "none" : "0 3px 12px rgba(201,146,42,0.28)",
  }}>{label}</button>
);

const Input = ({ placeholder, type="text", value, onChange }) => (
  <input
    type={type} placeholder={placeholder} value={value} onChange={onChange}
    style={{
      width:"100%", boxSizing:"border-box",
      padding:"13px 16px", borderRadius:12,
      border:`1.5px solid ${gray2}`, fontSize:15,
      background:gray1, color:text, outline:"none",
      fontFamily:"inherit", marginBottom:12,
    }}
  />
);

const SectionTitle = ({ children }) => (
  <h3 style={{ color:goldDk, fontSize:15, fontWeight:800, letterSpacing:0.6,
    textTransform:"uppercase", margin:"18px 0 10px",
    borderLeft:`3px solid ${gold}`, paddingLeft:10 }}>{children}</h3>
);

function LoginScreen({ onLogin }) {
  const [mobile, setMobile] = useState("");
  const [pass,   setPass]   = useState("");
  const [isReg,  setIsReg]  = useState(false);
  const [name,   setName]   = useState("");
  const [err,    setErr]    = useState("");

  const handle = () => {
    if (!mobile || mobile.length < 10) { setErr("சரியான மொபைல் எண் கொடுங்கள்"); return; }
    if (!pass)                          { setErr("கடவுச்சொல் கொடுங்கள்"); return; }
    onLogin({ name: name || "அன்பர்", mobile });
  };

  return (
    <div style={{ minHeight:"100vh", background:cream, display:"flex",
      flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ textAlign:"center", marginBottom:36 }}>
        <div style={{ fontSize:52 }}>🛕</div>
        <h1 style={{ color:gold, fontSize:30, fontWeight:900, margin:"8px 0 2px",
          letterSpacing:1.5, fontFamily:"serif" }}>திருவாசல்</h1>
        <p style={{ color:gray3, fontSize:13, margin:0 }}>கோவில் நிர்வாக செயலி</p>
      </div>
      <div style={{ width:"100%", maxWidth:380 }}>
        <Card>
          <h2 style={{ color:goldDk, fontSize:18, fontWeight:800, marginTop:0,
            marginBottom:18, textAlign:"center" }}>
            {isReg ? "புதிய கணக்கு" : "உள்நுழைவு"}
          </h2>
          {isReg && <Input placeholder="உங்கள் பெயர்" value={name} onChange={e=>setName(e.target.value)}/>}
          <Input placeholder="மொபைல் எண்" type="tel"      value={mobile} onChange={e=>setMobile(e.target.value)}/>
          <Input placeholder="கடவுச்சொல்"  type="password" value={pass}   onChange={e=>setPass(e.target.value)}/>
          {err && <p style={{ color:"#C62828", fontSize:13, margin:"0 0 10px" }}>{err}</p>}
          <GoldBtn label={isReg ? "பதிவு செய்க" : "உள்நுழைக"} onClick={handle}/>
          <p style={{ textAlign:"center", marginTop:14, fontSize:14, color:gray3 }}>
            {isReg ? "ஏற்கனவே கணக்கு உள்ளதா? " : "புதிய பயனரா? "}
            <span onClick={()=>{ setIsReg(!isReg); setErr(""); }}
              style={{ color:gold, fontWeight:700, cursor:"pointer" }}>
              {isReg ? "உள்நுழைவு" : "பதிவு செய்க"}
            </span>
          </p>
        </Card>
      </div>
    </div>
  );
}

function HomeScreen({ user, setScreen }) {
  return (
    <div style={{ padding:24 }}>
      <div style={{ marginBottom:24 }}>
        <p style={{ color:gray3, fontSize:13, margin:0 }}>வணக்கம்,</p>
        <h2 style={{ color:goldDk, fontSize:22, fontWeight:900, margin:"2px 0 0",
          fontFamily:"serif" }}>{user.name}</h2>
      </div>
      <div onClick={() => setScreen("charity")} style={{
        background:`linear-gradient(135deg, ${gold} 0%, #A8740F 100%)`,
        borderRadius:20, padding:28, marginBottom:16, cursor:"pointer",
        boxShadow:"0 6px 24px rgba(201,146,42,0.35)",
      }}>
        <div style={{ fontSize:40, marginBottom:8 }}>🪔</div>
        <h2 style={{ color:white, fontSize:22, fontWeight:900, margin:"0 0 4px",
          fontFamily:"serif" }}>தருமநிலயம்</h2>
        <p style={{ color:"rgba(255,255,255,0.85)", fontSize:14, margin:0 }}>
          நன்கொடை பட்டியல் & நினைவூட்டல்
        </p>
        <div style={{ marginTop:14, display:"flex", gap:10 }}>
          {[
            { n:DONORS.filter(d=>d.status==="paid").length,    l:"செலுத்தினர்" },
            { n:DONORS.filter(d=>d.status==="pending").length, l:"நிலுவை" },
          ].map(({ n, l }) => (
            <div key={l} style={{ background:"rgba(255,255,255,0.2)", borderRadius:12,
              padding:"8px 16px", textAlign:"center" }}>
              <div style={{ color:white, fontSize:20, fontWeight:900 }}>{n}</div>
              <div style={{ color:"rgba(255,255,255,0.8)", fontSize:12 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div onClick={() => setScreen("business")} style={{
        background:white, border:`2px solid ${gold}`,
        borderRadius:20, padding:28, cursor:"pointer",
        boxShadow:"0 3px 16px rgba(201,146,42,0.12)",
      }}>
        <div style={{ fontSize:40, marginBottom:8 }}>🏪</div>
        <h2 style={{ color:gold, fontSize:22, fontWeight:900, margin:"0 0 4px",
          fontFamily:"serif" }}>வர்த்தகம்</h2>
        <p style={{ color:gray3, fontSize:14, margin:0 }}>வணிக பட்டியல் & விளம்பரம்</p>
        <div style={{ marginTop:14, display:"inline-block", background:goldLt,
          borderRadius:10, padding:"6px 14px" }}>
          <span style={{ color:goldDk, fontSize:13, fontWeight:700 }}>
            {BUSINESSES.length} பட்டியல்கள்
          </span>
        </div>
      </div>
    </div>
  );
}

function CharityScreen({ setScreen }) {
  const [donors,   setDonors]   = useState(DONORS);
  const [filter,   setFilter]   = useState("all");
  const [showAdd,  setShowAdd]  = useState(false);
  const [newDonor, setNewDonor] = useState({ name:"", mobile:"", purpose:"", amount:"", date:"" });
  const [toast,    setToast]    = useState("");
  const [selected, setSelected] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const filtered = donors.filter(d => filter === "all" ? true : d.status === filter);

  const confirm = (id, yes) => {
    setDonors(prev => prev.map(d =>
      d.id === id ? { ...d, status: yes ? "paid" : "pending", reminded:false } : d
    ));
    showToast(yes ? "✅ நன்கொடை உறுதிப்படுத்தப்பட்டது!" : "⏭ தவிர்க்கப்பட்டது");
    setSelected(null);
  };

  const addDonor = () => {
    if (!newDonor.name || !newDonor.amount) { showToast("பெயர் & தொகை கொடுங்கள்"); return; }
    setDonors(prev => [...prev, {
      ...newDonor, id: Date.now(), status:"pending", reminded:false,
      amount: Number(newDonor.amount),
    }]);
    setNewDonor({ name:"", mobile:"", purpose:"", amount:"", date:"" });
    setShowAdd(false);
    showToast("✅ நன்கொடையாளர் சேர்க்கப்பட்டார்!");
  };

  return (
    <div style={{ padding:20 }}>
      {toast && (
        <div style={{ position:"fixed", top:70, left:"50%", transform:"translateX(-50%)",
          background:goldDk, color:white, padding:"10px 22px", borderRadius:20,
          fontSize:14, fontWeight:700, zIndex:999, whiteSpace:"nowrap",
          boxShadow:"0 4px 16px rgba(0,0,0,0.18)" }}>
          {toast}
        </div>
      )}
      {selected && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)",
          display:"flex", alignItems:"center", justifyContent:"center", zIndex:998, padding:24 }}>
          <Card style={{ width:"100%", maxWidth:360, marginBottom:0 }}>
            <div style={{ textAlign:"center", marginBottom:4 }}>
              <div style={{ fontSize:36 }}>🔔</div>
              <h3 style={{ color:goldDk, fontSize:18, fontWeight:900, margin:"8px 0 4px" }}>நினைவூட்டல்</h3>
              <p style={{ color:gray3, fontSize:14, margin:0 }}>{selected.name} — {selected.purpose}</p>
              <p style={{ color:gold, fontSize:22, fontWeight:900, margin:"8px 0" }}>{fmt(selected.amount)}</p>
              <p style={{ color:gray3, fontSize:13 }}>நன்கொடை உறுதிப்படுத்துகிறீர்களா?</p>
            </div>
            <div style={{ display:"flex", gap:12 }}>
              <button onClick={() => confirm(selected.id, true)} style={{
                flex:1, background:gold, color:white, border:"none",
                borderRadius:12, padding:14, fontSize:15, fontWeight:800, cursor:"pointer"
              }}>✅ ஆம்</button>
              <button onClick={() => confirm(selected.id, false)} style={{
                flex:1, background:gray1, color:gray3, border:`1.5px solid ${gray2}`,
                borderRadius:12, padding:14, fontSize:15, fontWeight:700, cursor:"pointer"
              }}>❌ இல்லை</button>
            </div>
            <p onClick={() => setSelected(null)} style={{
              textAlign:"center", color:gray3, fontSize:13, marginTop:12, cursor:"pointer" }}>மூடு</p>
          </Card>
        </div>
      )}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
        <button onClick={() => setScreen("home")} style={{
          background:gray1, border:"none", borderRadius:10, padding:"8px 12px",
          cursor:"pointer", fontSize:18 }}>←</button>
        <div>
          <h2 style={{ color:gold, fontSize:20, fontWeight:900, margin:0, fontFamily:"serif" }}>🪔 தருமநிலயம்</h2>
          <p style={{ color:gray3, fontSize:12, margin:0 }}>நன்கொடை நிர்வாகம்</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} style={{
          marginLeft:"auto", background:gold, color:white,
          border:"none", borderRadius:12, padding:"9px 16px",
          fontWeight:800, fontSize:15, cursor:"pointer" }}>+ சேர்</button>
      </div>
      {showAdd && (
        <Card>
          <SectionTitle>புதிய நன்கொடையாளர்</SectionTitle>
          <Input placeholder="பெயர்"       value={newDonor.name}    onChange={e=>setNewDonor({...newDonor,name:e.target.value})}/>
          <Input placeholder="மொபைல் எண்"  value={newDonor.mobile}  onChange={e=>setNewDonor({...newDonor,mobile:e.target.value})} type="tel"/>
          <Input placeholder="நோக்கம்"     value={newDonor.purpose} onChange={e=>setNewDonor({...newDonor,purpose:e.target.value})}/>
          <Input placeholder="தொகை (₹)"   value={newDonor.amount}  onChange={e=>setNewDonor({...newDonor,amount:e.target.value})} type="number"/>
          <Input placeholder="தேதி"        value={newDonor.date}    onChange={e=>setNewDonor({...newDonor,date:e.target.value})} type="date"/>
          <div style={{ display:"flex", gap:10 }}>
            <GoldBtn label="சேமி" onClick={addDonor} small/>
            <GoldBtn label="ரத்து" onClick={()=>setShowAdd(false)} small outline/>
          </div>
        </Card>
      )}
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        {[
          { label:"மொத்தம்",     n:donors.length,                                     col:gold      },
          { label:"செலுத்தினர்", n:donors.filter(d=>d.status==="paid").length,         col:"#2E7D32" },
          { label:"நிலுவை",     n:donors.filter(d=>d.status==="pending").length,       col:"#E65100" },
        ].map(({ label, n, col }) => (
          <div key={label} style={{ flex:1, background:white,
            borderRadius:14, padding:"12px 10px", textAlign:"center",
            border:`1.5px solid ${gray2}`, boxShadow:"0 2px 8px rgba(201,146,42,0.08)" }}>
            <div style={{ color:col, fontSize:20, fontWeight:900 }}>{n}</div>
            <div style={{ color:gray3, fontSize:11, marginTop:2 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", background:gray1, borderRadius:12, padding:4, marginBottom:16, gap:4 }}>
        {[["all","அனைத்தும்"],["paid","செலுத்தினர்"],["pending","நிலுவை"]].map(([k,l])=>(
          <button key={k} onClick={()=>setFilter(k)} style={{
            flex:1, border:"none", borderRadius:9,
            background: filter===k ? gold : "transparent",
            color:       filter===k ? white : gray3,
            padding:"9px 4px", fontSize:12, fontWeight:700, cursor:"pointer",
          }}>{l}</button>
        ))}
      </div>
      {filtered.map(d => (
        <Card key={d.id}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:22, background:goldLt,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:20, flexShrink:0 }}>👤</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ color:text, fontSize:16, fontWeight:800 }}>{d.name}</span>
                <Badge paid={d.status==="paid"}/>
              </div>
              <p style={{ color:gray3, fontSize:13, margin:"3px 0" }}>{d.purpose}</p>
              <div style={{ display:"flex", gap:16, marginTop:4 }}>
                <span style={{ color:gold, fontWeight:800, fontSize:15 }}>{fmt(d.amount)}</span>
                <span style={{ color:gray3, fontSize:13 }}>{d.date}</span>
              </div>
              {d.reminded && d.status === "pending" && (
                <div style={{ marginTop:8, background:"#FFF8E1", borderRadius:8,
                  padding:"6px 10px", display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:14 }}>🔔</span>
                  <span style={{ color:"#E65100", fontSize:12, fontWeight:700 }}>நினைவூட்டல் அனுப்பப்பட்டது</span>
                </div>
              )}
            </div>
          </div>
          {d.status === "pending" && (
            <div style={{ display:"flex", gap:10, marginTop:12 }}>
              <button onClick={()=>setSelected(d)} style={{
                flex:1, background:goldLt, color:goldDk, border:"none",
                borderRadius:10, padding:"9px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                🔔 உறுதிப்படுத்து
              </button>
              <button onClick={()=>confirm(d.id,true)} style={{
                flex:1, background:gold, color:white, border:"none",
                borderRadius:10, padding:"9px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                ✅ செலுத்தப்பட்டது
              </button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

function BusinessScreen({ setScreen }) {
  const [showAdd, setShowAdd] = useState(false);
  const [items,   setItems]   = useState(BUSINESSES);
  const [form,    setForm]    = useState({ name:"", type:"", price:"", contact:"", plan:"free" });
  const [toast,   setToast]   = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const add = () => {
    if (!form.name) { showToast("வணிக பெயர் கொடுங்கள்"); return; }
    setItems(prev => [...prev, { ...form, id: Date.now() }]);
    setForm({ name:"", type:"", price:"", contact:"", plan:"free" });
    setShowAdd(false);
    showToast("✅ பட்டியல் சேர்க்கப்பட்டது!");
  };

  return (
    <div style={{ padding:20 }}>
      {toast && (
        <div style={{ position:"fixed", top:70, left:"50%", transform:"translateX(-50%)",
          background:goldDk, color:white, padding:"10px 22px", borderRadius:20,
          fontSize:14, fontWeight:700, zIndex:999, whiteSpace:"nowrap" }}>
          {toast}
        </div>
      )}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
        <button onClick={() => setScreen("home")} style={{
          background:gray1, border:"none", borderRadius:10, padding:"8px 12px",
          cursor:"pointer", fontSize:18 }}>←</button>
        <div>
          <h2 style={{ color:gold, fontSize:20, fontWeight:900, margin:0, fontFamily:"serif" }}>🏪 வர்த்தகம்</h2>
          <p style={{ color:gray3, fontSize:12, margin:0 }}>வணிக பட்டியல்</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} style={{
          marginLeft:"auto", background:gold, color:white,
          border:"none", borderRadius:12, padding:"9px 16px",
          fontWeight:800, fontSize:15, cursor:"pointer" }}>+ சேர்</button>
      </div>
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        {[
          { plan:"free", label:"இலவச",           desc:"அடிப்படை பட்டியல்",    emoji:"📋", col:gray3 },
          { plan:"paid", label:"பணம் செலுத்திய", desc:"முன்னிலை பட்டியல்",    emoji:"⭐", col:gold  },
        ].map(({ plan, label, desc, emoji, col }) => (
          <div key={plan} style={{ flex:1, background:white,
            border: plan==="paid" ? `2px solid ${gold}` : `1.5px solid ${gray2}`,
            borderRadius:14, padding:14, textAlign:"center" }}>
            <div style={{ fontSize:24 }}>{emoji}</div>
            <div style={{ color:col, fontWeight:800, fontSize:14 }}>{label}</div>
            <div style={{ color:gray3, fontSize:11, marginTop:2 }}>{desc}</div>
          </div>
        ))}
      </div>
      {showAdd && (
        <Card>
          <SectionTitle>புதிய வணிகம் சேர்</SectionTitle>
          <Input placeholder="வணிக பெயர்"         value={form.name}    onChange={e=>setForm({...form,name:e.target.value})}/>
          <Input placeholder="பொருள் / சேவை வகை" value={form.type}    onChange={e=>setForm({...form,type:e.target.value})}/>
          <Input placeholder="விலை"                value={form.price}   onChange={e=>setForm({...form,price:e.target.value})}/>
          <Input placeholder="தொடர்பு எண்"         value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} type="tel"/>
          <p style={{ color:gray3, fontSize:13, margin:"0 0 8px" }}>திட்டம்:</p>
          <div style={{ display:"flex", gap:8, marginBottom:12 }}>
            {["free","paid"].map(p => (
              <button key={p} onClick={()=>setForm({...form,plan:p})} style={{
                flex:1, border: form.plan===p ? `2px solid ${gold}` : `1.5px solid ${gray2}`,
                background: form.plan===p ? goldLt : white,
                color: form.plan===p ? goldDk : gray3,
                borderRadius:10, padding:"9px", fontSize:13,
                fontWeight:700, cursor:"pointer"
              }}>
                {p==="free" ? "இலவச" : "⭐ பணம் செலுத்திய"}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <GoldBtn label="சேமி" onClick={add} small/>
            <GoldBtn label="ரத்து" onClick={()=>setShowAdd(false)} small outline/>
          </div>
        </Card>
      )}
      {items.map(b => (
        <Card key={b.id} style={{ border: b.plan==="paid" ? `2px solid ${gold}` : `1px solid ${gray2}` }}>
          {b.plan==="paid" && (
            <div style={{ background:goldLt, borderRadius:8, padding:"4px 10px",
              display:"inline-block", marginBottom:8 }}>
              <span style={{ color:goldDk, fontSize:11, fontWeight:800 }}>⭐ முன்னிலை</span>
            </div>
          )}
          <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
            <div style={{ width:48, height:48, borderRadius:14,
              background: b.plan==="paid" ? goldLt : gray1,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:22, flexShrink:0 }}>🏪</div>
            <div style={{ flex:1 }}>
              <p style={{ color:text, fontSize:16, fontWeight:800, margin:0 }}>{b.name}</p>
              <p style={{ color:gray3, fontSize:13, margin:"3px 0" }}>{b.type}</p>
              <div style={{ display:"flex", gap:16 }}>
                <span style={{ color:gold, fontWeight:800, fontSize:14 }}>{b.price}</span>
                <span style={{ color:gray3, fontSize:13 }}>📞 {b.contact}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ProfileScreen({ user, setScreen }) {
  return (
    <div style={{ padding:20 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <button onClick={() => setScreen("home")} style={{
          background:gray1, border:"none", borderRadius:10, padding:"8px 12px",
          cursor:"pointer", fontSize:18 }}>←</button>
        <h2 style={{ color:gold, fontSize:20, fontWeight:900, margin:0, fontFamily:"serif" }}>👤 சுயவிவரம்</h2>
      </div>
      <Card style={{ textAlign:"center" }}>
        <div style={{ width:72, height:72, borderRadius:36, background:goldLt,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:36, margin:"0 auto 12px" }}>👤</div>
        <h3 style={{ color:goldDk, fontSize:20, fontWeight:900, margin:"0 0 4px" }}>{user.name}</h3>
        <p style={{ color:gray3, fontSize:14, margin:0 }}>📞 {user.mobile}</p>
      </Card>
      <SectionTitle>என் நன்கொடைகள்</SectionTitle>
      {DONORS.slice(0,3).map(d => (
        <Card key={d.id}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <p style={{ color:text, fontWeight:700, fontSize:15, margin:0 }}>{d.purpose}</p>
              <p style={{ color:gray3, fontSize:13, margin:"3px 0" }}>{d.date}</p>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ color:gold, fontWeight:900, fontSize:16, margin:"0 0 4px" }}>{fmt(d.amount)}</p>
              <Badge paid={d.status==="paid"}/>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function ThiruvasalApp() {
  const [user,   setUser]   = useState(null);
  const [screen, setScreen] = useState("home");

  if (!user) return <LoginScreen onLogin={u => setUser(u)}/>;

  const screens = { home:HomeScreen, charity:CharityScreen, business:BusinessScreen, profile:ProfileScreen };
  const Screen  = screens[screen] || HomeScreen;

  return (
    <div style={{ background:cream, minHeight:"100vh", maxWidth:430,
      margin:"0 auto", fontFamily:"'Noto Sans Tamil', 'Segoe UI', sans-serif",
      position:"relative", paddingBottom:80 }}>
      <div style={{ background:white, borderBottom:`1px solid ${gray2}`,
        padding:"14px 20px", display:"flex", alignItems:"center",
        justifyContent:"space-between", position:"sticky", top:0, zIndex:100,
        boxShadow:"0 2px 8px rgba(201,146,42,0.07)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:22 }}>🛕</span>
          <span style={{ color:gold, fontWeight:900, fontSize:18,
            fontFamily:"serif", letterSpacing:0.8 }}>திருவாசல்</span>
        </div>
        <span style={{ color:gray3, fontSize:13, fontWeight:600 }}>{user.name}</span>
      </div>
      <Screen user={user} setScreen={setScreen}/>
      <div style={{ position:"fixed", bottom:0, left:"50%",
        transform:"translateX(-50%)", width:"100%", maxWidth:430,
        background:white, borderTop:`1px solid ${gray2}`,
        display:"flex", boxShadow:"0 -3px 12px rgba(0,0,0,0.07)" }}>
        {[
          { key:"home",     label:"முகப்பு",   emoji:"🏠" },
          { key:"charity",  label:"தருமம்",    emoji:"🪔" },
          { key:"business", label:"வர்த்தகம்", emoji:"🏪" },
          { key:"profile",  label:"சுயவிவரம்", emoji:"👤" },
        ].map(({ key, label, emoji }) => (
          <button key={key} onClick={() => setScreen(key)} style={{
            flex:1, border:"none", background:"transparent",
            padding:"12px 4px 10px", cursor:"pointer",
            borderTop: screen===key ? `2.5px solid ${gold}` : "2.5px solid transparent",
          }}>
            <div style={{ fontSize:20 }}>{emoji}</div>
            <div style={{
              color: screen===key ? gold : gray3,
              fontSize:10, fontWeight: screen===key ? 800 : 500, marginTop:2,
            }}>{label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}//  AUTH ENGINE
// ─────────────────────────────────────────────
const delay = (ms=700) => new Promise(r=>setTimeout(r,ms));
const Auth = {
  current: null,
  async signIn(phone, pwd) {
    await delay(800);
    let user = Object.values(DB.users).find(u=>u.phone===phone&&u.password===pwd);
    if (!user) {
      user = { id:"u_"+uid(), name:"நண்பரே", phone, password:pwd, avatar:"🧑", language:"ta", createdAt:Date.now() };
      DB.users[user.id] = user;
    }
    Auth.current = user;
    localStorage.setItem("tv_u", JSON.stringify(user));
    return user;
  },
  async register(name, phone, pwd) {
    await delay(900);
    const existing = Object.values(DB.users).find(u=>u.phone===phone);
    if (existing) throw new Error("Phone already registered");
    const user = { id:"u_"+uid(), name, phone, password:pwd, avatar:"🧑", language:"ta", createdAt:Date.now() };
    DB.users[user.id] = user;
    Auth.current = user;
    localStorage.setItem("tv_u", JSON.stringify(user));
    return user;
  },
  signOut() { Auth.current=null; localStorage.removeItem("tv_u"); },
  restore() { try { const s=localStorage.getItem("tv_u"); return s?JSON.parse(s):null; } catch { return null; } },
};

// ─────────────────────────────────────────────
//  i18n
// ─────────────────────────────────────────────
const i18n = {
  appName:        { ta:"திருவாசல்", en:"Thiruvasal" },
  tagline:        { ta:"புனித நுழைவாயில்", en:"The Sacred Gateway" },
  welcome:        { ta:"வணக்கம்", en:"Welcome back" },
  home:           { ta:"முகப்பு", en:"Home" },
  spiritual:      { ta:"ஆன்மீகம்", en:"Spiritual" },
  market:         { ta:"சந்தை", en:"Market" },
  profile:        { ta:"சுயவிவரம்", en:"Profile" },
  posts:          { ta:"பதிவுகள்", en:"Posts" },
  donated:        { ta:"நன்கொடை", en:"Donated" },
  products:       { ta:"தயாரிப்புகள்", en:"Products" },
  doctors:        { ta:"மருத்துவர்கள்", en:"Doctors" },
  donateNow:      { ta:"நன்கொடை", en:"Donate Now" },
  createPost:     { ta:"பதிவிடு", en:"Create Post" },
  addBusiness:    { ta:"வணிகம் சேர்", en:"Add Business" },
  sections:       { ta:"பிரிவுகள்", en:"Sections" },
  recentActivity: { ta:"சமீபத்திய செயல்பாடு", en:"Recent Activity" },
  seeAll:         { ta:"அனைத்தும்", en:"See All" },
  activity:       { ta:"செயல்பாடு", en:"Your Activity" },
  notifications:  { ta:"அறிவிப்புகள்", en:"Notifications" },
  markRead:       { ta:"படித்தது", en:"Mark All Read" },
  signIn:         { ta:"உள்நுழைய", en:"Sign In" },
  register:       { ta:"பதிவு", en:"Register" },
  mobile:         { ta:"மொபைல் எண்", en:"Mobile Number" },
  password:       { ta:"கடவுச்சொல்", en:"Password" },
  enter:          { ta:"உள்ளே செல்", en:"Enter" },
  sendOTP:        { ta:"OTP அனுப்பு", en:"Send OTP" },
  verify:         { ta:"சரிபார்", en:"Verify & Register" },
  back:           { ta:"திரும்பு", en:"Back" },
  shareThought:   { ta:"உங்கள் எண்ணங்களை பகிருங்கள்...", en:"Share your thoughts..." },
  post:           { ta:"பதிவிடு", en:"Post" },
  like:           { ta:"விரும்பு", en:"Like" },
  comment:        { ta:"கருத்து", en:"Comment" },
  share:          { ta:"பகிர்", en:"Share" },
  addProduct:     { ta:"தயாரிப்பு சேர்", en:"Add Product" },
  vendorName:     { ta:"கடை பெயர்", en:"Vendor Name" },
  productName:    { ta:"தயாரிப்பு பெயர்", en:"Product Name" },
  price:          { ta:"விலை ₹", en:"Price ₹" },
  description:    { ta:"விளக்கம்", en:"Description" },
  phone:          { ta:"தொலைபேசி", en:"Phone" },
  add:            { ta:"சேர்", en:"Add" },
  cancel:         { ta:"ரத்து", en:"Cancel" },
  callSeller:     { ta:"அழைக்க", en:"Call" },
  postRequest:    { ta:"கோரிக்கை சேர்", en:"Post Request" },
  title:          { ta:"தலைப்பு", en:"Title" },
  targetAmt:      { ta:"இலக்கு தொகை ₹", en:"Target Amount ₹" },
  raised:         { ta:"சேகரிக்கப்பட்டது", en:"raised" },
  donors:         { ta:"நன்கொடையாளர்கள்", en:"donors" },
  urgent:         { ta:"அவசரம்", en:"URGENT" },
  donateBtn:      { ta:"நன்கொடை அளிக்கவும்", en:"Donate Now" },
  makeDonation:   { ta:"நன்கொடை அளிக்கவும்", en:"Make a Donation" },
  customAmt:      { ta:"தனிப்பயன் தொகை", en:"Custom Amount ₹" },
  donate:         { ta:"நன்கொடை ✦", en:"Donate ✦" },
  emergency:      { ta:"அவசரகால அழைப்பு — 108", en:"Emergency Call — 108" },
  healthTips:     { ta:"சுகாதார குறிப்புகள்", en:"Health Tips" },
  nearbyHosp:     { ta:"அருகிலுள்ள மருத்துவமனைகள்", en:"Nearby Hospitals" },
  book:           { ta:"முன்பதிவு", en:"Book" },
  bookAppt:       { ta:"நேர முன்பதிவு", en:"Book Appointment" },
  name:           { ta:"பெயர்", en:"Name" },
  dateTime:       { ta:"தேதி & நேரம்", en:"Date & Time" },
  reason:         { ta:"காரணம்", en:"Reason" },
  bookNow:        { ta:"முன்பதிவு செய்ய ✦", en:"Book Now ✦" },
  editProfile:    { ta:"சுயவிவரம் திருத்து", en:"Edit Profile" },
  save:           { ta:"சேமி", en:"Save" },
  security:       { ta:"பாதுகாப்பு", en:"Security" },
  signOut:        { ta:"வெளியேறு", en:"Sign Out" },
  listings:       { ta:"வர்த்தக பட்டியல்", en:"Listings" },
  donations:      { ta:"நன்கொடைகள்", en:"Donations" },
  justNow:        { ta:"இப்போது", en:"just now" },
  ago:            { ta:"முன்", en:"ago" },
  nameLabel:      { ta:"பெயர்", en:"Name" },
  fullName:       { ta:"முழு பெயர்", en:"Full Name" },
  postedBy:       { ta:"பதிவிட்டவர்", en:"by" },
  collected:      { ta:"சேகரிக்கப்பட்டது", en:"collected" },
};

const t = (key, lang) => (i18n[key]?.[lang]) ?? (i18n[key]?.en) ?? key;

const timeAgo = (ts, lang) => {
  const s = Math.floor((Date.now()-ts)/1000);
  if (s<60)  return lang==="ta" ? "இப்போது" : "just now";
  if (s<3600) return lang==="ta" ? `${Math.floor(s/60)} நிமிடம் ${t("ago",lang)}` : `${Math.floor(s/60)}m ago`;
  if (s<86400) return lang==="ta" ? `${Math.floor(s/3600)} மணி ${t("ago",lang)}` : `${Math.floor(s/3600)}h ago`;
  return lang==="ta" ? `${Math.floor(s/86400)} நாள் ${t("ago",lang)}` : `${Math.floor(s/86400)}d ago`;
};

// ─────────────────────────────────────────────
//  CSS
// ─────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Tamil:wght@300;400;600;700&family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');

:root{
  --g1:#B8934A; --g2:#D4AA5C; --g3:#E8C87A; --g4:#F5DFA0;
  --gd:#8A6520; --gm:#C4963E;
  --w:#FFFFFF; --off:#FDFAF5; --cream:#F7F1E3; --cream2:#F0E8D0;
  --dark:#1E1608; --mid:#4A3C1E; --muted:#8C7A52;
  --red:#C94040; --green:#3A8A3A;
  --shadow-sm:0 2px 8px rgba(0,0,0,.06);
  --shadow-md:0 4px 20px rgba(0,0,0,.09);
  --shadow-lg:0 8px 40px rgba(0,0,0,.13);
  --shadow-gold:0 4px 20px rgba(184,147,74,.25);
  --r-sm:12px; --r-md:18px; --r-lg:24px; --r-xl:32px;
  --transition:.28s cubic-bezier(.4,0,.2,1);
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-font-smoothing:antialiased}
html,body{height:100%;overflow:hidden}
body{font-family:'Cormorant Garamond','Noto Serif Tamil',serif;background:#120E05;display:flex;justify-content:center;align-items:center}
#root{width:100%;max-width:430px;height:100%;max-height:100vh;background:var(--w);position:relative;overflow:hidden;display:flex;flex-direction:column}
@media(min-width:460px){#root{height:min(900px,96vh);border-radius:44px;box-shadow:0 0 0 1px rgba(184,147,74,.15),0 0 80px rgba(184,147,74,.2),var(--shadow-lg)}}

/* ── Scrollable areas ── */
.scr{flex:1;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;scroll-behavior:smooth}
.scr::-webkit-scrollbar{display:none}
.scr{scrollbar-width:none}

/* ── Screens ── */
.view{position:absolute;inset:0;display:flex;flex-direction:column;background:var(--w);will-change:transform,opacity}
.view-enter{animation:slideUp .32s cubic-bezier(.34,1.1,.64,1) forwards}
.view-exit{animation:slideDown .24s ease-in forwards}
@keyframes slideUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideDown{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(18px)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes pulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.18);opacity:.3}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:-300% 0}100%{background-position:300% 0}}
@keyframes ripple{0%{transform:scale(0);opacity:.4}100%{transform:scale(2.5);opacity:0}}
@keyframes countUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.stagger-1{animation:fadeIn .4s .06s both}
.stagger-2{animation:fadeIn .4s .12s both}
.stagger-3{animation:fadeIn .4s .18s both}
.stagger-4{animation:fadeIn .4s .24s both}
.stagger-5{animation:fadeIn .4s .30s both}
.stagger-6{animation:fadeIn .4s .36s both}
.count-up{animation:countUp .5s ease both}

/* ── Status Bar ── */
.status{padding:14px 22px 6px;display:flex;justify-content:space-between;align-items:center;background:var(--w);flex-shrink:0}
.s-time{font-family:'Cinzel',serif;font-size:12px;font-weight:700;color:var(--dark)}
.s-icons{display:flex;gap:5px;align-items:center}
.s-dot{width:5px;height:5px;border-radius:50%;background:var(--g2)}

/* ── Header ── */
.app-hd{flex-shrink:0;background:var(--w);border-bottom:1px solid rgba(184,147,74,.1);padding:0 18px 14px}
.hd-inner{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px}
.hd-left{display:flex;align-items:center;gap:6px}
.hd-center{display:flex;flex-direction:column;align-items:center}
.hd-right{display:flex;align-items:center;justify-content:flex-end;gap:8px}
.hd-title{font-family:'Cinzel',serif;font-size:17px;font-weight:900;letter-spacing:2.5px;background:linear-gradient(135deg,var(--gd) 0%,var(--g2) 50%,var(--gd) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1.2;white-space:nowrap}
.hd-subtitle{font-family:'Noto Serif Tamil',serif;font-size:9px;color:var(--muted);letter-spacing:1px;line-height:1}
.hd-btn{width:36px;height:36px;background:var(--cream);border:1px solid rgba(184,147,74,.18);border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;position:relative;transition:var(--transition)}
.hd-btn:active{transform:scale(.93);background:var(--cream2)}
.hd-badge{position:absolute;top:5px;right:5px;min-width:16px;height:16px;border-radius:8px;background:var(--red);color:white;font-size:8px;font-weight:800;display:flex;align-items:center;justify-content:center;border:2px solid var(--w);font-family:'Cinzel',serif;padding:0 2px}

/* ── Lang toggle ── */
.lang-sw{display:flex;background:var(--cream);border-radius:9px;padding:2px}
.lang-btn{padding:5px 10px;border:none;background:transparent;font-size:10px;font-weight:800;border-radius:7px;cursor:pointer;color:var(--muted);transition:var(--transition);font-family:'Cinzel',serif;letter-spacing:.5px}
.lang-btn.on{background:var(--w);color:var(--gd);box-shadow:var(--shadow-sm)}

/* ── Auth Screen ── */
.auth-bg{flex:1;display:flex;flex-direction:column;align-items:center;overflow-y:auto;padding-bottom:32px}
.auth-bg::-webkit-scrollbar{display:none}
.lotus-wrap{position:relative;width:96px;height:96px;margin:28px auto 14px;animation:float 3.5s ease-in-out infinite}
.lotus-ring{position:absolute;inset:-14px;border-radius:50%;background:radial-gradient(circle,rgba(184,147,74,.3) 0%,transparent 65%);animation:pulse 3s ease-in-out infinite}
.a-name{font-family:'Cinzel',serif;font-size:26px;font-weight:900;letter-spacing:3px;background:linear-gradient(135deg,var(--gd),var(--g2),var(--gd));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;text-align:center}
.a-tamil{font-family:'Noto Serif Tamil',serif;font-size:15px;font-weight:600;color:var(--gd);text-align:center;margin-top:2px}
.a-tag{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);text-align:center;margin:5px 0 18px}
.a-divider{width:64px;height:1px;background:linear-gradient(90deg,transparent,var(--g2),transparent);margin:0 auto 22px}
.a-tabs{display:flex;width:calc(100% - 48px);background:var(--cream);border-radius:13px;padding:3px;margin-bottom:20px}
.a-tab{flex:1;padding:9px;border:none;background:transparent;font-family:'Cinzel',serif;font-size:12px;font-weight:700;color:var(--muted);border-radius:10px;cursor:pointer;transition:var(--transition);letter-spacing:.5px}
.a-tab.on{background:var(--w);color:var(--gd);box-shadow:var(--shadow-sm)}
.a-form{width:calc(100% - 48px)}
.f-group{margin-bottom:14px}
.f-lbl{display:block;font-size:9px;font-weight:800;color:var(--gd);letter-spacing:1.8px;text-transform:uppercase;margin-bottom:5px;font-family:'Cinzel',serif}
.f-input{width:100%;padding:13px 15px;background:var(--cream);border:1.5px solid rgba(184,147,74,.2);border-radius:13px;font-family:'Cormorant Garamond','Noto Serif Tamil',serif;font-size:15px;color:var(--dark);outline:none;transition:var(--transition)}
.f-input:focus{border-color:var(--g2);background:var(--w);box-shadow:0 0 0 3px rgba(184,147,74,.1)}
.f-input::placeholder{color:var(--muted);opacity:.6}
.otp-row{display:flex;gap:8px;margin-bottom:18px}
.otp-box{flex:1;padding:13px 4px;background:var(--cream);border:1.5px solid rgba(184,147,74,.2);border-radius:12px;font-family:'Cinzel',serif;font-size:22px;font-weight:700;color:var(--gd);text-align:center;outline:none;transition:var(--transition)}
.otp-box:focus{border-color:var(--g2);background:var(--w)}
.btn-gold{width:100%;padding:14px;background:linear-gradient(135deg,var(--gd) 0%,var(--g2) 50%,var(--gm) 100%);border:none;border-radius:14px;font-family:'Cinzel',serif;font-size:13px;font-weight:700;color:var(--w);letter-spacing:2px;cursor:pointer;box-shadow:var(--shadow-gold);transition:var(--transition);margin-top:6px;display:flex;align-items:center;justify-content:center;gap:8px;position:relative;overflow:hidden}
.btn-gold::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,.12);opacity:0;transition:opacity .2s}
.btn-gold:hover::after{opacity:1}
.btn-gold:active{transform:scale(.98);box-shadow:0 2px 10px rgba(184,147,74,.3)}
.btn-gold:disabled{opacity:.55;cursor:not-allowed}
.btn-ghost{background:transparent;color:var(--gd);box-shadow:none;border:1.5px solid rgba(184,147,74,.3)}
.btn-sm{width:auto;padding:9px 16px;font-size:10px;border-radius:10px;margin-top:0}
.btn-danger{background:linear-gradient(135deg,#B83030,var(--red))}
.sw-text{text-align:center;margin-top:14px;font-size:12px;color:var(--mid)}
.sw-text a{color:var(--gd);font-weight:700;cursor:pointer}
.err-msg{color:var(--red);font-size:11px;text-align:center;margin-bottom:10px;font-weight:600}

/* ── Spinner ── */
.spin{width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .65s linear infinite}

/* ── Greeting Card ── */
.greet{margin:14px 16px;padding:18px 20px 18px 20px;background:linear-gradient(135deg,#FBF5E6 0%,#F2E8D0 100%);border-radius:var(--r-lg);border:1px solid rgba(184,147,74,.18);position:relative;overflow:hidden;box-shadow:var(--shadow-md)}
.greet::before{content:'';position:absolute;top:-20px;right:-20px;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(184,147,74,.15),transparent 70%)}
.greet-emoji{position:absolute;right:18px;top:50%;transform:translateY(-50%);font-size:38px;opacity:.35;filter:drop-shadow(0 2px 4px rgba(0,0,0,.1))}
.g-hi{font-size:9px;font-weight:800;color:var(--gd);letter-spacing:2px;text-transform:uppercase;margin-bottom:3px;font-family:'Cinzel',serif}
.g-name{font-family:'Noto Serif Tamil',serif;font-size:19px;font-weight:700;color:var(--dark);line-height:1.3}
.g-quote{font-size:10.5px;color:var(--mid);margin-top:5px;font-style:italic;max-width:200px;line-height:1.55;opacity:.85}

/* ── Quick Actions ── */
.qa-row{display:flex;gap:10px;padding:0 16px;overflow-x:auto;scrollbar-width:none}
.qa-row::-webkit-scrollbar{display:none}
.qa-btn{flex-shrink:0;display:flex;align-items:center;gap:6px;padding:9px 14px;background:var(--cream);border:1.5px solid rgba(184,147,74,.2);border-radius:22px;cursor:pointer;transition:var(--transition);white-space:nowrap}
.qa-btn:active{transform:scale(.96);border-color:var(--g2);background:var(--cream2)}
.qa-icon{font-size:15px}
.qa-lbl{font-family:'Cinzel',serif;font-size:9px;font-weight:700;color:var(--gd);letter-spacing:.8px}

/* ── Section Header ── */
.sec-hd{padding:16px 18px 10px;display:flex;justify-content:space-between;align-items:center}
.sec-title{font-family:'Cinzel',serif;font-size:10px;font-weight:700;color:var(--gd);letter-spacing:2px;text-transform:uppercase;display:flex;align-items:center;gap:6px}
.sec-title::before{content:'';width:3px;height:14px;background:linear-gradient(var(--gd),var(--g3));border-radius:2px}
.sec-more{font-size:11px;color:var(--g2);font-weight:600;cursor:pointer;font-family:'Cormorant Garamond',serif}

/* ── Stats Row ── */
.stats-row{display:flex;gap:10px;padding:0 16px;overflow-x:auto;scrollbar-width:none}
.stats-row::-webkit-scrollbar{display:none}
.stat-chip{flex-shrink:0;background:var(--w);border:1px solid rgba(184,147,74,.15);border-radius:var(--r-md);padding:13px 16px;min-width:90px;box-shadow:var(--shadow-sm);transition:var(--transition);cursor:pointer}
.stat-chip:active{transform:scale(.97);border-color:var(--g2)}
.stat-icon{font-size:18px;margin-bottom:5px}
.stat-num{font-family:'Cinzel',serif;font-size:18px;font-weight:700;color:var(--gd);line-height:1}
.stat-lbl{font-size:8.5px;color:var(--muted);letter-spacing:.8px;margin-top:2px;text-transform:uppercase;font-family:'Cinzel',serif;font-weight:600}

/* ── Module Grid ── */
.mod-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 16px}
.mod-card{background:var(--w);border-radius:var(--r-lg);padding:18px 14px;border:1px solid rgba(184,147,74,.13);cursor:pointer;transition:var(--transition);position:relative;overflow:hidden;box-shadow:var(--shadow-sm);min-height:132px;display:flex;flex-direction:column;align-items:flex-start}
.mod-card:active{transform:scale(.97);border-color:rgba(184,147,74,.4);box-shadow:var(--shadow-gold)}
.mod-card-line{position:absolute;top:0;left:0;right:0;height:2.5px;background:linear-gradient(90deg,var(--gd),var(--g3));border-radius:var(--r-lg) var(--r-lg) 0 0;opacity:0;transition:opacity .3s}
.mod-card:active .mod-card-line{opacity:1}
.mod-icon{width:46px;height:46px;background:linear-gradient(135deg,var(--cream),var(--cream2));border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:11px;font-size:22px;border:1px solid rgba(184,147,74,.16)}
.mod-name{font-family:'Noto Serif Tamil',serif;font-size:13px;font-weight:700;color:var(--dark);margin-bottom:2px;line-height:1.3}
.mod-en{font-size:9px;color:var(--gd);letter-spacing:1px;text-transform:uppercase;font-weight:600;opacity:.75;font-family:'Cinzel',serif}
.mod-badge{position:absolute;top:11px;right:11px;background:linear-gradient(135deg,var(--gd),var(--g2));color:var(--w);font-size:7.5px;font-weight:800;padding:2px 7px;border-radius:20px;letter-spacing:.8px;font-family:'Cinzel',serif;display:flex;align-items:center;gap:3px}
.live-dot{width:5px;height:5px;border-radius:50%;background:#E05252;animation:pulse 1.2s ease-in-out infinite;display:inline-block}

/* ── Activity List ── */
.act-list{padding:0 16px}
.act-row{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid rgba(184,147,74,.07)}
.act-row:last-child{border:none}
.act-ico{width:40px;height:40px;flex-shrink:0;background:linear-gradient(135deg,var(--cream),var(--cream2));border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:18px;border:1px solid rgba(184,147,74,.12)}
.act-t{font-family:'Noto Serif Tamil',serif;font-size:12px;font-weight:600;color:var(--dark);margin-bottom:1px}
.act-s{font-size:10px;color:var(--muted)}
.act-time{font-size:9px;color:var(--gd);font-weight:700;font-family:'Cinzel',serif;flex-shrink:0}

/* ── Bottom Nav ── */
.bot-nav{flex-shrink:0;display:flex;background:var(--w);border-top:1px solid rgba(184,147,74,.1);padding:10px 0 max(18px,env(safe-area-inset-bottom,18px));position:relative}
.bot-nav::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(184,147,74,.25),transparent)}
.nav-it{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;position:relative}
.nav-ico{width:38px;height:38px;display:flex;align-items:center;justify-content:center;border-radius:12px;font-size:17px;transition:var(--transition)}
.nav-it.on .nav-ico{background:linear-gradient(135deg,var(--cream),var(--cream2));border:1px solid rgba(184,147,74,.22);box-shadow:var(--shadow-sm)}
.nav-lbl{font-size:8px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;color:var(--muted);opacity:.4;transition:var(--transition);font-family:'Cinzel',serif}
.nav-it.on .nav-lbl{color:var(--gd);opacity:1}

/* ── FAB ── */
.fab{position:absolute;bottom:76px;right:18px;width:52px;height:52px;background:linear-gradient(135deg,var(--gd),var(--g2));border:none;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 18px rgba(184,147,74,.5);font-size:24px;color:var(--w);transition:var(--transition);z-index:50}
.fab:active{transform:scale(.93)}

/* ── Detail Header ── */
.det-hd{flex-shrink:0;padding:50px 18px 18px;background:linear-gradient(180deg,var(--cream) 0%,var(--w) 100%);border-bottom:1px solid rgba(184,147,74,.1)}
.back-btn{display:inline-flex;align-items:center;gap:6px;cursor:pointer;color:var(--gd);font-weight:700;font-size:12px;margin-bottom:14px;font-family:'Cinzel',serif;letter-spacing:.5px;transition:var(--transition)}
.back-btn:active{opacity:.7}
.det-ico{font-size:34px;margin-bottom:8px}
.det-title{font-family:'Noto Serif Tamil',serif;font-size:22px;font-weight:700;color:var(--dark);margin-bottom:3px}
.det-sub{font-size:10px;color:var(--gd);letter-spacing:2px;text-transform:uppercase;font-weight:700;font-family:'Cinzel',serif}

/* ── Post Card ── */
.post-card{background:var(--w);border:1px solid rgba(184,147,74,.11);border-radius:var(--r-lg);padding:15px;margin-bottom:12px;box-shadow:var(--shadow-sm);animation:fadeIn .3s ease both}
.post-user{display:flex;align-items:center;gap:10px;margin-bottom:11px}
.post-av{width:36px;height:36px;background:linear-gradient(135deg,var(--cream),var(--cream2));border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:18px;border:1px solid rgba(184,147,74,.14);flex-shrink:0}
.post-uname{font-family:'Noto Serif Tamil',serif;font-size:13px;font-weight:700;color:var(--dark)}
.post-time{font-size:9.5px;color:var(--muted)}
.post-text{font-family:'Noto Serif Tamil',serif;font-size:13px;color:var(--dark);line-height:1.65;margin-bottom:11px}
.post-acts{display:flex;gap:4px}
.p-btn{display:flex;align-items:center;gap:4px;cursor:pointer;font-size:11px;color:var(--mid);font-weight:600;padding:6px 10px;border-radius:9px;transition:var(--transition);border:none;background:transparent;font-family:'Cormorant Garamond',serif}
.p-btn:active{background:var(--cream)}
.p-btn.liked{color:var(--red)}
.tag{display:inline-block;padding:2px 8px;background:rgba(184,147,74,.1);border-radius:20px;font-size:9px;font-weight:700;color:var(--gd);letter-spacing:.5px;margin-right:4px;margin-bottom:5px;font-family:'Cinzel',serif}
.live-tag{background:rgba(201,64,64,.1);color:var(--red)}
.new-post-wrap{background:var(--cream);border-radius:var(--r-md);padding:13px;margin-bottom:14px;border:1px solid rgba(184,147,74,.14)}
.np-input{width:100%;background:var(--w);border:1.5px solid rgba(184,147,74,.18);border-radius:11px;padding:11px;font-family:'Noto Serif Tamil',serif;font-size:13px;color:var(--dark);outline:none;resize:none;height:76px;transition:var(--transition)}
.np-input:focus{border-color:var(--g2)}
.cmt-area{background:var(--cream);border-radius:11px;padding:11px;margin-top:9px}
.cmt-item{display:flex;gap:7px;margin-bottom:7px;font-size:11.5px;color:var(--dark)}
.cmt-row{display:flex;gap:7px;margin-top:7px}
.cmt-in{flex:1;background:var(--w);border:1px solid rgba(184,147,74,.18);border-radius:9px;padding:8px 11px;font-size:12px;font-family:'Noto Serif Tamil',serif;color:var(--dark);outline:none}

/* ── Product Card ── */
.prod-card{background:var(--w);border:1px solid rgba(184,147,74,.11);border-radius:var(--r-lg);padding:15px;margin-bottom:12px;box-shadow:var(--shadow-sm)}
.prod-top{display:flex;align-items:flex-start;gap:12px}
.prod-img{width:62px;height:62px;background:linear-gradient(135deg,var(--cream),var(--cream2));border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;border:1px solid rgba(184,147,74,.14)}
.prod-name{font-family:'Noto Serif Tamil',serif;font-size:14px;font-weight:700;color:var(--dark);margin-bottom:2px}
.prod-vendor{font-size:10px;color:var(--gd);font-weight:600;font-family:'Cinzel',serif}
.prod-price{font-family:'Cinzel',serif;font-size:17px;font-weight:700;color:var(--gd);margin-top:4px}
.prod-desc{font-size:11px;color:var(--muted);margin-top:6px;line-height:1.55}
.prod-btns{display:flex;gap:7px;margin-top:11px;flex-wrap:wrap}
.wa-btn{display:flex;align-items:center;gap:4px;padding:8px 13px;background:#25D366;border:none;border-radius:9px;font-size:10px;font-weight:800;color:var(--w);cursor:pointer;font-family:'Cinzel',serif;letter-spacing:.5px}
.call-btn{display:flex;align-items:center;gap:4px;padding:8px 13px;background:var(--cream);border:1px solid rgba(184,147,74,.2);border-radius:9px;font-size:10px;font-weight:700;color:var(--dark);cursor:pointer;font-family:'Cinzel',serif;transition:var(--transition)}
.call-btn:active{background:var(--cream2)}

/* ── Charity ── */
.charity-card{background:var(--w);border:1px solid rgba(184,147,74,.11);border-radius:var(--r-lg);padding:15px;margin-bottom:12px;box-shadow:var(--shadow-sm)}
.prog-bar{width:100%;height:7px;background:var(--cream2);border-radius:20px;overflow:hidden;margin:9px 0}
.prog-fill{height:100%;border-radius:20px;background:linear-gradient(90deg,var(--gd),var(--g2),var(--g4));transition:width 1s ease}
.urg-tag{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;background:rgba(201,64,64,.1);border-radius:20px;font-size:8.5px;font-weight:800;color:var(--red);font-family:'Cinzel',serif;letter-spacing:.5px}
.donate-btn{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;padding:11px;background:linear-gradient(135deg,var(--gd),var(--g2));border:none;border-radius:12px;font-family:'Cinzel',serif;font-size:10.5px;font-weight:700;color:var(--w);cursor:pointer;letter-spacing:1px;margin-top:11px;box-shadow:var(--shadow-gold);transition:var(--transition)}
.donate-btn:active{transform:scale(.98)}

/* ── Medical ── */
.hosp-card{background:var(--w);border:1px solid rgba(184,147,74,.11);border-radius:var(--r-lg);padding:15px;margin-bottom:12px;box-shadow:var(--shadow-sm)}
.hosp-name{font-family:'Noto Serif Tamil',serif;font-size:14px;font-weight:700;color:var(--dark);margin-bottom:2px}
.hosp-type{font-size:9.5px;color:var(--gd);font-weight:700;letter-spacing:.5px;margin-bottom:5px;font-family:'Cinzel',serif}
.hosp-addr{font-size:11px;color:var(--muted);margin-bottom:7px}
.hosp-btns{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}
.emrg-btn{display:flex;align-items:center;gap:4px;padding:8px 13px;background:linear-gradient(135deg,#B83030,var(--red));border:none;border-radius:9px;font-size:10px;font-weight:800;color:var(--w);cursor:pointer;font-family:'Cinzel',serif}
.book-btn{padding:8px 13px;background:var(--cream);border:1px solid rgba(184,147,74,.2);border-radius:9px;font-size:10px;font-weight:700;color:var(--gd);cursor:pointer;font-family:'Cinzel',serif}
.star{color:var(--g2);font-size:11px}
.tip-card{background:linear-gradient(135deg,var(--cream),var(--cream2));border-radius:var(--r-md);padding:13px;margin-bottom:10px;border:1px solid rgba(184,147,74,.14)}
.tip-ico{font-size:20px;margin-bottom:5px}
.tip-t{font-family:'Noto Serif Tamil',serif;font-size:13px;font-weight:700;color:var(--dark);margin-bottom:3px}
.tip-tx{font-size:11px;color:var(--mid);line-height:1.55;opacity:.85}

/* ── Notifications ── */
.notif-card{background:var(--w);border:1px solid rgba(184,147,74,.1);border-radius:var(--r-md);padding:13px;margin-bottom:9px;display:flex;gap:11px;align-items:flex-start;box-shadow:var(--shadow-sm)}
.notif-card.unread{background:linear-gradient(135deg,#FDFAF4,var(--w));border-color:rgba(184,147,74,.22)}
.n-dot{width:7px;height:7px;border-radius:50%;background:var(--g2);flex-shrink:0;margin-top:5px}
.n-dot.read{background:var(--cream2);border:1px solid rgba(184,147,74,.2)}
.n-msg{font-family:'Noto Serif Tamil',serif;font-size:12.5px;color:var(--dark);font-weight:600;line-height:1.5}
.n-time{font-size:9.5px;color:var(--muted);margin-top:3px}

/* ── Profile ── */
.prof-hd{background:linear-gradient(180deg,var(--cream) 0%,var(--w) 65%);padding:54px 22px 22px;text-align:center}
.prof-av{width:76px;height:76px;margin:0 auto 11px;background:linear-gradient(135deg,var(--cream),var(--cream2));border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:32px;border:2.5px solid rgba(184,147,74,.28);box-shadow:0 0 0 5px rgba(184,147,74,.07),var(--shadow-md)}
.prof-name{font-family:'Noto Serif Tamil',serif;font-size:19px;font-weight:700;color:var(--dark)}
.prof-id{font-size:9.5px;color:var(--gd);letter-spacing:1.8px;font-weight:700;margin-top:3px;font-family:'Cinzel',serif}
.prof-item{display:flex;align-items:center;justify-content:space-between;padding:13px 0;border-bottom:1px solid rgba(184,147,74,.07);cursor:pointer;transition:var(--transition)}
.prof-item:active{opacity:.7}
.pi-left{display:flex;align-items:center;gap:11px}
.pi-ico{width:38px;height:38px;background:var(--cream);border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:16px;border:1px solid rgba(184,147,74,.12)}
.pi-lbl{font-family:'Noto Serif Tamil',serif;font-size:13px;font-weight:600;color:var(--dark)}
.pi-sub{font-size:9.5px;color:var(--muted)}
.pi-arr{color:var(--g2);font-size:16px;opacity:.7}

/* ── Modal ── */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:200;display:flex;align-items:flex-end;justify-content:center;opacity:0;pointer-events:none;transition:opacity .28s;backdrop-filter:blur(3px)}
.overlay.open{opacity:1;pointer-events:all}
.modal{width:100%;max-width:430px;background:var(--w);border-radius:28px 28px 0 0;padding:24px 22px 40px;transform:translateY(100%);transition:transform .34s cubic-bezier(.34,1.1,.64,1)}
.overlay.open .modal{transform:translateY(0)}
.modal-handle{width:34px;height:4px;background:rgba(0,0,0,.1);border-radius:2px;margin:0 auto 18px}
.modal-title{font-family:'Noto Serif Tamil',serif;font-size:17px;font-weight:700;color:var(--dark);margin-bottom:14px}
.amt-row{display:flex;gap:8px;margin-bottom:13px}
.amt-btn{flex:1;padding:10px 4px;border:1.5px solid rgba(184,147,74,.22);border-radius:11px;background:transparent;font-family:'Cinzel',serif;font-size:12px;font-weight:700;color:var(--gd);cursor:pointer;transition:var(--transition)}
.amt-btn.on{background:var(--g2);color:var(--w);border-color:var(--g2)}

/* ── Toast ── */
.toast{position:fixed;top:16px;left:50%;transform:translateX(-50%) translateY(-90px);background:var(--dark);color:var(--w);padding:10px 20px;border-radius:24px;font-size:12px;font-weight:600;z-index:500;transition:transform .38s cubic-bezier(.34,1.4,.64,1);white-space:nowrap;box-shadow:var(--shadow-lg);max-width:320px;text-align:center;pointer-events:none;font-family:'Cormorant Garamond',serif}
.toast.show{transform:translateX(-50%) translateY(0)}

/* ── Filter chips ── */
.filter-row{display:flex;gap:7px;overflow-x:auto;scrollbar-width:none;padding:0 16px 2px}
.filter-row::-webkit-scrollbar{display:none}
.f-chip{flex-shrink:0;padding:6px 14px;border:1.5px solid rgba(184,147,74,.2);border-radius:20px;background:transparent;font-family:'Cinzel',serif;font-size:9.5px;font-weight:700;color:var(--gd);cursor:pointer;transition:var(--transition);text-transform:capitalize;letter-spacing:.5px}
.f-chip.on{background:var(--g2);color:var(--w);border-color:var(--g2);box-shadow:0 2px 8px rgba(184,147,74,.3)}
`;

// ─────────────────────────────────────────────
//  LOTUS SVG
// ─────────────────────────────────────────────
function Lotus({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 38" fill="none">
      <ellipse cx="19" cy="13" rx="4" ry="10" fill="white" stroke="#B8934A" strokeWidth="1.2" transform="rotate(-20 19 19)" />
      <ellipse cx="19" cy="13" rx="4" ry="10" fill="white" stroke="#B8934A" strokeWidth="1.2" />
      <ellipse cx="19" cy="13" rx="4" ry="10" fill="white" stroke="#B8934A" strokeWidth="1.2" transform="rotate(20 19 19)" />
      <ellipse cx="19" cy="15" rx="3" ry="7" fill="#F7F1E3" stroke="#C4963E" strokeWidth="1" transform="rotate(-10 19 19)" />
      <ellipse cx="19" cy="15" rx="3" ry="7" fill="#F7F1E3" stroke="#C4963E" strokeWidth="1" transform="rotate(10 19 19)" />
      <circle cx="19" cy="19" r="4" fill="#B8934A" />
      <circle cx="19" cy="19" r="2.2" fill="#E8C87A" />
    </svg>
  );
}

function LotusLarge() {
  return (
    <svg width="96" height="96" viewBox="0 0 110 110" fill="none">
      <ellipse cx="55" cy="38" rx="10" ry="24" fill="white" stroke="#B8934A" strokeWidth="1.5" transform="rotate(-40 55 55)" />
      <ellipse cx="55" cy="38" rx="10" ry="24" fill="white" stroke="#B8934A" strokeWidth="1.5" transform="rotate(-20 55 55)" />
      <ellipse cx="55" cy="38" rx="10" ry="24" fill="white" stroke="#B8934A" strokeWidth="1.5" />
      <ellipse cx="55" cy="38" rx="10" ry="24" fill="white" stroke="#B8934A" strokeWidth="1.5" transform="rotate(20 55 55)" />
      <ellipse cx="55" cy="38" rx="10" ry="24" fill="white" stroke="#B8934A" strokeWidth="1.5" transform="rotate(40 55 55)" />
      <ellipse cx="55" cy="42" rx="7" ry="17" fill="#F7F1E3" stroke="#C4963E" strokeWidth="1.5" transform="rotate(-30 55 55)" />
      <ellipse cx="55" cy="42" rx="7" ry="17" fill="#F7F1E3" stroke="#C4963E" strokeWidth="1.5" transform="rotate(-10 55 55)" />
      <ellipse cx="55" cy="42" rx="7" ry="17" fill="#F7F1E3" stroke="#C4963E" strokeWidth="1.5" transform="rotate(10 55 55)" />
      <ellipse cx="55" cy="42" rx="7" ry="17" fill="#F7F1E3" stroke="#C4963E" strokeWidth="1.5" transform="rotate(30 55 55)" />
      <circle cx="55" cy="55" r="10" fill="#B8934A" opacity="0.9" />
      <circle cx="55" cy="55" r="6" fill="#E8C87A" />
      <circle cx="55" cy="55" r="26" stroke="#B8934A" strokeWidth="0.7" strokeDasharray="3 5" opacity="0.45" />
    </svg>
  );
}

// ─────────────────────────────────────────────
//  TOAST HOOK
// ─────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState("");
  const timer = useRef(null);
  const show = useCallback(m => {
    setMsg(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(""), 2600);
  }, []);
  return [msg, show];
}

// ─────────────────────────────────────────────
//  STATUS BAR
// ─────────────────────────────────────────────
function StatusBar() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  );
  useEffect(() => {
    const id = setInterval(() =>
      setTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }))
    , 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="status">
      <span className="s-time">{time}</span>
      <div className="s-icons">
        <div className="s-dot" />
        <div className="s-dot" style={{ opacity: .45 }} />
        <div className="s-dot" style={{ opacity: .2 }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  APP HEADER
// ─────────────────────────────────────────────
function AppHeader({ lang, setLang, onBack, backLabel, onNotif, notifCount }) {
  return (
    <div className="app-hd">
      <StatusBar />
      <div className="hd-inner" style={{ marginTop: 6 }}>
        <div className="hd-left">
          {onBack ? (
            <div className="back-btn" onClick={onBack}>← {backLabel || t("back", lang)}</div>
          ) : (
            <Lotus size={32} />
          )}
        </div>
        <div className="hd-center">
          <div className="hd-title">THIRUVASAL</div>
          <div className="hd-subtitle">{t("tagline", lang)}</div>
        </div>
        <div className="hd-right">
          <div className="lang-sw">
            <button className={`lang-btn${lang === "ta" ? " on" : ""}`} onClick={() => setLang("ta")}>தமி</button>
            <button className={`lang-btn${lang === "en" ? " on" : ""}`} onClick={() => setLang("en")}>EN</button>
          </div>
          {onNotif && (
            <div className="hd-btn" onClick={onNotif}>
              🔔
              {notifCount > 0 && <div className="hd-badge">{notifCount > 9 ? "9+" : notifCount}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  BOTTOM NAV
// ─────────────────────────────────────────────
function BottomNav({ tab, setTab, lang }) {
  const items = [
    { id: "home",     icon: "🏠", key: "home"     },
    { id: "spiritual",icon: "🛕", key: "spiritual" },
    { id: "market",   icon: "🛒", key: "market"    },
    { id: "profile",  icon: "👤", key: "profile"   },
  ];
  return (
    <div className="bot-nav">
      {items.map(it => (
        <div key={it.id} className={`nav-it${tab === it.id ? " on" : ""}`} onClick={() => setTab(it.id)}>
          <div className="nav-ico">{it.icon}</div>
          <div className="nav-lbl">{t(it.key, lang)}</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
//  AUTH SCREEN
// ─────────────────────────────────────────────
function AuthScreen({ onLogin, showToast, lang, setLang }) {
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pwd, setPwd] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const refs = useRef([]);

  const signIn = async () => {
    if (!/^\d{10}$/.test(phone)) { setErr("Enter valid 10-digit number"); return; }
    if (!pwd) { setErr("Enter password"); return; }
    setLoading(true); setErr("");
    const user = await Auth.signIn(phone, pwd);
    onLogin(user);
    setLoading(false);
  };

  const sendOTP = async () => {
    if (name.trim().length < 2) { setErr("Enter your name"); return; }
    if (!/^\d{10}$/.test(phone)) { setErr("Enter valid 10-digit number"); return; }
    if (pwd.length < 6) { setErr("Password must be 6+ characters"); return; }
    setLoading(true); setErr("");
    await delay(900);
    setLoading(false);
    setMode("otp");
    showToast("📲 OTP sent! (Demo: 123456)");
  };

  const verifyOTP = async () => {
    if (otp.join("") !== "123456") { setErr("Invalid OTP"); return; }
    setLoading(true); setErr("");
    try {
      const user = await Auth.register(name, phone, pwd);
      onLogin(user);
    } catch (e) { setErr(e.message); setLoading(false); }
  };

  const handleOTP = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
    if (!v && i > 0) refs.current[i - 1]?.focus();
  };

  return (
    <div className="view" style={{ position: "relative" }}>
      <div style={{ flexShrink: 0, padding: "6px 18px 8px", display: "flex", justifyContent: "flex-end" }}>
        <div className="lang-sw">
          <button className={`lang-btn${lang === "ta" ? " on" : ""}`} onClick={() => setLang("ta")}>தமி</button>
          <button className={`lang-btn${lang === "en" ? " on" : ""}`} onClick={() => setLang("en")}>EN</button>
        </div>
      </div>
      <div className="auth-bg">
        <div className="lotus-wrap">
          <div className="lotus-ring" />
          <LotusLarge />
        </div>
        <div className="a-name">THIRUVASAL</div>
        <div className="a-tamil">{t("appName", lang)}</div>
        <div className="a-tag">{t("tagline", lang)}</div>
        <div className="a-divider" />

        {mode !== "otp" && (
          <div className="a-tabs">
            <button className={`a-tab${mode === "signin" ? " on" : ""}`} onClick={() => { setMode("signin"); setErr(""); }}>{t("signIn", lang)}</button>
            <button className={`a-tab${mode === "register" ? " on" : ""}`} onClick={() => { setMode("register"); setErr(""); }}>{t("register", lang)}</button>
          </div>
        )}

        {err && <div className="err-msg">⚠ {err}</div>}

        {mode === "signin" && (
          <div className="a-form">
            <div className="f-group">
              <label className="f-lbl">📱 {t("mobile", lang)}</label>
              <input className="f-input" type="tel" maxLength={10} placeholder="9876543210" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ""))} />
            </div>
            <div className="f-group">
              <label className="f-lbl">🔐 {t("password", lang)}</label>
              <input className="f-input" type="password" placeholder="••••••••" value={pwd} onChange={e => setPwd(e.target.value)} onKeyDown={e => e.key === "Enter" && signIn()} />
            </div>
            <button className="btn-gold" onClick={signIn} disabled={loading}>
              {loading ? <div className="spin" /> : t("enter", lang) + " ✦"}
            </button>
            <div className="sw-text">{lang === "ta" ? "புதியவரா?" : "New?"} <a onClick={() => setMode("register")}>{t("register", lang)}</a></div>
          </div>
        )}

        {mode === "register" && (
          <div className="a-form">
            <div className="f-group">
              <label className="f-lbl">👤 {t("fullName", lang)}</label>
              <input className="f-input" placeholder={lang === "ta" ? "உங்கள் பெயர்" : "Your Name"} value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="f-group">
              <label className="f-lbl">📱 {t("mobile", lang)}</label>
              <input className="f-input" type="tel" maxLength={10} placeholder="9876543210" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ""))} />
            </div>
            <div className="f-group">
              <label className="f-lbl">🔐 {t("password", lang)}</label>
              <input className="f-input" type="password" placeholder={lang === "ta" ? "கடவுச்சொல் (6+)" : "Password (6+)"} value={pwd} onChange={e => setPwd(e.target.value)} />
            </div>
            <button className="btn-gold" onClick={sendOTP} disabled={loading}>
              {loading ? <div className="spin" /> : t("sendOTP", lang) + " →"}
            </button>
            <div className="sw-text">{lang === "ta" ? "ஏற்கெனவே உள்ளீர்களா?" : "Have account?"} <a onClick={() => setMode("signin")}>{t("signIn", lang)}</a></div>
          </div>
        )}

        {mode === "otp" && (
          <div className="a-form">
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 34, marginBottom: 8 }}>📲</div>
              <div style={{ fontFamily: "'Noto Serif Tamil',serif", fontSize: 13, color: "var(--dark)", marginBottom: 3 }}>
                {lang === "ta" ? "OTP அனுப்பப்பட்டது" : "OTP Sent"}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>+91 {phone} &nbsp;·&nbsp; Demo: 123456</div>
            </div>
            <div className="otp-row">
              {otp.map((v, i) => (
                <input key={i} ref={el => refs.current[i] = el} className="otp-box" type="tel" maxLength={1} value={v}
                  onChange={e => handleOTP(i, e.target.value)}
                  onKeyDown={e => e.key === "Backspace" && !otp[i] && i > 0 && refs.current[i - 1]?.focus()} />
              ))}
            </div>
            {err && <div className="err-msg">⚠ {err}</div>}
            <button className="btn-gold" onClick={verifyOTP} disabled={loading}>
              {loading ? <div className="spin" /> : t("verify", lang) + " ✦"}
            </button>
            <div className="sw-text"><a onClick={() => { setMode("register"); setOtp(Array(6).fill("")); setErr(""); }}>← {lang === "ta" ? "எண்ணை மாற்று" : "Change number"}</a></div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  HOME SCREEN
// ─────────────────────────────────────────────
function HomeScreen({ user, lang, setLang, setTab, showToast, onNotif, notifCount }) {
  const [posts]  = useState(DB.spiritualPosts);
  const [chars]  = useState(DB.charityRequests);
  const totalDonated = useMemo(() => chars.reduce((a, c) => a + c.collected, 0), [chars]);

  const stats = [
    { ico: "📿", num: DB.spiritualPosts.length,         key: "posts"    },
    { ico: "❤️", num: "₹" + (totalDonated/1000).toFixed(1) + "K", key: "donated"  },
    { ico: "🛒", num: DB.businessListings.length,        key: "products" },
    { ico: "🏥", num: DB.medicalServices.length,          key: "doctors"  },
  ];

  const modules = [
    { id:"spiritual", icon:"🛕", ta:"பதி இணைப்பு",  en:"Spiritual",  badge:"LIVE", live:true },
    { id:"market",    icon:"🛒", ta:"வர்த்தகம்",    en:"Business",   badge:"NEW",  live:false },
    { id:"charity",   icon:"🤝", ta:"தருமநிலயம்",   en:"Charity",    badge:null,   live:false },
    { id:"medical",   icon:"🏥", ta:"மருத்துவம்",   en:"Medical",    badge:null,   live:false },
  ];

  const quickActions = [
    { ico:"❤️",  labelKey:"donateNow",   onClick:() => setTab("charity")  },
    { ico:"✍️",  labelKey:"createPost",  onClick:() => setTab("spiritual") },
    { ico:"🛒",  labelKey:"addBusiness", onClick:() => setTab("market")   },
    { ico:"🏥",  labelKey:"doctors",     onClick:() => setTab("medical")  },
  ];

  return (
    <div className="view" style={{ position: "relative" }}>
      <AppHeader lang={lang} setLang={setLang} onNotif={onNotif} notifCount={notifCount} />
      <div className="scr">
        {/* Greeting */}
        <div className="greet stagger-1">
          <div className="greet-emoji">🪷</div>
          <div className="g-hi">{t("welcome", lang)}</div>
          <div className="g-name">🙏 {user?.name || (lang === "ta" ? "நண்பரே" : "Friend")}</div>
          <div className="g-quote">
            {lang === "ta" ? "அறம் செய விரும்பு — Embrace righteousness" : "அறம் செய விரும்பு — Embrace righteousness"}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="sec-hd stagger-2" style={{ paddingBottom: 8 }}>
          <div className="sec-title">{lang === "ta" ? "விரைவு செயல்கள்" : "Quick Actions"}</div>
        </div>
        <div className="qa-row stagger-2">
          {quickActions.map(qa => (
            <div className="qa-btn" key={qa.labelKey} onClick={qa.onClick}>
              <span className="qa-icon">{qa.ico}</span>
              <span className="qa-lbl">{t(qa.labelKey, lang)}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="sec-hd stagger-3">
          <div className="sec-title">{t("activity", lang)}</div>
        </div>
        <div className="stats-row stagger-3">
          {stats.map((s, i) => (
            <div className="stat-chip count-up" key={i} style={{ animationDelay: i * 0.06 + "s" }}
              onClick={() => { const map = ["spiritual","charity","market","medical"]; setTab(map[i]); }}>
              <div className="stat-icon">{s.ico}</div>
              <div className="stat-num">{s.num}</div>
              <div className="stat-lbl">{t(s.key, lang)}</div>
            </div>
          ))}
        </div>

        {/* Modules */}
        <div className="sec-hd stagger-4">
          <div className="sec-title">{t("sections", lang)}</div>
        </div>
        <div className="mod-grid stagger-4">
          {modules.map(m => (
            <div className="mod-card" key={m.id} onClick={() => setTab(m.id)}>
              <div className="mod-card-line" />
              {m.badge && (
                <div className="mod-badge">
                  {m.live && <span className="live-dot" />}
                  {m.badge}
                </div>
              )}
              <div className="mod-icon">{m.icon}</div>
              <div className="mod-name">{lang === "ta" ? m.ta : m.en}</div>
              <div className="mod-en">{lang === "ta" ? m.en : m.ta}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="sec-hd stagger-5">
          <div className="sec-title">{t("recentActivity", lang)}</div>
          <div className="sec-more" onClick={() => setTab("spiritual")}>{t("seeAll", lang)} →</div>
        </div>
        <div className="act-list stagger-6">
          {posts.slice(0, 3).map(p => (
            <div className="act-row" key={p.id}>
              <div className="act-ico">{p.isLive ? "🔴" : "🛕"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="act-t" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.text}</div>
                <div className="act-s">{t("postedBy", lang)} {p.userName}</div>
              </div>
              <div className="act-time">{timeAgo(p.createdAt, lang)}</div>
            </div>
          ))}
          {DB.charityRequests.slice(0, 1).map(c => (
            <div className="act-row" key={c.id} onClick={() => setTab("charity")} style={{ cursor: "pointer" }}>
              <div className="act-ico">❤️</div>
              <div style={{ flex: 1 }}>
                <div className="act-t">{c.title}</div>
                <div className="act-s">₹{c.collected.toLocaleString()} {t("collected", lang)}</div>
              </div>
              <div className="act-time">{timeAgo(c.createdAt, lang)}</div>
            </div>
          ))}
        </div>
        <div style={{ height: 28 }} />
      </div>

      {/* FAB */}
      <button className="fab" onClick={() => setTab("spiritual")} title="Create Post">✦</button>
    </div>
  );
}

// ─────────────────────────────────────────────
//  SPIRITUAL SCREEN
// ─────────────────────────────────────────────
function SpiritualScreen({ user, lang, setLang, goBack, showToast }) {
  const [posts, setPosts] = useState(DB.spiritualPosts);
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [openComment, setOpenComment] = useState(null);
  const [cmt, setCmt] = useState("");

  const addPost = async () => {
    if (!newText.trim()) return;
    setLoading(true);
    await delay(500);
    const p = { id: uid(), userId: user.id, userName: user.name, avatar: user.avatar, text: newText, likes: [], comments: [], createdAt: Date.now(), isLive: false };
    DB.spiritualPosts.unshift(p);
    DB.notifications.unshift({ id: uid(), type: "spiritual", msg: user.name + ": " + newText.slice(0, 50), read: false, createdAt: Date.now() });
    setPosts([...DB.spiritualPosts]);
    setNewText(""); setLoading(false);
    showToast("✅ " + (lang === "ta" ? "பதிவு சேர்க்கப்பட்டது!" : "Post added!"));
  };

  const toggleLike = id => {
    const idx = DB.spiritualPosts.findIndex(p => p.id === id);
    const liked = DB.spiritualPosts[idx].likes.includes(user.id);
    if (liked) DB.spiritualPosts[idx].likes = DB.spiritualPosts[idx].likes.filter(x => x !== user.id);
    else DB.spiritualPosts[idx].likes.push(user.id);
    setPosts([...DB.spiritualPosts]);
  };

  const addComment = id => {
    if (!cmt.trim()) return;
    const idx = DB.spiritualPosts.findIndex(p => p.id === id);
    DB.spiritualPosts[idx].comments.push({ userId: user.id, userName: user.name, text: cmt });
    setPosts([...DB.spiritualPosts]);
    setCmt(""); setOpenComment(null);
    showToast("💬 " + (lang === "ta" ? "கருத்து சேர்க்கப்பட்டது" : "Comment added"));
  };

  return (
    <div className="view view-enter">
      <AppHeader lang={lang} setLang={setLang} onBack={goBack} />
      <div className="det-hd" style={{ paddingTop: 10 }}>
        <div className="det-ico">🛕</div>
        <div className="det-title">{lang === "ta" ? "பதி இணைப்பு" : "Spiritual Connect"}</div>
        <div className="det-sub">{lang === "ta" ? "ஆன்மீக சமூகம்" : "Spiritual Community"}</div>
      </div>
      <div className="scr" style={{ padding: "14px 14px 28px" }}>
        {/* New Post */}
        <div className="new-post-wrap">
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div className="post-av">{user.avatar}</div>
            <textarea className="np-input" placeholder={t("shareThought", lang)} value={newText} onChange={e => setNewText(e.target.value)} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button className="btn-gold btn-sm" onClick={addPost} disabled={loading || !newText.trim()}>
              {loading ? <div className="spin" style={{ width: 14, height: 14 }} /> : t("post", lang) + " ✦"}
            </button>
          </div>
        </div>

        {posts.map(p => (
          <div className="post-card" key={p.id}>
            <div className="post-user">
              <div className="post-av">{p.avatar || "🧑"}</div>
              <div style={{ flex: 1 }}>
                <div className="post-uname">{p.userName}</div>
                <div className="post-time">{timeAgo(p.createdAt, lang)}</div>
              </div>
              {p.isLive && <span className="tag live-tag"><span className="live-dot" /> LIVE</span>}
            </div>
            <div className="post-text">{p.text}</div>
            <div className="post-acts">
              <button className={`p-btn${p.likes.includes(user.id) ? " liked" : ""}`} onClick={() => toggleLike(p.id)}>
                {p.likes.includes(user.id) ? "❤️" : "🤍"} {p.likes.length}
              </button>
              <button className="p-btn" onClick={() => setOpenComment(openComment === p.id ? null : p.id)}>
                💬 {p.comments.length}
              </button>
              <button className="p-btn" onClick={() => showToast("🔗 " + (lang === "ta" ? "பகிரப்பட்டது!" : "Shared!"))}>
                🔗 {t("share", lang)}
              </button>
            </div>
            {openComment === p.id && (
              <div className="cmt-area">
                {p.comments.map((c, i) => (
                  <div className="cmt-item" key={i}>
                    <span>🧑</span>
                    <span><strong style={{ fontSize: 10 }}>{c.userName}</strong>: {c.text}</span>
                  </div>
                ))}
                <div className="cmt-row">
                  <input className="cmt-in" placeholder={lang === "ta" ? "கருத்து..." : "Comment..."} value={cmt}
                    onChange={e => setCmt(e.target.value)} onKeyDown={e => e.key === "Enter" && addComment(p.id)} />
                  <button className="btn-gold btn-sm" style={{ padding: "8px 12px", marginTop: 0 }} onClick={() => addComment(p.id)}>→</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MARKET SCREEN
// ─────────────────────────────────────────────
function MarketScreen({ user, lang, setLang, goBack, showToast }) {
  const [listings, setListings] = useState(DB.businessListings);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ product: "", vendorName: "", price: "", description: "", phone: "" });
  const emojis = { saree:"🥻", food:"🫙", craft:"🏺", other:"📦" };
  const cats = ["all","saree","food","craft"];
  const filtered = filter === "all" ? listings : listings.filter(l => l.category === filter);

  const addListing = async () => {
    if (!form.product || !form.price || !form.phone) { showToast("⚠️ Fill required fields"); return; }
    await delay(500);
    const item = { id: uid(), userId: user.id, vendorName: form.vendorName || user.name, avatar:"🛒", product: form.product, price: parseInt(form.price)||0, description: form.description, phone: form.phone, whatsapp: form.phone, category: filter === "all" ? "other" : filter, likes: 0, createdAt: Date.now(), isNew: true };
    DB.businessListings.unshift(item);
    setListings([...DB.businessListings]);
    setForm({ product:"", vendorName:"", price:"", description:"", phone:"" });
    setShowAdd(false);
    showToast("✅ " + (lang === "ta" ? "பட்டியல் சேர்க்கப்பட்டது!" : "Listing added!"));
  };

  return (
    <div className="view view-enter">
      <AppHeader lang={lang} setLang={setLang} onBack={goBack} />
      <div className="det-hd" style={{ paddingTop: 10 }}>
        <div className="det-ico">🛒</div>
        <div className="det-title">{lang === "ta" ? "வர்த்தகம்" : "Marketplace"}</div>
        <div className="det-sub">{lang === "ta" ? "வணிக சந்தை" : "Business Market"}</div>
      </div>
      <div className="scr" style={{ padding: "14px 14px 28px" }}>
        {/* Filter */}
        <div className="filter-row" style={{ marginBottom: 14 }}>
          {cats.map(c => (
            <button key={c} className={`f-chip${filter === c ? " on" : ""}`} onClick={() => setFilter(c)}>
              {c === "all" ? (lang === "ta" ? "அனைத்தும்" : "All") : c}
            </button>
          ))}
        </div>

        {!showAdd ? (
          <button className="btn-gold" style={{ marginBottom: 14 }} onClick={() => setShowAdd(true)}>
            + {t("addProduct", lang)}
          </button>
        ) : (
          <div className="new-post-wrap" style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "'Noto Serif Tamil',serif", fontWeight: 700, marginBottom: 11, color: "var(--dark)" }}>
              {lang === "ta" ? "புதிய தயாரிப்பு" : "New Product"}
            </div>
            {[["product",t("productName",lang),"text"],["vendorName",t("vendorName",lang),"text"],["price",t("price",lang),"number"],["description",t("description",lang),"text"],["phone",t("phone",lang),"tel"]].map(([k,lbl,type]) => (
              <div className="f-group" key={k} style={{ marginBottom: 9 }}>
                <label className="f-lbl">{lbl}</label>
                <input className="f-input" type={type} placeholder={lbl} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-gold btn-sm" onClick={addListing}>{t("add", lang)}</button>
              <button className="btn-gold btn-sm btn-ghost" onClick={() => setShowAdd(false)}>{t("cancel", lang)}</button>
            </div>
          </div>
        )}

        {filtered.map(l => (
          <div className="prod-card" key={l.id}>
            <div className="prod-top">
              <div className="prod-img">{emojis[l.category] || "📦"}</div>
              <div style={{ flex: 1 }}>
                <div className="prod-name">{l.product}</div>
                <div className="prod-vendor">🏪 {l.vendorName}</div>
                <div className="prod-price">₹{l.price.toLocaleString()}</div>
              </div>
              {l.isNew && <span className="tag" style={{ background:"rgba(58,138,58,.12)", color:"var(--green)", position:"absolute", top:13, right:13 }}>NEW</span>}
            </div>
            {l.description && <div className="prod-desc">{l.description}</div>}
            <div className="prod-btns">
              <button className="wa-btn" onClick={() => showToast("💬 WhatsApp: +" + l.whatsapp)}>💬 WhatsApp</button>
              <button className="call-btn" onClick={() => showToast("📞 " + l.phone)}>📞 {t("callSeller", lang)}</button>
              <button className="call-btn" onClick={() => { const i=DB.businessListings.findIndex(x=>x.id===l.id); DB.businessListings[i].likes++; setListings([...DB.businessListings]); }}>❤️ {l.likes}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  CHARITY SCREEN
// ─────────────────────────────────────────────
function CharityScreen({ user, lang, setLang, goBack, showToast }) {
  const [reqs, setReqs] = useState(DB.charityRequests);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title:"", description:"", target:"" });
  const [donateId, setDonateId] = useState(null);
  const [donateAmt, setDonateAmt] = useState("");

  const addReq = () => {
    if (!form.title || !form.target) { showToast("⚠️ Fill required fields"); return; }
    const r = { id: uid(), userId: user.id, title: form.title, description: form.description, target: parseInt(form.target)||0, collected: 0, donors: [], urgent: false, createdAt: Date.now() };
    DB.charityRequests.unshift(r);
    DB.notifications.unshift({ id: uid(), type:"charity", msg: "New request: " + form.title, read: false, createdAt: Date.now() });
    setReqs([...DB.charityRequests]);
    setForm({ title:"", description:"", target:"" }); setShowAdd(false);
    showToast("✅ " + (lang === "ta" ? "கோரிக்கை சேர்க்கப்பட்டது!" : "Request posted!"));
  };

  const donate = () => {
    const amt = parseInt(donateAmt);
    if (!amt || amt < 1) { showToast("⚠️ Enter valid amount"); return; }
    const i = DB.charityRequests.findIndex(r => r.id === donateId);
    if (!DB.charityRequests[i].donors.includes(user.id)) DB.charityRequests[i].donors.push(user.id);
    DB.charityRequests[i].collected += amt;
    setReqs([...DB.charityRequests]);
    setDonateId(null); setDonateAmt("");
    showToast(`🙏 ₹${amt} ${lang === "ta" ? "நன்கொடை அளிக்கப்பட்டது!" : "donated!"}`);
  };

  return (
    <div className="view view-enter">
      <AppHeader lang={lang} setLang={setLang} onBack={goBack} />
      <div className="det-hd" style={{ paddingTop: 10 }}>
        <div className="det-ico">🤝</div>
        <div className="det-title">{lang === "ta" ? "தருமநிலயம்" : "Charity"}</div>
        <div className="det-sub">{lang === "ta" ? "தர்ம சேவை" : "Dharma Service"}</div>
      </div>
      <div className="scr" style={{ padding: "14px 14px 28px" }}>
        {!showAdd ? (
          <button className="btn-gold" style={{ marginBottom: 14 }} onClick={() => setShowAdd(true)}>
            + {t("postRequest", lang)}
          </button>
        ) : (
          <div className="new-post-wrap" style={{ marginBottom: 14 }}>
            {[["title",t("title",lang),"text"],["description",t("description",lang),"text"],["target",t("targetAmt",lang),"number"]].map(([k,lbl,type]) => (
              <div className="f-group" key={k} style={{ marginBottom: 9 }}>
                <label className="f-lbl">{lbl}</label>
                <input className="f-input" type={type} placeholder={lbl} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} />
              </div>
            ))}
            <div style={{ display:"flex", gap:8 }}>
              <button className="btn-gold btn-sm" onClick={addReq}>{t("post", lang)}</button>
              <button className="btn-gold btn-sm btn-ghost" onClick={() => setShowAdd(false)}>{t("cancel", lang)}</button>
            </div>
          </div>
        )}

        {reqs.map(r => {
          const pct = Math.min(100, Math.round((r.collected / r.target) * 100));
          return (
            <div className="charity-card" key={r.id}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom: 7 }}>
                <div style={{ fontFamily:"'Noto Serif Tamil',serif", fontSize:14, fontWeight:700, color:"var(--dark)", flex:1 }}>{r.title}</div>
                {r.urgent && <span className="urg-tag"><span className="live-dot" /> {t("urgent", lang)}</span>}
              </div>
              {r.description && <div style={{ fontSize:11, color:"var(--muted)", marginBottom:8, lineHeight:1.55 }}>{r.description}</div>}
              <div className="prog-bar"><div className="prog-fill" style={{ width: pct + "%" }} /></div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, fontWeight:700 }}>
                <span style={{ color:"var(--gd)" }}>₹{r.collected.toLocaleString()} {t("raised", lang)}</span>
                <span style={{ color:"var(--muted)" }}>{pct}% of ₹{r.target.toLocaleString()}</span>
              </div>
              <div style={{ fontSize:10, color:"var(--muted)", marginTop:4, opacity:.75 }}>
                {r.donors.length} {t("donors", lang)} · {timeAgo(r.createdAt, lang)}
              </div>
              <button className="donate-btn" onClick={() => { setDonateId(r.id); setDonateAmt(""); }}>
                ❤️ {t("donateBtn", lang)}
              </button>
            </div>
          );
        })}
      </div>

      {/* Donate Modal */}
      <div className={`overlay${donateId ? " open" : ""}`} onClick={e => e.target === e.currentTarget && setDonateId(null)}>
        <div className="modal">
          <div className="modal-handle" />
          <div className="modal-title">💛 {t("makeDonation", lang)}</div>
          <div className="amt-row">
            {[100, 500, 1000, 2000].map(a => (
              <button key={a} className={`amt-btn${donateAmt === String(a) ? " on" : ""}`} onClick={() => setDonateAmt(String(a))}>₹{a}</button>
            ))}
          </div>
          <div className="f-group" style={{ marginBottom: 12 }}>
            <label className="f-lbl">{t("customAmt", lang)}</label>
            <input className="f-input" type="number" placeholder="Enter amount" value={donateAmt} onChange={e => setDonateAmt(e.target.value)} />
          </div>
          <button className="btn-gold" onClick={donate}>{t("donate", lang)}</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MEDICAL SCREEN
// ─────────────────────────────────────────────
function MedicalScreen({ user, lang, setLang, goBack, showToast }) {
  const [bookId, setBookId] = useState(null);
  const [form, setForm] = useState({ name: user.name, phone:"", date:"", reason:"" });
  const [loading, setLoading] = useState(false);

  const tips = [
    { ico:"🌿", ta:"துளசி தேநீர்",   en:"Tulsi Tea",    textTa:"தினமும் காலை துளசி தேநீர் குடிக்கவும். நோய் எதிர்ப்பு சக்தி அதிகரிக்கும்.", textEn:"Drink tulsi tea every morning to boost immunity." },
    { ico:"🧘", ta:"தியானம்",        en:"Meditation",   textTa:"தினமும் 10 நிமிடம் தியானம் மன அமைதி தரும்.",                                  textEn:"10 minutes of daily meditation brings peace." },
    { ico:"💧", ta:"நீர் அருந்துதல்",en:"Stay Hydrated",textTa:"தினமும் 8 கிளாஸ் தண்ணீர் குடிக்கவும்.",                                          textEn:"Drink 8 glasses of water daily." },
  ];

  const book = async () => {
    if (!form.phone || !form.date) { showToast("⚠️ Fill all fields"); return; }
    setLoading(true); await delay(700); setLoading(false);
    setBookId(null);
    showToast("✅ " + (lang === "ta" ? "முன்பதிவு உறுதி!" : "Appointment booked!"));
  };

  return (
    <div className="view view-enter">
      <AppHeader lang={lang} setLang={setLang} onBack={goBack} />
      <div className="det-hd" style={{ paddingTop: 10 }}>
        <div className="det-ico">🏥</div>
        <div className="det-title">{lang === "ta" ? "மருத்துவம்" : "Medical Services"}</div>
        <div className="det-sub">{lang === "ta" ? "சுகாதார சேவை" : "Healthcare"}</div>
      </div>
      <div className="scr" style={{ padding: "14px 14px 28px" }}>
        <button className="btn-gold btn-danger" style={{ marginBottom: 14 }} onClick={() => showToast("🚨 Calling 108...")}>
          🚨 {t("emergency", lang)}
        </button>

        <div className="sec-hd" style={{ padding: "0 0 10px" }}>
          <div className="sec-title">{t("healthTips", lang)}</div>
        </div>
        {tips.map((tp, i) => (
          <div className="tip-card" key={i}>
            <div className="tip-ico">{tp.ico}</div>
            <div className="tip-t">{lang === "ta" ? tp.ta : tp.en}</div>
            <div className="tip-tx">{lang === "ta" ? tp.textTa : tp.textEn}</div>
          </div>
        ))}

        <div className="sec-hd" style={{ padding: "12px 0 10px" }}>
          <div className="sec-title">{t("nearbyHosp", lang)}</div>
        </div>
        {DB.medicalServices.map(h => (
          <div className="hosp-card" key={h.id}>
            <div className="hosp-name">{h.name}</div>
            <div className="hosp-type">{h.type}{h.emergency ? " · 🆘 Emergency" : ""}</div>
            <div className="hosp-addr">📍 {h.address}</div>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom: 6 }}>
              {h.specialties.map(s => <span className="tag" key={s}>{s}</span>)}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:12, fontWeight:700, color:"var(--gd)" }}>📍 {h.distance}</div>
                <div className="star">{"★".repeat(Math.floor(h.rating))} <span style={{ fontSize:10, color:"var(--muted)" }}>{h.rating}</span></div>
              </div>
              <div className="hosp-btns">
                <button className="book-btn" onClick={() => { setBookId(h.id); setForm({ name:user.name, phone:"", date:"", reason:"" }); }}>{t("book", lang)}</button>
                <button className="emrg-btn" onClick={() => showToast("📞 " + h.phone)}>📞</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      <div className={`overlay${bookId ? " open" : ""}`} onClick={e => e.target === e.currentTarget && setBookId(null)}>
        <div className="modal">
          <div className="modal-handle" />
          <div className="modal-title">📅 {t("bookAppt", lang)}</div>
          {[["name",t("name",lang),"text"],["phone",t("phone",lang),"tel"],["date",t("dateTime",lang),"datetime-local"],["reason",t("reason",lang),"text"]].map(([k,lbl,type]) => (
            <div className="f-group" key={k} style={{ marginBottom: 10 }}>
              <label className="f-lbl">{lbl}</label>
              <input className="f-input" type={type} placeholder={lbl} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} />
            </div>
          ))}
          <button className="btn-gold" onClick={book} disabled={loading}>
            {loading ? <div className="spin" /> : t("bookNow", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  NOTIFICATIONS SCREEN
// ─────────────────────────────────────────────
function NotifScreen({ lang, setLang, goBack, showToast }) {
  const [notifs, setNotifs] = useState(DB.notifications);
  const icons = { spiritual:"🛕", charity:"❤️", business:"🛒" };

  const markAll = () => {
    DB.notifications.forEach(n => n.read = true);
    setNotifs([...DB.notifications]);
  };

  return (
    <div className="view view-enter">
      <AppHeader lang={lang} setLang={setLang} onBack={goBack} />
      <div className="det-hd" style={{ paddingTop: 10 }}>
        <div className="det-ico">🔔</div>
        <div className="det-title">{t("notifications", lang)}</div>
        <div className="det-sub">{notifs.filter(n => !n.read).length} {lang === "ta" ? "படிக்காதவை" : "unread"}</div>
      </div>
      <div className="scr" style={{ padding: "14px 14px 28px" }}>
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom: 12 }}>
          <button className="btn-gold btn-sm btn-ghost" onClick={markAll}>{t("markRead", lang)}</button>
        </div>
        {notifs.map(n => (
          <div key={n.id} className={`notif-card${!n.read ? " unread" : ""}`} onClick={() => { n.read = true; setNotifs([...DB.notifications]); }}>
            <div className={`n-dot${n.read ? " read" : ""}`} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{icons[n.type] || "🔔"}</div>
              <div className="n-msg">{n.msg}</div>
              <div className="n-time">{timeAgo(n.createdAt, lang)}</div>
            </div>
          </div>
        ))}
        {notifs.length === 0 && (
          <div style={{ textAlign:"center", padding:"40px 20px", color:"var(--muted)" }}>
            {lang === "ta" ? "அறிவிப்புகள் இல்லை" : "No notifications"}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PROFILE SCREEN
// ─────────────────────────────────────────────
function ProfileScreen({ user, setUser, lang, setLang, showToast, onLogout }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, phone: user.phone });
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true); await delay(500);
    const updated = { ...user, ...form };
    DB.users[user.id] = updated;
    Auth.current = updated;
    localStorage.setItem("tv_u", JSON.stringify(updated));
    setUser(updated); setEditing(false); setLoading(false);
    showToast("✅ " + (lang === "ta" ? "சுயவிவரம் புதுப்பிக்கப்பட்டது!" : "Profile updated!"));
  };

  const items = [
    { ico:"🛕", lbl:t("posts",lang),     sub: DB.spiritualPosts.filter(p=>p.userId===user.id).length + " posts" },
    { ico:"🛒", lbl:t("listings",lang),  sub: DB.businessListings.filter(l=>l.userId===user.id).length + " items" },
    { ico:"❤️", lbl:t("donations",lang), sub: DB.charityRequests.filter(r=>r.donors.includes(user.id)).length + " causes" },
  ];

  return (
    <div className="view view-enter">
      <div className="scr">
        <div className="prof-hd">
          <StatusBar />
          <div style={{ height: 10 }} />
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom: 6 }}>
            <div className="lang-sw">
              <button className={`lang-btn${lang === "ta" ? " on" : ""}`} onClick={() => setLang("ta")}>தமி</button>
              <button className={`lang-btn${lang === "en" ? " on" : ""}`} onClick={() => setLang("en")}>EN</button>
            </div>
          </div>
          <div className="prof-av">{user.avatar}</div>
          {editing ? (
            <div style={{ textAlign:"left", marginTop: 8 }}>
              <div className="f-group" style={{ marginBottom:9 }}>
                <label className="f-lbl">{t("nameLabel", lang)}</label>
                <input className="f-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="f-group" style={{ marginBottom:12 }}>
                <label className="f-lbl">{t("mobile", lang)}</label>
                <input className="f-input" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button className="btn-gold btn-sm" onClick={save} disabled={loading}>{loading ? <div className="spin" style={{ width:14, height:14 }} /> : t("save", lang)}</button>
                <button className="btn-gold btn-sm btn-ghost" onClick={() => setEditing(false)}>{t("cancel", lang)}</button>
              </div>
            </div>
          ) : (
            <>
              <div className="prof-name">{user.name}</div>
              <div className="prof-id">THIRUVASAL · +91 {user.phone}</div>
            </>
          )}
        </div>

        <div style={{ padding:"0 16px 32px" }}>
          {items.map((it, i) => (
            <div className="prof-item" key={i}>
              <div className="pi-left">
                <div className="pi-ico">{it.ico}</div>
                <div>
                  <div className="pi-lbl">{it.lbl}</div>
                  <div className="pi-sub">{it.sub}</div>
                </div>
              </div>
              <span className="pi-arr">›</span>
            </div>
          ))}
          <div className="prof-item" onClick={() => setEditing(true)}>
            <div className="pi-left">
              <div className="pi-ico">✏️</div>
              <div>
                <div className="pi-lbl">{t("editProfile", lang)}</div>
                <div className="pi-sub">{lang === "ta" ? "பெயர், தொலைபேசி" : "Name, phone"}</div>
              </div>
            </div>
            <span className="pi-arr">›</span>
          </div>
          <div className="prof-item" onClick={() => showToast("🔐 " + (lang === "ta" ? "பாதுகாப்பு அமைப்புகள்" : "Security settings"))}>
            <div className="pi-left">
              <div className="pi-ico">🔐</div>
              <div>
                <div className="pi-lbl">{t("security", lang)}</div>
                <div className="pi-sub">{lang === "ta" ? "கடவுச்சொல் மாற்றம்" : "Change password"}</div>
              </div>
            </div>
            <span className="pi-arr">›</span>
          </div>
          <div className="prof-item" onClick={onLogout}>
            <div className="pi-left">
              <div className="pi-ico">🚪</div>
              <div>
                <div className="pi-lbl" style={{ color:"var(--gd)" }}>{t("signOut", lang)}</div>
                <div className="pi-sub">{lang === "ta" ? "பாதுகாப்பாக வெளியேறு" : "Logout safely"}</div>
              </div>
            </div>
            <span className="pi-arr" style={{ color:"var(--gd)" }}>›</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  ROOT APP
// ─────────────────────────────────────────────
export default function App() {
  const [user, setUser]       = useState(null);
  const [tab, setTab]         = useState("home");
  const [lang, setLang]       = useState("ta");
  const [subScreen, setSub]   = useState(null);  // "charity" | "medical" | "notif"
  const [toastMsg, showToast] = useToast();
  const [booted, setBooted]   = useState(false);

  // Persist lang
  useEffect(() => { localStorage.setItem("tv_lang", lang); }, [lang]);
  useEffect(() => {
    const l = localStorage.getItem("tv_lang"); if (l) setLang(l);
    const u = Auth.restore(); if (u) setUser(u);
    setBooted(true);
  }, []);

  const handleLangChange = useCallback(newLang => {
    setLang(newLang);
    if (user) {
      const updated = { ...user, language: newLang };
      DB.users[user.id] = updated;
      Auth.current = updated;
      localStorage.setItem("tv_u", JSON.stringify(updated));
      setUser(updated);
    }
  }, [user]);

  const handleLogout = useCallback(() => {
    Auth.signOut();
    setUser(null); setTab("home"); setSub(null);
    showToast("🙏 " + (lang === "ta" ? "வணக்கம்! மீண்டும் வாருங்கள்" : "See you again!"));
  }, [lang, showToast]);

  const unreadCount = useMemo(() => DB.notifications.filter(n => !n.read).length, []);

  const goBack = useCallback(() => setSub(null), []);

  if (!booted) return null;

  const sharedProps = { lang, setLang: handleLangChange, showToast };

  return (
    <>
      <style>{CSS}</style>
      <div id="root">
        <div className={`toast${toastMsg ? " show" : ""}`}>{toastMsg}</div>

        {!user ? (
          <AuthScreen onLogin={u => { setUser(u); showToast("🙏 " + (u.language === "ta" ? "வணக்கம்! " : "Welcome! ") + u.name); }} {...sharedProps} />
        ) : subScreen === "notif" ? (
          <NotifScreen {...sharedProps} goBack={goBack} />
        ) : subScreen === "charity" ? (
          <CharityScreen user={user} {...sharedProps} goBack={goBack} />
        ) : subScreen === "medical" ? (
          <MedicalScreen user={user} {...sharedProps} goBack={goBack} />
        ) : (
          <>
            {tab === "home" && (
              <HomeScreen user={user} {...sharedProps}
                setTab={t => {
                  if (t === "charity" || t === "medical") setSub(t);
                  else setTab(t);
                }}
                onNotif={() => setSub("notif")}
                notifCount={DB.notifications.filter(n => !n.read).length} />
            )}
            {tab === "spiritual" && (
              <SpiritualScreen user={user} {...sharedProps} goBack={() => setTab("home")} />
            )}
            {tab === "market" && (
              <MarketScreen user={user} {...sharedProps} goBack={() => setTab("home")} />
            )}
            {tab === "profile" && (
              <ProfileScreen user={user} setUser={setUser} {...sharedProps} onLogout={handleLogout} />
            )}
            <BottomNav tab={tab} setTab={setTab} lang={lang} />
          </>
        )}
      </div>
    </>
  );
}
