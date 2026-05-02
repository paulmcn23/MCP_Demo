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
  <p style="text-align:center;margin-top:2rem;font-size:0.85rem;opacity:0.35;">Press <kbd style="background:#35353d;padding:2px 8px;border-radius:4px;">→</kbd> to begin</p>
</div>

<!-- ═══════ SLIDE 2 — The Problem ═══════ -->
<div class="slide" data-slide="1">
  <span class="tag">The Problem</span>
  <h2>Why Do We Need <span class="teal">MCP</span>?</h2>
  <p style="text-align:center;opacity:0.6;margin-bottom:1.2rem;">Before MCP, connecting AI models to each new data source required custom implementations — which gets expensive fast.</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;max-width:700px;width:100%;">
    <div style="background:#27272d;border:1px solid #f8717144;border-radius:14px;padding:1.1rem 1.3rem;">
      <h3 style="font-size:0.85rem;color:#f87171;margin-bottom:0.4rem;">❌ Before MCP</h3>
      <p style="font-size:0.78rem;opacity:0.6;line-height:1.6;">An AI agent needing a calculator, a web browser, then a spreadsheet required unique, custom-built adapters for each — like learning a new language for every single tool.</p>
    </div>
    <div style="background:#27272d;border:1px solid #34d39944;border-radius:14px;padding:1.1rem 1.3rem;">
      <h3 style="font-size:0.85rem;color:#34d399;margin-bottom:0.4rem;">✅ With MCP</h3>
      <p style="font-size:0.78rem;opacity:0.6;line-height:1.6;">MCP provides a standardised framework. An AI agent learns one way to interact, and any tool that speaks MCP connects seamlessly — dramatically reducing custom coding.</p>
    </div>
  </div>
  <p style="text-align:center;font-size:0.85rem;opacity:0.5;margin-top:1rem;">MCP gives AI systems access to <strong>databases, file systems, APIs, and tools</strong> in a standardised way.</p>
</div>

<!-- ═══════ SLIDE 3 — Architecture Overview ═══════ -->
<div class="slide" data-slide="2">
  <span class="tag">Architecture</span>
  <h2>Three Key <span class="teal">Components</span></h2>
  <p style="text-align:center;opacity:0.6;margin-bottom:1.2rem;">MCP follows a client-server model with Hosts, Clients, and Servers.</p>
  <div style="display:flex;gap:2rem;align-items:start;flex-wrap:wrap;justify-content:center;max-width:800px;">
    <div class="dbox dbox-green" style="width:200px;">
      <span class="dbox-label">Host</span>
      <span style="font-size:2.2rem;">🧠</span>
      <p style="font-size:0.78rem;text-align:center;opacity:0.6;">LLM applications like Claude Desktop that provide the environment for connections.</p>
    </div>
    <div class="dbox dbox-teal" style="width:200px;">
      <span class="dbox-label">MCP Client</span>
      <span style="font-size:2.2rem;">🔌</span>
      <p style="font-size:0.78rem;text-align:center;opacity:0.6;">Components within the host that establish 1:1 connections with external servers.</p>
    </div>
    <div class="dbox dbox-blue" style="width:200px;">
      <span class="dbox-label">MCP Server</span>
      <span style="font-size:2.2rem;">🖥️</span>
      <p style="font-size:0.78rem;text-align:center;opacity:0.6;">Separate processes providing context, tools, and prompts through the standard protocol.</p>
    </div>
  </div>
</div>

<!-- ═══════ SLIDE 4 — Host + Clients + Servers ═══════ -->
<div class="slide" data-slide="3">
  <span class="tag">How It Connects</span>
  <h2>Inside an <span class="teal">MCP Host</span></h2>
  <div class="host-box">
    <div class="host-badge">MCP Host</div>
    <div style="font-size:1.8rem;margin-bottom:0.2rem;">✳️ Claude</div>
    <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.2rem;"><span style="font-size:1.5rem;">🧠</span><span style="font-size:0.8rem;opacity:0.5;">LLM</span></div>
    <div class="host-clients">
      <div style="display:flex;align-items:center;gap:1.5rem;">
        <div class="client-chip">MCP Client</div>
        <span class="arrow-label">MCP Protocol →</span>
        <div class="server-chip"><span class="s-label">MCP Server A</span></div>
        <span style="font-size:0.7rem;opacity:0.4;">→ 📁 Google Drive</span>
      </div>
      <div style="display:flex;align-items:center;gap:1.5rem;">
        <div class="client-chip">MCP Client</div>
        <span class="arrow-label">MCP Protocol →</span>
        <div class="server-chip"><span class="s-label">MCP Server B</span></div>
        <span style="font-size:0.7rem;opacity:0.4;">→ 🐘 Postgres</span>
      </div>
      <div style="display:flex;align-items:center;gap:1.5rem;">
        <div class="client-chip">MCP Client</div>
        <span class="arrow-label">MCP Protocol →</span>
        <div class="server-chip"><span class="s-label">MCP Server C</span></div>
        <span style="font-size:0.7rem;opacity:0.4;">→ 🐙 GitHub · 💬 Slack</span>
      </div>
    </div>
  </div>
  <p style="text-align:center;font-size:0.78rem;opacity:0.4;margin-top:0.8rem;">Each client maintains a 1:1 connection · The host orchestrates all clients</p>
