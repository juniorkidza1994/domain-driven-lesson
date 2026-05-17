// components.jsx — shared building blocks for the DDD lesson UI.
// Each component is exported on window at the bottom.

const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;

// --------------------------------------------------------------
// Language context — each artboard has its own provider so the
// EN/TH toggle stays scoped to that artboard.
// --------------------------------------------------------------
const LangCtx = createContext({ lang: "en", setLang: () => {} });
function LangProvider({ initial = "en", children }) {
  const [lang, setLang] = useState(initial);
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}
const useLang = () => useContext(LangCtx);
const useT   = () => { const { lang } = useLang(); return I18N[lang]; };

// --------------------------------------------------------------
// Tiny icon set — line icons in matching weights
// --------------------------------------------------------------
const Icon = ({ name, size = 20, color = "currentColor", strokeWidth = 1.8 }) => {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none",
                  stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "menu":      return <svg {...props}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
    case "close":     return <svg {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    case "search":    return <svg {...props}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
    case "chevron":   return <svg {...props}><polyline points="6 9 12 15 18 9"/></svg>;
    case "chevron-r": return <svg {...props}><polyline points="9 18 15 12 9 6"/></svg>;
    case "check":     return <svg {...props}><polyline points="20 6 9 17 4 12"/></svg>;
    case "arrow-r":   return <svg {...props}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
    case "book":      return <svg {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
    case "info":      return <svg {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
    case "warn":      return <svg {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    case "clock":     return <svg {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
    case "spark":     return <svg {...props}><path d="M12 2v6M12 16v6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M16 12h6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24"/></svg>;
    case "copy":      return <svg {...props}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
    default: return null;
  }
};

// --------------------------------------------------------------
// TopNav (sticky 56px) — logo + hamburger
// --------------------------------------------------------------
function TopNav({ onMenu, progress }) {
  const t = useT();
  return (
    <div className="topnav">
      <div className="logo">
        <div className="mark">A</div>
        <span>{t.brand}</span>
      </div>
      <button className="icon-btn" onClick={onMenu} aria-label="Menu">
        <Icon name="menu" />
      </button>
      {typeof progress === "number" && (
        <div className="progress-line"><i style={{ width: progress + "%" }}/></div>
      )}
    </div>
  );
}

// --------------------------------------------------------------
// Drawer — full-height left slide-in
// --------------------------------------------------------------
function Drawer({ open, onClose, currentModule = null }) {
  const t = useT();
  const { lang, setLang } = useLang();
  return (
    <React.Fragment>
      <div className={"drawer-scrim" + (open ? " open" : "")} onClick={onClose}/>
      <div className={"drawer" + (open ? " open" : "")}>
        <header>
          <div className="logo">
            <div className="mark">A</div>
            <div>
              <div style={{lineHeight:1.1}}>{t.brand}</div>
              <div className="tiny muted" style={{fontWeight:500}}>{t.tagline}</div>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </header>
        <div className="nav-list">
          <div style={{padding:"8px 12px 4px"}} className="tiny muted">
            {lang === "en" ? "MODULES" : "บทเรียน"}
          </div>
          {MODULES.map(m => {
            const active = currentModule === m.n;
            return (
              <div key={m.n} className={"nav-item" + (active ? " active" : "")}>
                <div className="num">{m.n}</div>
                <div className="label">{lang === "en" ? m.en : m.th}</div>
                {m.done && <span className="check">✓</span>}
              </div>
            );
          })}
          <div style={{height:8}}/>
          <div className="nav-item">
            <div className="num"><Icon name="book" size={16}/></div>
            <div className="label">{lang === "en" ? "Glossary" : "คำศัพท์"}</div>
          </div>
        </div>
        <footer>
          <div className="tiny muted" style={{marginBottom:8}}>
            {lang === "en" ? "Language" : "ภาษา"}
          </div>
          <div className="lang-toggle">
            <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
            <button className={lang === "th" ? "active" : ""} onClick={() => setLang("th")}>ไทย</button>
          </div>
        </footer>
      </div>
    </React.Fragment>
  );
}

// --------------------------------------------------------------
// Bottom Sheet
// --------------------------------------------------------------
function BottomSheet({ open, onClose, children }) {
  return (
    <React.Fragment>
      <div className={"sheet-scrim" + (open ? " open" : "")} onClick={onClose}/>
      <div className={"sheet" + (open ? " open" : "")} role="dialog">
        <div className="handle"/>
        {children}
      </div>
    </React.Fragment>
  );
}

// --------------------------------------------------------------
// Tappable inline term — opens a bottom-sheet definition card.
// --------------------------------------------------------------
function Term({ id, children, onOpen }) {
  return (
    <span className="term" onClick={() => onOpen(id)}>{children}</span>
  );
}

function TermSheet({ termId, open, onClose }) {
  const { lang } = useLang();
  const term = useMemo(() => GLOSSARY.find(g => g.id === termId), [termId]);
  if (!term) return <BottomSheet open={open} onClose={onClose}><div/></BottomSheet>;
  const catLabel = { ddd: "DDD", es: "Event Storming", eda: "EDA" }[term.cat];
  const catCls   = { ddd: "indigo", es: "orange",         eda: "teal" }[term.cat];
  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="body">
        <div className="row-between" style={{marginBottom: 6}}>
          <h3 style={{ color: "var(--text)" }}>{lang === "en" ? term.term_en : term.term_th}</h3>
          <span className={"badge " + catCls}>{catLabel}</span>
        </div>
        <p style={{fontSize:15, marginBottom:14}}>{lang === "en" ? term.full_en : term.full_th}</p>
        <div className="example-box">
          <div className="label">ShopSphere</div>
          {lang === "en" ? term.ex_en : term.ex_th}
        </div>
      </div>
      <div className="actions">
        <button className="btn btn-primary" onClick={onClose}>
          {lang === "en" ? "Close" : "ปิด"}
        </button>
      </div>
    </BottomSheet>
  );
}

// --------------------------------------------------------------
// Callout
// --------------------------------------------------------------
function Callout({ kind = "info", title, children }) {
  const iconMap = { info: "info", warning: "warn", success: "check" };
  return (
    <div className={"callout " + (kind === "warning" ? "warning" : kind === "success" ? "success" : "")}>
      <div className="icon"><Icon name={iconMap[kind]} size={20}/></div>
      <div>
        {title && <div className="title">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------
// Mermaid-ish diagram (rendered as SVG flowchart placeholder)
// --------------------------------------------------------------
function FlowDiagram() {
  return (
    <div className="diagram-wrap">
      <svg viewBox="0 0 520 220" width="100%" style={{ minWidth: 480 }}>
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#6366f1"/>
          </marker>
        </defs>
        {[
          {x:10,  y:80,  w:120, t:"Cart",      f:"#eef2ff", s:"#6366f1"},
          {x:200, y:20,  w:120, t:"Inventory", f:"#ecfdf5", s:"#14b8a6"},
          {x:200, y:140, w:120, t:"Payments",  f:"#fffbeb", s:"#f59e0b"},
          {x:390, y:80,  w:120, t:"Email",     f:"#f5f3ff", s:"#8b5cf6"},
        ].map((n,i) => (
          <g key={i}>
            <rect x={n.x} y={n.y} width={n.w} height={60} rx={12} fill={n.f} stroke={n.s} strokeWidth="1.5"/>
            <text x={n.x + n.w/2} y={n.y + 36} textAnchor="middle" fontFamily="Inter, system-ui" fontWeight="600" fontSize="14" fill="#1e1b4b">{n.t}</text>
          </g>
        ))}
        {/* arrows */}
        <path d="M130,100 C 165,100 160,50 200,50"   stroke="#6366f1" strokeWidth="1.5" fill="none" markerEnd="url(#arr)"/>
        <path d="M130,110 C 165,110 160,170 200,170" stroke="#6366f1" strokeWidth="1.5" fill="none" markerEnd="url(#arr)"/>
        <path d="M320,50  C 360,50  355,100 390,100" stroke="#6366f1" strokeWidth="1.5" fill="none" markerEnd="url(#arr)"/>
        <path d="M320,170 C 360,170 355,120 390,120" stroke="#6366f1" strokeWidth="1.5" fill="none" markerEnd="url(#arr)"/>
        {/* event labels */}
        <text x="155" y="46"  fontSize="11" fill="#6366f1" fontFamily="ui-monospace,monospace">OrderPlaced</text>
        <text x="155" y="194" fontSize="11" fill="#6366f1" fontFamily="ui-monospace,monospace">OrderPlaced</text>
        <text x="345" y="80"  fontSize="11" fill="#6366f1" fontFamily="ui-monospace,monospace">StockReserved</text>
        <text x="345" y="145" fontSize="11" fill="#6366f1" fontFamily="ui-monospace,monospace">PaymentCharged</text>
      </svg>
    </div>
  );
}

// --------------------------------------------------------------
// Event Storming board — sticky-note grid
// --------------------------------------------------------------
const ES_BOARD = [
  { lane: "Events",   cls: "evt",  items: ["Item Added","Cart Viewed","Cart Submitted","Stock Reserved","Payment Charged","Order Placed","Email Sent","Points Awarded"] },
  { lane: "Commands", cls: "cmd",  items: ["Add Item","Submit Cart","","Reserve Stock","Charge Card","Place Order","Send Receipt","Award Points"] },
  { lane: "Actors",   cls: "act",  items: ["Shopper","Shopper","","System","Stripe","System","System","System"] },
  { lane: "Policies", cls: "pol",  items: ["", "", "Whenever Cart Submitted → reserve stock", "", "", "Whenever Order Placed → award points", "", ""] },
  { lane: "Hotspots", cls: "hot",  items: ["", "", "Charge before or after stock check?", "", "Retry policy on decline?", "", "", ""] },
  { lane: "Read Models", cls: "read", items: ["","Cart Summary","","Stock Level","","Order Confirmation","","Loyalty Wallet"] },
];

function ESBoard() {
  const t = useT();
  return (
    <div>
      <div className="es-board">
        <div className="es-lanes">
          <div className="es-lane-label" style={{gridColumn:"1"}}>Lane</div>
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="tiny muted" style={{textAlign:"center", fontWeight:600}}>t+{i}</div>
          ))}
          {ES_BOARD.map((row, ri) => (
            <React.Fragment key={ri}>
              <div className="es-lane-label">{row.lane}</div>
              {row.items.map((cell, ci) => (
                <div key={ci}>
                  {cell ? <div className={"note " + row.cls}>{cell}</div> : <div style={{height:56}}/>}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="es-hint">{t.scrollHint}</div>
      <div className="es-legend">
        {[
          ["#fdba74","Event"], ["#93c5fd","Command"], ["#fde68a","Actor"],
          ["#d8b4fe","Policy"], ["#f9a8d4","Hotspot"], ["#86efac","Read Model"],
        ].map(([sw, label]) => (
          <span key={label} className="legend-chip"><span className="sw" style={{background:sw}}/>{label}</span>
        ))}
      </div>
    </div>
  );
}

// --------------------------------------------------------------
// Module card (landing + module pages)
// --------------------------------------------------------------
function ModuleCard({ m, current }) {
  const { lang } = useLang();
  const t = useT();
  const title = lang === "en" ? m.en : m.th;
  const sub   = lang === "en" ? m.sub_en : m.sub_th;
  return (
    <div className={"card module-card" + (m.featured ? " featured" : "")}>
      <div className="head">
        <span className="badge indigo">{t.moduleN(m.n)}</span>
        <span className="badge teal"><Icon name="clock" size={11}/> {t.minutes(m.mins)}</span>
        {m.featured && <span className="badge amber" style={{marginLeft:"auto"}}>NEW</span>}
      </div>
      <h3>{title}</h3>
      <p className="lead">{sub}</p>
      <div className={"pbar" + (m.done ? " teal" : "")}><i style={{ width: m.progress + "%" }}/></div>
      {m.done ? (
        <div className="done-state mt-12"><Icon name="check" size={16}/> {t.complete}</div>
      ) : (
        <button className={"btn " + (m.progress > 0 ? "btn-secondary" : "btn-primary")} style={{marginTop:12}}>
          {m.progress > 0 ? t.inProgress : t.start_arrow}
        </button>
      )}
    </div>
  );
}

// --------------------------------------------------------------
// Collapsible
// --------------------------------------------------------------
function Collapsible({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={"collapsible" + (open ? " open" : "")}>
      <div className="head" onClick={() => setOpen(o => !o)}>
        <h3>{title}</h3>
        <span className="caret"><Icon name="chevron" size={20}/></span>
      </div>
      <div className="body">{children}</div>
    </div>
  );
}

// --------------------------------------------------------------
// Quiz
// --------------------------------------------------------------
const QUIZ = [
  { type: "mcq", q_en: "What does Ubiquitous Language give a team?",
    q_th: "Ubiquitous Language ให้อะไรกับทีม?",
    opts_en: [
      "Faster compile times",
      "A shared vocabulary across business and code",
      "Better database indexes",
      "Smaller container images",
    ],
    opts_th: [
      "คอมไพล์เร็วขึ้น",
      "คำศัพท์ที่ใช้ร่วมกันระหว่างธุรกิจกับโค้ด",
      "ดัชนีฐานข้อมูลดีขึ้น",
      "Container เล็กลง",
    ],
    correct: 1,
    why_en: "DDD is built on a vocabulary the business and engineers literally share.",
    why_th: "DDD วางอยู่บนคำศัพท์ที่ธุรกิจและวิศวกรใช้ร่วมกันจริงๆ",
  },
  { type: "tf", q_en: "A Domain Event is immutable and named in the past tense.",
    q_th: "Domain Event เปลี่ยนไม่ได้และตั้งชื่อด้วยรูปอดีต",
    correct: true,
    why_en: "Events record facts that already happened — they can't be undone, only compensated.",
    why_th: "Event บันทึกข้อเท็จจริงที่เกิดไปแล้ว ย้อนไม่ได้ ทำได้แค่ชดเชย",
  },
  { type: "mcq", q_en: "Which note color marks a question or risk on an ES board?",
    q_th: "โพสต์อิทสีอะไรหมายถึงคำถามหรือความเสี่ยงในบอร์ด ES?",
    opts_en: ["Orange","Blue","Yellow","Pink"],
    opts_th: ["ส้ม","น้ำเงิน","เหลือง","ชมพู"],
    correct: 3,
    why_en: "Pink hotspots are unresolved questions and disagreements — they're prompts for the next conversation.",
    why_th: "Hotspot สีชมพูคือคำถามและข้อโต้แย้งที่ยังไม่จบ — เป็นจุดที่ต้องคุยต่อ",
  },
  { type: "tf", q_en: "A Saga should always use a central orchestrator.",
    q_th: "Saga ต้องใช้ตัวประสานกลางเสมอ",
    correct: false,
    why_en: "Sagas can be choreographed (purely event-driven) or orchestrated. Each has trade-offs.",
    why_th: "Saga ทำแบบ choreography (ขับด้วย event ล้วน) หรือ orchestration ก็ได้ มี trade-off ต่างกัน",
  },
  { type: "mcq", q_en: "Why split Read Models from the write model?",
    q_th: "ทำไมจึงแยก Read Model ออกจากฝั่งเขียน?",
    opts_en: [
      "To avoid using events",
      "So each side can scale and shape data independently",
      "To remove transactions entirely",
      "To eliminate the need for testing",
    ],
    opts_th: [
      "เพื่อเลี่ยงการใช้ event",
      "เพื่อให้แต่ละฝั่งสเกลและออกแบบข้อมูลแยกกันได้",
      "เพื่อกำจัดทรานแซกชันทั้งหมด",
      "เพื่อไม่ต้องเทสต์",
    ],
    correct: 1,
    why_en: "CQRS lets you optimize storage and scale separately for writes and queries.",
    why_th: "CQRS ทำให้ปรับ storage และสเกลฝั่งเขียนและฝั่งอ่านแยกกันได้",
  },
];

function Quiz() {
  const { lang } = useLang();
  const t = useT();
  const [i, setI] = useState(0);
  const [ans, setAns] = useState(Array(QUIZ.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const choose = (v) => setAns(a => { const c = [...a]; c[i] = v; return c; });
  const total = QUIZ.length;
  const score = ans.reduce((s, v, idx) => s + (v !== null && v === QUIZ[idx].correct ? 1 : 0), 0);
  const allDone = ans.every(v => v !== null);

  if (submitted) {
    return (
      <div className="card flat" style={{padding:0, border:0, boxShadow:"none"}}>
        <div className="score-card">
          <div className="big">{score}/{total}</div>
          <div className="msg">
            {score === total
              ? (lang === "en" ? "🎉 Perfect — you nailed it." : "🎉 ครบทุกข้อ เก่งมาก!")
              : score >= 3
                ? (lang === "en" ? "Solid grasp — review the misses below." : "เข้าใจดีแล้ว — ทบทวนข้อที่พลาดด้านล่าง")
                : (lang === "en" ? "Worth another pass — answers are below." : "ลองอีกรอบ — เฉลยอยู่ด้านล่าง")
            }
          </div>
        </div>
        <div style={{marginTop:16}}>
          {QUIZ.map((q, idx) => {
            const ok = ans[idx] === q.correct;
            return (
              <div key={idx} className={"result-q " + (ok ? "ok" : "bad")}>
                <div className="t">
                  <span>{ok ? "✓" : "✗"}</span>
                  <span>Q{idx+1}. {lang === "en" ? q.q_en : q.q_th}</span>
                </div>
                <div className="muted" style={{fontSize:13}}>{lang === "en" ? q.why_en : q.why_th}</div>
              </div>
            );
          })}
        </div>
        <div className="btn-row" style={{marginTop:16}}>
          <button className="btn btn-secondary" onClick={() => { setAns(Array(total).fill(null)); setI(0); setSubmitted(false); }}>{t.retake}</button>
          <button className="btn btn-primary">{t.readNext}</button>
        </div>
      </div>
    );
  }

  const q = QUIZ[i];
  return (
    <div>
      <div className="quiz-dots">
        {QUIZ.map((_, idx) => (
          <i key={idx} className={idx === i ? "active" : ans[idx] !== null ? "done" : ""}/>
        ))}
      </div>
      <div style={{fontWeight:700, fontSize:16, marginBottom:14}}>
        Q{i+1}. {lang === "en" ? q.q_en : q.q_th}
      </div>
      {q.type === "mcq" ? (
        <div className="mcq-list">
          {(lang === "en" ? q.opts_en : q.opts_th).map((opt, idx) => (
            <div key={idx} className={"mcq-opt" + (ans[i] === idx ? " selected" : "")} onClick={() => choose(idx)}>
              <span className="radio"/>
              <span>{opt}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="tf-row">
          {[true, false].map(v => (
            <button key={String(v)} className={"tf-btn" + (ans[i] === v ? " selected" : "")} onClick={() => choose(v)}>
              {v ? (lang === "en" ? "True" : "ใช่") : (lang === "en" ? "False" : "ไม่ใช่")}
            </button>
          ))}
        </div>
      )}
      <div className="btn-row" style={{marginTop:18}}>
        <button className="btn btn-secondary" disabled={i===0} onClick={() => setI(x => Math.max(0, x-1))}>
          ← {lang === "en" ? "Prev" : "ก่อนหน้า"}
        </button>
        {i < total - 1 ? (
          <button className="btn btn-primary" disabled={ans[i] === null} onClick={() => setI(x => Math.min(total-1, x+1))}>
            {lang === "en" ? "Next" : "ต่อไป"} →
          </button>
        ) : (
          <button className="btn btn-primary" disabled={!allDone} onClick={() => setSubmitted(true)}>{t.submit}</button>
        )}
      </div>
    </div>
  );
}

// --------------------------------------------------------------
// Mobile shell helpers
// --------------------------------------------------------------
function MobileShell({ children, currentModule, progress, lang = "en" }) {
  return (
    <LangProvider initial={lang}>
      <MobileShellInner currentModule={currentModule} progress={progress}>
        {children}
      </MobileShellInner>
    </LangProvider>
  );
}
function MobileShellInner({ children, currentModule, progress }) {
  const [drawer, setDrawer] = useState(false);
  const { lang } = useLang();
  return (
    <div className="app" data-lang={lang} style={{ position: "relative", overflow: "hidden" }}>
      <TopNav onMenu={() => setDrawer(true)} progress={progress}/>
      {children}
      <Drawer open={drawer} onClose={() => setDrawer(false)} currentModule={currentModule}/>
    </div>
  );
}

// --------------------------------------------------------------
// Exports
// --------------------------------------------------------------
Object.assign(window, {
  LangProvider, LangCtx, useLang, useT,
  Icon, TopNav, Drawer, BottomSheet,
  Term, TermSheet, Callout, FlowDiagram, ESBoard,
  ModuleCard, Collapsible, Quiz, MobileShell,
});
