import { useState, useEffect } from "react";

/* ─── KES FORMATTER ─────────────────────────────────────────── */
function kes(amount) {
  return "KES " + Number(amount).toLocaleString("en-KE");
}

/* ─── DATA — All amounts in Kenyan Shillings ────────────────── */
const ALERTS = [
  { id:"ALT-9812", sev:"critical", title:"AML Threshold Breached",          detail:"TXN-4471 · KES 298M velocity spike",        entity:"Corp Account #7723", time:"12s ago" },
  { id:"ALT-9811", sev:"warn",     title:"KYC Document Expiry",             detail:"Customer #88210 · renewal overdue 3d",      entity:"Retail Segment",     time:"2m ago"  },
  { id:"ALT-9810", sev:"critical", title:"Liquidity Threshold Violation",   detail:"LDR breached 95% on Tier-2 pool",           entity:"Treasury Ops",       time:"5m ago"  },
  { id:"ALT-9809", sev:"info",     title:"Regulatory Rule Update Applied",  detail:"CBK Basel III rule engine hot-reloaded",    entity:"System",             time:"11m ago" },
  { id:"ALT-9808", sev:"warn",     title:"Suspicious Cross-Border Pattern", detail:"3 txns to flagged jurisdiction · USD→KES",  entity:"FX Desk #02",        time:"18m ago" },
];

// USD→KES approx rate: 1 USD ≈ 129 KES
const TRANSACTIONS = [
  { id:"TXN-4471", type:"Wire Transfer",    amount:297_000_000,  party:"SWIFT/NCBA-KE",       score:92, risk:"high", status:"Flagged" },
  { id:"TXN-4469", type:"EFT Batch",        amount:52_954_500,   party:"Payroll Corp KE",      score:12, risk:"low",  status:"Cleared" },
  { id:"TXN-4468", type:"FX Swap USD/KES",  amount:113_520_000,  party:"Stanbic Bank Kenya",   score:48, risk:"med",  status:"Review"  },
  { id:"TXN-4466", type:"Wire Transfer",    amount:20_020_800,   party:"Cayman Holdings",      score:78, risk:"high", status:"Flagged" },
  { id:"TXN-4465", type:"Internal",         amount:670_800,      party:"Branch #14 — Nairobi", score:5,  risk:"low",  status:"Cleared" },
  { id:"TXN-4463", type:"Letter of Credit", amount:79_980_000,   party:"Dubai Trade Bank",     score:61, risk:"med",  status:"Review"  },
];

const AGENTS = [
  { name:"Ingestion Agent",   desc:"Event stream processing",    status:"running", ms:"4ms"  },
  { name:"AML Engine",        desc:"Transaction evaluation",     status:"running", ms:"11ms" },
  { name:"KYC Validator",     desc:"Identity verification",      status:"running", ms:"7ms"  },
  { name:"Vault Connector",   desc:"Credential provisioning",    status:"running", ms:"2ms"  },
  { name:"Rule Engine",       desc:"CBK regulatory logic layer", status:"running", ms:"3ms"  },
  { name:"Audit Recorder",    desc:"Immutable trail writer",     status:"standby", ms:"—"    },
  { name:"Observability Hub", desc:"IBM Instana telemetry",      status:"running", ms:"1ms"  },
  { name:"Decryption Broker", desc:"Vault lease management",     status:"standby", ms:"—"    },
];

const AUDIT_LOG = [
  { ts:"10:42:38.112", event:"ALERT_TRIGGERED",     rule:"AML-VEL-001",  actor:"rule_engine",     outcome:"FLAGGED"   },
  { ts:"10:42:38.118", event:"RISK_SCORE_ASSIGNED",  rule:"SCORE-CALC",   actor:"aml_engine",      outcome:"SCORE: 92" },
  { ts:"10:42:38.124", event:"AUDIT_SEALED",         rule:"IMMUT-001",    actor:"audit_recorder",  outcome:"SEALED"    },
  { ts:"10:40:11.004", event:"KYC_EXPIRY_DETECTED",  rule:"KYC-EXP-003",  actor:"kyc_validator",   outcome:"WARN"      },
  { ts:"10:35:02.889", event:"RULE_ENGINE_RELOAD",   rule:"CBK-RULE-01",  actor:"system",          outcome:"SUCCESS"   },
  { ts:"10:28:44.321", event:"VAULT_LEASE_ISSUED",   rule:"VAULT-SEC-1",  actor:"vault_connector", outcome:"GRANTED"   },
  { ts:"10:27:00.010", event:"VAULT_LEASE_EXPIRED",  rule:"VAULT-SEC-1",  actor:"vault_connector", outcome:"EXPIRED"   },
];

const SPARK = [28,45,38,60,52,88,44,67,91,50,72,80];

const NAV = [
  { id:"pulse",    icon:"◉", label:"Compliance Pulse" },
  { id:"txn",      icon:"⇄", label:"Transactions"     },
  { id:"agents",   icon:"⬡", label:"Micro-Agents"     },
  { id:"audit",    icon:"≡", label:"Audit Trail"      },
  { id:"vault",    icon:"⊛", label:"Vault Access"     },
  { id:"rules",    icon:"⊕", label:"Rule Engine"      },
  { id:"settings", icon:"⚙", label:"Settings"         },
];

