/* eslint-disable */
import React from "react";

const SUN = "#FF8C00";
const SUN2 = "#FFA833";
const MUTED = "#5A7AB5";
const TEXT = "#F0F6FF";
const MODAL_BG = "0 20px 60px rgba(0,0,0,0.7)";

export function SunIcon({ size = 100 }) {
  const c = size / 2;
  const r = size * 0.26;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ overflow:"visible", filter:`drop-shadow(0 0 ${size*0.14}px rgba(255,140,0,0.7))` }}>
      <defs>
        <radialGradient id="sc" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FFF8DC"/>
          <stop offset="30%"  stopColor="#FFD700"/>
          <stop offset="70%"  stopColor="#FF8C00"/>
          <stop offset="100%" stopColor="#E85000" stopOpacity="0.9"/>
        </radialGradient>
        <radialGradient id="sg" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FFA833" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#FF4500" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="rg" cx="50%" cy="0%" r="100%">
          <stop offset="0%"   stopColor="#FFD080" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#FF8C00" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx={c} cy={c} r={size*0.46} fill="url(#sg)"/>
      <g style={{transformOrigin:`${c}px ${c}px`, animation:"rayRotate 20s linear infinite"}}>
        {Array.from({length:12}).map((_,i)=>{
          const angle=(i*30)*Math.PI/180;
          return <line key={i}
            x1={c+Math.cos(angle)*r*1.18} y1={c+Math.sin(angle)*r*1.18}
            x2={c+Math.cos(angle)*r*2.1}  y2={c+Math.sin(angle)*r*2.1}
            stroke="url(#rg)" strokeWidth={i%3===0?2.5:1.2}
            strokeLinecap="round" opacity={i%3===0?0.85:0.5}/>;
        })}
      </g>
      <circle cx={c} cy={c} r={r*1.08} fill="none" stroke="rgba(255,210,80,0.3)" strokeWidth="2"/>
      <circle cx={c} cy={c} r={r} fill="url(#sc)"/>
      <circle cx={c} cy={c} r={r*0.18} fill="rgba(255,255,240,0.85)"/>
    </svg>
  );
}