</div>

<!-- ═══════ SLIDE 5 — Five Primitives ═══════ -->
<div class="slide" data-slide="4">
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
      <div class="prim-box" style="border-color:#6b9fff55;">
        <span class="p-icon">💬</span><span class="p-name">Prompts</span>
      </div>
      <p style="font-size:0.72rem;opacity:0.5;padding-left:0.5rem;">Instructions or templates injected into the LLM context to guide task approach.</p>
      <div class="prim-box" style="border-color:#a78bfa55;">
        <span class="p-icon">📦</span><span class="p-name">Resources</span>
      </div>
      <p style="font-size:0.72rem;opacity:0.5;padding-left:0.5rem;">Structured data objects — files, images, API data, databases — fed into the context window.</p>
      <div class="prim-box" style="border-color:#fbbf2455;">
        <span class="p-icon">🛠️</span><span class="p-name">Tools</span>
      </div>
      <p style="font-size:0.72rem;opacity:0.5;padding-left:0.5rem;">Executable functions the LLM can call — query a database, modify a file, call an API.</p>
    </div>
  </div>
</div>

<!-- ═══════ SLIDE 6 — Server Deep Dive ═══════ -->
<div class="slide" data-slide="5">
  <span class="tag">Server Capabilities</span>
  <h2>What MCP Servers <span class="teal">Expose</span></h2>
  <p style="text-align:center;opacity:0.6;margin-bottom:1rem;">Servers expose capabilities that the LLM discovers dynamically at connection time.</p>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;max-width:720px;width:100%;">
    <div class="card" style="text-align:center;">
      <div class="card-icon">💬</div><h3 style="color:#6b9fff;">Prompts</h3>
      <p>Templates and instructions injected into context. Guide how the model approaches tasks.</p>
    </div>
    <div class="card" style="text-align:center;">
      <div class="card-icon">📦</div><h3 style="color:#a78bfa;">Resources</h3>
      <p>Structured data included in the context window — files, API responses, database records.</p>
    </div>
    <div class="card" style="text-align:center;">
      <div class="card-icon">🛠️</div><h3 style="color:#fbbf24;">Tools</h3>
      <p>Executable functions — query databases, modify files, call external APIs.</p>
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
</div>

<!-- ═══════ SLIDE 7 — Client Primitives ═══════ -->
<div class="slide" data-slide="6">
  <span class="tag">Client Side</span>
  <h2>Client Primitives: <span class="teal">Roots</span> & <span class="purple">Sampling</span></h2>
  <p style="text-align:center;opacity:0.6;margin-bottom:1.2rem;">On the client side, two primitives are equally important.</p>
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

<!-- ═══════ SLIDE 8 — N×M Interactive ═══════ -->
<div class="slide" data-slide="7">
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
    <div class="istep-dot" id="id0"></div><div class="istep-dot" id="id1"></div><div class="istep-dot" id="id2"></div><div class="istep-dot" id="id3"></div>
    <div class="istep-caption" id="icap">Press Enter to start</div>
    <div class="istep-hint">Enter / Space</div>
  </div>
</div>

<!-- ═══════ SLIDE 9 — Practical Example ═══════ -->
<div class="slide" data-slide="8">
  <span class="tag">In Practice</span>
  <h2>Claude + <span class="teal">Postgres</span> via MCP</h2>
  <p style="text-align:center;opacity:0.6;margin-bottom:1rem;">No custom integration needed — just an MCP server for Postgres.</p>
  <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;justify-content:center;max-width:750px;">
    <div class="dbox dbox-green" style="width:140px;">
      <span style="font-size:2rem;">✳️</span>
      <span style="font-size:0.75rem;font-weight:600;">Claude</span>
    </div>
    <span style="font-size:0.7rem;opacity:0.4;">→ MCP Client →</span>
    <div class="dbox dbox-teal" style="width:160px;">
      <span class="dbox-label">MCP Server</span>
      <span style="font-size:1.5rem;">🖥️</span>
      <span style="font-size:0.7rem;opacity:0.6;">Postgres Server</span>
    </div>
    <span style="font-size:0.7rem;opacity:0.4;">→ SQL queries →</span>
    <div class="dbox dbox-blue" style="width:140px;">
      <span style="font-size:2rem;">🐘</span>
      <span style="font-size:0.75rem;font-weight:600;">PostgreSQL</span>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;max-width:700px;width:100%;margin-top:1.2rem;">
    <div class="card" style="text-align:center;">
      <p style="font-size:0.8rem;"><strong class="teal">1.</strong> Claude asks to query data via MCP client</p>
    </div>
    <div class="card" style="text-align:center;">
      <p style="font-size:0.8rem;"><strong class="teal">2.</strong> MCP server translates to SQL and executes safely</p>
    </div>
    <div class="card" style="text-align:center;">
      <p style="font-size:0.8rem;"><strong class="teal">3.</strong> Results flow back into Claude's context</p>
    </div>
  </div>
  <p style="text-align:center;font-size:0.78rem;opacity:0.45;margin-top:0.8rem;">All while maintaining security and context · Read-only access by default</p>