/* ─── HELPERS ───────────────────────────────────────────────── */
function useClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  return t.toLocaleTimeString("en-KE", { hour12: false }) + " EAT";
}

function RiskGauge({ score }) {
  const r = 54, cx = 70, cy = 72;
  const circ = Math.PI * r;
  const color = score > 70 ? "#FF4059" : score > 40 ? "#FFBE32" : "#23E8A0";
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"8px 0 4px" }}>
      <svg width="140" height="90" viewBox="0 0 140 90" style={{ overflow:"visible" }}>
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}
          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" strokeLinecap="round"/>
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}
          fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - score / 100)}
          style={{ transition:"stroke-dashoffset 1.2s ease, stroke 0.5s" }}/>
        <text x={cx} y={cy - 10} textAnchor="middle"
          style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:38, fill:"#F0F2FF" }}>{score}</text>
        <text x={cx} y={cy + 10} textAnchor="middle"
          style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, fill:"#4A5A7A", letterSpacing:2 }}>
          RISK SCORE
        </text>
      </svg>
      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, fontWeight:700,
        color, marginTop:-4, letterSpacing:2 }}>
        {score > 70 ? "CRITICAL" : score > 40 ? "ELEVATED" : "NOMINAL"}
      </div>
    </div>
  );
}

/* ─── CSS ───────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;600;700&family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg0:#07080C; --bg1:#0D0F18; --bg2:#111522; --bg3:#181D30;
  --bdr:rgba(255,190,50,0.11); --bdr2:rgba(255,190,50,0.32);
  --gld:#FFBE32; --gld-bg:rgba(255,190,50,0.09);
  --red:#FF4059; --red-bg:rgba(255,64,89,0.13);
  --grn:#23E8A0; --grn-bg:rgba(35,232,160,0.11);
  --blu:#4FA8FF; --blu-bg:rgba(79,168,255,0.11);
  --hi:#F0F2FF; --md:#7B86AA; --lo:#394260;
  --fd:'Bebas Neue',sans-serif;
  --fm:'IBM Plex Mono',monospace;
  --fu:'DM Sans',sans-serif;
  --rad:6px;
}
html,body,#root{height:100%;background:var(--bg0)}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:var(--bg1)}
::-webkit-scrollbar-thumb{background:var(--bg3);border-radius:2px}

/* Shell */
.shell{display:flex;height:100vh;overflow:hidden;font-family:var(--fu);background:var(--bg0);color:var(--hi)}
.shell::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:9998;
  background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.03) 3px,rgba(0,0,0,0.03) 4px)}
.glow{position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0}
.ga{width:500px;height:500px;background:rgba(255,190,50,0.04);top:-150px;left:-80px}
.gb{width:380px;height:380px;background:rgba(255,64,89,0.03);top:50%;right:-60px}
.gc{width:320px;height:320px;background:rgba(35,232,160,0.03);bottom:-100px;left:30%}

/* Sidebar */
.sb{width:228px;min-width:228px;background:var(--bg1);border-right:1px solid var(--bdr);display:flex;flex-direction:column;z-index:20}
.sb-top{padding:22px 20px 18px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;gap:11px}
.lm{width:36px;height:36px;background:var(--gld);border-radius:5px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.lm svg{width:20px;height:20px}
.lt{font-family:var(--fd);font-size:19px;letter-spacing:2px;color:var(--hi);display:block}
.ls{font-family:var(--fm);font-size:8px;color:var(--gld);letter-spacing:2.5px;text-transform:uppercase;margin-top:2px;display:block}
.sb-lbl{font-family:var(--fm);font-size:8px;color:var(--lo);letter-spacing:2px;text-transform:uppercase;padding:16px 20px 5px}
.nv{display:flex;align-items:center;gap:10px;padding:9px 20px;cursor:pointer;font-size:13px;font-weight:500;
  color:var(--md);border:none;background:none;width:100%;text-align:left;border-left:2px solid transparent;transition:all 0.14s}
.nv:hover{color:var(--hi);background:var(--gld-bg)}
.nv.on{color:var(--gld);background:var(--gld-bg);border-left-color:var(--gld)}
.ni{font-size:14px;width:18px;text-align:center;flex-shrink:0}
.nb{margin-left:auto;background:var(--red);color:#fff;font-family:var(--fm);font-size:8px;font-weight:700;border-radius:9px;padding:1px 6px}
.sb-foot{margin-top:auto;border-top:1px solid var(--bdr);padding:14px 20px;display:flex;align-items:center;gap:10px}
.av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#2a3a60,var(--bg3));
  border:1.5px solid var(--bdr2);display:flex;align-items:center;justify-content:center;
  font-family:var(--fm);font-size:11px;font-weight:700;color:var(--gld);flex-shrink:0}
.un{font-size:12px;font-weight:600;color:var(--hi)}
.ur{font-family:var(--fm);font-size:8px;color:var(--lo);margin-top:2px}
.ud{width:7px;height:7px;border-radius:50%;background:var(--grn);box-shadow:0 0 7px var(--grn);animation:bl 2s ease-in-out infinite;flex-shrink:0}
@keyframes bl{0%,100%{opacity:1}50%{opacity:.4}}

/* Main */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative;z-index:1}

