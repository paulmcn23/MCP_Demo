export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/favicon.ico") {
      return new Response(null, { status: 204 });
    }
    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
};

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MCP Explained — The Model Context Protocol</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body { height:100%; overflow:hidden; font-family:'Inter',system-ui,-apple-system,sans-serif; background:#1e1e24; color:#e4e4e7; }

  /* ── Deck ── */
  .deck { position:relative; width:100vw; height:100vh; }
  .slide { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:2rem 2.5rem; opacity:0; transform:translateY(30px) scale(0.97); transition:opacity 0.6s cubic-bezier(.4,0,.2,1), transform 0.6s cubic-bezier(.4,0,.2,1); pointer-events:none; overflow-y:auto; }
  .slide.active { opacity:1; transform:translateY(0) scale(1); pointer-events:auto; }
  .slide > * { position:relative; z-index:1; }

  /* ── Type ── */
  h1 { font-size:2.6rem; font-weight:800; line-height:1.15; text-align:center; }
  h2 { font-size:1.7rem; font-weight:700; text-align:center; margin-bottom:0.8rem; }
  h3 { font-size:1.1rem; font-weight:600; margin-bottom:0.4rem; }
  p, li { font-size:0.92rem; line-height:1.7; max-width:50rem; }
  .sub { font-size:1.1rem; font-weight:300; opacity:0.55; margin-top:0.4rem; text-align:center; }
  .tag { display:inline-block; background:#2dd4bf18; color:#2dd4bf; border:1px solid #2dd4bf44; border-radius:999px; padding:0.18rem 0.7rem; font-size:0.68rem; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:0.6rem; }
  .teal{color:#2dd4bf;} .orange{color:#f6821f;} .blue{color:#6b9fff;} .green{color:#34d399;} .purple{color:#a78bfa;} .red{color:#f87171;} .yellow{color:#fbbf24;}

  /* ── Nav ── */
  .nav { position:fixed; bottom:1.2rem; left:50%; transform:translateX(-50%); display:flex; align-items:center; gap:0.8rem; background:#16161add; backdrop-filter:blur(12px); border:1px solid #2a2a30; border-radius:999px; padding:0.4rem 1.2rem; z-index:100; }
  .nav button { background:none; border:none; color:#e4e4e7; font-size:1.2rem; cursor:pointer; padding:0.2rem 0.4rem; border-radius:8px; transition:background 0.2s; }
  .nav button:hover { background:#27272a; }
  .nav button:disabled { opacity:0.2; cursor:default; }
  .nav .counter { font-family:'JetBrains Mono',monospace; font-size:0.78rem; opacity:0.4; min-width:3.5rem; text-align:center; }
  .dots { display:flex; gap:5px; }
  .dot { width:7px; height:7px; border-radius:50%; background:#3f3f46; transition:background 0.3s, transform 0.3s; cursor:pointer; }
  .dot.active { background:#2dd4bf; transform:scale(1.4); }
  .progress-bar { position:fixed; top:0; left:0; height:3px; background:linear-gradient(90deg,#2dd4bf,#34d399); transition:width 0.4s ease; z-index:100; }

  /* ── Shared card styles ── */
  .card { background:#27272d; border:1px solid #35353d; border-radius:14px; padding:1.2rem 1.4rem; transition:all 0.3s; }
  .card:hover { border-color:#2dd4bf; transform:translateY(-3px); }
  .card-icon { font-size:1.8rem; margin-bottom:0.4rem; }
  .card h3 { font-size:0.95rem; margin-bottom:0.3rem; }
  .card p { font-size:0.8rem; opacity:0.6; line-height:1.5; }

  /* ── Dashed-box style (from video) ── */
  .dbox { border:2px dashed #45454d; border-radius:16px; padding:1.2rem; display:flex; flex-direction:column; align-items:center; gap:0.5rem; }
  .dbox-label { font-size:0.7rem; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; padding:0.15rem 0.6rem; border-radius:6px; }
  .dbox-teal { border-color:#2dd4bf55; }
  .dbox-teal .dbox-label { background:#2dd4bf; color:#111; }
  .dbox-purple { border-color:#a78bfa55; }
  .dbox-purple .dbox-label { background:#a78bfa; color:#111; }
  .dbox-green { border-color:#34d39955; }
  .dbox-green .dbox-label { background:#34d399; color:#111; }
  .dbox-blue { border-color:#6b9fff55; }
  .dbox-blue .dbox-label { background:#6b9fff; color:#111; }
  .dbox-rose { border-color:#fb718555; }
  .dbox-rose .dbox-label { background:#fb7185; color:#111; }
  .dbox-olive { border-color:#a3e63555; }
  .dbox-olive .dbox-label { background:#a3e635; color:#111; }

  /* ── Architecture: Host diagram ── */
  .host-box { background:#2a2a32; border:2px dashed #55555d; border-radius:20px; padding:1.5rem 2rem; position:relative; display:flex; flex-direction:column; align-items:center; gap:1rem; max-width:750px; width:100%; }
  .host-badge { position:absolute; top:-14px; left:50%; transform:translateX(-50%); background:#e4e4e7; color:#1e1e24; font-size:0.7rem; font-weight:700; padding:0.2rem 0.8rem; border-radius:8px; }
  .host-content { display:flex; align-items:center; gap:1.5rem; }
  .host-clients { display:flex; flex-direction:column; gap:0.8rem; }
  .client-chip { background:#2dd4bf; color:#111; font-size:0.75rem; font-weight:700; padding:0.35rem 0.8rem; border-radius:8px; text-align:center; }
  .server-chip { background:#27272d; border:1px solid #45454d; border-radius:12px; padding:0.8rem 1rem; display:flex; align-items:center; gap:0.6rem; font-size:0.8rem; }
  .server-chip .s-label { background:#2dd4bf; color:#111; font-size:0.65rem; font-weight:700; padding:0.15rem 0.5rem; border-radius:6px; }
  .arrow-label { font-size:0.65rem; opacity:0.5; text-align:center; font-weight:500; }

  /* ── Primitives diagram ── */
  .prim-grid { display:grid; grid-template-columns:1fr auto 1fr; gap:2rem; align-items:start; max-width:800px; width:100%; }
  .prim-col { display:flex; flex-direction:column; gap:0.8rem; }
  .prim-box { border:2px dashed #45454d; border-radius:14px; padding:0.8rem 1rem; display:flex; align-items:center; gap:0.7rem; min-width:160px; }
  .prim-box .p-icon { font-size:1.5rem; }
  .prim-box .p-name { font-size:0.85rem; font-weight:600; }
  .transport-col { display:flex; flex-direction:column; align-items:center; gap:0.5rem; padding-top:1rem; }
  .transport-line { width:2px; height:60px; background:repeating-linear-gradient(180deg,#e4e4e7 0,#e4e4e7 6px,transparent 6px,transparent 12px); }
  .transport-label { font-size:0.7rem; opacity:0.5; }

  /* ── N×M interactive ── */
  .interactive-canvas { position:relative; width:100%; max-width:900px; height:380px; margin:0.5rem 0; }
  .interactive-canvas svg { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
  .interactive-canvas svg line { stroke-width:2; stroke-linecap:round; }
  .interactive-canvas svg line.mess { stroke:#f87171; stroke-dasharray:4 4; opacity:0; transition:opacity 0.4s; }
  .interactive-canvas svg line.mess.show { opacity:0.4; }
  .interactive-canvas svg line.clean { stroke:#2dd4bf; stroke-dasharray:8 4; opacity:0; transition:opacity 0.5s; }
  .interactive-canvas svg line.clean.show { opacity:0.8; animation:dashFlow 1.5s linear infinite; }
  @keyframes dashFlow { to { stroke-dashoffset:-24; } }
  .inode { position:absolute; background:#35353d; border:2px solid #45454d; border-radius:12px; padding:0.5rem 1rem; display:flex; align-items:center; gap:0.5rem; font-size:0.8rem; font-weight:600; opacity:0; transform:scale(0.5); transition:all 0.5s cubic-bezier(.34,1.56,.64,1); white-space:nowrap; }
  .inode.show { opacity:1; transform:scale(1); }
  .inode .ie { font-size:1.3rem; }
  .inode.ic { border-color:#6b9fff55; }
  .inode.is { border-color:#34d39955; }
  .ihub { position:absolute; width:90px; height:200px; background:#fbbf24; border-radius:14px; display:flex; align-items:center; justify-content:center; color:#111; font-weight:800; font-size:1.1rem; box-shadow:0 0 50px #fbbf2444; opacity:0; transform:scale(0); transition:all 0.7s cubic-bezier(.34,1.56,.64,1); }
  .ihub.show { opacity:1; transform:scale(1); }
  .ibigx { position:absolute; font-size:5rem; color:#f8717188; opacity:0; transform:scale(0.5) rotate(-10deg); transition:all 0.5s cubic-bezier(.34,1.56,.64,1); pointer-events:none; }
  .ibigx.show { opacity:1; transform:scale(1) rotate(0deg); }
  .ilabel { position:absolute; font-size:0.6rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; opacity:0; transition:opacity 0.4s; }
  .ilabel.show { opacity:0.3; }
  .istep-bar { display:flex; align-items:center; gap:0.8rem; margin-top:0.3rem; }
  .istep-dot { width:9px; height:9px; border-radius:50%; background:#3f3f46; transition:all 0.3s; }
  .istep-dot.active { background:#2dd4bf; transform:scale(1.4); }
  .istep-caption { font-size:0.82rem; opacity:0; transition:all 0.3s; max-width:550px; text-align:center; }
  .istep-caption.show { opacity:0.6; }
  .istep-hint { font-size:0.65rem; opacity:0.25; font-family:'JetBrains Mono',monospace; }

  /* ── LLM / Tools / MCP intro slides ── */
  .llm-hero { display:flex; flex-direction:column; align-items:center; gap:0.6rem; margin:0.8rem 0; }
  .llm-brain { width:100px; height:100px; background:#2a2a32; border:2px solid #45454d; border-radius:18px; display:flex; align-items:center; justify-content:center; font-size:3rem; }
  .llm-models { display:flex; gap:0.6rem; }
  .llm-models span { font-size:1.6rem; }
  .check-row { display:flex; align-items:center; gap:0.6rem; font-size:0.92rem; margin:0.3rem 0; max-width:550px; }
  .check-row .ico { font-size:1.2rem; flex-shrink:0; }

  .tools-canvas { position:relative; width:100%; max-width:800px; height:340px; margin:0.5rem 0; }
  .tools-canvas .tnode { position:absolute; background:#2a2a32; border:2px solid #45454d; border-radius:16px; padding:0.6rem 1rem; display:flex; align-items:center; gap:0.5rem; font-size:0.8rem; font-weight:600; opacity:0; transform:scale(0.5); transition:all 0.5s cubic-bezier(.34,1.56,.64,1); white-space:nowrap; }
  .tools-canvas .tnode.show { opacity:1; transform:scale(1); }
  .tools-canvas .tnode .te { font-size:1.4rem; }
  .tools-canvas .tarrow { position:absolute; color:#666; font-size:1.4rem; opacity:0; transition:all 0.4s; }
  .tools-canvas .tarrow.show { opacity:0.7; }
  .tools-canvas .tarrow.bi { color:#2dd4bf; }
  .tools-canvas .tline { position:absolute; border-top:2px dashed #55555d; opacity:0; transition:opacity 0.4s; }
  .tools-canvas .tline.show { opacity:0.5; }
  .tools-canvas .tline.bi { border-color:#2dd4bf; }
  .tools-caption-row { display:flex; flex-direction:column; gap:0.3rem; align-items:center; margin-top:0.2rem; }
  .tools-caption-row .check-row { opacity:0; transform:translateY(8px); transition:all 0.4s; }
  .tools-caption-row .check-row.show { opacity:1; transform:translateY(0); }

  /* ── Fragmented chain (Slide 3) ── */
  .frag-wrap { display:flex; flex-direction:column; gap:1rem; max-width:850px; width:100%; align-items:center; margin-top:0.5rem; }
  .frag-row { display:flex; align-items:center; gap:0; opacity:0; transform:translateY(12px); transition:all 0.6s cubic-bezier(.4,0,.2,1); }
  .frag-row.show { opacity:1; transform:translateY(0); }
  .frag-box { padding:0.55rem 0.9rem; border-radius:10px; font-size:0.72rem; font-weight:600; white-space:nowrap; border:1.5px solid #45454d; background:#35353d; color:#e4e4e7; opacity:0; transform:scale(0.7); transition:all 0.4s cubic-bezier(.34,1.56,.64,1); }
  .frag-box.show { opacity:1; transform:scale(1); }
  .frag-box.app { background:#e4e4e7; color:#1e1e24; border-color:#e4e4e7; }
  .frag-box.impl { background:#d4d4d8; color:#1e1e24; border-color:#d4d4d8; }
  .frag-box.prompt { background:#c8b88a; color:#1e1e24; border-color:#c8b88a; }
  .frag-box.tool { background:#a8c4b8; color:#1e1e24; border-color:#a8c4b8; }
  .frag-box.data { background:#c75050; color:#fff; border-color:#c75050; }
  .frag-arrow { font-size:0.7rem; color:#666; margin:0 0.3rem; opacity:0; transition:opacity 0.3s; }
  .frag-arrow.show { opacity:1; }
  .frag-step-bar { display:flex; align-items:center; gap:0.8rem; margin-top:0.5rem; }
  .frag-step-dot { width:9px; height:9px; border-radius:50%; background:#3f3f46; transition:all 0.3s; }
  .frag-step-dot.active { background:#2dd4bf; transform:scale(1.4); }

  /* ── Ecosystem row ── */
  .eco-row { display:flex; gap:2rem; align-items:center; justify-content:center; flex-wrap:wrap; margin:1rem 0; }
  .eco-item { display:flex; flex-direction:column; align-items:center; gap:0.3rem; }
  .eco-item .eco-icon { font-size:2.5rem; }
  .eco-item .eco-name { font-size:0.72rem; font-weight:600; opacity:0.5; }

  /* ── Code block ── */
  .code-block { background:#16161a; border:1px solid #2a2a30; border-radius:14px; padding:1.2rem 1.5rem; max-width:620px; width:100%; font-family:'JetBrains Mono',monospace; font-size:0.75rem; line-height:1.8; overflow-x:auto; }

  @media (max-width:768px) {
    h1 { font-size:1.8rem; } h2 { font-size:1.3rem; }
    .slide { padding:1.5rem 1rem; }
    .prim-grid { grid-template-columns:1fr; }
    .host-content { flex-direction:column; }
    .interactive-canvas { height:300px; }
  }
</style>
</head>
<body>

<div class="progress-bar" id="progress"></div>

<div class="deck" id="deck">

<!-- ═══════ SLIDE 1 — Title ═══════ -->
<div class="slide active" data-slide="0">
  <span class="tag">An Open Standard by Anthropic</span>
  <h1>The <span class="teal">Model Context Protocol</span></h1>
  <p class="sub">One of the most significant advancements in LLM integration</p>
  <div style="margin-top:2rem;display:flex;flex-direction:column;gap:0.7rem;align-items:flex-start;max-width:400px;">
    <p style="font-size:0.9rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;opacity:0.5;align-self:center;margin-bottom:0.2rem;">Video Overview</p>
    <div style="display:flex;align-items:center;gap:0.8rem;"><div style="width:22px;height:22px;border:2px solid #a78bfa;border-radius:50%;flex-shrink:0;"></div><span style="font-size:0.95rem;">Define MCP</span></div>
    <div style="display:flex;align-items:center;gap:0.8rem;"><div style="width:22px;height:22px;border:2px solid #a78bfa;border-radius:50%;flex-shrink:0;"></div><span style="font-size:0.95rem;">Fundamentals of MCP</span></div>
    <div style="display:flex;align-items:center;gap:0.8rem;"><div style="width:22px;height:22px;border:2px solid #a78bfa;border-radius:50%;flex-shrink:0;"></div><span style="font-size:0.95rem;">Build an MCP Server</span></div>
  </div>
  <p style="text-align:center;margin-top:1.5rem;font-size:0.85rem;opacity:0.35;">Press <kbd style="background:#35353d;padding:2px 8px;border-radius:4px;">→</kbd> to begin</p>
</div>

<!-- ═══════ SLIDE 2 — Breaking Down the Name ═══════ -->
<div class="slide" data-slide="1">
  <span class="tag">Definitions</span>
  <h2>Breaking Down <span class="teal">M · C · P</span></h2>
  <p style="text-align:center;opacity:0.6;margin-bottom:1.2rem;">Before we dive in — let's unpack what each word actually means.</p>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.2rem;max-width:800px;width:100%;">
    <div class="card" style="text-align:center;">
      <div class="card-icon">🧠</div>
      <h3 style="color:#34d399;">Model</h3>
      <p style="font-size:0.78rem;">The LLM — a large language model like GPT, Claude, or Gemini. Billions of parameters, trained on vast data. Great at conversation, strategy, and pulling historical facts.</p>
      <p style="font-size:0.72rem;opacity:0.4;margin-top:0.5rem;">On its own it can <em>write</em> an email — but can't <em>send</em> it.</p>
    </div>
    <div class="card" style="text-align:center;border-color:#a78bfa44;">
      <div class="card-icon">🔍</div>
      <h3 style="color:#a78bfa;">Context</h3>
      <p style="font-size:0.78rem;">The missing ingredient. An LLM only knows its training data and your prompt. <strong>Context</strong> means connecting it to <em>your</em> data — your CRM, codebase, emails, databases.</p>
      <p style="font-size:0.72rem;opacity:0.4;margin-top:0.5rem;">"What are the top job titles of new customers?" — impossible without <strong>context</strong> from Salesforce.</p>
    </div>
    <div class="card" style="text-align:center;border-color:#6b9fff44;">
      <div class="card-icon">📜</div>
      <h3 style="color:#6b9fff;">Protocol</h3>
      <p style="font-size:0.78rem;">A set of rules. HTTP defines how browsers talk to servers. TCP/IP defines how packets travel the internet. <strong>MCP</strong> defines how AI apps talk to tools.</p>
      <p style="font-size:0.72rem;opacity:0.4;margin-top:0.5rem;">An agreed-upon industry standard — so every tool doesn't need its own custom connector.</p>
    </div>
  </div>
</div>

<!-- ═══════ SLIDE 3 — The LLM on its own ═══════ -->
<div class="slide" data-slide="2">
  <span class="tag">Current Limitations</span>
  <h2>The LLM <span class="red">On Its Own</span></h2>
  <div class="llm-hero">
    <div class="llm-models">
      <span>🌀</span><span>✳️</span><span>💎</span>
    </div>
    <div class="llm-brain">🧠</div>
    <p style="font-size:0.85rem;font-weight:600;opacity:0.5;">LLM</p>
  </div>
  <div class="check-row"><span class="ico">✅</span><span>Great at conversation, answering questions, and predicting text.</span></div>
  <div class="check-row"><span class="ico">❌</span><span>Incapable of doing anything <strong style="color:#f87171;">meaningful</strong><br><span style="opacity:0.5;font-size:0.82rem;">Ask it to send an email — it simply can't. Knowledge only, no action.</span></span></div>
</div>

<!-- ═══════ SLIDE 4 — With Tools (Interactive) ═══════ -->
<div class="slide" data-slide="3">
  <span class="tag" id="ttag">Connecting to Tools</span>
  <h2 id="ttitle">With tools, AI models gain <span class="teal">new capabilities</span></h2>
  <p style="text-align:center;opacity:0.6;margin-bottom:0.4rem;" id="tsub">Press <kbd style="background:#35353d;padding:2px 8px;border-radius:4px;font-size:0.75rem;">Enter</kbd> to step through</p>
  <div class="tools-canvas" id="tools-canvas">
    <div class="tnode" id="t-llm" style="left:3%;top:35%;">
      <span class="te">🧠</span><span>LLM</span>
    </div>
    <div class="llm-models" id="t-models" style="position:absolute;left:4%;top:12%;opacity:0;transition:opacity 0.5s;">
      <span>🌀</span><span>✳️</span><span>💎</span>
    </div>
    <div class="tline" id="t-line1" style="left:19%;top:32%;width:32%;"></div>
    <div class="tline" id="t-line2" style="left:19%;top:50%;width:32%;"></div>
    <div class="tline" id="t-line3" style="left:19%;top:68%;width:32%;"></div>
    <div class="tarrow" id="t-arr1" style="left:32%;top:26%;">⟷</div>
    <div class="tarrow" id="t-arr2" style="left:32%;top:44%;">⟷</div>
    <div class="tarrow" id="t-arr3" style="left:32%;top:62%;">⟷</div>
    <div class="tnode" id="t-tool1" style="left:52%;top:15%;">
      <span class="te">🔧</span><span>Tool</span><span class="te" style="margin-left:0.3rem;">☁️</span>
    </div>
    <div style="position:absolute;left:72%;top:18%;font-size:0.65rem;opacity:0.4;" class="tlabel" id="t-lbl1">Salesforce</div>
    <div class="tnode" id="t-tool2" style="left:52%;top:42%;">
      <span class="te">🔧</span><span>Tool</span><span class="te" style="margin-left:0.3rem;">📧</span>
    </div>
    <div style="position:absolute;left:72%;top:46%;font-size:0.65rem;opacity:0.4;" class="tlabel" id="t-lbl2">Gmail</div>
    <div class="tnode" id="t-tool3" style="left:52%;top:68%;">
      <span class="te">🔧</span><span>Tool</span><span class="te" style="margin-left:0.3rem;">📝</span>
    </div>
    <div style="position:absolute;left:72%;top:72%;font-size:0.65rem;opacity:0.4;" class="tlabel" id="t-lbl3">Wiki</div>
  </div>
  <div class="tools-caption-row" id="t-caps">
    <div class="check-row" id="t-cap1"><span class="ico">✅</span><span>Get <strong style="color:#2dd4bf;">context</strong> from external systems for better analysis</span></div>
    <div class="check-row" id="t-cap2"><span class="ico">✅</span><span>Perform <strong style="color:#fbbf24;">actions</strong> in external systems and tools</span></div>
    <div class="check-row" id="t-cap3"><span class="ico">⚠️</span><span>But gluing multiple tools together is <strong style="color:#f87171;">fragile and cumbersome</strong></span></div>
  </div>
  <div class="istep-bar" style="margin-top:0.4rem;">
    <div class="istep-dot" id="td0"></div><div class="istep-dot" id="td1"></div><div class="istep-dot" id="td2"></div>
    <div class="istep-caption" id="tcap">Press Enter to start</div>
    <div class="istep-hint">Enter / Space</div>
  </div>
</div>

<!-- ═══════ SLIDE 5 — Fragmented Chain (Interactive) ═══════ -->
<div class="slide" data-slide="4">
  <span class="tag" id="ftag">The Problem</span>
  <h2 id="ftitle">Without MCP: <span class="red">Fragmented</span> AI Development</h2>
  <p style="text-align:center;opacity:0.6;margin-bottom:0.8rem;" id="fsub">Press <kbd style="background:#35353d;padding:2px 8px;border-radius:4px;font-size:0.75rem;">Enter</kbd> to step through</p>
  <div class="frag-wrap" id="frag-wrap">
    <!-- Row 0 (AI App 1 — appears in step 3) -->
    <div class="frag-row" id="frow0">
      <div class="frag-box app">AI App 1</div>
      <span class="frag-arrow">→</span>
      <div class="frag-box impl">Custom implementation</div>
      <span class="frag-arrow">→</span>
      <div class="frag-box prompt">Custom prompt logic</div>
      <span class="frag-arrow">→</span>
      <div class="frag-box tool">Custom tool calls</div>
      <span class="frag-arrow">→</span>
      <div class="frag-box data">Custom data access</div>
    </div>
    <!-- Row 1 (AI App 2 — shown first) -->
    <div class="frag-row" id="frow1">
      <div class="frag-box app" id="f1-app">AI App 2</div>
      <span class="frag-arrow" id="f1-a1">→</span>
      <div class="frag-box impl" id="f1-impl">Custom implementation</div>
      <span class="frag-arrow" id="f1-a2">→</span>
      <div class="frag-box prompt" id="f1-prompt">Custom prompt logic</div>
      <span class="frag-arrow" id="f1-a3">→</span>
      <div class="frag-box tool" id="f1-tool">Custom tool calls</div>
      <span class="frag-arrow" id="f1-a4">→</span>
      <div class="frag-box data" id="f1-data">Custom data access</div>
    </div>
    <!-- Row 2 (AI App 3 — appears in step 3) -->
    <div class="frag-row" id="frow2">
      <div class="frag-box app">AI App 3</div>
      <span class="frag-arrow">→</span>
      <div class="frag-box impl">Custom implementation</div>
      <span class="frag-arrow">→</span>
      <div class="frag-box prompt">Custom prompt logic</div>
      <span class="frag-arrow">→</span>
      <div class="frag-box tool">Custom tool calls</div>
      <span class="frag-arrow">→</span>
      <div class="frag-box data">Custom data access</div>
    </div>
  </div>
  <div class="frag-step-bar">
    <div class="frag-step-dot" id="fd0"></div><div class="frag-step-dot" id="fd1"></div><div class="frag-step-dot" id="fd2"></div>
    <div class="istep-caption" id="fcap">Press Enter to start</div>
    <div class="istep-hint">Enter / Space</div>
  </div>
</div>

<!-- ═══════ SLIDE 6 — N×M Interactive ═══════ -->
<div class="slide" data-slide="5">
  <span class="tag" id="itag">The N×M Problem</span>
  <h2 id="ititle">Press <span class="teal">Enter</span> to Step Through</h2>
  <div class="interactive-canvas" id="icanvas">
    <svg id="ilines" xmlns="http://www.w3.org/2000/svg"></svg>
    <div class="ilabel" id="ilbl-c" style="left:5%;top:4px;">LLM Vendors</div>
    <div class="ilabel" id="ilbl-s" style="right:5%;top:4px;">Tools</div>
    <div class="ihub" id="ihub">MCP</div>
    <div class="ibigx" id="ibigx">❌</div>
  </div>
  <div class="istep-bar">
    <div class="istep-dot" id="id0"></div><div class="istep-dot" id="id1"></div><div class="istep-dot" id="id2"></div><div class="istep-dot" id="id3"></div><div class="istep-dot" id="id4"></div><div class="istep-dot" id="id5"></div>
    <div class="istep-caption" id="icap">Press Enter to start</div>
    <div class="istep-hint">Enter / Space</div>
  </div>
</div>

<!-- ═══════ SLIDE 7 — The Evolution of LLMs ═══════ -->
<div class="slide" data-slide="6">
  <span class="tag">The Journey</span>
  <h2>LLMs by themselves are incapable of doing anything <span class="red">meaningful</span></h2>
  <p style="text-align:center;opacity:0.6;margin-bottom:1rem;">Three stages in the evolution of LLM capabilities.</p>
  <div style="display:flex;gap:1.2rem;max-width:820px;width:100%;justify-content:center;flex-wrap:wrap;">
    <!-- Panel 1: LLM alone -->
    <div class="card" style="flex:1;min-width:220px;max-width:250px;text-align:center;border-color:#45454d;">
      <p style="font-size:0.7rem;opacity:0.5;margin-bottom:0.4rem;font-weight:700;">1. Just the LLM</p>
      <div style="font-size:2.4rem;margin:0.5rem 0;">🧠</div>
      <p style="font-size:0.72rem;font-weight:600;">LLM</p>
      <p style="font-size:0.72rem;opacity:0.5;margin-top:0.5rem;">Can answer questions and predict text — but <strong style="color:#f87171;">cannot take action</strong>. Ask it to send an email? It simply can't.</p>
    </div>
    <!-- Panel 2: LLMs + Tools -->
    <div class="card" style="flex:1;min-width:220px;max-width:250px;text-align:center;border-color:#2dd4bf55;">
      <p style="font-size:0.7rem;opacity:0.5;margin-bottom:0.4rem;font-weight:700;">2. LLMs + Tools</p>
      <div style="display:flex;align-items:center;justify-content:center;gap:0.3rem;margin:0.5rem 0;">
        <span style="font-size:1.8rem;">🧠</span>
        <span style="opacity:0.4;font-size:0.9rem;">→</span>
        <div style="display:flex;flex-direction:column;gap:0.2rem;">
          <span style="font-size:0.9rem;background:#27272d;border:1px solid #35353d;border-radius:6px;padding:2px 6px;">🔧 Tool #1</span>
          <span style="font-size:0.9rem;background:#27272d;border:1px solid #35353d;border-radius:6px;padding:2px 6px;">� Tool #2</span>
          <span style="font-size:0.9rem;background:#27272d;border:1px solid #35353d;border-radius:6px;padding:2px 6px;">🔧 Tool #3</span>
        </div>
      </div>
      <p style="font-size:0.72rem;opacity:0.5;margin-top:0.5rem;">More powerful — can search the web, read emails. But stacking tools is <strong style="color:#fbbf24;">fragile and cumbersome</strong>. API changes break everything.</p>
    </div>
    <!-- Panel 3: LLMs + MCP -->
    <div class="card" style="flex:1;min-width:220px;max-width:250px;text-align:center;border-color:#fbbf2455;">
      <p style="font-size:0.7rem;opacity:0.5;margin-bottom:0.4rem;font-weight:700;">3. LLMs + MCP</p>
      <div style="display:flex;align-items:center;justify-content:center;gap:0.3rem;margin:0.5rem 0;">
        <span style="font-size:1.8rem;">🧠</span>
        <span style="opacity:0.4;font-size:0.9rem;">→</span>
        <span style="font-size:1rem;background:#fbbf2422;border:1px solid #fbbf2455;border-radius:8px;padding:4px 10px;font-weight:700;color:#fbbf24;">MCP</span>
        <span style="opacity:0.4;font-size:0.9rem;">→</span>
        <div style="display:flex;flex-direction:column;gap:0.2rem;">
          <span style="font-size:0.8rem;background:#27272d;border:1px solid #35353d;border-radius:6px;padding:2px 6px;">Service #1</span>
          <span style="font-size:0.8rem;background:#27272d;border:1px solid #35353d;border-radius:6px;padding:2px 6px;">Service #2</span>
        </div>
      </div>
      <p style="font-size:0.72rem;opacity:0.5;margin-top:0.5rem;">MCP is a <strong style="color:#fbbf24;">unified layer</strong> between the LLM and services. One protocol, all tools — plug and play.</p>
    </div>
  </div>
</div>

<!-- ═══════ SLIDE 8 — What is MCP (Ecosystem Diagram) ═══════ -->
<div class="slide" data-slide="7">
  <span class="tag">Under the Hood</span>
  <h2>What is the <span class="teal">Model Context Protocol</span>?</h2>
  <p style="text-align:center;opacity:0.6;margin-bottom:0.6rem;">The MCP ecosystem: Hosts → Clients → Protocol → Servers → Primitives</p>

  <!-- ── Diagram: Host with overlapping clients → Protocol → Servers → TRP ── -->
  <div style="display:flex;align-items:center;gap:0;max-width:860px;width:100%;justify-content:center;">

    <!-- HOST BOX (dark, rounded, dashed) -->
    <div style="position:relative;border:2px dashed #45454d;border-radius:16px;background:#1e1e28;padding:1rem 2.8rem 1rem 1rem;display:flex;flex-direction:column;gap:1.2rem;min-width:130px;">
      <div style="position:absolute;top:-10px;left:14px;background:#1a1a2e;padding:0 8px;font-size:0.6rem;opacity:0.45;font-weight:700;letter-spacing:0.05em;">MCP Host</div>
      <!-- App 1 -->
      <div style="display:flex;align-items:center;gap:0.5rem;">
        <span style="font-size:1.1rem;">⌨️</span>
        <span style="font-size:0.72rem;font-weight:700;">OpenCode</span>
      </div>
      <!-- App 2 -->
      <div style="display:flex;align-items:center;gap:0.5rem;">
        <span style="font-size:1.1rem;">🤖</span>
        <span style="font-size:0.72rem;font-weight:700;">AI Agent</span>
      </div>
    </div>

    <!-- MCP CLIENT chips (overlapping the host edge) -->
    <div style="display:flex;flex-direction:column;gap:1.2rem;margin-left:-1.6rem;z-index:2;">
      <div style="background:#2dd4bf;color:#111;border-radius:6px;padding:0.25rem 0.55rem;font-size:0.62rem;font-weight:700;white-space:nowrap;">MCP Client</div>
      <div style="background:#2dd4bf;color:#111;border-radius:6px;padding:0.25rem 0.55rem;font-size:0.62rem;font-weight:700;white-space:nowrap;">MCP Client</div>
    </div>

    <!-- PROTOCOL ARROWS -->
    <div style="display:flex;flex-direction:column;gap:1.2rem;margin:0 0.3rem;">
      <span style="font-size:0.55rem;opacity:0.4;white-space:nowrap;text-align:center;">MCP<br>Protocol →</span>
      <span style="font-size:0.55rem;opacity:0.4;white-space:nowrap;text-align:center;">MCP<br>Protocol →</span>
    </div>

    <!-- SERVERS -->
    <div style="display:flex;flex-direction:column;gap:0.7rem;">
      <!-- Server A -->
      <div style="background:#2a3a3a;border:1px solid #2dd4bf55;border-radius:10px;padding:0.4rem 0.7rem;display:flex;align-items:center;gap:0.4rem;white-space:nowrap;">
        <span style="font-size:0.9rem;">🖥️</span>
        <span style="font-size:0.65rem;font-weight:600;">MCP Server A</span>
      </div>
      <!-- Server B -->
      <div style="background:#2a3a3a;border:1px solid #2dd4bf55;border-radius:10px;padding:0.4rem 0.7rem;display:flex;align-items:center;gap:0.4rem;white-space:nowrap;">
        <span style="font-size:0.9rem;">🖥️</span>
        <span style="font-size:0.65rem;font-weight:600;">MCP Server B</span>
      </div>
    </div>

    <!-- ARROW TO PRIMITIVES -->
    <div style="display:flex;flex-direction:column;gap:1rem;margin:0 0.2rem;">
      <span style="font-size:0.5rem;opacity:0.35;">→</span>
      <span style="font-size:0.5rem;opacity:0.35;">→</span>
    </div>

    <!-- TRP PRIMITIVES (dashed boxes, fanning out from each server) -->
    <div style="display:flex;flex-direction:column;gap:0.35rem;">
      <!-- Server A primitives -->
      <div style="display:flex;gap:0.3rem;">
        <div style="border:1px dashed #a78bfa55;border-radius:6px;padding:0.2rem 0.4rem;font-size:0.55rem;display:flex;align-items:center;gap:0.2rem;"><span style="font-size:0.7rem;">📦</span> Resources</div>
        <div style="border:1px dashed #fbbf2455;border-radius:6px;padding:0.2rem 0.4rem;font-size:0.55rem;display:flex;align-items:center;gap:0.2rem;"><span style="font-size:0.7rem;">🛠️</span> Tools</div>
        <div style="border:1px dashed #6b9fff55;border-radius:6px;padding:0.2rem 0.4rem;font-size:0.55rem;display:flex;align-items:center;gap:0.2rem;"><span style="font-size:0.7rem;">💬</span> Prompts</div>
      </div>
      <!-- Spacer -->
      <div style="height:0.9rem;"></div>
      <!-- Server B primitives -->
      <div style="display:flex;gap:0.3rem;">
        <div style="border:1px dashed #a78bfa55;border-radius:6px;padding:0.2rem 0.4rem;font-size:0.55rem;display:flex;align-items:center;gap:0.2rem;"><span style="font-size:0.7rem;">�</span> Resources</div>
        <div style="border:1px dashed #fbbf2455;border-radius:6px;padding:0.2rem 0.4rem;font-size:0.55rem;display:flex;align-items:center;gap:0.2rem;"><span style="font-size:0.7rem;">�️</span> Tools</div>
        <div style="border:1px dashed #6b9fff55;border-radius:6px;padding:0.2rem 0.4rem;font-size:0.55rem;display:flex;align-items:center;gap:0.2rem;"><span style="font-size:0.7rem;">💬</span> Prompts</div>
      </div>
    </div>

  </div>

  <div style="display:flex;gap:0.8rem;max-width:780px;width:100%;margin-top:1rem;justify-content:center;flex-wrap:wrap;">
    <div style="background:#27272d;border:1px solid #35353d;border-radius:10px;padding:0.5rem 0.8rem;flex:1;min-width:160px;text-align:center;">
      <p style="font-size:0.7rem;"><strong style="color:#2dd4bf;">Client</strong> — the LLM-facing side. OpenCode, Windsurf, Cursor.</p>
    </div>
    <div style="background:#27272d;border:1px solid #35353d;border-radius:10px;padding:0.5rem 0.8rem;flex:1;min-width:160px;text-align:center;">
      <p style="font-size:0.7rem;"><strong style="color:#fbbf24;">Protocol</strong> — the two-way connection between client and server.</p>
    </div>
    <div style="background:#27272d;border:1px solid #35353d;border-radius:10px;padding:0.5rem 0.8rem;flex:1;min-width:160px;text-align:center;">
      <p style="font-size:0.7rem;"><strong style="color:#6b9fff;">Server</strong> — translates a service's capabilities for the client.</p>
    </div>
  </div>
  <div style="background:#fbbf2411;border:1px solid #fbbf2433;border-radius:12px;padding:0.5rem 1rem;max-width:720px;width:100%;margin-top:0.8rem;text-align:center;">
    <p style="font-size:0.72rem;">💡 The MCP server is in the hands of the <strong style="color:#fbbf24;">service provider</strong>. Anthropic created the standard — it's on each company to build their server. That's why every service provider is now building MCP servers.</p>
  </div>
</div>

<!-- ═══════ SLIDE 9 — Five Primitives ═══════ -->
<div class="slide" data-slide="8">
  <span class="tag">Core Primitives</span>
  <h2>Five Building Blocks of <span class="teal">MCP</span></h2>
  <p style="text-align:center;opacity:0.6;margin-bottom:1rem;">The standardised building blocks that enable communication between AI and external systems.</p>
  <div class="prim-grid">
    <div class="prim-col">
      <div style="text-align:center;margin-bottom:0.3rem;"><span class="dbox-label" style="background:#2dd4bf;color:#111;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.7rem;">MCP Client</span></div>
      <div class="prim-box" style="border-color:#a3e63555;">
        <span class="p-icon">📂</span><span class="p-name">Roots</span>
      </div>
      <p style="font-size:0.72rem;opacity:0.5;padding-left:0.5rem;">Secure file access — open documents, read code, analyse data without unrestricted filesystem access.</p>
      <div class="prim-box" style="border-color:#94a3b855;">
        <span class="p-icon">🔗</span><span class="p-name">Sampling</span>
      </div>
      <p style="font-size:0.72rem;opacity:0.5;padding-left:0.5rem;">Lets the server ask the LLM for help — e.g. "generate a SQL query for this schema".</p>
    </div>
    <div class="transport-col">
      <span style="font-size:0.65rem;opacity:0.4;">Transport Layer</span>
      <div class="transport-line"></div>
      <span style="font-size:1.2rem;">⟷</span>
      <div class="transport-line"></div>
    </div>
    <div class="prim-col">
      <div style="text-align:center;margin-bottom:0.3rem;"><span class="dbox-label" style="background:#2dd4bf;color:#111;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.7rem;">MCP Server</span></div>
      <div class="prim-box" style="border-color:#fbbf2455;">
        <span class="p-icon">�️</span><span class="p-name">Tools</span>
      </div>
      <p style="font-size:0.72rem;opacity:0.5;padding-left:0.5rem;">Executable functions the LLM can call — query a database, send a message, call an API.</p>
      <div class="prim-box" style="border-color:#a78bfa55;">
        <span class="p-icon">📦</span><span class="p-name">Resources</span>
      </div>
      <p style="font-size:0.72rem;opacity:0.5;padding-left:0.5rem;">Read-only data exposed by the server — files, logs, database records, API responses.</p>
      <div class="prim-box" style="border-color:#6b9fff55;">
        <span class="p-icon">�</span><span class="p-name">Prompt Templates</span>
      </div>
      <p style="font-size:0.72rem;opacity:0.5;padding-left:0.5rem;">Structured prompt blueprints so users don't have to engineer their own prompts.</p>
    </div>
  </div>
</div>

<!-- ═══════ SLIDE 10 — Client Side: Roots & Sampling ═══════ -->
<div class="slide" data-slide="9">
  <span class="tag">Client Side</span>
  <h2>Client Primitives: <span class="teal">Roots</span> & <span class="purple">Sampling</span></h2>
  <p style="text-align:center;opacity:0.6;margin-bottom:1.2rem;">On the client side, two primitives complete the picture.</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;max-width:700px;width:100%;">
    <div class="card">
      <div class="card-icon">📂</div>
      <h3 style="color:#a3e635;">Roots</h3>
      <p>Creates a secure channel for file access. The AI can open documents, read code, and analyse data files — <em>without</em> unrestricted access to your entire file system.</p>
      <div style="display:flex;gap:0.8rem;margin-top:0.8rem;justify-content:center;">
        <span style="font-size:1.5rem;">📁</span>
        <span style="font-size:1.5rem;">💻</span>
        <span style="font-size:1.5rem;">🔍</span>
      </div>
      <div style="display:flex;gap:1.5rem;justify-content:center;margin-top:0.3rem;">
        <span style="font-size:0.65rem;opacity:0.4;">opening</span>
        <span style="font-size:0.65rem;opacity:0.4;">reading</span>
        <span style="font-size:0.65rem;opacity:0.4;">analysing</span>
      </div>
    </div>
    <div class="card">
      <div class="card-icon">🔗</div>
      <h3 style="color:#a78bfa;">Sampling</h3>
      <p>Enables a server to request the LLM's help. If an MCP server is analysing your database schema and needs to generate a query, it asks the LLM through sampling.</p>
      <p style="font-size:0.78rem;opacity:0.5;margin-top:0.5rem;text-align:center;">This creates a <strong>two-way interaction</strong> — both the AI and external tools can initiate requests to each other.</p>
    </div>
  </div>
</div>

<!-- ═══════ SLIDE 11 — Server Side: Tools, Resources, Prompts ═══════ -->
<div class="slide" data-slide="10">
  <span class="tag">Server Capabilities</span>
  <h2>What MCP Servers <span class="teal">Expose</span></h2>
  <p style="text-align:center;opacity:0.6;margin-bottom:1rem;">Three major things inside every MCP server — <strong>TRP</strong>: Tools, Resources, Prompt Templates.</p>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;max-width:720px;width:100%;">
    <div class="card" style="text-align:center;">
      <div class="card-icon">🛠️</div><h3 style="color:#fbbf24;">Tools</h3>
      <p>Functions the client can invoke. Send a message, update a record, query a database, search files.</p>
    </div>
    <div class="card" style="text-align:center;">
      <div class="card-icon">📦</div><h3 style="color:#a78bfa;">Resources</h3>
      <p>Read-only data exposed by the server. Logs, files, database records — data the client can query but not change.</p>
    </div>
    <div class="card" style="text-align:center;">
      <div class="card-icon">💬</div><h3 style="color:#6b9fff;">Prompt Templates</h3>
      <p>Structured blueprints so users don't need to engineer prompts. The server provides best-practice templates.</p>
    </div>
  </div>
  <div class="code-block" style="margin-top:1rem;">
    <span style="color:#555;">// Tool definition exposed to the LLM</span><br>
    {<br>
    &nbsp;&nbsp;<span style="color:#a78bfa;">"name"</span>: <span style="color:#34d399;">"analyze-project"</span>,<br>
    &nbsp;&nbsp;<span style="color:#a78bfa;">"description"</span>: <span style="color:#34d399;">"Analyze project logs and code"</span>,<br>
    &nbsp;&nbsp;<span style="color:#a78bfa;">"arguments"</span>: [<br>
    &nbsp;&nbsp;&nbsp;&nbsp;{ <span style="color:#a78bfa;">"name"</span>: <span style="color:#34d399;">"timeframe"</span>, <span style="color:#a78bfa;">"required"</span>: <span style="color:#fbbf24;">true</span> },<br>
    &nbsp;&nbsp;&nbsp;&nbsp;{ <span style="color:#a78bfa;">"name"</span>: <span style="color:#34d399;">"fileUri"</span>, <span style="color:#a78bfa;">"required"</span>: <span style="color:#fbbf24;">true</span> }<br>
    &nbsp;&nbsp;]<br>
    }
  </div>
  <div style="background:#2dd4bf0d;border:1px solid #2dd4bf33;border-radius:12px;padding:0.8rem 1.2rem;max-width:620px;width:100%;margin-top:0.8rem;text-align:center;">
    <p style="font-size:0.8rem;">🔍 <strong class="teal">Dynamic Discovery</strong> — The AI asks the server <em>"what can you do?"</em> at runtime. New capabilities are picked up automatically.</p>
  </div>
</div>

<!-- ═══════ SLIDE 12 — Practical Example: OpenCode + Google Workspace ═══════ -->
<div class="slide" data-slide="11">
  <span class="tag">In Practice</span>
  <h2>OpenCode + <span class="teal">Google Workspace</span> via MCP</h2>
  <p style="text-align:center;opacity:0.6;margin-bottom:1rem;">No custom integration needed — just an MCP server for Google Workspace.</p>
  <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;justify-content:center;max-width:750px;">
    <div class="dbox dbox-green" style="width:140px;">
      <span style="font-size:2rem;">⌨️</span>
      <span style="font-size:0.75rem;font-weight:600;">OpenCode</span>
    </div>
    <span style="font-size:0.7rem;opacity:0.4;">→ MCP Client →</span>
    <div class="dbox dbox-teal" style="width:180px;">
      <span class="dbox-label">MCP Server</span>
      <span style="font-size:1.5rem;">🖥️</span>
      <span style="font-size:0.7rem;opacity:0.6;">Google Workspace</span>
    </div>
    <span style="font-size:0.7rem;opacity:0.4;">→ Google APIs →</span>
    <div class="dbox dbox-blue" style="width:140px;">
      <span style="font-size:1.4rem;">📧 📁 �</span>
      <span style="font-size:0.75rem;font-weight:600;">Google Workspace</span>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;max-width:700px;width:100%;margin-top:1.2rem;">
    <div class="card" style="text-align:center;">
      <p style="font-size:0.8rem;"><strong class="teal">1.</strong> OpenCode asks to draft a reply via MCP client</p>
    </div>
    <div class="card" style="text-align:center;">
      <p style="font-size:0.8rem;"><strong class="teal">2.</strong> MCP server calls Gmail / Drive / Calendar APIs</p>
    </div>
    <div class="card" style="text-align:center;">
      <p style="font-size:0.8rem;"><strong class="teal">3.</strong> Results flow back into OpenCode's context</p>
    </div>
  </div>
  <p style="text-align:center;font-size:0.78rem;opacity:0.45;margin-top:0.8rem;">We use Google Workspace at Cloudflare · This is a real use case for our teams</p>
</div>

<!-- ═══════ SLIDE 13 — Ecosystem & Summary ═══════ -->
<div class="slide" data-slide="12">
  <span class="tag">Growing Ecosystem</span>
  <h2>MCP is <span class="teal">Everywhere</span></h2>
  <p style="text-align:center;opacity:0.6;margin-bottom:1rem;">Developers have already built integrations for the tools teams use every day.</p>
  <div class="eco-row">
    <div class="eco-item"><span class="eco-icon">📁</span><span class="eco-name">Google Drive</span></div>
    <div class="eco-item"><span class="eco-icon">💬</span><span class="eco-name">Slack</span></div>
    <div class="eco-item"><span class="eco-icon">🐙</span><span class="eco-name">GitHub</span></div>
    <div class="eco-item"><span class="eco-icon">🔀</span><span class="eco-name">Git</span></div>
    <div class="eco-item"><span class="eco-icon">🐘</span><span class="eco-name">Postgres</span></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;max-width:700px;width:100%;margin-top:1rem;">
    <div class="card" style="text-align:center;">
      <div class="card-icon">🔌</div><h3>One Standard</h3>
      <p>Replace N×M integrations with one universal protocol.</p>
    </div>
    <div class="card" style="text-align:center;">
      <div class="card-icon">🧩</div><h3>Build Once</h3>
      <p>Create a server, every AI client can use it.</p>
    </div>
    <div class="card" style="text-align:center;">
      <div class="card-icon">🌍</div><h3>Open Source</h3>
      <p>SDKs in TypeScript, Python, and more. Accessible to all.</p>
    </div>
  </div>
  <div style="background:#27272d;border:1px solid #35353d;border-radius:12px;padding:0.6rem 1.2rem;max-width:700px;width:100%;margin-top:0.8rem;text-align:center;">
    <p style="font-size:0.78rem;opacity:0.6;">💡 MCP doesn't replace APIs — it's an <strong>AI-friendly layer on top</strong>. Under the hood, MCP servers are often wrappers around existing REST APIs.</p>
  </div>
  <p style="text-align:center;font-size:0.78rem;opacity:0.45;margin-top:0.8rem;">Now let's build one ourselves — on Cloudflare.</p>
</div>

<!-- ═══════ SLIDE 14 — Let's Build on Cloudflare ═══════ -->
<div class="slide" data-slide="13">
  <span class="tag">Build Section</span>
  <h2>Let's Build an MCP Server on <span class="teal">Cloudflare</span></h2>
  <p style="text-align:center;opacity:0.6;margin-bottom:1rem;">Cloudflare Workers + Agents SDK = remote MCP servers with durable state, zero cold starts, global edge deployment.</p>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;max-width:720px;width:100%;">
    <div class="card" style="text-align:center;">
      <div class="card-icon">🏗️</div>
      <h3 style="color:#fbbf24;">McpAgent</h3>
      <p>Extend the <code style="background:#35353d;padding:2px 6px;border-radius:4px;font-size:0.75rem;">McpAgent</code> class from the Agents SDK. Each instance is a Durable Object with its own SQL store.</p>
    </div>
    <div class="card" style="text-align:center;">
      <div class="card-icon">🗄️</div>
      <h3 style="color:#a78bfa;">D1 Database</h3>
      <p>Cloudflare's serverless SQL (SQLite at the edge). Bind it to your Worker and query it directly from your MCP tools.</p>
    </div>
    <div class="card" style="text-align:center;">
      <div class="card-icon">⚡</div>
      <h3 style="color:#2dd4bf;">Workers Runtime</h3>
      <p>Deploy globally. No containers, no cold starts. Your MCP server runs at the edge, close to your users. <code style="background:#35353d;padding:2px 6px;border-radius:4px;font-size:0.75rem;">wrangler deploy</code> and you're live.</p>
    </div>
  </div>
  <div class="code-block" style="margin-top:1rem;font-size:0.72rem;">
    <span style="color:#555;">// The minimal Cloudflare MCP server</span><br>
    <span style="color:#c792ea;">import</span> { McpAgent } <span style="color:#c792ea;">from</span> <span style="color:#34d399;">"agents/mcp"</span>;<br>
    <span style="color:#c792ea;">import</span> { McpServer } <span style="color:#c792ea;">from</span> <span style="color:#34d399;">"@modelcontextprotocol/sdk/server/mcp.js"</span>;<br>
    <br>
    <span style="color:#c792ea;">export class</span> <span style="color:#fbbf24;">MyMCP</span> <span style="color:#c792ea;">extends</span> McpAgent {<br>
    &nbsp;&nbsp;server = <span style="color:#c792ea;">new</span> McpServer({ <span style="color:#a78bfa;">name</span>: <span style="color:#34d399;">"Demo"</span>, <span style="color:#a78bfa;">version</span>: <span style="color:#34d399;">"1.0.0"</span> });<br>
    &nbsp;&nbsp;<span style="color:#c792ea;">async</span> <span style="color:#6b9fff;">init</span>() { <span style="color:#555;">/* register tools, resources, prompts */</span> }<br>
    }
  </div>
</div>

<!-- ═══════ SLIDE 15 — Connected Council Case Study ═══════ -->
<div class="slide" data-slide="14">
  <span class="tag">Case Study</span>
  <h2>Connected Council: <span class="teal">Smart Borough</span> MCP Server</h2>
  <p style="text-align:center;opacity:0.6;margin-bottom:0.8rem;">A real Cloudflare project — IoT sensor network for the London Borough of Thornbridge.</p>
  <div style="display:flex;align-items:center;gap:0.8rem;flex-wrap:wrap;justify-content:center;max-width:800px;margin-bottom:0.8rem;">
    <!-- Architecture flow -->
    <div class="dbox dbox-blue" style="width:120px;">
      <span style="font-size:1.6rem;">🏛️</span>
      <span style="font-size:0.7rem;font-weight:600;">23 IoT Sensors</span>
      <span style="font-size:0.55rem;opacity:0.5;">5 wards</span>
    </div>
    <span style="font-size:0.65rem;opacity:0.4;">→ readings →</span>
    <div class="dbox dbox-teal" style="width:130px;">
      <span style="font-size:1.6rem;">🗄️</span>
      <span style="font-size:0.7rem;font-weight:600;">D1 Database</span>
      <span style="font-size:0.55rem;opacity:0.5;">SQLite at the edge</span>
    </div>
    <span style="font-size:0.65rem;opacity:0.4;">→ bound to →</span>
    <div class="dbox dbox-green" style="width:150px;">
      <span style="font-size:1.6rem;">🖥️</span>
      <span style="font-size:0.7rem;font-weight:600;">MCP Server</span>
      <span style="font-size:0.55rem;opacity:0.5;">McpAgent on Workers</span>
    </div>
    <span style="font-size:0.65rem;opacity:0.4;">← MCP Protocol →</span>
    <div class="dbox dbox-blue" style="width:120px;">
      <span style="font-size:1.6rem;">⌨️</span>
      <span style="font-size:0.7rem;font-weight:600;">Any MCP Host</span>
      <span style="font-size:0.55rem;opacity:0.5;">OpenCode, Cursor…</span>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.8rem;max-width:700px;width:100%;">
    <div class="card" style="font-size:0.75rem;">
      <h3 style="color:#fbbf24;font-size:0.85rem;">🛠️ Tools (8)</h3>
      <p><code>get_live_readings</code> · <code>query_history</code> · <code>list_alerts</code> · <code>get_ward_status</code> · <code>compare_wards</code> · <code>get_sensor_health</code> · <code>list_wards</code> · <code>list_sensors</code></p>
    </div>
    <div class="card" style="font-size:0.75rem;">
      <h3 style="color:#a78bfa;font-size:0.85rem;">📡 Sensor Types</h3>
      <p>Air quality · Temperature · Flood level · Bin fill · Parking · Street lights · Noise · Energy meters</p>
    </div>
  </div>
  <div style="background:#2dd4bf0d;border:1px solid #2dd4bf33;border-radius:12px;padding:0.5rem 1rem;max-width:700px;width:100%;margin-top:0.6rem;text-align:center;">
    <p style="font-size:0.75rem;">🏗️ Ask the AI: <em>"What's the air quality in Riverside Ward?"</em> or <em>"Compare flood levels between Parklands and Industrial"</em> — it uses MCP tools to query D1 directly.</p>
  </div>
</div>

<!-- ═══════ SLIDE 16 — The Code ═══════ -->
<div class="slide" data-slide="15">
  <span class="tag">Show Me the Code</span>
  <h2>Defining <span class="teal">Tools</span> in Your MCP Server</h2>
  <p style="text-align:center;opacity:0.6;margin-bottom:0.8rem;">Extend McpAgent, bind D1, register tools with Zod schemas. The LLM discovers them automatically.</p>
  <div class="code-block" style="font-size:0.65rem;max-width:760px;line-height:1.5;">
    <span style="color:#c792ea;">export class</span> <span style="color:#fbbf24;">CouncilMCP</span> <span style="color:#c792ea;">extends</span> McpAgent&lt;Env&gt; {<br>
    &nbsp;&nbsp;server = <span style="color:#c792ea;">new</span> McpServer({ <span style="color:#a78bfa;">name</span>: <span style="color:#34d399;">"Connected Council"</span> });<br>
    <br>
    &nbsp;&nbsp;<span style="color:#c792ea;">async</span> <span style="color:#6b9fff;">init</span>() {<br>
    &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#555;">// ── Tool: Get live sensor readings ──</span><br>
    &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c792ea;">this</span>.server.<span style="color:#fbbf24;">tool</span>(<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#34d399;">"get_live_readings"</span>,<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#34d399;">"Get the most recent sensor readings for a ward"</span>,<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ <span style="color:#a78bfa;">ward_id</span>: z.string().optional(), <span style="color:#a78bfa;">sensor_type</span>: z.string().optional() },<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c792ea;">async</span> ({ ward_id, sensor_type }) =&gt; {<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c792ea;">const</span> result = <span style="color:#c792ea;">await</span> <span style="color:#c792ea;">this</span>.env.DB.prepare(query).bind(...params).all();<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c792ea;">return</span> { content: [{ type: <span style="color:#34d399;">"text"</span>, text: JSON.stringify(result) }] };<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>
    &nbsp;&nbsp;&nbsp;&nbsp;);<br>
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#555;">// ── Tool: Query historical data ──</span><br>
    &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c792ea;">this</span>.server.<span style="color:#fbbf24;">tool</span>(<span style="color:#34d399;">"query_history"</span>, <span style="color:#34d399;">"Query historical readings with aggregation"</span>, { ... });<br>
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#555;">// ── Tool: List alerts, Compare wards, Sensor health... ──</span><br>
    &nbsp;&nbsp;}<br>
    }
  </div>
  <div style="display:flex;gap:0.6rem;max-width:700px;width:100%;margin-top:0.8rem;justify-content:center;flex-wrap:wrap;">
    <div style="background:#fbbf2411;border:1px solid #fbbf2433;border-radius:8px;padding:0.4rem 0.8rem;font-size:0.68rem;text-align:center;">
      <strong style="color:#fbbf24;">this.server.tool()</strong> — register a callable function
    </div>
    <div style="background:#a78bfa11;border:1px solid #a78bfa33;border-radius:8px;padding:0.4rem 0.8rem;font-size:0.68rem;text-align:center;">
      <strong style="color:#a78bfa;">this.env.DB</strong> — D1 binding, query SQLite directly
    </div>
    <div style="background:#2dd4bf11;border:1px solid #2dd4bf33;border-radius:8px;padding:0.4rem 0.8rem;font-size:0.68rem;text-align:center;">
      <strong style="color:#2dd4bf;">z.string().optional()</strong> — Zod schema for params
    </div>
  </div>
</div>

<!-- ═══════ SLIDE 17 — Deploy & Connect ═══════ -->
<div class="slide" data-slide="16">
  <span class="tag">Ship It</span>
  <h2>Deploy & <span class="teal">Connect</span></h2>
  <p style="text-align:center;opacity:0.6;margin-bottom:1rem;">One command to deploy. Any MCP host can connect instantly.</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;max-width:700px;width:100%;">
    <div class="card">
      <h3 style="color:#fbbf24;">1. Deploy</h3>
      <div class="code-block" style="font-size:0.7rem;margin-top:0.5rem;">
        <span style="color:#555;">$ </span>npx wrangler deploy<br>
        <span style="color:#34d399;">✓ Deployed connected-council-mcp</span><br>
        <span style="color:#34d399;">✓ https://council.workers.dev/sse</span>
      </div>
      <p style="font-size:0.72rem;opacity:0.5;margin-top:0.6rem;">Your MCP server is live globally on Workers — D1 bound, Durable Objects backing each session.</p>
    </div>
    <div class="card">
      <h3 style="color:#2dd4bf;">2. Connect</h3>
      <div class="code-block" style="font-size:0.65rem;margin-top:0.5rem;">
        <span style="color:#555;">// mcp_config.json (any host)</span><br>
        {<br>
        &nbsp;&nbsp;<span style="color:#a78bfa;">"council"</span>: {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#a78bfa;">"url"</span>: <span style="color:#34d399;">"https://council.workers.dev/sse"</span><br>
        &nbsp;&nbsp;}<br>
        }
      </div>
      <p style="font-size:0.72rem;opacity:0.5;margin-top:0.6rem;">Paste into OpenCode, Cursor, Windsurf, Claude Desktop — works everywhere.</p>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;max-width:700px;width:100%;margin-top:1rem;">
    <div class="card" style="text-align:center;">
      <div class="card-icon">🌍</div><h3>Global Edge</h3>
      <p style="font-size:0.72rem;">Runs in 300+ cities. Low latency for every user.</p>
    </div>
    <div class="card" style="text-align:center;">
      <div class="card-icon">🔒</div><h3>OAuth Ready</h3>
      <p style="font-size:0.72rem;">Built-in auth support. Scoped permissions per MCP best practices.</p>
    </div>
    <div class="card" style="text-align:center;">
      <div class="card-icon">🧩</div><h3>Any Host</h3>
      <p style="font-size:0.72rem;">One server, every AI client. Build once, connect from anywhere.</p>
    </div>
  </div>
  <div style="margin-top:1.2rem;text-align:center;">
    <p style="font-size:0.9rem;margin-bottom:0.6rem;">
      <a href="https://developers.cloudflare.com/agents/model-context-protocol/" style="color:#2dd4bf;text-decoration:none;border-bottom:1px solid #2dd4bf44;font-weight:600;">Cloudflare MCP Docs</a>
      &nbsp;·&nbsp;
      <a href="https://modelcontextprotocol.io" style="color:#6b9fff;text-decoration:none;border-bottom:1px solid #6b9fff44;font-weight:600;">modelcontextprotocol.io</a>
      &nbsp;·&nbsp;
      <a href="https://github.com/modelcontextprotocol" style="color:#34d399;text-decoration:none;border-bottom:1px solid #34d39944;font-weight:600;">GitHub</a>
    </p>
    <p style="font-size:0.75rem;opacity:0.35;">Built with Cloudflare Workers · Paul McNamara · Inspired by ByteByteGo</p>
  </div>
</div>

</div><!-- /deck -->

<nav class="nav">
  <button id="prev" onclick="go(-1)" disabled>◀</button>
  <div class="dots" id="dots"></div>
  <span class="counter" id="counter">1 / 17</span>
  <button id="next" onclick="go(1)">▶</button>
</nav>

<script>
  /* ── Slide nav ── */
  let current = 0;
  const slides = document.querySelectorAll('.slide');
  const total = slides.length;
  const dots = document.getElementById('dots');
  const counter = document.getElementById('counter');
  const progress = document.getElementById('progress');
  const TOOLS_SLIDE = 3;
  const FRAG_SLIDE = 4;
  const INTERACTIVE_SLIDE = 5;

  for (let i = 0; i < total; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.onclick = () => goTo(i);
    dots.appendChild(d);
  }

  function goTo(n) {
    if (n < 0 || n >= total) return;
    if (current === INTERACTIVE_SLIDE && n !== INTERACTIVE_SLIDE) iReset();
    if (current === FRAG_SLIDE && n !== FRAG_SLIDE) fReset();
    if (current === TOOLS_SLIDE && n !== TOOLS_SLIDE) tReset();
    slides[current].classList.remove('active');
    dots.children[current].classList.remove('active');
    current = n;
    slides[current].classList.add('active');
    dots.children[current].classList.add('active');
    counter.textContent = (current + 1) + ' / ' + total;
    progress.style.width = ((current / (total - 1)) * 100) + '%';
    document.getElementById('prev').disabled = current === 0;
    document.getElementById('next').disabled = current === total - 1;
  }
  function go(dir) {
    if (current === INTERACTIVE_SLIDE && dir === 1 && istep < 5) { iAdvance(); return; }
    if (current === FRAG_SLIDE && dir === 1 && fstep < 2) { fAdvance(); return; }
    if (current === TOOLS_SLIDE && dir === 1 && tstep < 2) { tAdvance(); return; }
    goTo(current + dir);
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });
  let touchX = 0;
  document.addEventListener('touchstart', e => { touchX = e.changedTouches[0].screenX; });
  document.addEventListener('touchend', e => { const d = touchX - e.changedTouches[0].screenX; if (Math.abs(d)>50) go(d>0?1:-1); });

  /* ═══════ Slide 6 (index 5) — interactive N×M + MCP Standard ═══════ */
  const icanvas = document.getElementById('icanvas');
  const isvg = document.getElementById('ilines');
  const ihub = document.getElementById('ihub');
  const ibigx = document.getElementById('ibigx');
  const itag = document.getElementById('itag');
  const ititle = document.getElementById('ititle');
  const icap = document.getElementById('icap');

  const iclients = [{e:'ANTHROPIC',icon:''},{e:'deepseek',icon:'🦊'},{e:'OpenAI',icon:'🤖'}];
  const iservers = [{e:'�',n:'Slack'},{e:'📁',n:'Google Drive'},{e:'🐙',n:'GitHub'}];

  let icNodes=[], isNodes=[], imLines=[], icLines=[], istep=-1;

  function iInit() {
    const r = icanvas.getBoundingClientRect();
    const w = r.width, h = r.height;
    const colL = w * 0.03, colR = w * 0.75;
    const startY = 40, gap = 110;

    iclients.forEach((c,i) => {
      const n = document.createElement('div');
      n.className = 'inode ic';
      n.innerHTML = (c.icon ? '<span class="ie">'+c.icon+'</span>' : '') + '<span style="font-size:0.8rem;font-weight:700;">'+c.e+'</span>';
      n.style.left = colL+'px'; n.style.top = (startY + i*gap)+'px';
      icanvas.appendChild(n); icNodes.push(n);
    });
    iservers.forEach((s,i) => {
      const n = document.createElement('div');
      n.className = 'inode is';
      n.innerHTML = '<span class="ie">'+s.e+'</span><span style="font-size:0.8rem;font-weight:700;">'+s.n+'</span>';
      n.style.left = colR+'px'; n.style.top = (startY + i*gap)+'px';
      icanvas.appendChild(n); isNodes.push(n);
    });

    ihub.style.left = (w/2 - 45)+'px'; ihub.style.top = (h/2 - 100)+'px';
    ibigx.style.left = (w/2 - 40)+'px'; ibigx.style.top = (h/2 - 50)+'px';

    icNodes.forEach(cn => {
      isNodes.forEach(sn => {
        const l = document.createElementNS('http://www.w3.org/2000/svg','line');
        l.classList.add('mess'); isvg.appendChild(l);
        imLines.push({l,cn,sn});
      });
    });
    icNodes.forEach(cn => {
      const l = document.createElementNS('http://www.w3.org/2000/svg','line');
      l.classList.add('clean'); isvg.appendChild(l);
      icLines.push({l,from:cn,to:'hub'});
    });
    isNodes.forEach(sn => {
      const l = document.createElementNS('http://www.w3.org/2000/svg','line');
      l.classList.add('clean'); isvg.appendChild(l);
      icLines.push({l,from:'hub',to:sn});
    });
    iUpdateLines();
  }

  function imid(n){ const r=n.getBoundingClientRect(); const cr=icanvas.getBoundingClientRect(); return {x:r.left-cr.left+r.width/2, y:r.top-cr.top+r.height/2}; }
  function iUpdateLines() {
    const hr=ihub.getBoundingClientRect(); const cr=icanvas.getBoundingClientRect();
    const hx=hr.left-cr.left+hr.width/2, hy=hr.top-cr.top+hr.height/2;
    imLines.forEach(m => { const a=imid(m.cn),b=imid(m.sn); m.l.setAttribute('x1',a.x); m.l.setAttribute('y1',a.y); m.l.setAttribute('x2',b.x); m.l.setAttribute('y2',b.y); });
    icLines.forEach(c => {
      if(c.from==='hub'){ c.l.setAttribute('x1',hx); c.l.setAttribute('y1',hy); const b=imid(c.to); c.l.setAttribute('x2',b.x); c.l.setAttribute('y2',b.y); }
      else { const a=imid(c.from); c.l.setAttribute('x1',a.x); c.l.setAttribute('y1',a.y); c.l.setAttribute('x2',hx); c.l.setAttribute('y2',hy); }
    });
  }

  const isteps = [
    { tag:'N×M Connections', title:'LLM Vendors & Tools — <span class="teal">Disconnected</span>',
      cap:'Each LLM vendor and each tool exist independently.',
      run(){ icNodes.forEach((n,i)=>setTimeout(()=>n.classList.add('show'),i*120)); isNodes.forEach((n,i)=>setTimeout(()=>n.classList.add('show'),i*120)); document.getElementById('ilbl-c').classList.add('show'); document.getElementById('ilbl-s').classList.add('show'); }},
    { tag:'N×M Connections', title:'The Integration <span class="red">Mess</span>',
      cap:'3 vendors × 3 tools = <strong style="color:#f87171;">9 custom integrations</strong>. Every new tool multiplies the work.',
      run(){ imLines.forEach((m,i)=>setTimeout(()=>m.l.classList.add('show'),i*30)); }},
    { tag:'This Breaks', title:'Now Imagine <span class="red">Slack Updates Their API…</span>',
      cap:"One service changes and your fragile integrations break. Different auth, breaking changes, duplicated code — it's a nightmare.",
      run(){ ibigx.classList.add('show'); }},
    { tag:'A Unified Layer', title:'MCP <span class="yellow">unifies</span> the LLM and services',
      cap:'A layer that translates all those different languages into one <strong style="color:#fbbf24;">unified language</strong> the LLM understands. <strong style="color:#fbbf24;">N+M</strong> instead of N×M.',
      run(){ ibigx.classList.remove('show'); imLines.forEach(m=>m.l.classList.remove('show')); setTimeout(()=>ihub.classList.add('show'),200); setTimeout(()=>{icLines.forEach((c,i)=>setTimeout(()=>c.l.classList.add('show'),i*80)); iUpdateLines();},500); }},
    { tag:'The Standard', title:'MCP: A <span class="yellow">communication standard</span>',
      cap:'Rather than every tool creating its own method, Anthropic developed one protocol. Build once, use everywhere.',
      run(){ ihub.innerHTML = '<span style="font-size:0.7rem;">📁</span> Google Drive<br>MCP Server'; ihub.style.fontSize = '0.65rem'; ihub.style.padding = '0.6rem 0.8rem'; }},
    { tag:'Build Once, Reuse', title:'Build once — <span class="teal">reuse everywhere</span>',
      cap:'One MCP server works with any compatible AI app. Assistants, agents, IDEs — all plug and play.',
      run(){ document.getElementById('ilbl-c').textContent = 'AI Applications'; }},
  ];

  function iAdvance() {
    if (istep >= 5) return;
    istep++;
    const s = isteps[istep];
    itag.textContent = s.tag;
    ititle.innerHTML = s.title;
    icap.innerHTML = s.cap; icap.classList.add('show');
    for(let i=0;i<6;i++) document.getElementById('id'+i).classList.toggle('active',i<=istep);
    s.run();
    if(istep===0) setTimeout(iUpdateLines,50);
  }

  function iReset() {
    istep = -1;
    icNodes.forEach(nd=>nd.classList.remove('show'));
    isNodes.forEach(nd=>nd.classList.remove('show'));
    imLines.forEach(m=>m.l.classList.remove('show'));
    icLines.forEach(c=>c.l.classList.remove('show'));
    ihub.classList.remove('show'); ibigx.classList.remove('show');
    document.getElementById('ilbl-c').classList.remove('show');
    document.getElementById('ilbl-s').classList.remove('show');
    for(let i=0;i<6;i++) document.getElementById('id'+i).classList.remove('active');
    ihub.innerHTML = 'MCP'; ihub.style.fontSize = ''; ihub.style.padding = ''; document.getElementById('ilbl-c').textContent = 'LLM Vendors';
    itag.textContent = 'The N×M Problem';
    ititle.innerHTML = 'Press <span class="teal">Enter</span> to Step Through';
    icap.innerHTML = 'Press Enter to start'; icap.classList.remove('show');
  }

  iInit();
  window.addEventListener('resize', () => { iUpdateLines(); });

  /* ═══════ Slide 5 (index 4) — fragmented chain ═══════ */
  let fstep = -1;
  const ftag = document.getElementById('ftag');
  const ftitle = document.getElementById('ftitle');
  const fsub = document.getElementById('fsub');
  const fcap = document.getElementById('fcap');
  const frow1 = document.getElementById('frow1');
  const frow0 = document.getElementById('frow0');
  const frow2 = document.getElementById('frow2');

  const fsteps = [
    { tag:'The Problem', title:'Without MCP: <span class="red">Fragmented</span> AI Development',
      cap:'Each AI app needs to build everything from scratch.',
      run(){
        frow1.classList.add('show');
        document.getElementById('f1-app').classList.add('show');
      }},
    { tag:'Custom Everything', title:'Every Connection is <span class="red">Bespoke</span>',
      cap:'Custom implementation, custom prompts, custom tool calls, custom data access — <strong style="color:#f87171;">for every single tool</strong>.',
      run(){
        const ids = ['f1-a1','f1-impl','f1-a2','f1-prompt','f1-a3','f1-tool','f1-a4','f1-data'];
        ids.forEach((id,i) => setTimeout(() => document.getElementById(id).classList.add('show'), i * 150));
      }},
    { tag:'This Does Not Scale', title:'Now Multiply by <span class="red">Every AI App…</span>',
      cap:'Each app rebuilds the same chain independently. 3 apps = <strong style="color:#f87171;">3× the work</strong>. 100 apps = chaos.',
      run(){
        frow0.classList.add('show');
        frow0.querySelectorAll('.frag-box, .frag-arrow').forEach((el,i) => setTimeout(() => el.classList.add('show'), i * 80));
        setTimeout(() => {
          frow2.classList.add('show');
          frow2.querySelectorAll('.frag-box, .frag-arrow').forEach((el,i) => setTimeout(() => el.classList.add('show'), i * 80));
        }, 400);
      }},
  ];

  function fAdvance() {
    if (fstep >= 2) return;
    fstep++;
    const s = fsteps[fstep];
    ftag.textContent = s.tag;
    ftitle.innerHTML = s.title;
    fcap.innerHTML = s.cap; fcap.classList.add('show');
    for(let i=0;i<3;i++) document.getElementById('fd'+i).classList.toggle('active',i<=fstep);
    s.run();
  }

  function fReset() {
    fstep = -1;
    [frow0,frow1,frow2].forEach(r => {
      r.classList.remove('show');
      r.querySelectorAll('.frag-box, .frag-arrow').forEach(el => el.classList.remove('show'));
    });
    for(let i=0;i<3;i++) document.getElementById('fd'+i).classList.remove('active');
    ftag.textContent = 'The Problem';
    ftitle.innerHTML = 'Without MCP: <span class="red">Fragmented</span> AI Development';
    fsub.style.display = '';
    fcap.innerHTML = 'Press Enter to start'; fcap.classList.remove('show');
  }

  /* ═══════ Slide 4 (index 3) — With Tools ═══════ */
  let tstep = -1;
  const ttag = document.getElementById('ttag');
  const ttitle = document.getElementById('ttitle');
  const tcap = document.getElementById('tcap');

  const tsteps = [
    { tag:'Connecting to Tools', title:'With tools, AI models gain <span class="teal">new capabilities</span>',
      cap:'The LLM can now reach out to external systems.',
      run(){
        document.getElementById('t-llm').classList.add('show');
        document.getElementById('t-models').style.opacity='1';
      }},
    { tag:'External Systems', title:'Connect to <span class="teal">any</span> tool or service',
      cap:'Salesforce, Gmail, Wiki — any tool becomes accessible.',
      run(){
        ['t-tool1','t-tool2','t-tool3'].forEach((id,i) => setTimeout(() => {
          document.getElementById(id).classList.add('show');
          document.getElementById('t-lbl'+(i+1)).style.opacity='0.4';
        }, i*200));
      }},
    { tag:'Context + Action', title:'Two new <span class="teal">superpowers</span>',
      cap:'Pull in context for analysis, and perform actions in external systems.',
      run(){
        ['t-line1','t-line2','t-line3'].forEach((id,i) => setTimeout(() => document.getElementById(id).classList.add('show'), i*120));
        ['t-arr1','t-arr2','t-arr3'].forEach((id,i) => setTimeout(() => document.getElementById(id).classList.add('show'), i*120+60));
        setTimeout(() => document.getElementById('t-cap1').classList.add('show'), 400);
        setTimeout(() => document.getElementById('t-cap2').classList.add('show'), 700);
        setTimeout(() => document.getElementById('t-cap3').classList.add('show'), 1000);
      }},
  ];

  function tAdvance() {
    if (tstep >= 2) return;
    tstep++;
    const s = tsteps[tstep];
    ttag.textContent = s.tag;
    ttitle.innerHTML = s.title;
    tcap.innerHTML = s.cap; tcap.classList.add('show');
    for(let i=0;i<3;i++) document.getElementById('td'+i).classList.toggle('active',i<=tstep);
    s.run();
  }

  function tReset() {
    tstep = -1;
    ['t-llm','t-tool1','t-tool2','t-tool3'].forEach(id => document.getElementById(id).classList.remove('show'));
    ['t-line1','t-line2','t-line3','t-arr1','t-arr2','t-arr3'].forEach(id => document.getElementById(id).classList.remove('show'));
    document.getElementById('t-models').style.opacity='0';
    document.getElementById('t-cap1').classList.remove('show');
    document.getElementById('t-cap2').classList.remove('show');
    document.getElementById('t-cap3').classList.remove('show');
    for(let i=0;i<3;i++) document.getElementById('td'+i).classList.remove('active');
    ttag.textContent = 'Connecting to Tools';
    ttitle.innerHTML = 'With tools, AI models gain <span class="teal">new capabilities</span>';
    tcap.innerHTML = 'Press Enter to start'; tcap.classList.remove('show');
  }

</script>

<footer style="position:fixed;bottom:8px;right:12px;font-size:10px;color:#444;font-family:'Inter',sans-serif;z-index:100;">
  Built with Cloudflare Workers · Paul McNamara
</footer>

</body>
</html>`;
