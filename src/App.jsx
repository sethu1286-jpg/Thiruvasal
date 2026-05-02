/* eslint-disable */
import React, { useState, useEffect, createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, addDoc, setDoc, getDoc, updateDoc, deleteDoc, query, orderBy, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";

// ─── Firebase ────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyABFYdnOQAf1-WkVxanFsXxM2fj6-XOnrU",
  authDomain:        "thiruvasal.firebaseapp.com",
  projectId:         "thiruvasal",
  storageBucket:     "thiruvasal.firebasestorage.app",
  messagingSenderId: "1013411348504",
  appId:             "1:1013411348504:web:a34bea6fc6b6eb19f5036d",
};
const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

// ─── Helpers ─────────────────────────────────────────────
function fmtDate(ts) {
  if (!ts) return "-";
  if (typeof ts === "string") return ts;
  try { const d = ts.toDate ? ts.toDate() : new Date(ts); return d.toLocaleDateString("en-IN"); } catch(e) { return "-"; }
}
function fmtErr(code) {
  const m = {
    "auth/email-already-in-use":"Email already registered.",
    "auth/weak-password":"Password needs 6+ characters.",
    "auth/user-not-found":"No account found. Register first.",
    "auth/wrong-password":"Wrong password.",
    "auth/invalid-credential":"Invalid email or password.",
    "auth/invalid-email":"Invalid email address.",
    "auth/too-many-requests":"Too many attempts. Wait a moment.",
  };
  return m[code] || "Something went wrong.";
}

// ─── CSS ─────────────────────────────────────────────────
const CSS = `
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
@keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
@keyframes pulse { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
@keyframes rayRot { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
@keyframes sunUp { from { transform:translateY(40px) scale(0.8); opacity:0; } to { transform:translateY(0) scale(1); opacity:1; } }
@keyframes twinkle { 0%,100% { opacity:0.15; } 50% { opacity:0.8; } }
@keyframes slideUp { from { transform:translateY(100%); opacity:0; } to { transform:translateY(0); opacity:1; } }
* { box-sizing:border-box; margin:0; padding:0; -webkit-tap-highlight-color:transparent; }
body { background:#0F1B3D; font-family:Poppins,sans-serif; color:#F0F6FF; }
.app { max-width:430px; margin:0 auto; min-height:100vh; background:#0F1B3D; position:relative; overflow-x:hidden; }
.gold { background:linear-gradient(90deg,#FF8C00,#FFD080,#FF8C00); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 3s linear infinite; }
.btn-gold { background:linear-gradient(135deg,#FF8C00,#FFA833); color:#0A1628; border:none; border-radius:13px; font-weight:800; font-family:inherit; cursor:pointer; box-shadow:0 4px 20px rgba(255,140,0,0.45); transition:transform 0.15s; }
.btn-gold:hover { transform:translateY(-2px); }
.btn-out { background:transparent; border:1.5px solid rgba(255,140,0,0.4); border-radius:12px; color:#FFA833; font-family:inherit; cursor:pointer; transition:all 0.2s; }
.inp { width:100%; padding:13px 16px; background:rgba(10,22,40,0.8); border:1px solid rgba(255,140,0,0.25); border-radius:12px; color:#F0F6FF; font-size:15px; font-family:inherit; outline:none; }
.inp:focus { border-color:#FF8C00; box-shadow:0 0 0 3px rgba(255,140,0,0.15); }
.inp::placeholder { color:rgba(155,181,224,0.35); }
.card { background:rgba(22,35,71,0.85); border:1px solid rgba(255,140,0,0.18); border-radius:16px; backdrop-filter:blur(12px); padding:14px 16px; margin-bottom:10px; }
.scroll { overflow-y:auto; overflow-x:hidden; }
.scroll::-webkit-scrollbar { width:3px; }
.scroll::-webkit-scrollbar-thumb { background:rgba(255,140,0,0.25); border-radius:2px; }
.fade { animation:fadeUp 0.4s ease forwards; }
.slide { animation:slideUp 0.35s ease forwards; }
.spin { width:20px; height:20px; border:2px solid rgba(255,140,0,0.25); border-top-color:#FF8C00; border-radius:50%; animation:spin 0.7s linear infinite; display:inline-block; }
.divider { height:1px; background:linear-gradient(90deg,transparent,rgba(255,140,0,0.25),transparent); margin:14px 0; }
.badge-paid { color:#22C55E; background:rgba(34,197,94,0.12); border:1px solid rgba(34,197,94,0.3); border-radius:999px; padding:3px 10px; font-size:11px; font-weight:700; }
.badge-pend { color:#FF9800; background:rgba(255,152,0,0.12); border:1px solid rgba(255,152,0,0.3); border-radius:999px; padding:3px 10px; font-size:11px; font-weight:700; }
.badge-prem { color:#FFA833; background:rgba(255,140,0,0.12); border:1px solid rgba(255,140,0,0.3); border-radius:999px; padding:3px 10px; font-size:11px; font-weight:700; }
`;

// ─── Auth Context ─────────────────────────────────────────
const Ctx = createContext(null);
function useCtx() { return useContext(Ctx); }

// ─── Sun SVG ─────────────────────────────────────────────
function Sun({ size=90 }) {
  const c=size/2, r=size*0.26;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{overflow:"visible",filter:`drop-shadow(0 0 ${size*0.12}px rgba(255,140,0,0.8))`}}>
      <defs>
        <radialGradient id="sg"><stop offset="0%" stopColor="#FFA833" stopOpacity="0.5"/><stop offset="100%" stopColor="#FF4500" stopOpacity="0"/></radialGradient>
        <radialGradient id="sc"><stop offset="0%" stopColor="#FFFDE0"/><stop offset="40%" stopColor="#FFD700"/><stop offset="100%" stopColor="#FF6600"/></radialGradient>
      </defs>
      <circle cx={c} cy={c} r={size*0.44} fill="url(#sg)"/>
      <g style={{transformOrigin:`${c}px ${c}px`,animation:"rayRot 18s linear infinite"}}>
        {[...Array(12)].map((_,i)=>{const a=i*30*Math.PI/180;return <line key={i} x1={c+Math.cos(a)*r*1.2} y1={c+Math.sin(a)*r*1.2} x2={c+Math.cos(a)*r*2.1} y2={c+Math.sin(a)*r*2.1} stroke="#FFD080" strokeWidth={i%3===0?2.5:1} strokeLinecap="round" opacity={i%3===0?0.9:0.45}/>;})}</g>
      <circle cx={c} cy={c} r={r} fill="url(#sc)"/>
      <circle cx={c} cy={c} r={r*0.2} fill="rgba(255,255,240,0.9)"/>
    </svg>
  );
}