/* Topbar */
.tb{height:54px;min-height:54px;background:rgba(7,8,12,0.92);border-bottom:1px solid var(--bdr);
  display:flex;align-items:center;padding:0 24px;gap:14px;backdrop-filter:blur(12px)}
.tb-bc{font-family:var(--fm);font-size:10px;color:var(--lo);display:flex;align-items:center;gap:5px}
.tb-bc b{color:var(--hi);font-weight:600}
.tb-sp{flex:1}
.tb-live{display:flex;align-items:center;gap:6px;padding:4px 11px;border-radius:4px;
  background:var(--grn-bg);border:1px solid rgba(35,232,160,0.22);
  font-family:var(--fm);font-size:8px;color:var(--grn);letter-spacing:1.5px;text-transform:uppercase}
.tb-dot{width:6px;height:6px;border-radius:50%;background:var(--grn);animation:bl 1s infinite}
.tb-tm{font-family:var(--fm);font-size:10px;color:var(--md);padding:4px 10px;border-radius:4px;border:1px solid var(--bdr);background:var(--bg2)}
.tb-btn{padding:6px 14px;border-radius:var(--rad);border:1px solid var(--bdr2);background:var(--gld-bg);
  font-family:var(--fm);font-size:9px;color:var(--gld);cursor:pointer;transition:all 0.14s;letter-spacing:.5px}
.tb-btn:hover{background:rgba(255,190,50,0.18)}

/* Canvas */
.canvas{flex:1;overflow-y:auto;padding:20px 24px 36px;display:flex;flex-direction:column;gap:16px}

