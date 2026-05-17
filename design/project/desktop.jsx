// desktop.jsx — desktop (1280px) reference layouts for Landing / Module / Glossary.
// Reuses the same color/type tokens. Wrapped in .desk + .app so styles cascade.

function DesktopShell({ children, active, lang = "en" }) {
  return (
    <LangProvider initial={lang}>
      <DesktopShellInner active={active}>{children}</DesktopShellInner>
    </LangProvider>
  );
}
function DesktopShellInner({ children, active }) {
  const { lang, setLang } = useLang();
  const t = useT();
  return (
    <div className="app desk" data-lang={lang}>
      <div className="topnav">
        <div className="logo">
          <div className="mark">A</div>
          <span>{t.brand}</span>
        </div>
        <div className="nav-links">
          <a className={active === "home" ? "active" : ""}>Home</a>
          <a className={active === "module" ? "active" : ""}>Modules</a>
          <a className={active === "glossary" ? "active" : ""}>Glossary</a>
          <a>About</a>
        </div>
        <div className="flex" style={{display:"flex", gap:10, alignItems:"center"}}>
          <div className="lang-toggle" style={{width:120, padding:3}}>
            <button className={lang === "en" ? "active" : ""} style={{minHeight:32, fontSize:12}} onClick={() => setLang("en")}>EN</button>
            <button className={lang === "th" ? "active" : ""} style={{minHeight:32, fontSize:12}} onClick={() => setLang("th")}>ไทย</button>
          </div>
          <button className="btn btn-primary" style={{width:"auto", padding:"0 16px", minHeight:40}}>{t.start}</button>
        </div>
      </div>
      {children}
    </div>
  );
}