</div>

<!-- ═══════ SLIDE 10 — Ecosystem & Summary ═══════ -->
<div class="slide" data-slide="9">
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
  <div style="margin-top:1.2rem;text-align:center;">
    <p style="font-size:0.9rem;margin-bottom:0.6rem;">
      <a href="https://modelcontextprotocol.io" style="color:#2dd4bf;text-decoration:none;border-bottom:1px solid #2dd4bf44;font-weight:600;">modelcontextprotocol.io</a>
      &nbsp;·&nbsp;
      <a href="https://github.com/modelcontextprotocol" style="color:#6b9fff;text-decoration:none;border-bottom:1px solid #6b9fff44;font-weight:600;">GitHub</a>
      &nbsp;·&nbsp;
      <a href="https://spec.modelcontextprotocol.io" style="color:#34d399;text-decoration:none;border-bottom:1px solid #34d39944;font-weight:600;">Full Spec</a>
    </p>
    <p style="font-size:0.75rem;opacity:0.35;">Built with Cloudflare Workers · Paul McNamara · Inspired by ByteByteGo</p>
  </div>
</div>

</div><!-- /deck -->

<nav class="nav">
  <button id="prev" onclick="go(-1)" disabled>◀</button>
  <div class="dots" id="dots"></div>
  <span class="counter" id="counter">1 / 10</span>
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
  const INTERACTIVE_SLIDE = 7;

  for (let i = 0; i < total; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.onclick = () => goTo(i);
    dots.appendChild(d);
  }

  function goTo(n) {
    if (n < 0 || n >= total) return;
    if (current === INTERACTIVE_SLIDE && n !== INTERACTIVE_SLIDE) iReset();
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
    if (current === INTERACTIVE_SLIDE && dir === 1 && istep < 3) { iAdvance(); return; }
    goTo(current + dir);
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });
  let touchX = 0;
  document.addEventListener('touchstart', e => { touchX = e.changedTouches[0].screenX; });
  document.addEventListener('touchend', e => { const d = touchX - e.changedTouches[0].screenX; if (Math.abs(d)>50) go(d>0?1:-1); });

  /* ═══════ Slide 8 (index 7) — interactive N×M ═══════ */
  const icanvas = document.getElementById('icanvas');
  const isvg = document.getElementById('ilines');
  const ihub = document.getElementById('ihub');
  const ibigx = document.getElementById('ibigx');
  const itag = document.getElementById('itag');
  const ititle = document.getElementById('ititle');
  const icap = document.getElementById('icap');

  const iclients = [{e:'ANTHROPIC',icon:''},{e:'deepseek',icon:'🦊'},{e:'OpenAI',icon:'🤖'}];
  const iservers = [{e:'🐘',n:'Postgres'},{e:'📁',n:'Google Drive'},{e:'🐙',n:'GitHub'}];

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
    { tag:'This Breaks', title:'Now Imagine <span class="red">100 Tools…</span>',
      cap:"Different auth, breaking changes, duplicated code. This doesn't scale.",
      run(){ ibigx.classList.add('show'); }},
    { tag:'N+M Connections', title:'Enter <span class="yellow">MCP</span>',
      cap:'One protocol. Tool builders implement it once. LLM vendors implement it once. <strong style="color:#fbbf24;">N+M</strong> instead of N×M.',
      run(){ ibigx.classList.remove('show'); imLines.forEach(m=>m.l.classList.remove('show')); setTimeout(()=>ihub.classList.add('show'),200); setTimeout(()=>{icLines.forEach((c,i)=>setTimeout(()=>c.l.classList.add('show'),i*80)); iUpdateLines();},500); }},
  ];

  function iAdvance() {
    if (istep >= 3) return;
    istep++;
    const s = isteps[istep];
    itag.textContent = s.tag;
    ititle.innerHTML = s.title;
    icap.innerHTML = s.cap; icap.classList.add('show');
    for(let i=0;i<4;i++) document.getElementById('id'+i).classList.toggle('active',i<=istep);
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
    for(let i=0;i<4;i++) document.getElementById('id'+i).classList.remove('active');
    itag.textContent = 'The N×M Problem';
    ititle.innerHTML = 'Press <span class="teal">Enter</span> to Step Through';
    icap.innerHTML = 'Press Enter to start'; icap.classList.remove('show');
  }

  iInit();
  window.addEventListener('resize', () => { iUpdateLines(); });
</script>

<footer style="position:fixed;bottom:8px;right:12px;font-size:10px;color:#444;font-family:'Inter',sans-serif;z-index:100;">
  Built with Cloudflare Workers · Paul McNamara
</footer>

</body>
</html>`;
