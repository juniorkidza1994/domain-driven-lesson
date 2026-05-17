// pages.jsx — Landing, Module, Glossary pages (mobile + desktop refs)

const { useState: pUseState, useMemo: pUseMemo, useEffect: pUseEffect } = React;

// ===============================================================
// LANDING (mobile)
// ===============================================================
function LandingMobile({ lang = "en" }) {
  return (
    <MobileShell lang={lang}>
      <LandingBody/>
    </MobileShell>
  );
}
function LandingBody() {
  const t = useT();
  const { lang } = useLang();
  return (
    <React.Fragment>
      {/* HERO */}
      <section className="section" style={{paddingTop: 28, paddingBottom: 22}}>
        <div className="flex" style={{gap:8, marginBottom:12}}>
          <span className="badge teal">v0.4</span>
          <span className="badge gray">{lang === "en" ? "Free · self-paced" : "ฟรี · เรียนตามจังหวะ"}</span>
        </div>
        <h1 style={{marginBottom:10, textWrap:"balance"}}>{t.heroTitle}</h1>
        <p className="muted" style={{marginBottom:20, fontSize:15}}>{t.heroSub}</p>
        <button className="btn btn-primary">{t.start} <Icon name="arrow-r" size={16}/></button>
        <button className="btn btn-ghost" style={{marginTop:6}}>{t.browseGlossary}</button>
      </section>

      {/* WHAT YOU'LL LEARN — horizontal rail */}
      <section style={{paddingTop:12}}>
        <div className="section-title" style={{padding:"0 16px"}}>
          <h2>{t.whatYouLearn}</h2>
          <span className="meta">3 {lang === "en" ? "areas" : "หัวข้อ"}</span>
        </div>
        <div className="h-rail peek">
          {t.topics.map((it, i) => (
            <div key={i} className="card topic-card">
              <div className={"ico " + it.cls}>{it.ico}</div>
              <h3>{it.t}</h3>
              <p>{it.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LEARNING PATH stepper */}
      <section className="section">
        <div className="section-title"><h2>{t.learningPath}</h2></div>
        <div className="card flat" style={{background:"transparent", border:0, padding:"4px 0 0", boxShadow:"none"}}>
          <div className="stepper">
            {t.steps.map((s, i) => (
              <div key={i} className={"step" + (i === 0 ? " done" : "")}>
                <div className="dot">{i+1}</div>
                <div className="body">
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section className="section">
        <div className="section-title"><h2>{t.modulesN(7)}</h2>
          <span className="meta">1 {lang === "en" ? "in progress" : "กำลังเรียน"}</span>
        </div>
        <div className="flex-col gap-12" style={{display:"flex", flexDirection:"column", gap:12}}>
          {MODULES.map(m => <ModuleCard key={m.n} m={m}/>)}
        </div>
      </section>

      {/* PROGRESS SYNC */}
      <section style={{marginTop:8}}>
        <Collapsible title={t.sync}>
          <p className="muted" style={{fontSize:14, marginBottom:12}}>{t.syncExplain}</p>
          <div className="sync-row">
            <button className="btn btn-secondary"><Icon name="copy" size={16}/> {t.exportCode}</button>
            <input className="input" placeholder={t.pasteCode}/>
            <button className="btn btn-primary">{t.import}</button>
          </div>
        </Collapsible>
      </section>

      <footer className="footer">
        <div className="row"><a>About</a><a>GitHub</a><a>RSS</a></div>
        <div>{t.footer1}</div>
        <div style={{marginTop:4}}>{t.footer2}</div>
      </footer>
    </React.Fragment>
  );
}

// ===============================================================
// MODULE PAGE (mobile)
// ===============================================================
function ModuleMobile({ lang = "en" }) {
  return (
    <MobileShell currentModule={1} progress={28} lang={lang}>
      <ModuleBody/>
    </MobileShell>
  );
}
function ModuleBody() {
  const { lang } = useLang();
  const t = useT();
  const m = MODULES[0];
  const [openTerm, setOpenTerm] = pUseState(null);
  const onOpen = (id) => setOpenTerm(id);

  return (
    <React.Fragment>
      {/* Page header card */}
      <section className="section" style={{paddingBottom:8}}>
        <div className="flex gap-8" style={{display:"flex", gap:8, marginBottom:12}}>
          <span className="badge indigo">{t.moduleN(m.n)}</span>
          <span className="badge teal"><Icon name="clock" size={11}/> {t.minutes(m.mins)}</span>
        </div>
        <h1 style={{marginBottom:8, textWrap:"balance"}}>
          {lang === "en" ? m.en : m.th}
        </h1>
        <p className="muted">{lang === "en" ? m.sub_en : m.sub_th}</p>
      </section>

      {/* Body */}
      <section className="section" style={{paddingTop:8}}>
        <p style={{marginBottom:16}}>
          {lang === "en"
            ? <>The hardest part of building software for a real business isn't writing code — it's <strong>agreeing on what the code means</strong>. <Term id="ubiquitous-language" onOpen={onOpen}>Ubiquitous Language</Term> is the practice of sharing one vocabulary between domain experts and engineers, so the words on a whiteboard match the names in the codebase.</>
            : <>ส่วนที่ยากที่สุดของการสร้างซอฟต์แวร์สำหรับธุรกิจจริง ไม่ใช่การเขียนโค้ด — แต่คือการ<strong>ตกลงกันให้ได้ว่าโค้ดหมายถึงอะไร</strong> <Term id="ubiquitous-language" onOpen={onOpen}>Ubiquitous Language</Term> คือการใช้คำศัพท์ชุดเดียวกันระหว่างผู้เชี่ยวชาญธุรกิจและวิศวกร เพื่อให้คำบนกระดานตรงกับชื่อในโค้ด</>
          }
        </p>

        <Callout kind="info" title={lang === "en" ? "Mental model" : "หลักคิด"}>
          {lang === "en"
            ? <>If your team uses two different words for the same thing in standup and in code, your bugs are hiding in that translation.</>
            : <>ถ้าทีมเรียกสิ่งเดียวกันด้วยสองคำ — คำหนึ่งในมีตติ้ง อีกคำในโค้ด — บั๊กของคุณกำลังซ่อนอยู่ในการแปลนั้น</>
          }
        </Callout>

        <h2 style={{marginTop:24, marginBottom:12}}>
          {lang === "en" ? "From CRUD to model" : "จาก CRUD สู่โมเดล"}
        </h2>
        <p style={{marginBottom:16}}>
          {lang === "en"
            ? <>Most apps start as CRUD: tables in, tables out. But a real business is full of <Term id="aggregate" onOpen={onOpen}>aggregates</Term>, invariants, and events that don't fit a flat row. A <Term id="bounded-context" onOpen={onOpen}>Bounded Context</Term> gives each part of the business its own model — and lets the same word mean different things in different places, on purpose.</>
            : <>แอปส่วนใหญ่เริ่มต้นแบบ CRUD: เข้าตาราง ออกตาราง แต่ธุรกิจจริงเต็มไปด้วย <Term id="aggregate" onOpen={onOpen}>aggregate</Term>, กฎคงที่ และ event ที่ไม่เข้ากับแถวแบนๆ <Term id="bounded-context" onOpen={onOpen}>Bounded Context</Term> ให้แต่ละส่วนของธุรกิจมีโมเดลของตัวเอง — และทำให้คำเดียวกันหมายต่างกันในแต่ละที่ได้ อย่างจงใจ</>
          }
        </p>

        {/* Flow / vertical stepper */}
        <h3 style={{marginBottom:14, marginTop:8}}>
          {lang === "en" ? "How a feature flows" : "ฟีเจอร์ไหลอย่างไร"}
        </h3>
        <div className="stepper" style={{marginBottom:20}}>
          {[
            { t: lang === "en" ? "Capture the language" : "จับภาษา",     d: lang === "en" ? "Sit with the domain expert. Write the verbs and nouns down — verbatim." : "นั่งกับผู้เชี่ยวชาญ จดคำนามและคำกริยาคำต่อคำ" },
            { t: lang === "en" ? "Spot the events"      : "หา event",     d: lang === "en" ? "Past tense, business-meaningful: OrderPlaced, StockReserved, RefundIssued." : "อดีต ในภาษาธุรกิจ เช่น OrderPlaced, StockReserved, RefundIssued" },
            { t: lang === "en" ? "Carve the contexts"   : "ตัด context",  d: lang === "en" ? "Group events by team and language. Each group is a candidate context." : "จัดกลุ่ม event ตามทีมและภาษา แต่ละกลุ่มคือ context ที่เป็นไปได้" },
            { t: lang === "en" ? "Model the aggregates" : "สร้าง aggregate", d: lang === "en" ? "Find invariants. Each invariant lives inside one aggregate root." : "หากฎคงที่ — แต่ละกฎอยู่ใน aggregate root เดียว" },
          ].map((s, i) => (
            <div key={i} className={"step" + (i === 0 ? " done" : "")}>
              <div className="dot">{i+1}</div>
              <div className="body">
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison rail */}
        <h3 style={{marginBottom:12}}>
          {lang === "en" ? "Three modelling styles" : "สามแบบของการโมเดล"}
        </h3>
        <div className="h-rail peek-1-5" style={{paddingLeft:0, paddingRight:0, marginLeft:-16, marginRight:-16, paddingLeft:16}}>
          <div className="compare-card">
            <span className="chip a">CRUD</span>
            <strong>{lang === "en" ? "Table-shaped" : "รูปแบบตาราง"}</strong>
            <ul>
              <li>{lang === "en" ? "Fast to start" : "เริ่มเร็ว"}</li>
              <li>{lang === "en" ? "Anemic models" : "โมเดลตื้น"}</li>
              <li>{lang === "en" ? "Logic leaks to UI" : "ลอจิกรั่วไป UI"}</li>
            </ul>
          </div>
          <div className="compare-card">
            <span className="chip b">DDD</span>
            <strong>{lang === "en" ? "Domain-shaped" : "รูปทรงโดเมน"}</strong>
            <ul>
              <li>{lang === "en" ? "Rules in the model" : "กฎอยู่ในโมเดล"}</li>
              <li>{lang === "en" ? "Talks like the business" : "พูดเหมือนธุรกิจ"}</li>
              <li>{lang === "en" ? "More upfront thought" : "ใช้สมองก่อนเขียน"}</li>
            </ul>
          </div>
          <div className="compare-card">
            <span className="chip c">EDA</span>
            <strong>{lang === "en" ? "Event-shaped" : "รูปทรง event"}</strong>
            <ul>
              <li>{lang === "en" ? "Loose coupling" : "ผูกกันหลวม"}</li>
              <li>{lang === "en" ? "Async by default" : "Async โดยปริยาย"}</li>
              <li>{lang === "en" ? "Harder to debug" : "ดีบักยากกว่า"}</li>
            </ul>
          </div>
        </div>

        {/* Mermaid-ish diagram */}
        <h3 style={{marginTop:24, marginBottom:12}}>
          {lang === "en" ? "OrderPlaced fans out" : "OrderPlaced กระจาย"}
        </h3>
        <FlowDiagram/>
        <p className="diagram-caption">
          {lang === "en"
            ? "One event, many reactions — none of the consumers know each other."
            : "Event เดียว มีหลายผู้ตอบสนอง — ผู้ฟังไม่ต้องรู้จักกัน"}
        </p>

        <Callout kind="warning" title={lang === "en" ? "Watch out" : "ระวัง"}>
          {lang === "en"
            ? <>Don't reach for <Term id="domain-event" onOpen={onOpen}>domain events</Term> just to feel modern. Events buy decoupling at the cost of traceability. Pay only when the decoupling is worth it.</>
            : <>อย่ารีบใช้ <Term id="domain-event" onOpen={onOpen}>domain event</Term> เพียงเพื่อให้ดูทันสมัย event ซื้อความหลวมด้วยต้นทุนการตามรอย จ่ายเมื่อคุ้มเท่านั้น</>
          }
        </Callout>

        {/* ES Board */}
        <h3 style={{marginTop:24, marginBottom:12}}>
          {lang === "en" ? "Event Storming board" : "บอร์ด Event Storming"}
        </h3>
        <p className="muted" style={{fontSize:14, marginBottom:10}}>
          {lang === "en"
            ? "ShopSphere's checkout flow, captured in 6 lanes."
            : "Flow checkout ของ ShopSphere ใน 6 lane"}
        </p>
        <ESBoard/>

        {/* Infographic grid */}
        <h3 style={{marginTop:28, marginBottom:12}}>
          {lang === "en" ? "Vocabulary in one screen" : "คำศัพท์ในหน้าจอเดียว"}
        </h3>
        <div className="info-grid">
          {GLOSSARY.slice(0,6).map(g => (
            <div key={g.id} className="info-cell">
              <div className="t">{lang === "en" ? g.term_en : g.term_th}</div>
              <div className="d">{lang === "en" ? g.short_en : g.short_th}</div>
              <div className="ex">{(lang === "en" ? g.ex_en : g.ex_th).slice(0, 70)}…</div>
            </div>
          ))}
        </div>

        {/* QUIZ */}
        <div style={{marginTop:28, marginBottom:8}}>
          <h2 style={{marginBottom:4}}>{t.test}</h2>
          <p className="muted" style={{fontSize:14, marginBottom:16}}>
            {lang === "en" ? "Module 1 · 5 questions" : "บทที่ 1 · 5 ข้อ"}
          </p>
          <Quiz/>
        </div>
      </section>

      <footer className="footer">
        <div>{lang === "en" ? "End of Module 1 of 7" : "จบบทที่ 1 จาก 7"}</div>
      </footer>

      <TermSheet termId={openTerm} open={!!openTerm} onClose={() => setOpenTerm(null)}/>
    </React.Fragment>
  );
}

// ===============================================================
// GLOSSARY (mobile)
// ===============================================================
function GlossaryMobile({ lang = "en" }) {
  return (
    <MobileShell lang={lang}>
      <GlossaryBody/>
    </MobileShell>
  );
}
function GlossaryBody() {
  const { lang } = useLang();
  const t = useT();
  const [query, setQuery] = pUseState("");
  const [cat, setCat] = pUseState("all");
  const [expanded, setExpanded] = pUseState({ "bounded-context": true });

  const filtered = pUseMemo(() => GLOSSARY.filter(g => {
    if (cat !== "all" && g.cat !== cat) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (g.term_en + g.term_th + g.short_en + g.short_th).toLowerCase().includes(q);
  }), [query, cat]);

  const cats = [
    { id:"all", en:"All",            th:"ทั้งหมด" },
    { id:"ddd", en:"DDD",            th:"DDD" },
    { id:"es",  en:"Event Storming", th:"Event Storming" },
    { id:"eda", en:"EDA",            th:"EDA" },
  ];

  return (
    <React.Fragment>
      <div className="section" style={{paddingBottom:8}}>
        <h1 style={{marginBottom:6}}>{lang === "en" ? "Glossary" : "คำศัพท์"}</h1>
        <p className="muted" style={{fontSize:14}}>
          {lang === "en"
            ? "42 terms across DDD, Event Storming, and EDA — searchable and tappable."
            : "42 คำศัพท์ครอบคลุม DDD, Event Storming และ EDA — ค้นและแตะได้"}
        </p>
      </div>

      <div className="filter-bar">
        <div className="search">
          <span className="ico"><Icon name="search" size={18}/></span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.search}/>
          {query && (
            <button className="clear" onClick={() => setQuery("")}><Icon name="close" size={16}/></button>
          )}
        </div>
        <div className="chip-rail">
          {cats.map(c => (
            <button key={c.id}
                    className={"fchip" + (cat === c.id ? " active" : "")}
                    data-cat={c.id}
                    onClick={() => setCat(c.id)}>
              {lang === "en" ? c.en : c.th}
            </button>
          ))}
        </div>
      </div>

      <div className="section" style={{paddingTop:14}}>
        {filtered.length === 0 ? (
          <div className="card" style={{textAlign:"center", padding:"32px 16px"}}>
            <div style={{fontSize:36, marginBottom:8}}>📭</div>
            <h3 style={{marginBottom:4}}>{t.noMatch}</h3>
            <button className="btn btn-ghost" onClick={() => { setQuery(""); setCat("all"); }}>
              {t.clearFilter}
            </button>
          </div>
        ) : filtered.map(g => {
          const open = !!expanded[g.id];
          const catLabel = { ddd:"DDD", es:"Event Storming", eda:"EDA" }[g.cat];
          const catCls   = { ddd:"indigo", es:"orange", eda:"teal" }[g.cat];
          return (
            <div key={g.id} className="card term-card">
              <div className="top">
                <h3>{lang === "en" ? g.term_en : g.term_th}</h3>
                <span className={"badge " + catCls}>{catLabel}</span>
              </div>
              <p className="short">{lang === "en" ? g.short_en : g.short_th}</p>
              <button className="toggle" onClick={() => setExpanded(s => ({ ...s, [g.id]: !open }))}>
                {open ? t.hide : t.seeExample}
                <Icon name="chevron" size={14} style={{ transform: open ? "rotate(180deg)" : "" }}/>
              </button>
              {open && (
                <div className="expanded">
                  <p style={{fontSize:14}}>{lang === "en" ? g.full_en : g.full_th}</p>
                  <div className="example-box">
                    <div className="label">ShopSphere</div>
                    {lang === "en" ? g.ex_en : g.ex_th}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <footer className="footer">
        <div>{lang === "en" ? `${filtered.length} of ${GLOSSARY.length} terms` : `${filtered.length} จาก ${GLOSSARY.length} คำ`}</div>
      </footer>
    </React.Fragment>
  );
}

Object.assign(window, { LandingMobile, ModuleMobile, GlossaryMobile });