// ===============================================================
// DESKTOP LANDING
// ===============================================================
function LandingDesktop({ lang = "en" }) {
  return (
    <DesktopShell active="home" lang={lang}>
      <LandingDesktopBody/>
    </DesktopShell>
  );
}
function LandingDesktopBody() {
  const { lang } = useLang();
  const t = useT();
  return (
    <React.Fragment>
      <div className="hero">
        <div>
          <div className="flex" style={{display:"flex", gap:8, marginBottom:16}}>
            <span className="badge teal">v0.4</span>
            <span className="badge gray">{lang === "en" ? "Free · self-paced" : "ฟรี · เรียนตามจังหวะ"}</span>
          </div>
          <h1>{t.heroTitle}</h1>
          <p className="lead">{t.heroSub}</p>
          <div className="cta-row">
            <button className="btn btn-primary">{t.start} <Icon name="arrow-r" size={16}/></button>
            <button className="btn btn-secondary">{t.browseGlossary}</button>
          </div>
        </div>
        <div className="hero-art">
          <div className="flex" style={{display:"flex", gap:8, marginBottom:14}}>
            <span className="badge indigo">{t.moduleN(1)}</span>
            <span className="badge teal"><Icon name="clock" size={11}/> 6 min</span>
          </div>
          <h2 style={{fontSize:"1.5rem", marginBottom:10, color:"var(--text)"}}>
            {lang === "en" ? "Why your domain model matters" : "ทำไมโดเมนโมเดลถึงสำคัญ"}
          </h2>
          <p className="muted" style={{fontSize:14, marginBottom:16}}>
            {lang === "en" ? "Preview the first lesson — no signup." : "ลองอ่านบทแรก — ไม่ต้องสมัคร"}
          </p>
          <div className="pbar"><i style={{width:"42%"}}/></div>
          <div className="flex" style={{display:"flex", justifyContent:"space-between", marginTop:8, fontSize:12, color:"var(--muted)"}}>
            <span>{t.progressPct(42)}</span>
            <span>2.5 min left</span>
          </div>
          <button className="btn btn-primary" style={{marginTop:16, width:"auto", padding:"0 18px"}}>
            {t.inProgress}
          </button>
        </div>
      </div>

      <div className="section">
        <h2 className="big">{t.whatYouLearn}</h2>
        <div className="three">
          {t.topics.map((it, i) => (
            <div key={i} className="card topic-card" style={{minHeight:180}}>
              <div className={"ico " + it.cls}>{it.ico}</div>
              <h3>{it.t}</h3>
              <p>{it.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="big">{t.learningPath}</h2>
        <div className="four">
          {t.steps.map((s, i) => (
            <div key={i} className="card flat" style={{display:"flex", flexDirection:"column", gap:8}}>
              <div className="step" style={{padding:0}}>
                <div className="dot" style={{background: i===0 ? "var(--primary)" : undefined, color: i===0 ? "#fff" : undefined}}>{i+1}</div>
                <div className="body">
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="row-between" style={{marginBottom:24}}>
          <h2 className="big" style={{marginBottom:0}}>{t.modulesN(7)}</h2>
          <span className="muted">1 {lang === "en" ? "in progress" : "กำลังเรียน"} · 1 {lang === "en" ? "complete" : "เรียนจบ"}</span>
        </div>
        <div className="modules-grid">
          {MODULES.map(m => <ModuleCard key={m.n} m={m}/>)}
        </div>
      </div>

      <div className="section">
        <div className="card" style={{padding:24, display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, alignItems:"center"}}>
          <div>
            <h2 style={{marginBottom:8}}>{t.sync}</h2>
            <p className="muted">{t.syncExplain}</p>
          </div>
          <div className="flex" style={{display:"flex", gap:10}}>
            <button className="btn btn-secondary" style={{width:"auto", padding:"0 16px"}}>
              <Icon name="copy" size={16}/> {t.exportCode}
            </button>
            <input className="input" placeholder={t.pasteCode} style={{flex:1}}/>
            <button className="btn btn-primary" style={{width:"auto", padding:"0 20px"}}>{t.import}</button>
          </div>
        </div>
      </div>

      <div className="footer">{t.footer1} · {t.footer2}</div>
    </React.Fragment>
  );
}

// ===============================================================
// DESKTOP MODULE PAGE
// ===============================================================
function ModuleDesktop({ lang = "en" }) {
  return (
    <DesktopShell active="module" lang={lang}>
      <ModuleDesktopBody/>
    </DesktopShell>
  );
}
function ModuleDesktopBody() {
  const { lang } = useLang();
  const t = useT();
  const m = MODULES[0];
  const sections = lang === "en"
    ? ["Introduction", "From CRUD to model", "How a feature flows", "Three modelling styles", "Diagram: OrderPlaced", "Event Storming board", "Vocabulary", "Quiz"]
    : ["บทนำ", "จาก CRUD สู่โมเดล", "ฟีเจอร์ไหลอย่างไร", "สามแบบของการโมเดล", "ภาพ: OrderPlaced", "บอร์ด Event Storming", "คำศัพท์", "ทดสอบ"];
  return (
    <div className="module-row" style={{maxWidth:1180, margin:"0 auto", padding:"40px 32px"}}>
      <div className="module-shell">
        <aside className="toc">
          <h4>{lang === "en" ? "On this page" : "ในหน้านี้"}</h4>
          <ul>
            {sections.map((s, i) => (
              <li key={i} className={i === 1 ? "active" : ""}>{s}</li>
            ))}
          </ul>
          <hr className="hr-soft"/>
          <h4 style={{marginTop:12}}>{lang === "en" ? "Module" : "บทเรียน"}</h4>
          <div className="pbar" style={{margin:"8px 0"}}><i style={{width:"28%"}}/></div>
          <div className="tiny muted">{t.progressPct(28)} · {t.minutes(m.mins)}</div>
        </aside>
        <div className="reading">
          <div className="flex" style={{display:"flex", gap:8, marginBottom:14}}>
            <span className="badge indigo">{t.moduleN(m.n)}</span>
            <span className="badge teal"><Icon name="clock" size={11}/> {t.minutes(m.mins)}</span>
          </div>
          <h1>{lang === "en" ? m.en : m.th}</h1>
          <p className="muted" style={{fontSize:17, marginBottom:24}}>{lang === "en" ? m.sub_en : m.sub_th}</p>

          <p style={{marginBottom:18}}>
            {lang === "en"
              ? <>The hardest part of building software for a real business isn't writing code — it's <strong>agreeing on what the code means</strong>. <span className="term">Ubiquitous Language</span> keeps the words on a whiteboard and the names in the codebase the same.</>
              : <>ส่วนที่ยากที่สุดคือการตกลงว่าโค้ดหมายถึงอะไร <span className="term">Ubiquitous Language</span> ทำให้คำบนกระดานและในโค้ดเป็นคำเดียวกัน</>
            }
          </p>

          <Callout kind="info" title={lang === "en" ? "Mental model" : "หลักคิด"}>
            {lang === "en"
              ? "If your team uses two different words for the same thing in standup and in code, your bugs are hiding in that translation."
              : "ถ้าทีมเรียกสิ่งเดียวกันด้วยสองคำ — คำหนึ่งในมีตติ้ง อีกคำในโค้ด — บั๊กกำลังซ่อนอยู่ตรงนั้น"}
          </Callout>

          <h2 style={{marginTop:32, marginBottom:14}}>{sections[1]}</h2>
          <p style={{marginBottom:18}}>
            {lang === "en"
              ? "Most apps start as CRUD: tables in, tables out. A Bounded Context gives each part of the business its own model — same word, different meaning, on purpose."
              : "แอปส่วนใหญ่เริ่มต้นแบบ CRUD แต่ Bounded Context ให้แต่ละส่วนมีโมเดลของตัวเอง คำเดียวกันความหมายต่างกันได้โดยจงใจ"}
          </p>

          <h2 style={{marginTop:32, marginBottom:14}}>{sections[4]}</h2>
          <FlowDiagram/>
          <p className="diagram-caption">
            {lang === "en"
              ? "One event, many reactions — none of the consumers know each other."
              : "Event เดียว มีหลายผู้ตอบสนอง"}
          </p>

          <h2 style={{marginTop:32, marginBottom:14}}>{sections[5]}</h2>
          <ESBoard/>
        </div>
      </div>
    </div>
  );
}

// ===============================================================
// DESKTOP GLOSSARY
// ===============================================================
function GlossaryDesktop({ lang = "en" }) {
  return (
    <DesktopShell active="glossary" lang={lang}>
      <GlossaryDesktopBody/>
    </DesktopShell>
  );
}
function GlossaryDesktopBody() {
  const { lang } = useLang();
  const t = useT();
  const [query, setQuery] = pUseState("");
  const [cat, setCat] = pUseState("all");
  const filtered = pUseMemo(() => GLOSSARY.filter(g => {
    if (cat !== "all" && g.cat !== cat) return false;
    if (!query) return true;
    return (g.term_en + g.term_th + g.short_en + g.short_th).toLowerCase().includes(query.toLowerCase());
  }), [query, cat]);
  return (
    <div className="section" style={{maxWidth:1180, margin:"0 auto", padding:"40px 32px"}}>
      <div className="row-between" style={{marginBottom:24}}>
        <div>
          <h1 style={{marginBottom:6}}>{lang === "en" ? "Glossary" : "คำศัพท์"}</h1>
          <p className="muted">
            {lang === "en"
              ? "42 terms across DDD, Event Storming, and EDA."
              : "42 คำศัพท์ครอบคลุม DDD, Event Storming และ EDA"}
          </p>
        </div>
        <div className="search" style={{width:340}}>
          <span className="ico"><Icon name="search" size={18}/></span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.search}/>
        </div>
      </div>
      <div className="glossary-grid">
        <aside className="filters">
          <h4 style={{fontSize:12, textTransform:"uppercase", letterSpacing:".08em", color:"var(--muted)", marginBottom:10}}>
            {lang === "en" ? "Category" : "หมวด"}
          </h4>
          <div className="flex-col" style={{display:"flex", flexDirection:"column", gap:8}}>
            {[
              { id:"all", en:"All",            th:"ทั้งหมด" },
              { id:"ddd", en:"DDD",            th:"DDD" },
              { id:"es",  en:"Event Storming", th:"Event Storming" },
              { id:"eda", en:"EDA",            th:"EDA" },
            ].map(c => (
              <button key={c.id}
                      className={"fchip" + (cat === c.id ? " active" : "")}
                      data-cat={c.id}
                      onClick={() => setCat(c.id)}
                      style={{justifyContent:"flex-start"}}>
                {lang === "en" ? c.en : c.th}
              </button>
            ))}
          </div>
        </aside>
        <div className="term-list">
          {filtered.map(g => {
            const catLabel = { ddd:"DDD", es:"Event Storming", eda:"EDA" }[g.cat];
            const catCls   = { ddd:"indigo", es:"orange", eda:"teal" }[g.cat];
            return (
              <div key={g.id} className="card term-card">
                <div className="top">
                  <h3>{lang === "en" ? g.term_en : g.term_th}</h3>
                  <span className={"badge " + catCls}>{catLabel}</span>
                </div>
                <p className="short">{lang === "en" ? g.short_en : g.short_th}</p>
                <div className="example-box" style={{marginTop:10}}>
                  <div className="label">ShopSphere</div>
                  {(lang === "en" ? g.ex_en : g.ex_th).slice(0, 120)}…
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LandingDesktop, ModuleDesktop, GlossaryDesktop });