// ─── Login ────────────────────────────────────────────────
function Login() {
  const [mode,setMode]=useState("login");
  const [form,setForm]=useState({name:"",phone:"",email:"",password:"",role:"donor"});
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const s=k=>e=>setForm(f=>({...f,[k]:e.target.value}));

  async function submit() {
    setErr("");
    if(!form.email||!form.password){setErr("Email and password required");return;}
    setLoading(true);
    try {
      if(mode==="register"){
        if(!form.name){setErr("Name required");setLoading(false);return;}
        const c=await createUserWithEmailAndPassword(auth,form.email,form.password);
        await updateProfile(c.user,{displayName:form.name});
        await setDoc(doc(db,"users",c.user.uid),{uid:c.user.uid,name:form.name,phone:form.phone,email:form.email,role:form.role,createdAt:serverTimestamp()});
      } else {
        await signInWithEmailAndPassword(auth,form.email,form.password);
      }
    } catch(e){setErr(fmtErr(e.code));}
    setLoading(false);
  }

  return (
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at 50% 25%,#162347,#0F1B3D 50%,#080F20)",display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
      {/* Stars */}
      {[...Array(12)].map((_,i)=><div key={i} style={{position:"absolute",width:Math.random()*3+1,height:Math.random()*3+1,left:`${10+i*7}%`,top:`${5+i*5}%`,borderRadius:"50%",background:"#FFD080",animation:`twinkle ${2+i*0.3}s ease-in-out infinite`,animationDelay:`${i*0.4}s`,opacity:0.4}}/>)}
      {/* Sun hero */}
      <div style={{padding:"56px 24px 20px",textAlign:"center",animation:"sunUp 0.8s ease forwards"}}>
        <Sun size={120}/>
        <div style={{marginTop:16}}>
          <div style={{fontSize:10,letterSpacing:4,color:"rgba(255,168,51,0.55)",marginBottom:6}}>AYYAAKILAM</div>
          <div className="gold" style={{fontSize:38,fontWeight:900,lineHeight:1.1}}>THIRUVASAL</div>
          <div style={{color:"rgba(155,181,224,0.55)",fontSize:13,marginTop:8}}>Temple Donation Management</div>
        </div>
      </div>
      {/* Card */}
      <div style={{flex:1,background:"linear-gradient(180deg,rgba(22,35,71,0),rgba(12,20,48,0.98) 12%)",borderRadius:"28px 28px 0 0",padding:"28px 22px 44px",borderTop:"1px solid rgba(255,140,0,0.18)",marginTop:"auto"}}>
        {/* Toggle */}
        <div style={{display:"flex",background:"rgba(10,18,38,0.7)",borderRadius:12,padding:4,marginBottom:20,border:"1px solid rgba(255,140,0,0.15)"}}>
          {[["login","Login"],["register","Register"]].map(([m,l])=>(
            <button key={m} onClick={()=>{setMode(m);setErr("");}} style={{flex:1,padding:"9px",borderRadius:9,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13,background:mode===m?"linear-gradient(135deg,#FF8C00,#FFA833)":"transparent",color:mode===m?"#0A1628":"rgba(155,181,224,0.6)",transition:"all 0.2s"}}>{l}</button>
          ))}
        </div>
        {err && <div style={{background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:10,padding:"10px 14px",color:"#EF4444",fontSize:13,marginBottom:14}}>{err}</div>}
        {mode==="register"&&<><label style={{fontSize:11,fontWeight:700,color:"#5A7AB5",display:"block",marginBottom:5}}>Full Name</label><input className="inp" placeholder="Your name" value={form.name} onChange={s("name")} style={{marginBottom:12}}/></>}
        {mode==="register"&&<><label style={{fontSize:11,fontWeight:700,color:"#5A7AB5",display:"block",marginBottom:5}}>Mobile</label><input className="inp" placeholder="9XXXXXXXXX" type="tel" maxLength={10} value={form.phone} onChange={s("phone")} style={{marginBottom:12}}/></>}
        <label style={{fontSize:11,fontWeight:700,color:"#5A7AB5",display:"block",marginBottom:5}}>Email</label>
        <input className="inp" placeholder="you@email.com" type="email" value={form.email} onChange={s("email")} style={{marginBottom:12}}/>
        <label style={{fontSize:11,fontWeight:700,color:"#5A7AB5",display:"block",marginBottom:5}}>Password</label>
        <input className="inp" placeholder="Min 6 characters" type="password" value={form.password} onChange={s("password")} style={{marginBottom:mode==="register"?12:20}}/>
        {mode==="register"&&(
          <div style={{marginBottom:20}}>
            <label style={{fontSize:11,fontWeight:700,color:"#5A7AB5",display:"block",marginBottom:8}}>Role</label>
            <div style={{display:"flex",gap:8}}>
              {[["donor","Donor"],["admin","Admin"]].map(([v,l])=>(
                <button key={v} onClick={()=>setForm(f=>({...f,role:v}))} style={{flex:1,padding:"10px",borderRadius:10,border:`1.5px solid ${form.role===v?"#FF8C00":"rgba(255,140,0,0.2)"}`,background:form.role===v?"rgba(255,140,0,0.12)":"transparent",color:form.role===v?"#FFA833":"rgba(155,181,224,0.5)",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
              ))}
            </div>
          </div>
        )}
        <button className="btn-gold" disabled={loading} onClick={submit} style={{width:"100%",padding:"15px",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
          {loading?<><div className="spin" style={{borderTopColor:"#0A1628"}}/><span>Please wait...</span></>:mode==="login"?"Login":"Create Account"}
        </button>
        <div style={{marginTop:18,padding:"11px 14px",background:"rgba(255,140,0,0.05)",border:"1px dashed rgba(255,140,0,0.18)",borderRadius:10,textAlign:"center"}}>
          <span style={{fontSize:11,color:"rgba(155,181,224,0.45)"}}>Your data is securely stored in Firebase</span>
        </div>
      </div>
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────
function Home({setTab}) {
  const {profile}=useCtx();
  const [donors,setDonors]=useState([]);
  useEffect(()=>{
    try{const q=query(collection(db,"donors"),orderBy("createdAt","desc"));return onSnapshot(q,s=>setDonors(s.docs.map(d=>({id:d.id,...d.data()}))));}catch(e){console.error(e);}
  },[]);
  const paid=donors.filter(d=>d.status==="paid");
  const pending=donors.filter(d=>d.status==="pending");
  const total=paid.reduce((s,d)=>s+(d.amount||0),0);
  return (
    <div className="scroll" style={{paddingBottom:80}}>
      <div style={{background:"radial-gradient(ellipse at 50% 0%,#1E2F5C,#0F1B3D 60%)",padding:"28px 20px 32px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        {[...Array(10)].map((_,i)=><div key={i} style={{position:"absolute",width:2,height:2,left:`${i*10+5}%`,top:`${10+i*7}%`,borderRadius:"50%",background:"#FFD080",animation:`twinkle ${2+i*0.4}s ease-in-out infinite`,animationDelay:`${i*0.5}s`,opacity:0.3}}/>)}
        <div style={{fontSize:9,letterSpacing:4,color:"rgba(255,168,51,0.5)",marginBottom:12}}>AYYAAKILAM</div>
        <Sun size={88}/>
        <div className="gold" style={{fontSize:26,fontWeight:900,marginTop:12}}>THIRUVASAL</div>
        <div style={{color:"rgba(155,181,224,0.5)",fontSize:12,marginTop:4}}>Welcome, {profile?.name||"User"}</div>
        <div style={{display:"flex",gap:9,marginTop:20}}>
          {[{i:"👥",l:"Donors",v:donors.length},{i:"⏳",l:"Pending",v:pending.length,c:"#FF9800"},{i:"💰",l:"Collected",v:total>=1000?(total/1000).toFixed(0)+"K":total}].map(s=>(
            <div key={s.l} style={{flex:1,background:"rgba(22,35,71,0.7)",border:"1px solid rgba(255,140,0,0.18)",borderRadius:14,padding:"14px 8px",textAlign:"center"}}>
              <div style={{fontSize:20,marginBottom:5}}>{s.i}</div>
              <div style={{fontSize:18,fontWeight:900,color:s.c||"#FFA833"}}>{s.v}</div>
              <div style={{fontSize:9.5,color:"#5A7AB5",marginTop:3}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"18px 16px 0"}}>
        <div className="card fade" style={{background:"linear-gradient(135deg,rgba(255,140,0,0.13),rgba(22,35,71,0.9))",borderColor:"rgba(255,140,0,0.32)"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:50,height:50,borderRadius:25,background:"linear-gradient(135deg,#FF8C00,#FFA833)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:"0 0 18px rgba(255,140,0,0.5)",flexShrink:0}}>🙏</div>
            <div><div className="gold" style={{fontWeight:800,fontSize:16}}>{profile?.name||"User"}</div><div style={{color:"rgba(155,181,224,0.5)",fontSize:11}}>{profile?.phone||""} | {profile?.role==="admin"?"Admin":"Donor"}</div></div>
          </div>
        </div>
        <div style={{fontSize:10,letterSpacing:2,color:"#5A7AB5",fontWeight:700,marginBottom:10,marginTop:6}}>MAIN FEATURES</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:12}}>
          {[{icon:"🏛️",title:"Donations",sub:"Donor Management",tab:"charity",accent:"#FF8C00",border:"rgba(255,140,0,0.28)",bg:"rgba(255,140,0,0.06)"},{icon:"🛒",title:"Business",sub:"Listings",tab:"business",accent:"#4A9FFF",border:"rgba(74,159,255,0.25)",bg:"rgba(74,159,255,0.05)"}].map(item=>(
            <button key={item.tab} onClick={()=>setTab(item.tab)} style={{background:item.bg,border:`1px solid ${item.border}`,borderRadius:17,padding:"20px 14px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"transform 0.2s"}}>
              <div style={{fontSize:30,marginBottom:10}}>{item.icon}</div>
              <div style={{fontWeight:800,color:item.accent,fontSize:14,marginBottom:3}}>{item.title}</div>
              <div style={{fontSize:11,color:"rgba(155,181,224,0.4)"}}>{item.sub}</div>
            </button>
          ))}
        </div>
        {pending.length>0&&<div onClick={()=>setTab("charity")} style={{padding:"14px 16px",borderRadius:14,cursor:"pointer",background:"rgba(255,152,0,0.08)",border:"1px solid rgba(255,152,0,0.3)",borderLeft:"3px solid #FF9800",display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <div style={{fontSize:22}}>🔔</div>
          <div><div style={{fontWeight:700,color:"#FF9800",fontSize:13}}>{pending.length} Pending Donations</div><div style={{fontSize:11,color:"rgba(255,152,0,0.55)"}}>Confirmation required</div></div>
        </div>}
        <div style={{padding:"16px",background:"rgba(255,140,0,0.04)",border:"1px dashed rgba(255,140,0,0.18)",borderRadius:13,textAlign:"center"}}>
          <div style={{fontSize:18,marginBottom:6}}>🪔</div>
          <div style={{color:"rgba(255,168,51,0.7)",fontSize:12,fontStyle:"italic"}}>He who gives shall receive a thousandfold</div>
        </div>
      </div>
    </div>
  );
}

// ─── Charity ──────────────────────────────────────────────
function Charity() {
  const {profile,isAdmin}=useCtx();
  const [donors,setDonors]=useState([]);
  const [filter,setFilter]=useState("all");
  const [sel,setSel]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({name:"",phone:"",amount:"",purpose:"",donationDate:""});
  const [loading,setLoading]=useState(false);
  const s=k=>e=>setForm(f=>({...f,[k]:e.target.value}));

  useEffect(()=>{
    try{const q=query(collection(db,"donors"),orderBy("createdAt","desc"));return onSnapshot(q,snap=>setDonors(snap.docs.map(d=>({id:d.id,...d.data()}))));}catch(e){console.error(e);}
  },[]);

  const filtered=donors.filter(d=>filter==="all"||d.status===filter);
  const selected=donors.find(d=>d.id===sel);

  async function addD(){
    if(!form.name||!form.phone||!form.amount||!form.donationDate)return;
    setLoading(true);
    try{await addDoc(collection(db,"donors"),{...form,amount:Number(form.amount),status:"pending",addedBy:profile?.uid||"",nextReminderDate:form.donationDate,createdAt:serverTimestamp(),updatedAt:serverTimestamp()});}catch(e){console.error(e);}
    setLoading(false);setShowAdd(false);setForm({name:"",phone:"",amount:"",purpose:"",donationDate:""});
  }
  async function markStatus(id,status){
    try{await updateDoc(doc(db,"donors",id),{status,updatedAt:serverTimestamp()});}catch(e){console.error(e);}
    setSel(null);
  }
  async function delDonor(id){
    try{await deleteDoc(doc(db,"donors",id));}catch(e){console.error(e);}
    setSel(null);
  }

  if(sel&&selected){
    const d=selected;
    return(
      <div style={{background:"#0F1B3D",minHeight:"100vh"}}>
        <TopBar title={d.name} sub={d.purpose} onBack={()=>setSel(null)}/>
        <div style={{padding:"18px 16px 80px"}} className="scroll">
          <div className="card fade" style={{textAlign:"center",background:"linear-gradient(135deg,rgba(255,140,0,0.12),rgba(22,35,71,0.9))",borderColor:"rgba(255,140,0,0.3)"}}>
            <div style={{width:64,height:64,borderRadius:32,background:"linear-gradient(135deg,#FF8C00,#FFA833)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 12px",boxShadow:"0 0 22px rgba(255,140,0,0.5)"}}>🙏</div>
            <div className="gold" style={{fontSize:20,fontWeight:800}}>{d.name}</div>
            <div style={{color:"rgba(155,181,224,0.5)",fontSize:12,marginTop:4}}>📞 {d.phone}</div>
            <div className="divider"/>
            {[{l:"Amount",v:`Rs ${Number(d.amount||0).toLocaleString()}`},{l:"Purpose",v:d.purpose},{l:"Date",v:fmtDate(d.donationDate)},{l:"Next Reminder",v:fmtDate(d.nextReminderDate)}].map(r=>(
              <div key={r.l} style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <span style={{color:"rgba(155,181,224,0.5)",fontSize:13}}>{r.l}</span>
                <span style={{color:"#F0F6FF",fontWeight:700,fontSize:13}}>{r.v}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:"rgba(155,181,224,0.5)",fontSize:13}}>Status</span>
              {d.status==="paid"?<span className="badge-paid">✅ Paid</span>:<span className="badge-pend">⏳ Pending</span>}
            </div>
          </div>
          {d.status==="pending"&&<div className="card" style={{textAlign:"center"}}>
            <div style={{color:"#F0F6FF",fontWeight:700,marginBottom:6}}>Confirm Donation</div>
            <div style={{color:"rgba(155,181,224,0.5)",fontSize:12,marginBottom:16}}>Will you donate Rs {Number(d.amount).toLocaleString()} this year?</div>
            <div style={{display:"flex",gap:10}}>
              <button className="btn-gold" style={{flex:1,padding:"13px",fontSize:14}} onClick={()=>markStatus(d.id,"paid")}>✅ Yes</button>
              <button className="btn-out" style={{flex:1,padding:"13px",fontSize:14,color:"#EF4444",borderColor:"rgba(239,68,68,0.4)"}} onClick={()=>setSel(null)}>❌ No</button>
            </div>
          </div>}
          {d.status==="paid"&&<div style={{padding:20,background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:14,textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:8}}>🎉</div>
            <div style={{color:"#22C55E",fontWeight:700}}>Donation Confirmed!</div>
          </div>}
          {isAdmin&&<div style={{display:"flex",gap:10,marginTop:10}}>
            <button className="btn-gold" style={{flex:1,padding:"11px",fontSize:13}} onClick={()=>markStatus(d.id,d.status==="paid"?"pending":"paid")}>{d.status==="paid"?"Mark Pending":"Mark Paid"}</button>
            <button className="btn-out" style={{flex:1,padding:"11px",fontSize:13,color:"#EF4444",borderColor:"rgba(239,68,68,0.3)"}} onClick={()=>delDonor(d.id)}>Delete</button>
          </div>}
        </div>
      </div>
    );
  }

  return(
    <div style={{background:"#0F1B3D",minHeight:"100vh"}}>
      <div style={{background:"radial-gradient(ellipse at 50% 0%,#1E3060,#0F1B3D 70%)",padding:"20px 20px 24px",borderBottom:"1px solid rgba(255,140,0,0.18)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div className="gold" style={{fontSize:22,fontWeight:900}}>Donations</div><div style={{color:"rgba(155,181,224,0.5)",fontSize:11,marginTop:2}}>Donor Management</div></div>
          {isAdmin&&<button className="btn-gold" style={{padding:"9px 16px",fontSize:13}} onClick={()=>setShowAdd(true)}>+ Add</button>}
        </div>
        <div style={{display:"flex",gap:7,marginTop:14}}>
          {[["all","All"],["pending","Pending"],["paid","Paid"]].map(([f,l])=>(
            <button key={f} onClick={()=>setFilter(f)} style={{padding:"6px 13px",borderRadius:20,border:"none",background:filter===f?"linear-gradient(135deg,#FF8C00,#FFA833)":"rgba(255,140,0,0.1)",color:filter===f?"#0A1628":"rgba(155,181,224,0.7)",fontWeight:700,fontSize:11.5,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{padding:"14px 16px 90px"}} className="scroll">
        {filtered.length===0?<div style={{textAlign:"center",padding:"52px 20px",color:"#5A7AB5"}}><div style={{fontSize:44,marginBottom:12,opacity:0.5}}>🏛️</div><div>No donors found</div></div>:
          filtered.map(d=>(
            <div key={d.id} className="card" onClick={()=>setSel(d.id)} style={{cursor:"pointer",borderLeft:d.status==="paid"?"3px solid #22C55E":"3px solid rgba(255,152,0,0.5)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <div style={{width:42,height:42,borderRadius:21,background:"rgba(255,140,0,0.15)",border:"1px solid rgba(255,140,0,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🙏</div>
                  <div>
                    <div style={{color:"#F0F6FF",fontWeight:700,fontSize:14}}>{d.name}</div>
                    <div style={{color:"rgba(155,181,224,0.5)",fontSize:11}}>{d.purpose}</div>
                    <div style={{color:"rgba(155,181,224,0.4)",fontSize:11}}>{fmtDate(d.donationDate)}</div>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div className="gold" style={{fontWeight:900,fontSize:15}}>Rs {Number(d.amount||0).toLocaleString()}</div>
                  <div style={{marginTop:4}}>{d.status==="paid"?<span className="badge-paid">Paid</span>:<span className="badge-pend">Pending</span>}</div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
      {showAdd&&<div onClick={e=>e.target===e.currentTarget&&setShowAdd(false)} style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(6px)",display:"flex",alignItems:"flex-end"}}>
        <div className="slide" style={{width:"100%",maxWidth:430,margin:"0 auto",background:"linear-gradient(180deg,#162347,#0F1B3D)",borderRadius:"24px 24px 0 0",border:"1px solid rgba(255,140,0,0.3)",padding:"20px 20px 40px",maxHeight:"88vh",overflow:"auto"}}>
          <div style={{width:40,height:4,background:"rgba(255,140,0,0.3)",borderRadius:2,margin:"0 auto 20px"}}/>
          <div className="gold" style={{fontSize:18,fontWeight:800,marginBottom:16}}>New Donor</div>
          {[{k:"name",l:"Full Name",p:"Donor name"},{k:"phone",l:"Phone",p:"9XXXXXXXXX",t:"tel"},{k:"amount",l:"Amount (Rs)",p:"5000",t:"number"},{k:"purpose",l:"Purpose",p:"Festival name"},{k:"donationDate",l:"Donation Date",p:"",t:"date"}].map(f=>(
            <div key={f.k} style={{marginBottom:12}}>
              <label style={{fontSize:11,fontWeight:700,color:"#5A7AB5",display:"block",marginBottom:5}}>{f.l}</label>
              <input className="inp" placeholder={f.p} type={f.t||"text"} value={form[f.k]} onChange={s(f.k)}/>
            </div>
          ))}
          <div style={{display:"flex",gap:10,marginTop:6}}>
            <button className="btn-gold" disabled={loading} style={{flex:1,padding:"13px",fontSize:14}} onClick={addD}>{loading?"Saving...":"Save Donor"}</button>
            <button className="btn-out" style={{flex:1,padding:"13px",fontSize:14}} onClick={()=>setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      </div>}
    </div>
  );
}

// ─── Business ─────────────────────────────────────────────
function Business() {
  const {profile}=useCtx();
  const [list,setList]=useState([]);
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({name:"",service:"",price:"",phone:"",category:"Flowers",plan:"free"});
  const [loading,setLoading]=useState(false);
  const s=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  useEffect(()=>{
    try{const q=query(collection(db,"businesses"),where("isActive","==",true),orderBy("plan","desc"),orderBy("createdAt","desc"));return onSnapshot(q,snap=>setList(snap.docs.map(d=>({id:d.id,...d.data()}))));}catch(e){console.error(e);}
  },[]);
  async function reg(){
    if(!form.name||!form.service||!form.phone)return;
    setLoading(true);
    try{await addDoc(collection(db,"businesses"),{...form,ownerId:profile?.uid||"",isActive:true,createdAt:serverTimestamp(),updatedAt:serverTimestamp()});}catch(e){console.error(e);}
    setLoading(false);setShow(false);setForm({name:"",service:"",price:"",phone:"",category:"Flowers",plan:"free"});
  }
  return(
    <div style={{background:"#0F1B3D",minHeight:"100vh"}}>
      <div style={{background:"radial-gradient(ellipse at 50% 0%,#0A2040,#0F1B3D 70%)",padding:"20px 20px 22px",borderBottom:"1px solid rgba(74,159,255,0.18)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:22,fontWeight:900,color:"#4A9FFF"}}>Business</div><div style={{color:"rgba(155,181,224,0.5)",fontSize:11,marginTop:2}}>{list.length} listings</div></div>
          <button className="btn-gold" style={{padding:"9px 14px",fontSize:13}} onClick={()=>setShow(true)}>+ Register</button>
        </div>
        <div style={{marginTop:16,padding:"13px 15px",background:"linear-gradient(135deg,rgba(255,140,0,0.1),rgba(10,22,40,0.9))",border:"1px solid rgba(255,140,0,0.25)",borderRadius:13,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{color:"#FFA833",fontWeight:800,fontSize:13}}>⭐ Premium</div><div style={{color:"rgba(155,181,224,0.5)",fontSize:11,marginTop:2}}>Top placement, more reach</div></div>
          <div className="gold" style={{fontSize:17,fontWeight:900}}>Rs 299/mo</div>
        </div>
      </div>
      <div style={{padding:"14px 16px 90px"}} className="scroll">
        {list.length===0?<div style={{textAlign:"center",padding:"52px 20px",color:"#5A7AB5"}}><div style={{fontSize:44,marginBottom:12,opacity:0.5}}>🛒</div><div>No businesses yet</div></div>:
          list.map(b=>(
            <div key={b.id} className="card" style={{borderLeft:b.plan==="paid"?"3px solid #FF8C00":"3px solid rgba(74,159,255,0.3)"}}>
              {b.plan==="paid"&&<div style={{marginBottom:8}}><span className="badge-prem">⭐ Premium</span></div>}
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <div><div style={{color:"#F0F6FF",fontWeight:700,fontSize:14}}>{b.name}</div><div style={{color:"rgba(155,181,224,0.5)",fontSize:12,marginTop:1}}>{b.service}</div><div style={{color:"rgba(155,181,224,0.4)",fontSize:11}}>{b.category}</div></div>
                <div style={{textAlign:"right"}}><div className="gold" style={{fontWeight:800,fontSize:13}}>{b.price||"--"}</div><div style={{color:"#4A9FFF",fontSize:12,marginTop:4}}>📞 {b.phone}</div></div>
              </div>
            </div>
          ))
        }
      </div>
      {show&&<div onClick={e=>e.target===e.currentTarget&&setShow(false)} style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(6px)",display:"flex",alignItems:"flex-end"}}>
        <div className="slide" style={{width:"100%",maxWidth:430,margin:"0 auto",background:"linear-gradient(180deg,#162347,#0F1B3D)",borderRadius:"24px 24px 0 0",border:"1px solid rgba(255,140,0,0.3)",padding:"20px 20px 40px",maxHeight:"85vh",overflow:"auto"}}>
          <div style={{width:40,height:4,background:"rgba(255,140,0,0.3)",borderRadius:2,margin:"0 auto 20px"}}/>
          <div className="gold" style={{fontSize:18,fontWeight:800,marginBottom:16}}>Register Business</div>
          {[{k:"name",l:"Business Name",p:"Shop name"},{k:"service",l:"Service/Product",p:"What you offer"},{k:"price",l:"Price",p:"Rs 100 onwards"},{k:"phone",l:"Phone",p:"9XXXXXXXXX",t:"tel"}].map(f=>(
            <div key={f.k} style={{marginBottom:12}}>
              <label style={{fontSize:11,fontWeight:700,color:"#5A7AB5",display:"block",marginBottom:5}}>{f.l}</label>
              <input className="inp" placeholder={f.p} type={f.t||"text"} value={form[f.k]} onChange={s(f.k)}/>
            </div>
          ))}
          <div style={{marginBottom:16}}>
            <label style={{fontSize:11,fontWeight:700,color:"#5A7AB5",display:"block",marginBottom:8}}>Plan</label>
            <div style={{display:"flex",gap:8}}>
              {[["free","Free","Basic"],["paid","Premium","Rs 299/mo"]].map(([v,l,sub])=>(
                <div key={v} onClick={()=>setForm(f=>({...f,plan:v}))} style={{flex:1,padding:"11px 8px",borderRadius:11,cursor:"pointer",textAlign:"center",border:`1.5px solid ${form.plan===v?"#FF8C00":"rgba(255,140,0,0.18)"}`,background:form.plan===v?"rgba(255,140,0,0.1)":"transparent"}}>
                  <div style={{fontWeight:700,color:form.plan===v?"#FFA833":"rgba(155,181,224,0.5)",fontSize:13}}>{l}</div>
                  <div style={{fontSize:10,color:"rgba(155,181,224,0.4)",marginTop:2}}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
          <button className="btn-gold" disabled={loading} style={{width:"100%",padding:"14px",fontSize:15}} onClick={reg}>{loading?"Registering...":"Register"}</button>
        </div>
      </div>}
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────
function Profile() {
  const {profile,logout}=useCtx();
  return(
    <div style={{background:"#0F1B3D",minHeight:"100vh"}}>
      <div style={{background:"radial-gradient(ellipse at 50% 0%,#1A2F5C,#0F1B3D 70%)",padding:"32px 20px 36px",textAlign:"center",borderBottom:"1px solid rgba(255,140,0,0.15)"}}>
        <div style={{width:72,height:72,borderRadius:36,background:"linear-gradient(135deg,#FF8C00,#FFA833)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 16px",boxShadow:"0 0 28px rgba(255,140,0,0.55)"}}>🙏</div>
        <div className="gold" style={{fontSize:22,fontWeight:800}}>{profile?.name||"User"}</div>
        <div style={{color:"rgba(155,181,224,0.5)",fontSize:13,marginTop:4}}>{profile?.role==="admin"?"Admin":"Donor"}</div>
      </div>
      <div style={{padding:"18px 16px 90px"}}>
        <div className="card">
          <div style={{color:"#5A7AB5",fontSize:10,letterSpacing:2,fontWeight:700,marginBottom:14}}>MY DETAILS</div>
          {[{l:"Name",v:profile?.name||"--"},{l:"Phone",v:profile?.phone||"--"},{l:"Email",v:profile?.email||"--"},{l:"Role",v:profile?.role==="admin"?"Admin":"Donor"}].map((r,i)=>(
            <React.Fragment key={r.l}>
              <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0"}}>
                <span style={{color:"rgba(155,181,224,0.5)",fontSize:13}}>{r.l}</span>
                <span style={{color:"#F0F6FF",fontWeight:600,fontSize:13}}>{r.v}</span>
              </div>
              {i<3&&<div className="divider" style={{margin:"4px 0"}}/>}
            </React.Fragment>
          ))}
        </div>
        <div className="card" style={{marginBottom:16}}>
          <div style={{color:"#5A7AB5",fontSize:10,letterSpacing:2,fontWeight:700,marginBottom:12}}>REMINDERS</div>
          {["1 month before","1 week before","On the day"].map(r=>(
            <div key={r} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{color:"rgba(155,181,224,0.5)",fontSize:13}}>{r}</span>
              <span style={{color:"#22C55E",fontWeight:700,fontSize:13}}>Enabled</span>
            </div>
          ))}
        </div>
        <div style={{padding:"14px",background:"rgba(255,140,0,0.04)",border:"1px dashed rgba(255,140,0,0.15)",borderRadius:12,textAlign:"center",marginBottom:16}}>
          <div className="gold" style={{fontSize:13,fontWeight:700,marginBottom:3}}>Thiruvasal v1.0</div>
          <div style={{color:"rgba(155,181,224,0.4)",fontSize:11}}>AyyaAkilam Platform — Free for users</div>
        </div>
        <button className="btn-out" style={{width:"100%",padding:"14px",fontSize:14,color:"#EF4444",borderColor:"rgba(239,68,68,0.35)"}} onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

// ─── Admin ────────────────────────────────────────────────
function Admin() {
  const [donors,setDonors]=useState([]);
  const [businesses,setBusinesses]=useState([]);
  const [tab,setTab]=useState("overview");
  useEffect(()=>{
    try{const q=query(collection(db,"donors"),orderBy("createdAt","desc"));const u=onSnapshot(q,s=>setDonors(s.docs.map(d=>({id:d.id,...d.data()}))));return u;}catch(e){console.error(e);}
  },[]);
  useEffect(()=>{
    try{const q=query(collection(db,"businesses"),where("isActive","==",true));const u=onSnapshot(q,s=>setBusinesses(s.docs.map(d=>({id:d.id,...d.data()}))));return u;}catch(e){console.error(e);}
  },[]);
  const paid=donors.filter(d=>d.status==="paid");
  const pending=donors.filter(d=>d.status==="pending");
  const total=paid.reduce((s,d)=>s+(d.amount||0),0);
  async function mark(id,status){try{await updateDoc(doc(db,"donors",id),{status,updatedAt:serverTimestamp()});}catch(e){console.error(e);}}
  async function del(id){try{await deleteDoc(doc(db,"donors",id));}catch(e){console.error(e);}}
  return(
    <div style={{background:"#0A1020",minHeight:"100vh"}}>
      <div style={{background:"radial-gradient(ellipse at 50% 0%,#1A0A3C,#0A1020 70%)",padding:"20px 20px 22px",borderBottom:"1px solid rgba(255,140,0,0.15)"}}>
        <div className="gold" style={{fontSize:22,fontWeight:900}}>Admin Dashboard</div>
        <div style={{color:"rgba(155,181,224,0.5)",fontSize:11,marginTop:2}}>Live data</div>
        <div style={{display:"flex",gap:6,marginTop:14}}>
          {[["overview","Overview"],["donors","Donors"],["business","Business"]].map(([id,l])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:"7px 13px",borderRadius:20,border:"none",background:tab===id?"linear-gradient(135deg,#FF8C00,#FFA833)":"rgba(255,140,0,0.08)",color:tab===id?"#0A1628":"rgba(155,181,224,0.5)",fontWeight:700,fontSize:11.5,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{padding:"14px 16px 90px"}} className="scroll">
        {tab==="overview"&&<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            {[{i:"✅",l:"Paid",v:paid.length,c:"#22C55E"},{i:"⏳",l:"Pending",v:pending.length,c:"#FF9800"},{i:"Rs",l:"Collected",v:total.toLocaleString(),c:"#FF8C00"},{i:"🛒",l:"Businesses",v:businesses.length,c:"#4A9FFF"}].map(s=>(
              <div key={s.l} style={{background:"rgba(22,35,71,0.6)",border:"1px solid rgba(255,140,0,0.15)",borderRadius:14,padding:"18px 12px",textAlign:"center"}}>
                <div style={{fontSize:22,marginBottom:6}}>{s.i}</div>
                <div style={{fontSize:20,fontWeight:900,color:s.c}}>{s.v}</div>
                <div style={{fontSize:10,color:"#5A7AB5",marginTop:3}}>{s.l}</div>
              </div>
            ))}
          </div>
          <div className="card">
            <div style={{color:"#5A7AB5",fontSize:10,letterSpacing:2,fontWeight:700,marginBottom:12}}>AUTO REMINDERS</div>
            {["1 month before — SMS + Notification","1 week before — SMS + Notification","On the same day — SMS + Notification"].map(r=>(
              <div key={r} style={{display:"flex",gap:10,marginBottom:9,alignItems:"center"}}>
                <div style={{width:6,height:6,borderRadius:3,background:"#FF8C00",flexShrink:0}}/>
                <span style={{color:"#F0F6FF",fontSize:12}}>{r}</span>
              </div>
            ))}
          </div>
        </>}
        {tab==="donors"&&(donors.length===0?<div style={{textAlign:"center",padding:"52px 20px",color:"#5A7AB5"}}><div style={{fontSize:44,opacity:0.5}}>👥</div><div>No donors</div></div>:
          donors.map(d=>(
            <div key={d.id} className="card" style={{borderLeft:`3px solid ${d.status==="paid"?"#22C55E":"#FF9800"}`}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <div><div style={{color:"#F0F6FF",fontWeight:700,fontSize:14}}>{d.name}</div><div style={{color:"rgba(155,181,224,0.5)",fontSize:11}}>📞 {d.phone}</div><div style={{color:"rgba(155,181,224,0.4)",fontSize:11}}>{d.purpose} | {fmtDate(d.donationDate)}</div></div>
                <div style={{textAlign:"right"}}><div className="gold" style={{fontWeight:900}}>Rs {Number(d.amount||0).toLocaleString()}</div><div style={{marginTop:4}}>{d.status==="paid"?<span className="badge-paid">Paid</span>:<span className="badge-pend">Pending</span>}</div></div>
              </div>
              <div style={{display:"flex",gap:7,marginTop:10}}>
                <button className="btn-gold" style={{padding:"6px 12px",fontSize:11}} onClick={()=>mark(d.id,d.status==="paid"?"pending":"paid")}>{d.status==="paid"?"Mark Pending":"Mark Paid"}</button>
                <button className="btn-out" style={{padding:"6px 10px",fontSize:11,color:"#EF4444",borderColor:"rgba(239,68,68,0.3)"}} onClick={()=>del(d.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
        {tab==="business"&&(businesses.length===0?<div style={{textAlign:"center",padding:"52px 20px",color:"#5A7AB5"}}><div style={{fontSize:44,opacity:0.5}}>🛒</div><div>No businesses</div></div>:
          businesses.map(b=>(
            <div key={b.id} className="card" style={{borderLeft:b.plan==="paid"?"3px solid #FF8C00":"3px solid rgba(74,159,255,0.3)"}}>
              {b.plan==="paid"&&<div style={{marginBottom:6}}><span className="badge-prem">⭐ Premium</span></div>}
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <div><div style={{color:"#F0F6FF",fontWeight:700}}>{b.name}</div><div style={{color:"rgba(155,181,224,0.5)",fontSize:12}}>{b.service}</div></div>
                <div style={{textAlign:"right"}}><div className="gold" style={{fontWeight:800}}>{b.price||"--"}</div><div style={{color:"#4A9FFF",fontSize:12,marginTop:3}}>📞 {b.phone}</div></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── TopBar ───────────────────────────────────────────────
function TopBar({title,sub,onBack,right}) {
  return(
    <div style={{position:"sticky",top:0,zIndex:100,background:"linear-gradient(180deg,rgba(10,22,40,0.98),rgba(15,27,61,0.95))",borderBottom:"1px solid rgba(255,140,0,0.18)",padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",backdropFilter:"blur(20px)"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {onBack?<button onClick={onBack} className="btn-out" style={{padding:"7px 12px",fontSize:17}}>←</button>:<div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#FF8C00,#FFA833)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:"#0A1628"}}>AA</div>}
        <div><div className="gold" style={{fontSize:15,fontWeight:800}}>{title}</div>{sub&&<div style={{fontSize:10,color:"#5A7AB5"}}>{sub}</div>}</div>
      </div>
      {right&&<div>{right}</div>}
    </div>
  );
}

// ─── BottomNav ────────────────────────────────────────────
function BottomNav({tab,setTab,isAdmin}) {
  const items=[{id:"home",icon:"🏠",l:"Home"},{id:"charity",icon:"🏛️",l:"Charity"},{id:"business",icon:"🛒",l:"Business"},{id:"profile",icon:"👤",l:"Profile"},...(isAdmin?[{id:"admin",icon:"⚙️",l:"Admin"}]:[])];
  return(
    <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"linear-gradient(180deg,rgba(10,22,40,0.97),rgba(9,18,35,0.99))",borderTop:"1px solid rgba(255,140,0,0.2)",display:"flex",zIndex:200,backdropFilter:"blur(20px)",paddingBottom:"env(safe-area-inset-bottom,6px)"}}>
      {items.map(n=>{
        const a=tab===n.id;
        return<button key={n.id} onClick={()=>setTab(n.id)} style={{flex:1,background:"none",border:"none",padding:"10px 4px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",fontFamily:"inherit",borderTop:a?`2px solid #FF8C00`:"2px solid transparent",transition:"all 0.2s"}}>
          <span style={{fontSize:19,filter:a?"none":"grayscale(0.5) opacity(0.6)"}}>{n.icon}</span>
          <span style={{fontSize:9.5,fontWeight:a?700:400,color:a?"#FFA833":"#5A7AB5"}}>{n.l}</span>
        </button>;
      })}
    </nav>
  );
}

// ─── Main App ─────────────────────────────────────────────
export default function App() {
  const [user,setUser]=useState(undefined);
  const [profile,setProfile]=useState(null);
  const [tab,setTab]=useState("home");

  useEffect(()=>{
    return onAuthStateChanged(auth,async u=>{
      if(u){
        setUser(u);
        try{const snap=await getDoc(doc(db,"users",u.uid));if(snap.exists())setProfile(snap.data());}catch(e){console.error(e);}
      }else{setUser(null);setProfile(null);}
    });
  },[]);

  const logout=async()=>{try{await signOut(auth);}catch(e){console.error(e);}setUser(null);setProfile(null);};
  const isAdmin=profile?.role==="admin";

  if(user===undefined) return(
    <div style={{minHeight:"100vh",background:"#0F1B3D",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:18}}>
      <style>{CSS}</style>
      <Sun size={70}/>
      <div className="spin" style={{width:28,height:28}}/>
      <p style={{color:"#5A7AB5",fontSize:13}}>Loading...</p>
    </div>
  );

  return(
    <Ctx.Provider value={{user,profile,isAdmin,logout}}>
      <style>{CSS}</style>
      <div className="app">
        {!user ? <Login/> : (
          <>
            <TopBar title="THIRUVASAL" sub="AyyaAkilam"
              right={<div style={{display:"flex",gap:7}}>
                <div style={{background:"rgba(255,152,0,0.15)",border:"1px solid rgba(255,152,0,0.35)",borderRadius:20,padding:"4px 10px",color:"#FF9800",fontSize:11,fontWeight:700}}>🔔</div>
                <button className="btn-out" style={{padding:"5px 9px",fontSize:10}}>EN</button>
              </div>}/>
            <div style={{paddingBottom:62,minHeight:"calc(100vh - 52px)"}}>
              {tab==="home"&&<Home setTab={setTab}/>}
              {tab==="charity"&&<Charity/>}
              {tab==="business"&&<Business/>}
              {tab==="profile"&&<Profile/>}
              {tab==="admin"&&isAdmin&&<Admin/>}
              {tab==="admin"&&!isAdmin&&<div style={{padding:"40px 20px",textAlign:"center",color:"#5A7AB5"}}><div style={{fontSize:40,marginBottom:12}}>🔒</div><div>Admin access only</div></div>}
            </div>
            <BottomNav tab={tab} setTab={setTab} isAdmin={isAdmin}/>
          </>
        )}
      </div>
    </Ctx.Provider>
  );
}