export function TopBar({ title, subtitle, onBack, rightElement }) {
  return (
    <div style={{position:"sticky",top:0,zIndex:100,
      background:"linear-gradient(180deg,rgba(10,22,40,0.98),rgba(15,27,61,0.95))",
      borderBottom:"1px solid rgba(255,140,0,0.18)",
      padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",
      backdropFilter:"blur(20px)"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {onBack
          ? <button onClick={onBack} className="btn-outline" style={{padding:"7px 12px",fontSize:17,lineHeight:1}}>&#8592;</button>
          : <div style={{width:34,height:34,borderRadius:9,
              background:"linear-gradient(135deg,#FF8C00,#FFA833)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:13,fontWeight:900,color:"#0A1628",
              boxShadow:"0 0 12px rgba(255,140,0,0.5)"}}>AA</div>}
        <div>
          <div className="shimmer-text" style={{fontSize:15,fontWeight:800}}>{title}</div>
          {subtitle && <div style={{fontSize:10,color:MUTED}}>{subtitle}</div>}
        </div>
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
}

export function BottomNav({ activeTab, setTab, isAdmin }) {
  const items = [
    {id:"home",    icon:"&#127968;", label:"Home"},
    {id:"charity", icon:"&#127963;", label:"Charity"},
    {id:"business",icon:"&#128722;", label:"Business"},
    {id:"profile", icon:"&#128100;", label:"Profile"},
    ...(isAdmin ? [{id:"admin",icon:"&#9881;",label:"Admin"}] : []),
  ];
  return (
    <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
      width:"100%",maxWidth:430,
      background:"linear-gradient(180deg,rgba(10,22,40,0.97),rgba(9,18,35,0.99))",
      borderTop:"1px solid rgba(255,140,0,0.2)",
      display:"flex",zIndex:200,paddingBottom:"env(safe-area-inset-bottom,6px)",
      backdropFilter:"blur(20px)"}}>
      {items.map(n=>{
        const active=activeTab===n.id;
        return (
          <button key={n.id} onClick={()=>setTab(n.id)} style={{
            flex:1,background:"none",border:"none",padding:"10px 4px 8px",
            display:"flex",flexDirection:"column",alignItems:"center",gap:3,
            cursor:"pointer",fontFamily:"inherit",
            borderTop:active?`2px solid ${SUN}`:"2px solid transparent",
            transition:"all 0.2s"}}>
            <span style={{fontSize:19,filter:active?"none":"grayscale(0.5) opacity(0.6)"}}
              dangerouslySetInnerHTML={{__html:n.icon}}/>
            <span style={{fontSize:9.5,fontWeight:active?700:400,color:active?SUN2:MUTED}}>{n.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function ModalSheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{
      position:"fixed",inset:0,zIndex:400,
      background:"rgba(0,0,0,0.75)",backdropFilter:"blur(6px)",
      display:"flex",alignItems:"flex-end"}}>
      <div className="animate-slideUp scroll-y" style={{
        width:"100%",maxWidth:430,margin:"0 auto",
        background:"linear-gradient(180deg,#162347,#0F1B3D)",
        borderRadius:"24px 24px 0 0",
        border:"1px solid rgba(255,140,0,0.3)",borderBottom:"none",
        padding:"20px 20px 40px",maxHeight:"88vh",
        boxShadow:MODAL_BG}}>
        <div style={{width:40,height:4,background:"rgba(255,140,0,0.3)",borderRadius:2,margin:"0 auto 20px"}}/>
        {title && <div className="shimmer-text" style={{fontSize:18,fontWeight:800,marginBottom:4}}>{title}</div>}
        {children}
      </div>
    </div>
  );
}

export function Card({ children, style={}, onClick }) {
  return (
    <div className="glass-card" onClick={onClick} style={{
      padding:"14px 16px",marginBottom:10,
      cursor:onClick?"pointer":"default",
      transition:"transform 0.15s",...style}}
      onMouseEnter={onClick?e=>{e.currentTarget.style.transform="translateY(-2px)"}:undefined}
      onMouseLeave={onClick?e=>{e.currentTarget.style.transform="translateY(0)"}:undefined}>
      {children}
    </div>
  );
}

export function Field({ label, children, style={} }) {
  return (
    <div style={{marginBottom:14,...style}}>
      {label && <label style={{display:"block",fontSize:11,fontWeight:700,color:MUTED,marginBottom:6}}>{label}</label>}
      {children}
    </div>
  );
}

export function StatBox({ icon, label, value, color="#FFA833", bg, border }) {
  return (
    <div style={{flex:1,textAlign:"center",padding:"14px 8px",
      background:bg||"rgba(22,35,71,0.6)",
      border:`1px solid ${border||"rgba(255,140,0,0.18)"}`,borderRadius:14}}>
      <div style={{fontSize:20,marginBottom:5}}>{icon}</div>
      <div style={{fontSize:18,fontWeight:900,color}}>{value}</div>
      <div style={{fontSize:9.5,color:MUTED,marginTop:3}}>{label}</div>
    </div>
  );
}

export function FullLoader({ text="Loading..." }) {
  return (
    <div style={{position:"fixed",inset:0,background:"#0F1B3D",
      display:"flex",alignItems:"center",justifyContent:"center",
      flexDirection:"column",gap:18,zIndex:999}}>
      <div style={{animation:"sunRise 0.6s ease forwards"}}><SunIcon size={70}/></div>
      <div className="spinner" style={{width:28,height:28}}/>
      <p style={{color:MUTED,fontSize:13}}>{text}</p>
    </div>
  );
}

export function EmptyState({ icon="📋", text="No items found" }) {
  return (
    <div style={{textAlign:"center",padding:"52px 20px",color:MUTED}}>
      <div style={{fontSize:44,marginBottom:12,opacity:0.5}}>{icon}</div>
      <div style={{fontSize:14}}>{text}</div>
    </div>
  );
}

export function ConfirmDialog({ open, message, onYes, onNo }) {
  if (!open) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:500,
      background:"rgba(0,0,0,0.8)",backdropFilter:"blur(4px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:"0 24px"}}>
      <div className="glass-card animate-fadeUp" style={{padding:24,width:"100%",maxWidth:380,textAlign:"center"}}>
        <div style={{fontSize:32,marginBottom:12}}>&#128591;</div>
        <div style={{color:TEXT,fontSize:15,marginBottom:20,lineHeight:1.6}}>{message}</div>
        <div style={{display:"flex",gap:10}}>
          <button className="btn-sun" style={{flex:1,padding:"13px",fontSize:14}} onClick={onYes}>Yes</button>
          <button className="btn-outline" style={{flex:1,padding:"13px",fontSize:14,color:"#EF4444",borderColor:"rgba(239,68,68,0.4)"}} onClick={onNo}>No</button>
        </div>
      </div>
    </div>
  );
}

export function ParticleBg() {
  const p=Array.from({length:15},(_,i)=>({
    id:i,size:Math.random()*3+1,
    x:Math.random()*100,y:Math.random()*100,
    dur:`${Math.random()*4+2}s`,delay:`${Math.random()*5}s`
  }));
  return (
    <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
      {p.map(pt=>(
        <div key={pt.id} style={{position:"absolute",width:pt.size,height:pt.size,
          left:`${pt.x}%`,top:`${pt.y}%`,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(255,200,80,0.8) 0%,transparent 70%)",
          animation:`twinkle ${pt.dur} ease-in-out infinite`,animationDelay:pt.delay}}/>
      ))}
    </div>
  );
}