/* KPI */
.krow{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.kpi{background:var(--bg1);border:1px solid var(--bdr);border-radius:var(--rad);padding:18px 20px;position:relative;overflow:hidden;transition:border-color 0.2s}
.kpi:hover{border-color:var(--bdr2)}
.kb{position:absolute;top:0;left:0;right:0;height:2px}
.kb.g{background:linear-gradient(90deg,var(--gld),transparent)}
.kb.r{background:linear-gradient(90deg,var(--red),transparent)}
.kb.n{background:linear-gradient(90deg,var(--grn),transparent)}
.kb.b{background:linear-gradient(90deg,var(--blu),transparent)}
.kl{font-family:var(--fm);font-size:8px;color:var(--lo);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px}
.kv{font-family:var(--fd);font-size:36px;line-height:1;letter-spacing:.5px}
.kv.gold{color:var(--gld)}.kv.red{color:var(--red)}.kv.grn{color:var(--grn)}.kv.blu{color:var(--blu)}
.km{font-family:var(--fm);font-size:8px;color:var(--lo);margin-top:7px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.dl{font-size:8px;padding:1px 6px;border-radius:9px;font-family:var(--fm)}
.dl.up{background:var(--grn-bg);color:var(--grn)}.dl.dn{background:var(--red-bg);color:var(--red)}

/* Grids */
.g31{display:grid;grid-template-columns:1.65fr 1fr;gap:14px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.col{display:flex;flex-direction:column;gap:14px}

/* Panel */
.pn{background:var(--bg1);border:1px solid var(--bdr);border-radius:var(--rad);overflow:hidden;display:flex;flex-direction:column}
.ph{display:flex;align-items:center;gap:8px;padding:13px 18px;border-bottom:1px solid var(--bdr)}
.pt{font-family:var(--fm);font-size:9px;font-weight:700;color:var(--hi);letter-spacing:1.5px;text-transform:uppercase}
.ptg{margin-left:auto;font-family:var(--fm);font-size:7px;padding:2px 7px;border-radius:3px;letter-spacing:1px;text-transform:uppercase}
.ptg.g{background:var(--gld-bg);color:var(--gld);border:1px solid var(--bdr)}
.ptg.r{background:var(--red-bg);color:var(--red);border:1px solid rgba(255,64,89,.28)}
.ptg.n{background:var(--grn-bg);color:var(--grn);border:1px solid rgba(35,232,160,.25)}
.ptg.b{background:var(--blu-bg);color:var(--blu);border:1px solid rgba(79,168,255,.25)}
.pb{padding:16px 18px}

/* Alerts */
.alist{display:flex;flex-direction:column;gap:8px}
.al{display:flex;align-items:flex-start;gap:11px;padding:11px 13px;border-radius:5px;
  background:var(--bg2);border:1px solid transparent;border-left:3px solid transparent;
  cursor:pointer;transition:all 0.15s;animation:si 0.35s ease both}
@keyframes si{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:translateX(0)}}
.al:hover{border-color:var(--bdr);transform:translateX(2px)}
.al.critical{border-left-color:var(--red)}
.al.warn{border-left-color:var(--gld)}
.al.info{border-left-color:var(--blu)}
.aic{font-size:15px;flex-shrink:0;margin-top:1px}
.ab{flex:1;min-width:0}
.at{font-size:12px;font-weight:600;color:var(--hi);margin-bottom:3px}
.am{font-family:var(--fm);font-size:9px;color:var(--md)}
.sv{font-family:var(--fm);font-size:8px;padding:2px 7px;border-radius:8px;flex-shrink:0;margin-top:1px}
.sv.critical{background:var(--red-bg);color:var(--red)}
.sv.warn{background:var(--gld-bg);color:var(--gld)}
.sv.info{background:var(--blu-bg);color:var(--blu)}

/* Spark */
.sps{display:flex;align-items:flex-end;gap:4px;height:50px}
.sp{flex:1;border-radius:3px 3px 0 0;animation:gw 0.5s ease both;transform-origin:bottom}
@keyframes gw{from{transform:scaleY(0)}to{transform:scaleY(1)}}
.sp:hover{opacity:.7}

/* Transaction table */
.tt{width:100%;border-collapse:collapse;font-size:11px}
.tt th{text-align:left;font-family:var(--fm);font-size:8px;color:var(--lo);
  letter-spacing:1.5px;text-transform:uppercase;padding:9px 14px;border-bottom:1px solid var(--bdr)}
.tt td{padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.03)}
.tt tr:last-child td{border-bottom:none}
.tt tr:hover td{background:rgba(255,190,50,0.03)}
.tid{font-family:var(--fm);font-size:10px;color:var(--gld)}
.tam{font-family:var(--fd);font-size:14px;color:var(--hi)}
.kes-tag{font-family:var(--fm);font-size:8px;color:var(--md);margin-left:3px}
.ch{display:inline-block;font-family:var(--fm);font-size:8px;padding:2px 8px;border-radius:9px}
.ch.high{background:var(--red-bg);color:var(--red)}
.ch.med{background:var(--gld-bg);color:var(--gld)}
.ch.low{background:var(--grn-bg);color:var(--grn)}

/* Agent */
.agrid{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.ag{background:var(--bg2);border-radius:5px;padding:11px 13px;display:flex;align-items:center;gap:10px;border:1px solid var(--bdr);transition:border-color 0.15s}
.ag:hover{border-color:var(--bdr2)}
.ad{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.ad.running{background:var(--grn);box-shadow:0 0 7px var(--grn);animation:bl 1.8s infinite}
.ad.standby{background:var(--gld)}
.an{font-size:12px;font-weight:600;color:var(--hi)}
.adc{font-family:var(--fm);font-size:8px;color:var(--lo);margin-top:2px}
.ams{margin-left:auto;font-family:var(--fm);font-size:10px;color:var(--gld)}

/* Audit */
.aut{width:100%;border-collapse:collapse;font-family:var(--fm);font-size:10px}
.aut th{text-align:left;font-size:8px;color:var(--lo);letter-spacing:1.5px;text-transform:uppercase;padding:9px 14px;border-bottom:1px solid var(--bdr)}
.aut td{padding:9px 14px;border-bottom:1px solid rgba(255,255,255,0.03);vertical-align:top}
.aut tr:last-child td{border-bottom:none}
.aut tr:hover td{background:rgba(255,190,50,0.025)}

/* Modal */
.ov{position:fixed;inset:0;background:rgba(0,0,0,0.72);z-index:200;display:flex;
  align-items:center;justify-content:center;backdrop-filter:blur(5px);animation:fin 0.18s ease}
@keyframes fin{from{opacity:0}to{opacity:1}}
.mo{background:var(--bg1);border:1px solid var(--bdr2);border-radius:10px;width:520px;max-width:95vw;
  box-shadow:0 40px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(255,190,50,0.08);animation:min 0.22s ease}
@keyframes min{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}
.moh{display:flex;align-items:flex-start;justify-content:space-between;padding:20px 22px;border-bottom:1px solid var(--bdr)}
.mid{font-family:var(--fm);font-size:9px;color:var(--lo);margin-bottom:4px}
.mti{font-family:var(--fd);font-size:20px;letter-spacing:1px;color:var(--hi)}
.mcl{background:none;border:none;color:var(--lo);cursor:pointer;font-size:18px;padding:4px;border-radius:4px;transition:color 0.14s;line-height:1}
.mcl:hover{color:var(--hi)}
.mob{padding:20px 22px;display:flex;flex-direction:column;gap:14px}
.mr{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.mfl{}
.mla{font-family:var(--fm);font-size:8px;color:var(--lo);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:5px}
.mva{font-size:13px;color:var(--hi)}
.mlg{font-family:var(--fm);font-size:9px;color:var(--md);background:var(--bg2);border-radius:5px;padding:10px 12px;line-height:1.7;border:1px solid var(--bdr)}
.lbx{background:var(--bg2);border:1px solid rgba(255,190,50,0.28);border-radius:6px;padding:13px 15px;display:flex;align-items:center;gap:12px}
.lic{font-size:22px;flex-shrink:0}
.llb{font-family:var(--fm);font-size:9px;color:var(--gld)}
.lcn{font-family:var(--fd);font-size:28px;color:var(--gld)}
.mof{display:flex;gap:9px;padding:0 22px 20px}
.btn{padding:9px 18px;border-radius:var(--rad);font-family:var(--fm);font-size:9px;font-weight:700;cursor:pointer;border:none;transition:all 0.14s;letter-spacing:.5px}
.bp{background:var(--gld);color:var(--bg0)}.bp:hover{background:#ffd060;transform:translateY(-1px)}
.bd{background:var(--red-bg);color:var(--red);border:1px solid rgba(255,64,89,.3)}.bd:hover{background:rgba(255,64,89,.25)}
.bg2b{background:var(--bg2);color:var(--md);border:1px solid var(--bdr)}.bg2b:hover{border-color:var(--bdr2);color:var(--hi)}
.bml{margin-left:auto}

/* FX Rate banner */
.fx-banner{
  display:flex;align-items:center;gap:8px;
  padding:7px 14px;border-radius:4px;
  background:rgba(79,168,255,0.07);
  border:1px solid rgba(79,168,255,0.18);
  font-family:var(--fm);font-size:9px;color:var(--blu);
  letter-spacing:.5px;
}
`;

/* ─── MAIN COMPONENT ────────────────────────────────────────── */
export default function ComplianceGuard() {
  const [nav,      setNav]      = useState("pulse");
  const [selAlert, setSelAlert] = useState(null);
  const [leaseOn,  setLeaseOn]  = useState(false);
  const [leaseSec, setLeaseSec] = useState(30);
  const [alerts,   setAlerts]   = useState(ALERTS);
  const clock = useClock();

  useEffect(() => {
    if (!leaseOn) return;
    if (leaseSec <= 0) { setLeaseOn(false); setLeaseSec(30); return; }
    const t = setTimeout(() => setLeaseSec(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [leaseOn, leaseSec]);

  const critCount = alerts.filter(a => a.sev === "critical").length;

  function resolveAlert(id) {
    setAlerts(prev => prev.filter(a => a.id !== id));
    setSelAlert(null);
  }

  /* ── Sidebar ── */
  const Sidebar = (
    <aside className="sb">
      <div className="sb-top">
        <div className="lm">
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M10 2L3 6v8l7 4 7-4V6L10 2z" stroke="#07080C" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M10 6v8M6.5 7.5l3.5 2 3.5-2" stroke="#07080C" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <span className="lt">COMPLIANCE</span>
          <span className="ls">GUARD · KE v2.4</span>
        </div>
      </div>
      <span className="sb-lbl">Navigation</span>
      {NAV.map(n => (
        <button key={n.id} className={`nv${nav === n.id ? " on" : ""}`} onClick={() => setNav(n.id)}>
          <span className="ni">{n.icon}</span>
          {n.label}
          {n.id === "pulse" && alerts.length > 0 &&
            <span className="nb">{alerts.length}</span>}
        </button>
      ))}
      <div className="sb-foot">
        <div className="av">AW</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="un">Amina Waweru</div>
          <div className="ur">CBK COMPLIANCE OFFICER</div>
        </div>
        <div className="ud"/>
      </div>
    </aside>
  );

  /* ── Topbar ── */
  const Topbar = (
    <header className="tb">
      <div className="tb-bc">
        <span>COMPLIANCE GUARD</span>
        <span style={{ color:"var(--lo)" }}>›</span>
        <b>{NAV.find(n => n.id === nav)?.label}</b>
      </div>
      <div className="tb-sp"/>
      {/* Live FX rate display */}
      <div className="fx-banner">
        🇰🇪 1 USD = KES 129.40 &nbsp;|&nbsp; CBK REF RATE
      </div>
      <div className="tb-live"><div className="tb-dot"/>SYSTEM LIVE</div>
      <div className="tb-tm">{clock}</div>
      <button className="tb-btn">EXPORT REPORT</button>
    </header>
  );

  /* ── Shared TXN Table body ── */
  const TxnTableRows = (
    <tbody>
      {TRANSACTIONS.map(tx => (
        <tr key={tx.id}>
          <td><span className="tid">{tx.id}</span></td>
          <td style={{ color:"var(--md)", fontSize:11 }}>{tx.type}</td>
          <td>
            <span className="tam">{kes(tx.amount)}</span>
          </td>
          <td style={{ fontFamily:"var(--fm)", fontSize:9, color:"var(--md)" }}>{tx.party}</td>
          <td><span className={`ch ${tx.risk}`}>{tx.score}/100</span></td>
          <td style={{ fontFamily:"var(--fm)", fontSize:10, fontWeight:700,
            color: tx.status === "Flagged" ? "var(--red)"
                 : tx.status === "Review"  ? "var(--gld)" : "var(--grn)" }}>
            {tx.status}
          </td>
        </tr>
      ))}
    </tbody>
  );

  /* ── Pulse Page ── */
  const PulsePage = (
    <>
      {/* KPI Row — all amounts in KES */}
      <div className="krow">
        {[
          { c:"g", v:"gold", val:"1,926,000",    prefix:"KES", lbl:"Total Volume Scanned Today",   meta:"In-day · Nairobi exchange", dl:"+8.2%", dir:"up" },
          { c:"r", v:"red",  val:String(alerts.length), prefix:"",  lbl:"Active Compliance Alerts",  meta:"Unresolved",                dl:`${critCount} critical`, dir:"dn" },
          { c:"n", v:"grn",  val:"90%",           prefix:"",    lbl:"Checks Automated",              meta:"CBK routine compliance",    dl:"+18pp vs legacy", dir:"up" },
          { c:"b", v:"blu",  val:"11ms",          prefix:"",    lbl:"Avg Decision Latency",          meta:"P95 pipeline · EAT",        dl:"↓ 34ms saved", dir:"up" },
        ].map((k,i) => (
          <div className="kpi" key={i}>
            <div className={`kb ${k.c}`}/>
            <div className="kl">{k.lbl}</div>
            <div className={`kv ${k.v}`}>
              {k.prefix && <span style={{ fontFamily:"var(--fm)", fontSize:14, opacity:.7, marginRight:4 }}>{k.prefix}</span>}
              {k.val}
            </div>
            <div className="km">{k.meta}<span className={`dl ${k.dir}`}>{k.dl}</span></div>
          </div>
        ))}
      </div>

      {/* Alerts + Side column */}
      <div className="g31">
        <div className="pn">
          <div className="ph">
            <span className="pt">Smart Alerts · Compliance Pulse</span>
            <span className="ptg n">● LIVE</span>
          </div>
          <div className="pb">
            {alerts.length === 0
              ? <div style={{ fontFamily:"var(--fm)", fontSize:11, color:"var(--lo)",
                  padding:"20px 0", textAlign:"center" }}>✓ All alerts resolved</div>
              : <div className="alist">
                  {alerts.map((a,i) => (
                    <div key={a.id} className={`al ${a.sev}`}
                      style={{ animationDelay:`${i*0.06}s` }}
                      onClick={() => setSelAlert(a)}>
                      <div className="aic">
                        {a.sev === "critical" ? "🔴" : a.sev === "warn" ? "🟡" : "🔵"}
                      </div>
                      <div className="ab">
                        <div className="at">{a.title}</div>
                        <div className="am">{a.detail} · {a.time}</div>
                      </div>
                      <span className={`sv ${a.sev}`}>{a.sev.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
            }
          </div>
        </div>

        <div className="col">
          <div className="pn">
            <div className="ph">
              <span className="pt">Portfolio Risk Score</span>
              <span className="ptg r">REAL-TIME</span>
            </div>
            <div className="pb" style={{ paddingTop:8 }}>
              <RiskGauge score={72}/>
            </div>
          </div>
          <div className="pn">
            <div className="ph">
              <span className="pt">Violation Velocity</span>
              <span className="ptg g">12H EAT</span>
            </div>
            <div className="pb">
              <div style={{ fontFamily:"var(--fm)", fontSize:8, color:"var(--lo)", marginBottom:10, letterSpacing:1 }}>
                LAST 12 HOURS · HOURLY VIOLATION COUNT
              </div>
              <div className="sps">
                {SPARK.map((h,i) => (
                  <div key={i} className="sp" style={{
                    height:`${h}%`,
                    background: h > 80 ? "rgba(255,64,89,0.55)"
                              : h > 60 ? "rgba(255,190,50,0.45)"
                              :          "rgba(79,168,255,0.3)",
                    animationDelay:`${i*0.04}s`
                  }}/>
                ))}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between",
                fontFamily:"var(--fm)", fontSize:8, color:"var(--lo)", marginTop:6 }}>
                <span>22:00</span><span>04:00</span><span>10:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="pn">
        <div className="ph">
          <span className="pt">In-Flight Transactions · AML Risk Scored (KES)</span>
          <span className="ptg n">● STREAMING</span>
        </div>
        <table className="tt">
          <thead>
            <tr>
              <th>TXN ID</th><th>TYPE</th><th>AMOUNT (KES)</th>
              <th>COUNTERPARTY</th><th>RISK SCORE</th><th>STATUS</th>
            </tr>
          </thead>
          {TxnTableRows}
        </table>
      </div>

      {/* Agent Cluster */}
      <div className="pn">
        <div className="ph">
          <span className="pt">Micro-Agent Cluster · IBM Instana Observability</span>
          <span className="ptg b">GOLDEN THREAD</span>
        </div>
        <div className="pb">
          <div className="agrid">
            {AGENTS.map(ag => (
              <div key={ag.name} className="ag">
                <div className={`ad ${ag.status}`}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div className="an">{ag.name}</div>
                  <div className="adc">{ag.desc}</div>
                </div>
                <div className="ams">{ag.ms}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  /* ── Transactions Page ── */
  const TxnPage = (
    <div className="pn">
      <div className="ph">
        <span className="pt">All Transactions · AML Risk Scored · Currency: KES</span>
        <span className="ptg n">● STREAMING</span>
      </div>
      <table className="tt">
        <thead>
          <tr><th>TXN ID</th><th>TYPE</th><th>AMOUNT (KES)</th><th>COUNTERPARTY</th><th>RISK SCORE</th><th>STATUS</th></tr>
        </thead>
        {TxnTableRows}
      </table>
    </div>
  );

  /* ── Agents Page ── */
  const AgentsPage = (
    <div className="pn">
      <div className="ph">
        <span className="pt">Micro-Agent Cluster · Real-Time Status</span>
        <span className="ptg b">IBM INSTANA</span>
      </div>
      <div className="pb">
        <div className="agrid">
          {AGENTS.map(ag => (
            <div key={ag.name} className="ag" style={{ padding:"14px 16px" }}>
              <div className={`ad ${ag.status}`}/>
              <div style={{ flex:1 }}>
                <div className="an">{ag.name}</div>
                <div className="adc" style={{ marginTop:3 }}>{ag.desc}</div>
                <div style={{ fontFamily:"var(--fm)", fontSize:8, color:"var(--lo)",
                  marginTop:6, textTransform:"uppercase", letterSpacing:1 }}>
                  {ag.status === "running" ? "● ACTIVE" : "○ STANDBY"}
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"var(--fd)", fontSize:20, color:"var(--gld)" }}>{ag.ms}</div>
                <div style={{ fontFamily:"var(--fm)", fontSize:8, color:"var(--lo)", marginTop:2 }}>LATENCY</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ── Audit Page ── */
  const AuditPage = (
    <div className="pn">
      <div className="ph">
        <span className="pt">Immutable Audit Trail · Golden Thread · CBK Compliant</span>
        <span className="ptg n">SEALED</span>
      </div>
      <table className="aut">
        <thead>
          <tr><th>TIMESTAMP (EAT)</th><th>EVENT</th><th>RULE</th><th>ACTOR</th><th>OUTCOME</th></tr>
        </thead>
        <tbody>
          {AUDIT_LOG.map((row,i) => (
            <tr key={i}>
              <td style={{ fontFamily:"var(--fm)", color:"var(--gld)", whiteSpace:"nowrap" }}>{row.ts}</td>
              <td style={{ fontFamily:"var(--fm)", color:"var(--hi)", fontWeight:700 }}>{row.event}</td>
              <td style={{ fontFamily:"var(--fm)", color:"var(--md)" }}>{row.rule}</td>
              <td style={{ fontFamily:"var(--fm)", color:"var(--blu)" }}>{row.actor}</td>
              <td style={{ fontFamily:"var(--fm)", fontWeight:700,
                color: row.outcome.includes("FLAG") ? "var(--red)"
                     : row.outcome.includes("WARN") ? "var(--gld)" : "var(--grn)" }}>
                {row.outcome}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* ── Vault Page ── */
  const VaultPage = (
    <div className="g2">
      <div className="pn">
        <div className="ph">
          <span className="pt">HashiCorp Vault · Zero-Trust Access</span>
          <span className="ptg g">CONNECTED</span>
        </div>
        <div className="pb" style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {[
            { lbl:"Vault Endpoint",    val:"vault.compliance-guard.ke:8200",   col:"var(--hi)"  },
            { lbl:"Auth Method",       val:"AppRole + JWT (micro-agent level)", col:"var(--hi)"  },
            { lbl:"Lease Duration",    val:"30s time-bound · auto-expiry",      col:"var(--gld)" },
            { lbl:"Active Leases",     val:"2 of 10 slots used",                col:"var(--grn)" },
            { lbl:"Zero-Trust Policy", val:"Ephemeral credentials only",        col:"var(--hi)"  },
            { lbl:"Currency Context",  val:"KES · Central Bank of Kenya",       col:"var(--blu)" },
            { lbl:"Last Rotation",     val:"10:27:00 EAT · automated",          col:"var(--md)"  },
          ].map(f => (
            <div key={f.lbl} style={{ display:"flex", justifyContent:"space-between",
              borderBottom:"1px solid var(--bdr)", paddingBottom:10 }}>
              <span style={{ fontFamily:"var(--fm)", fontSize:9, color:"var(--lo)",
                letterSpacing:1, textTransform:"uppercase" }}>{f.lbl}</span>
              <span style={{ fontFamily:"var(--fm)", fontSize:10, color:f.col }}>{f.val}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="pn">
        <div className="ph">
          <span className="pt">Request Decryption Lease</span>
          <span className="ptg r">SECURE</span>
        </div>
        <div className="pb" style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ fontFamily:"var(--fm)", fontSize:9, color:"var(--md)", lineHeight:1.8 }}>
            Time-bound access to sensitive KES transaction data. All lease requests are
            logged to the immutable CBK audit trail and auto-expire after 30 seconds.
          </div>
          {leaseOn ? (
            <div className="lbx">
              <div className="lic">🔐</div>
              <div style={{ flex:1 }}>
                <div className="llb">DECRYPTION LEASE ACTIVE</div>
                <div className="lcn">{leaseSec}s remaining</div>
              </div>
              <button className="btn bd" onClick={() => { setLeaseOn(false); setLeaseSec(30); }}>
                REVOKE
              </button>
            </div>
          ) : (
            <button className="btn bp" style={{ alignSelf:"flex-start" }}
              onClick={() => setLeaseOn(true)}>
              🔑 REQUEST DECRYPTION LEASE
            </button>
          )}
          <div style={{ fontFamily:"var(--fm)", fontSize:9, color:"var(--lo)", lineHeight:1.7,
            background:"var(--bg2)", borderRadius:5, padding:"10px 12px", border:"1px solid var(--bdr)" }}>
            {new Date().toISOString()} | VAULT_LEASE_REQUEST → auth_verified → lease_issued → audit_sealed
          </div>
        </div>
      </div>
    </div>
  );

  function PlaceholderPage(label) {
    return (
      <div className="pn" style={{ flex:1, minHeight:300, alignItems:"center",
        justifyContent:"center", display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ fontFamily:"var(--fd)", fontSize:36, color:"var(--lo)", letterSpacing:3 }}>{label}</div>
        <div style={{ fontFamily:"var(--fm)", fontSize:10, color:"var(--lo)", letterSpacing:1 }}>
          MODULE AVAILABLE IN NEXT SPRINT
        </div>
      </div>
    );
  }

  function Page() {
    switch(nav) {
      case "pulse":    return PulsePage;
      case "txn":      return TxnPage;
      case "agents":   return AgentsPage;
      case "audit":    return AuditPage;
      case "vault":    return VaultPage;
      case "rules":    return PlaceholderPage("RULE ENGINE");
      case "settings": return PlaceholderPage("SETTINGS");
      default:         return PulsePage;
    }
  }

  /* ── Alert Investigation Modal ── */
  const Modal = selAlert && (
    <div className="ov" onClick={() => setSelAlert(null)}>
      <div className="mo" onClick={e => e.stopPropagation()}>
        <div className="moh">
          <div>
            <div className="mid">{selAlert.id} · INVESTIGATION WORKFLOW · CBK AML</div>
            <div className="mti">{selAlert.title}</div>
          </div>
          <button className="mcl" onClick={() => setSelAlert(null)}>✕</button>
        </div>
        <div className="mob">
          <div className="mr">
            <div className="mfl">
              <div className="mla">Entity</div>
              <div className="mva">{selAlert.entity}</div>
            </div>
            <div className="mfl">
              <div className="mla">Severity</div>
              <div className="mva">
                <span className={`sv ${selAlert.sev}`}>{selAlert.sev.toUpperCase()}</span>
              </div>
            </div>
            <div className="mfl">
              <div className="mla">Detail</div>
              <div className="mva" style={{ fontSize:12 }}>{selAlert.detail}</div>
            </div>
            <div className="mfl">
              <div className="mla">Triggered (EAT)</div>
              <div className="mva" style={{ fontFamily:"var(--fm)", fontSize:12 }}>{selAlert.time}</div>
            </div>
          </div>
          {/* Show KES threshold for AML alert */}
          {selAlert.sev === "critical" && (
            <div style={{ background:"var(--red-bg)", border:"1px solid rgba(255,64,89,0.25)",
              borderRadius:5, padding:"10px 13px", fontFamily:"var(--fm)", fontSize:9,
              color:"var(--red)", lineHeight:1.7 }}>
              ⚠ CBK AML THRESHOLD: KES 1,000,000 single transaction limit exceeded.
              Mandatory Suspicious Transaction Report (STR) required within 24 hours.
            </div>
          )}
          <div className="mfl">
            <div className="mla">Audit Trail</div>
            <div className="mlg">
              [{new Date().toISOString()}]&nbsp;
              ALERT_TRIGGERED → rule_engine → risk_score_assigned → audit_recorder → immutable_log_sealed
            </div>
          </div>
          {leaseOn && (
            <div className="lbx">
              <div className="lic">🔐</div>
              <div style={{ flex:1 }}>
                <div className="llb">DECRYPTION LEASE ACTIVE · KES DATA ACCESS GRANTED</div>
                <div className="lcn">{leaseSec}s remaining</div>
              </div>
            </div>
          )}
        </div>
        <div className="mof">
          {!leaseOn
            ? <button className="btn bp" onClick={() => setLeaseOn(true)}>🔑 REQUEST DECRYPTION LEASE</button>
            : <button className="btn bd" onClick={() => { setLeaseOn(false); setLeaseSec(30); }}>REVOKE LEASE</button>
          }
          <button className="btn bg2b" onClick={() => setSelAlert(null)}>DISMISS</button>
          <button className="btn bg2b bml" onClick={() => resolveAlert(selAlert.id)}>✓ MARK RESOLVED</button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="shell">
        <div className="glow ga"/><div className="glow gb"/><div className="glow gc"/>
        {Sidebar}
        <div className="main">
          {Topbar}
          <div className="canvas"><Page/></div>
        </div>
        {Modal}
      </div>
    </>
  );
}
