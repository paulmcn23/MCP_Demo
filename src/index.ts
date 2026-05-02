export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/favicon.ico") {
      return new Response(null, { status: 204 });
    }
    if (url.pathname === "/playground") {
      return new Response(playground, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
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
  html, body { height:100%; overflow:hidden; font-family:'Inter',system-ui,-apple-system,sans-serif; background:#0a0a0a; color:#e4e4e7; }

  /* ── Slide deck ────────────────────────────────────── */
  .deck { position:relative; width:100vw; height:100vh; }
  .slide {
    position:absolute; inset:0;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    padding:2.5rem 3rem;
    opacity:0; transform:translateY(30px) scale(0.97);
    transition: opacity 0.6s cubic-bezier(.4,0,.2,1), transform 0.6s cubic-bezier(.4,0,.2,1);
    pointer-events:none;
  }
  .slide.active { opacity:1; transform:translateY(0) scale(1); pointer-events:auto; }

  /* ── Typography ────────────────────────────────────── */
  h1 { font-size:3rem; font-weight:800; line-height:1.15; text-align:center; }
  h2 { font-size:2rem; font-weight:700; text-align:center; margin-bottom:1.2rem; }
  h3 { font-size:1.4rem; font-weight:600; margin-bottom:0.75rem; }
  p, li { font-size:1.05rem; line-height:1.7; max-width:50rem; }
  .subtitle { font-size:1.25rem; font-weight:300; opacity:0.65; margin-top:0.6rem; text-align:center; }
  .tag { display:inline-block; background:#f6821f18; color:#f6821f; border:1px solid #f6821f44; border-radius:999px; padding:0.2rem 0.75rem; font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:0.8rem; }

  /* ── Colours ────────────────────────────────────────── */
  .orange { color:#f6821f; } .blue { color:#6b9fff; } .green { color:#34d399; } .purple { color:#a78bfa; } .red { color:#f87171; }

  /* ── Navigation ────────────────────────────────────── */
  .nav {
    position:fixed; bottom:2rem; left:50%; transform:translateX(-50%);
    display:flex; align-items:center; gap:1rem;
    background:#18181bdd; backdrop-filter:blur(12px);
    border:1px solid #27272a; border-radius:999px;
    padding:0.6rem 1.5rem; z-index:100;
  }
  .nav button { background:none; border:none; color:#e4e4e7; font-size:1.4rem; cursor:pointer; padding:0.3rem 0.6rem; border-radius:8px; transition:background 0.2s; }
  .nav button:hover { background:#27272a; }
  .nav button:disabled { opacity:0.25; cursor:default; }
  .nav .counter { font-family:'JetBrains Mono',monospace; font-size:0.85rem; opacity:0.5; min-width:4rem; text-align:center; }
  .dots { display:flex; gap:6px; }
  .dot { width:8px; height:8px; border-radius:50%; background:#3f3f46; transition:background 0.3s, transform 0.3s; cursor:pointer; }
  .dot.active { background:#f6821f; transform:scale(1.35); }
  .progress-bar { position:fixed; top:0; left:0; height:3px; background:linear-gradient(90deg,#f6821f,#fbad41); transition:width 0.4s ease; z-index:100; }

  /* ── Background ────────────────────────────────────── */
  .bg-glow { position:fixed; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle,#f6821f0c 0%,transparent 70%); pointer-events:none; z-index:0; top:50%; left:50%; transform:translate(-50%,-50%); }
  #particles { position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden; }
  .particle { position:absolute; bottom:-10px; background:#f6821f; border-radius:50%; opacity:0; animation:rise linear infinite; }
  @keyframes rise { 0%{opacity:0;transform:translateY(0) scale(1)} 10%{opacity:0.3} 90%{opacity:0.1} 100%{opacity:0;transform:translateY(-100vh) scale(0.3)} }

  /* ── USB-C visual ──────────────────────────────────── */
  .usb-grid { display:grid; grid-template-columns:1fr auto 1fr; gap:0; align-items:center; margin:2rem 0; max-width:700px; width:100%; }
  .usb-side { display:flex; flex-direction:column; gap:0.7rem; }
  .usb-item { background:#18181b; border:1px solid #27272a; border-radius:10px; padding:0.7rem 1rem; font-size:0.85rem; display:flex; align-items:center; gap:0.5rem; transition:all 0.3s; }
  .usb-item:hover { border-color:#f6821f; transform:translateX(4px); }
  .usb-item.right:hover { transform:translateX(-4px); }
  .usb-item .icon { font-size:1.3rem; }
  .usb-port { width:60px; height:180px; background:linear-gradient(180deg,#f6821f,#fbad41); border-radius:30px; display:flex; align-items:center; justify-content:center; font-size:1.5rem; font-weight:800; color:#0a0a0a; writing-mode:vertical-lr; text-orientation:mixed; letter-spacing:0.1em; position:relative; box-shadow:0 0 40px #f6821f44; }
  .usb-port::before, .usb-port::after { content:''; position:absolute; width:100px; height:2px; background:linear-gradient(90deg,transparent,#f6821f55,transparent); }
  .usb-port::before { left:-100px; top:50%; }
  .usb-port::after { right:-100px; top:50%; }

  /* ── Architecture diagram ──────────────────────────── */
  .arch-container { position:relative; width:100%; max-width:800px; height:360px; margin:1.5rem 0; }
  .arch-box { position:absolute; background:#18181b; border:1px solid #27272a; border-radius:14px; padding:1rem 1.4rem; text-align:center; font-weight:500; transition:all 0.4s; cursor:default; }
  .arch-box:hover { border-color:#f6821f; box-shadow:0 0 30px #f6821f22; transform:scale(1.05); }
  .arch-box .icon { font-size:1.8rem; margin-bottom:0.3rem; }
  .arch-box .label { font-size:0.85rem; font-weight:600; }
  .arch-box .desc { font-size:0.7rem; opacity:0.5; margin-top:0.2rem; }
  .arch-svg { position:absolute; inset:0; pointer-events:none; }
  .arch-svg line { stroke:#f6821f; stroke-width:2; stroke-dasharray:8 4; }
  .arch-svg line.animate { animation:dashFlow 1.5s linear infinite; }
  @keyframes dashFlow { to { stroke-dashoffset:-24; } }

  /* ── Capability cards ──────────────────────────────── */
  .cap-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; max-width:750px; width:100%; margin:1rem 0; }
  .cap-card { background:#18181b; border:1px solid #27272a; border-radius:14px; padding:1.5rem; text-align:center; transition:all 0.3s; }
  .cap-card:hover { transform:translateY(-6px); }
  .cap-card .cap-icon { font-size:2.5rem; margin-bottom:0.5rem; }
  .cap-card h3 { font-size:1.1rem; margin-bottom:0.5rem; }
  .cap-card p { font-size:0.85rem; opacity:0.6; line-height:1.5; }

  /* ── Use-case cards (slides 6-9) ───────────────────── */
  .use-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1.2rem; max-width:750px; width:100%; margin:1.5rem 0; }
  .use-card { background:#18181b; border:1px solid #27272a; border-radius:14px; padding:1.2rem 1.5rem; transition:all 0.3s; }
  .use-card:hover { border-color:#f6821f; transform:translateY(-3px); }
  .use-card .uc-head { display:flex; align-items:center; gap:0.6rem; margin-bottom:0.5rem; }
  .use-card .uc-icon { font-size:1.6rem; }
  .use-card .uc-title { font-size:0.95rem; font-weight:700; }
  .use-card .uc-desc { font-size:0.8rem; opacity:0.6; line-height:1.5; }

  /* ── Interactive slide 4 ───────────────────────────── */
  .interactive-canvas { position:relative; width:100%; max-width:900px; height:420px; margin:1rem 0; }
  .interactive-canvas svg { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
  .interactive-canvas svg line { stroke-width:2; stroke-linecap:round; }
  .interactive-canvas svg line.mess { stroke:#f87171; stroke-dasharray:4 4; opacity:0; transition:opacity 0.4s; }
  .interactive-canvas svg line.mess.show { opacity:0.45; }
  .interactive-canvas svg line.clean { stroke:#f6821f; stroke-dasharray:8 4; opacity:0; transition:opacity 0.5s; }
  .interactive-canvas svg line.clean.show { opacity:0.85; animation:dashFlow 1.5s linear infinite; }
  .inode {
    position:absolute; width:82px; height:82px; background:#18181b; border:2px solid #27272a; border-radius:14px;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    opacity:0; transform:scale(0.5); transition:all 0.5s cubic-bezier(.34,1.56,.64,1);
  }
  .inode.show { opacity:1; transform:scale(1); }
  .inode .ie { font-size:1.8rem; pointer-events:none; }
  .inode .il { font-size:0.6rem; font-weight:600; opacity:0.6; margin-top:2px; pointer-events:none; }
  .inode.ic { border-color:#6b9fff44; }
  .inode.is { border-color:#34d39944; }
  .ihub {
    position:absolute; width:110px; height:110px; background:linear-gradient(135deg,#f6821f,#fbad41);
    border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center;
    color:#0a0a0a; font-weight:800; font-size:1rem; box-shadow:0 0 60px #f6821f44;
    opacity:0; transform:scale(0); transition:all 0.7s cubic-bezier(.34,1.56,.64,1);
  }
  .ihub.show { opacity:1; transform:scale(1); }
  .ihub .isub { font-size:0.5rem; font-weight:500; opacity:0.6; margin-top:1px; }
  .ibigx { position:absolute; font-size:6rem; color:#f8717188; opacity:0; transform:scale(0.5) rotate(-10deg); transition:all 0.5s cubic-bezier(.34,1.56,.64,1); pointer-events:none; }
  .ibigx.show { opacity:1; transform:scale(1) rotate(0deg); }
  .ilabel { position:absolute; font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; opacity:0; transition:opacity 0.4s; }
  .ilabel.show { opacity:0.3; }
  .istep-bar { display:flex; align-items:center; gap:1rem; margin-top:0.5rem; }
  .istep-dot { width:10px; height:10px; border-radius:50%; background:#3f3f46; transition:all 0.3s; }
  .istep-dot.active { background:#f6821f; transform:scale(1.4); }
  .istep-caption { font-size:0.85rem; opacity:0; transition:all 0.3s; max-width:550px; text-align:center; }
  .istep-caption.show { opacity:0.65; }
  .istep-hint { font-size:0.7rem; opacity:0.3; font-family:'JetBrains Mono',monospace; }

  .slide > * { position:relative; z-index:1; }

  @media (max-width:768px) {
    h1 { font-size:2rem; } h2 { font-size:1.5rem; }
    .slide { padding:2rem 1.5rem; }
    .usb-grid { grid-template-columns:1fr; gap:1rem; }
    .usb-port { width:180px; height:50px; writing-mode:horizontal-tb; }
    .cap-grid, .use-grid { grid-template-columns:1fr; }
    .arch-container { height:auto; min-height:400px; }
    .interactive-canvas { height:350px; }
  }
</style>
</head>
<body>

<div class="bg-glow"></div>
<div id="particles"></div>
<div class="progress-bar" id="progress"></div>

<div class="deck" id="deck">

<!-- ══════════ SLIDE 1 — Title ══════════ -->
<div class="slide active" data-slide="0">
  <span class="tag">An Open Standard by Anthropic</span>
  <h1>The <span class="orange">Model Context Protocol</span></h1>
  <p class="subtitle">How AI applications talk to the outside world</p>
  <p style="text-align:center;margin-top:2.5rem;font-size:0.9rem;opacity:0.4;">Press <kbd style="background:#27272a;padding:2px 8px;border-radius:4px;">→</kbd> to begin</p>
</div>

<!-- ══════════ SLIDE 2 — USB-C Analogy ══════════ -->
<div class="slide" data-slide="1">
  <span class="tag">The Big Idea</span>
  <h2>MCP is the <span class="orange">USB-C</span> for AI</h2>
  <p style="text-align:center;opacity:0.7;margin-bottom:0.5rem;">Just as USB-C standardises how devices connect to accessories,<br>MCP standardises how AI apps connect to data sources and tools.</p>
  <div class="usb-grid">
    <div class="usb-side">
      <div class="usb-item"><span class="icon">🤖</span> Claude Desktop</div>
      <div class="usb-item"><span class="icon">💻</span> Cursor / Windsurf</div>
      <div class="usb-item"><span class="icon">📱</span> Custom AI App</div>
      <div class="usb-item"><span class="icon">🧠</span> ChatGPT</div>
    </div>
    <div class="usb-port">MCP</div>
    <div class="usb-side">
      <div class="usb-item right"><span class="icon">📁</span> File System</div>
      <div class="usb-item right"><span class="icon">🐙</span> GitHub / GitLab</div>
      <div class="usb-item right"><span class="icon">💬</span> Slack</div>
      <div class="usb-item right"><span class="icon">🗄️</span> Databases</div>
    </div>
  </div>
  <p style="text-align:center;font-size:0.85rem;opacity:0.5;">Build the server once → every MCP client can use it</p>
</div>

<!-- ══════════ SLIDE 3 — Architecture ══════════ -->
<div class="slide" data-slide="2">
  <span class="tag">How It Works</span>
  <h2>Client → Server Architecture</h2>
  <div class="arch-container">
    <svg class="arch-svg" viewBox="0 0 800 360">
      <line class="animate" x1="200" y1="90" x2="200" y2="155" />
      <line class="animate" x1="400" y1="90" x2="400" y2="155" />
      <line class="animate" x1="600" y1="90" x2="600" y2="155" />
      <line class="animate" x1="200" y1="235" x2="200" y2="280" />
      <line class="animate" x1="400" y1="235" x2="400" y2="280" />
      <line class="animate" x1="600" y1="235" x2="600" y2="280" />
    </svg>
    <div class="arch-box" style="left:50px;top:10px;width:700px;background:linear-gradient(135deg,#1a1a2e,#18181b);border-color:#6b9fff44;">
      <div class="label" style="color:#6b9fff;">🖥️ MCP Host <span style="opacity:0.5;font-weight:400;">(AI Application — e.g. Cursor, Claude)</span></div>
    </div>
    <div class="arch-box" style="left:100px;top:155px;width:160px;"><div class="icon">🔌</div><div class="label">MCP Client 1</div></div>
    <div class="arch-box" style="left:320px;top:155px;width:160px;"><div class="icon">🔌</div><div class="label">MCP Client 2</div></div>
    <div class="arch-box" style="left:540px;top:155px;width:160px;"><div class="icon">🔌</div><div class="label">MCP Client 3</div></div>
    <div class="arch-box" style="left:80px;top:280px;width:200px;border-color:#34d39944;"><div class="icon">📁</div><div class="label" style="color:#34d399;">Server A — Local</div><div class="desc">Filesystem (stdio)</div></div>
    <div class="arch-box" style="left:305px;top:280px;width:190px;border-color:#a78bfa44;"><div class="icon">🗄️</div><div class="label" style="color:#a78bfa;">Server B — Local</div><div class="desc">Database (stdio)</div></div>
    <div class="arch-box" style="left:520px;top:280px;width:200px;border-color:#f6821f44;"><div class="icon">☁️</div><div class="label" style="color:#f6821f;">Server C — Remote</div><div class="desc">Sentry (Streamable HTTP)</div></div>
  </div>
  <p style="text-align:center;font-size:0.85rem;opacity:0.5;">Each client maintains a 1:1 connection to its server · The host orchestrates all clients</p>
</div>

<!-- ══════════ SLIDE 4 — Interactive Before/After ══════════ -->
<div class="slide" data-slide="3">
  <span class="tag" id="itag">Interactive Demo</span>
  <h2 id="ititle">Press <span class="orange">Enter</span> to Step Through</h2>
  <div class="interactive-canvas" id="icanvas">
    <svg id="ilines" xmlns="http://www.w3.org/2000/svg"></svg>
    <div class="ilabel" id="ilbl-c" style="left:8%;top:6px;">AI Clients</div>
    <div class="ilabel" id="ilbl-s" style="right:8%;top:6px;">Tools & Data</div>
    <div class="ihub" id="ihub">MCP<div class="isub">Protocol</div></div>
    <div class="ibigx" id="ibigx">❌</div>
  </div>
  <div class="istep-bar">
    <div class="istep-dot" id="id0"></div><div class="istep-dot" id="id1"></div><div class="istep-dot" id="id2"></div><div class="istep-dot" id="id3"></div>
    <div class="istep-caption" id="icap">Press Enter to start the walkthrough</div>
    <div class="istep-hint">Enter / Space</div>
  </div>
</div>

<!-- ══════════ SLIDE 5 — Server Capabilities ══════════ -->
<div class="slide" data-slide="4">
  <span class="tag">Server Capabilities</span>
  <h2>What MCP Servers <span class="orange">Expose</span></h2>
  <p style="text-align:center;opacity:0.65;margin-bottom:1rem;">Three core primitives that every MCP server can provide</p>
  <div class="cap-grid">
    <div class="cap-card" onmouseover="this.style.borderColor='#f6821f'" onmouseout="this.style.borderColor='#27272a'">
      <div class="cap-icon">🛠️</div><h3 style="color:#f6821f;">Tools</h3>
      <p>Actions the LLM can invoke — API calls, calculations, code execution. The AI <em>does</em> something.</p>
    </div>
    <div class="cap-card" onmouseover="this.style.borderColor='#6b9fff'" onmouseout="this.style.borderColor='#27272a'">
      <div class="cap-icon">📦</div><h3 style="color:#6b9fff;">Resources</h3>
      <p>Data the LLM can read — files, database records, API responses. The AI <em>knows</em> something.</p>
    </div>
    <div class="cap-card" onmouseover="this.style.borderColor='#a78bfa'" onmouseout="this.style.borderColor='#27272a'">
      <div class="cap-icon">💬</div><h3 style="color:#a78bfa;">Prompts</h3>
      <p>Reusable templates and workflows — pre-built instructions for common tasks. The AI <em>follows a pattern</em>.</p>
    </div>
  </div>
  <div style="background:#18181b;border:1px solid #27272a;border-radius:14px;padding:1.2rem 1.8rem;max-width:750px;width:100%;margin-top:1rem;">
    <p style="text-align:center;font-size:0.9rem;opacity:0.7;">
      <strong>Transport:</strong> <span class="blue">JSON-RPC 2.0</span> over
      <span class="green">stdio</span> (local) or <span class="orange">Streamable HTTP</span> (remote)
    </p>
  </div>
</div>

<!-- ══════════ SLIDE 6 — Code Assistants ══════════ -->
<div class="slide" data-slide="5">
  <span class="tag">How We Use It Today</span>
  <h2><span class="blue">Code Assistants</span> with MCP</h2>
  <p style="text-align:center;opacity:0.65;margin-bottom:0.5rem;">AI-powered IDEs use MCP to access your codebase, run commands, and manage files</p>
  <div class="use-grid">
    <div class="use-card">
      <div class="uc-head"><span class="uc-icon">💻</span><span class="uc-title" style="color:#6b9fff;">Cursor / Windsurf</span></div>
      <div class="uc-desc">MCP servers give AI access to filesystem, terminal, git history, and project context — all through a standard interface.</div>
    </div>
    <div class="use-card">
      <div class="uc-head"><span class="uc-icon">🤖</span><span class="uc-title" style="color:#f6821f;">Claude Code</span></div>
      <div class="uc-desc">Anthropic's CLI agent uses MCP to read files, run bash commands, search codebases, and manage multi-file edits.</div>
    </div>
    <div class="use-card">
      <div class="uc-head"><span class="uc-icon">🐙</span><span class="uc-title" style="color:#34d399;">GitHub MCP Server</span></div>
      <div class="uc-desc">Create PRs, review code, search issues, and manage repos — directly from your AI assistant.</div>
    </div>
    <div class="use-card">
      <div class="uc-head"><span class="uc-icon">🔍</span><span class="uc-title" style="color:#a78bfa;">Code Search</span></div>
      <div class="uc-desc">MCP servers can expose semantic code search, dependency graphs, and documentation across your entire org.</div>
    </div>
  </div>
</div>

<!-- ══════════ SLIDE 7 — Enterprise Data ══════════ -->
<div class="slide" data-slide="6">
  <span class="tag">How We Use It Today</span>
  <h2><span class="green">Enterprise Data</span> Access</h2>
  <p style="text-align:center;opacity:0.65;margin-bottom:0.5rem;">Connect AI to the tools your teams already use — securely and in real time</p>
  <div class="use-grid">
    <div class="use-card">
      <div class="uc-head"><span class="uc-icon">💬</span><span class="uc-title" style="color:#34d399;">Slack / Teams</span></div>
      <div class="uc-desc">Search messages, summarise channels, post updates, and monitor conversations through MCP.</div>
    </div>
    <div class="use-card">
      <div class="uc-head"><span class="uc-icon">📄</span><span class="uc-title" style="color:#6b9fff;">Google Drive / Docs</span></div>
      <div class="uc-desc">Read documents, search across drives, extract data from spreadsheets — AI gets context from your files.</div>
    </div>
    <div class="use-card">
      <div class="uc-head"><span class="uc-icon">🎫</span><span class="uc-title" style="color:#f6821f;">Jira / Linear</span></div>
      <div class="uc-desc">Query tickets, update statuses, create issues, and track sprint progress with natural language.</div>
    </div>
    <div class="use-card">
      <div class="uc-head"><span class="uc-icon">🗄️</span><span class="uc-title" style="color:#a78bfa;">Databases</span></div>
      <div class="uc-desc">Query PostgreSQL, MySQL, or any DB. AI writes SQL, the MCP server executes it safely with read-only access.</div>
    </div>
  </div>
</div>

<!-- ══════════ SLIDE 8 — DevOps & Observability ══════════ -->
<div class="slide" data-slide="7">
  <span class="tag">How We Use It Today</span>
  <h2><span class="purple">DevOps</span> & Observability</h2>
  <p style="text-align:center;opacity:0.65;margin-bottom:0.5rem;">AI agents that can debug, monitor, and respond to incidents</p>
  <div class="use-grid">
    <div class="use-card">
      <div class="uc-head"><span class="uc-icon">🐛</span><span class="uc-title" style="color:#f87171;">Sentry</span></div>
      <div class="uc-desc">AI reads error reports, stack traces, and release data. Diagnose issues before you even open the dashboard.</div>
    </div>
    <div class="use-card">
      <div class="uc-head"><span class="uc-icon">📊</span><span class="uc-title" style="color:#34d399;">Grafana / Datadog</span></div>
      <div class="uc-desc">Query metrics, review dashboards, and correlate anomalies — AI becomes part of your on-call toolkit.</div>
    </div>
    <div class="use-card">
      <div class="uc-head"><span class="uc-icon">🔄</span><span class="uc-title" style="color:#6b9fff;">CI/CD Pipelines</span></div>
      <div class="uc-desc">Trigger builds, check deployment status, and rollback — AI can manage your delivery pipeline via MCP.</div>
    </div>
    <div class="use-card">
      <div class="uc-head"><span class="uc-icon">📋</span><span class="uc-title" style="color:#f6821f;">Log Search</span></div>
      <div class="uc-desc">Elasticsearch, CloudWatch, or any log store. AI searches, filters, and summarises logs in seconds.</div>
    </div>
  </div>
</div>

<!-- ══════════ SLIDE 9 — Build Your Own ══════════ -->
<div class="slide" data-slide="8">
  <span class="tag">Get Started</span>
  <h2>Building Your Own <span class="orange">MCP Server</span></h2>
  <p style="text-align:center;opacity:0.65;margin-bottom:1.5rem;">It's simpler than you think — a few lines of code to expose any tool to every AI client</p>
  <div style="background:#18181b;border:1px solid #27272a;border-radius:14px;padding:1.5rem 2rem;max-width:650px;width:100%;font-family:'JetBrains Mono',monospace;font-size:0.8rem;line-height:1.8;overflow-x:auto;">
    <span style="color:#a78bfa;">import</span> { <span style="color:#34d399;">McpServer</span> } <span style="color:#a78bfa;">from</span> <span style="color:#f6821f;">"@modelcontextprotocol/sdk"</span>;<br><br>
    <span style="color:#6b9fff;">const</span> server = <span style="color:#a78bfa;">new</span> <span style="color:#34d399;">McpServer</span>({ name: <span style="color:#f6821f;">"my-server"</span> });<br><br>
    server.<span style="color:#34d399;">tool</span>(<span style="color:#f6821f;">"get_weather"</span>,<br>
    &nbsp;&nbsp;{ city: { type: <span style="color:#f6821f;">"string"</span> } },<br>
    &nbsp;&nbsp;<span style="color:#a78bfa;">async</span> ({ city }) => ({<br>
    &nbsp;&nbsp;&nbsp;&nbsp;content: [{ type: <span style="color:#f6821f;">"text"</span>, text: <span style="color:#f6821f;">await fetchWeather(city)</span> }]<br>
    &nbsp;&nbsp;})<br>
    );
  </div>
  <div class="use-grid" style="margin-top:1.5rem;">
    <div class="use-card">
      <div class="uc-head"><span class="uc-icon">🐍</span><span class="uc-title">Python SDK</span></div>
      <div class="uc-desc">pip install mcp — FastMCP makes it even simpler with decorators.</div>
    </div>
    <div class="use-card">
      <div class="uc-head"><span class="uc-icon">📦</span><span class="uc-title">TypeScript SDK</span></div>
      <div class="uc-desc">npm install @modelcontextprotocol/sdk — full server + client support.</div>
    </div>
  </div>
</div>

<!-- ══════════ SLIDE 10 — Summary ══════════ -->
<div class="slide" data-slide="9">
  <span class="tag">Wrap Up</span>
  <h2>MCP in <span class="orange">30 Seconds</span></h2>
  <div class="cap-grid" style="margin-top:1.5rem;">
    <div class="cap-card" onmouseover="this.style.borderColor='#f6821f'" onmouseout="this.style.borderColor='#27272a'">
      <div class="cap-icon">🔌</div>
      <h3>One Standard</h3>
      <p>Replace N×M custom integrations with one universal protocol for AI ↔ tools.</p>
    </div>
    <div class="cap-card" onmouseover="this.style.borderColor='#6b9fff'" onmouseout="this.style.borderColor='#27272a'">
      <div class="cap-icon">🧩</div>
      <h3>Build Once</h3>
      <p>Create an MCP server and every compatible AI client can use it immediately.</p>
    </div>
    <div class="cap-card" onmouseover="this.style.borderColor='#34d399'" onmouseout="this.style.borderColor='#27272a'">
      <div class="cap-icon">🚀</div>
      <h3>Growing Fast</h3>
      <p>Anthropic, OpenAI, Google, Microsoft — the entire industry is adopting MCP.</p>
    </div>
  </div>
  <div style="margin-top:2rem;text-align:center;">
    <p style="font-size:1rem;margin-bottom:0.8rem;">
      <a href="https://modelcontextprotocol.io" style="color:#f6821f;text-decoration:none;border-bottom:1px solid #f6821f44;font-weight:600;">modelcontextprotocol.io</a>
      &nbsp;·&nbsp;
      <a href="https://github.com/modelcontextprotocol" style="color:#6b9fff;text-decoration:none;border-bottom:1px solid #6b9fff44;font-weight:600;">GitHub</a>
      &nbsp;·&nbsp;
      <a href="https://spec.modelcontextprotocol.io" style="color:#34d399;text-decoration:none;border-bottom:1px solid #34d39944;font-weight:600;">Full Spec</a>
    </p>
    <p style="font-size:0.85rem;opacity:0.4;">Built with Cloudflare Workers · Paul McNamara</p>
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
  /* ── Slide navigation ── */
  let current = 0;
  const slides = document.querySelectorAll('.slide');
  const total = slides.length;
  const dots = document.getElementById('dots');
  const counter = document.getElementById('counter');
  const progress = document.getElementById('progress');

  for (let i = 0; i < total; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.onclick = () => goTo(i);
    dots.appendChild(d);
  }

  function goTo(n) {
    if (n < 0 || n >= total) return;
    slides[current].classList.remove('active');
    dots.children[current].classList.remove('active');
    current = n;
    slides[current].classList.add('active');
    dots.children[current].classList.add('active');
    counter.textContent = (current + 1) + ' / ' + total;
    progress.style.width = ((current / (total - 1)) * 100) + '%';
    document.getElementById('prev').disabled = current === 0;
    document.getElementById('next').disabled = current === total - 1;
    if (current === 3 && istep === -1) istep = -1; // ready for interactive
  }
  function go(dir) {
    // On slide 4, Enter/Space advances the interactive walkthrough instead
    if (current === 3 && dir === 1 && istep < 3) {
      iAdvance();
      return;
    }
    goTo(current + dir);
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });

  let touchStartX = 0;
  document.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
  document.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
  });

  /* ── Particles ── */
  const pc = document.getElementById('particles');
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (5 + Math.random() * 7) + 's';
    p.style.animationDelay = Math.random() * 10 + 's';
    p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
    pc.appendChild(p);
  }

  /* ══════════ Slide 4 interactive walkthrough ══════════ */
  const icanvas = document.getElementById('icanvas');
  const isvg = document.getElementById('ilines');
  const ihub = document.getElementById('ihub');
  const ibigx = document.getElementById('ibigx');
  const itag = document.getElementById('itag');
  const ititle = document.getElementById('ititle');
  const icap = document.getElementById('icap');

  const iclients = [{e:'🤖',n:'Claude'},{e:'💻',n:'Cursor'},{e:'🏄',n:'Windsurf'},{e:'🧠',n:'ChatGPT'}];
  const iservers = [{e:'📁',n:'Files'},{e:'🐙',n:'GitHub'},{e:'💬',n:'Slack'},{e:'🗄️',n:'Database'},{e:'📧',n:'Email'}];

  let icNodes=[], isNodes=[], imLines=[], icLines=[], istep=-1;

  function iInit() {
    const r = icanvas.getBoundingClientRect();
    const w = r.width, h = r.height;
    const colL = w * 0.08, colR = w * 0.82;
    const startY = 30, gap = 90;

    iclients.forEach((c,i) => {
      const n = document.createElement('div');
      n.className = 'inode ic';
      n.innerHTML = '<div class="ie">'+c.e+'</div><div class="il">'+c.n+'</div>';
      n.style.left = colL+'px'; n.style.top = (startY + i*gap)+'px';
      icanvas.appendChild(n); icNodes.push(n);
    });
    iservers.forEach((s,i) => {
      const n = document.createElement('div');
      n.className = 'inode is';
      n.innerHTML = '<div class="ie">'+s.e+'</div><div class="il">'+s.n+'</div>';
      n.style.left = colR+'px'; n.style.top = (startY + i*(gap*0.82))+'px';
      icanvas.appendChild(n); isNodes.push(n);
    });

    ihub.style.left = (w/2 - 55)+'px'; ihub.style.top = (h/2 - 70)+'px';
    ibigx.style.left = (w/2 - 48)+'px'; ibigx.style.top = (h/2 - 60)+'px';

    // Mess lines
    icNodes.forEach(cn => {
      isNodes.forEach(sn => {
        const l = document.createElementNS('http://www.w3.org/2000/svg','line');
        l.classList.add('mess'); isvg.appendChild(l);
        imLines.push({l,cn,sn});
      });
    });
    // Clean lines
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

  function icx(n){ return parseFloat(n.style.left)+41; }
  function icy(n){ return parseFloat(n.style.top)+41; }

  function iUpdateLines() {
    const hx = parseFloat(ihub.style.left)+55, hy = parseFloat(ihub.style.top)+55;
    imLines.forEach(m => { m.l.setAttribute('x1',icx(m.cn)); m.l.setAttribute('y1',icy(m.cn)); m.l.setAttribute('x2',icx(m.sn)); m.l.setAttribute('y2',icy(m.sn)); });
    icLines.forEach(c => {
      if(c.from==='hub'){ c.l.setAttribute('x1',hx); c.l.setAttribute('y1',hy); c.l.setAttribute('x2',icx(c.to)); c.l.setAttribute('y2',icy(c.to)); }
      else { c.l.setAttribute('x1',icx(c.from)); c.l.setAttribute('y1',icy(c.from)); c.l.setAttribute('x2',hx); c.l.setAttribute('y2',hy); }
    });
  }

  const isteps = [
    { tag:'The Problem', title:'AI Apps & Tools — <span class="orange">Disconnected</span>',
      cap:'Each AI application and each tool exist independently. No connections yet.',
      run(){ icNodes.forEach((n,i)=>setTimeout(()=>n.classList.add('show'),i*100)); isNodes.forEach((n,i)=>setTimeout(()=>n.classList.add('show'),i*100)); document.getElementById('ilbl-c').classList.add('show'); document.getElementById('ilbl-s').classList.add('show'); }},
    { tag:'N × M Problem', title:'The Integration <span class="red">Mess</span>',
      cap:'4 clients × 5 tools = <strong style="color:#f87171;">20 custom integrations</strong>. Every new tool multiplies the work.',
      run(){ imLines.forEach((m,i)=>setTimeout(()=>m.l.classList.add('show'),i*25)); }},
    { tag:'This Breaks', title:'Now Imagine <span class="red">100 Tools…</span>',
      cap:'Different auth, breaking changes, duplicated code. This doesn\\'t scale.',
      run(){ ibigx.classList.add('show'); }},
    { tag:'The Solution', title:'Enter <span class="orange">MCP</span>',
      cap:'One universal standard. Build each connection <strong>once</strong>. Press → to continue.',
      run(){ ibigx.classList.remove('show'); imLines.forEach(m=>m.l.classList.remove('show')); setTimeout(()=>ihub.classList.add('show'),200); setTimeout(()=>icLines.forEach((c,i)=>setTimeout(()=>c.l.classList.add('show'),i*70)),500); }},
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
  }

  // Reset interactive when leaving slide 4
  const origGoTo = goTo;
  goTo = function(n) {
    if (current === 3 && n !== 3) {
      // Reset interactive
      istep = -1;
      icNodes.forEach(nd=>nd.classList.remove('show'));
      isNodes.forEach(nd=>nd.classList.remove('show'));
      imLines.forEach(m=>m.l.classList.remove('show'));
      icLines.forEach(c=>c.l.classList.remove('show'));
      ihub.classList.remove('show'); ibigx.classList.remove('show');
      document.getElementById('ilbl-c').classList.remove('show');
      document.getElementById('ilbl-s').classList.remove('show');
      for(let i=0;i<4;i++) document.getElementById('id'+i).classList.remove('active');
      itag.textContent = 'Interactive Demo';
      ititle.innerHTML = 'Press <span class="orange">Enter</span> to Step Through';
      icap.innerHTML = 'Press Enter to start the walkthrough';
    }
    origGoTo(n);
  };

  iInit();
</script>

<footer style="position:fixed;bottom:16px;right:16px;font-size:11px;color:#555;font-family:'Inter',sans-serif;z-index:1000;">
  Built with Cloudflare Workers · Paul McNamara
</footer>

</body>
</html>`;

const playground = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MCP Explained — Before & After</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body { height:100%; font-family:'Inter',system-ui,sans-serif; background:#0a0a0a; color:#e4e4e7; overflow:hidden; user-select:none; }

  .canvas { position:relative; width:100vw; height:100vh; }
  svg#lines { position:absolute; inset:0; width:100%; height:100%; z-index:1; pointer-events:none; }

  /* ── Nodes ──────────────────────────────────────── */
  .node {
    position:absolute; display:flex; flex-direction:column; align-items:center; justify-content:center;
    width:90px; height:90px; background:#18181b; border:2px solid #27272a; border-radius:16px;
    z-index:10; opacity:0; transform:scale(0.5);
    transition:all 0.6s cubic-bezier(.34,1.56,.64,1);
  }
  .node.show { opacity:1; transform:scale(1); }
  .node .emoji { font-size:2.2rem; }
  .node .label { font-size:0.65rem; font-weight:600; opacity:0.7; margin-top:3px; text-align:center; line-height:1.2; }
  .node.client { border-color:#6b9fff44; }
  .node.server { border-color:#34d39944; }
  .node.client.show:hover { border-color:#6b9fff; box-shadow:0 0 20px #6b9fff22; transform:scale(1.08); }
  .node.server.show:hover { border-color:#34d399; box-shadow:0 0 20px #34d39922; transform:scale(1.08); }

  /* ── MCP Hub ──────────────────────────────────────── */
  .hub {
    position:absolute; width:130px; height:130px;
    background:linear-gradient(135deg,#f6821f,#fbad41); border-radius:50%;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    color:#0a0a0a; font-weight:800; font-size:1.1rem; letter-spacing:0.05em;
    box-shadow:0 0 80px #f6821f55; z-index:15;
    opacity:0; transform:scale(0);
    transition:all 0.8s cubic-bezier(.34,1.56,.64,1);
  }
  .hub.show { opacity:1; transform:scale(1); }
  .hub .sub { font-size:0.55rem; font-weight:500; opacity:0.6; margin-top:2px; }

  /* ── Connection lines ───────────────────────────── */
  svg line { stroke-width:2; stroke-linecap:round; }
  svg line.mess { stroke:#f87171; stroke-dasharray:4 4; opacity:0; transition:opacity 0.4s; }
  svg line.mess.show { opacity:0.5; }
  svg line.clean { stroke:#f6821f; stroke-dasharray:8 4; opacity:0; transition:opacity 0.5s; }
  svg line.clean.show { opacity:0.9; animation:flowDash 1.5s linear infinite; }
  @keyframes flowDash { to { stroke-dashoffset:-24; } }

  /* ── Column labels ──────────────────────────────── */
  .col-label {
    position:absolute; font-size:0.7rem; font-weight:700; text-transform:uppercase;
    letter-spacing:0.12em; opacity:0; transition:opacity 0.5s;
  }
  .col-label.show { opacity:0.35; }

  /* ── Headline + caption ─────────────────────────── */
  .headline {
    position:fixed; top:0; left:0; right:0; z-index:100;
    text-align:center; padding:1.5rem 2rem 0;
  }
  .headline .tag {
    display:inline-block; background:#f6821f18; color:#f6821f; border:1px solid #f6821f44;
    border-radius:999px; padding:0.2rem 0.75rem; font-size:0.7rem; font-weight:600;
    text-transform:uppercase; letter-spacing:0.08em; margin-bottom:0.5rem;
    opacity:0; transition:opacity 0.4s;
  }
  .headline .tag.show { opacity:1; }
  .headline h2 {
    font-size:1.8rem; font-weight:800; opacity:0; transform:translateY(10px);
    transition:all 0.5s ease;
  }
  .headline h2.show { opacity:1; transform:translateY(0); }

  /* ── Bottom bar ─────────────────────────────────── */
  .bottombar {
    position:fixed; bottom:0; left:0; right:0; z-index:100;
    display:flex; align-items:center; justify-content:center; gap:1.5rem;
    padding:1rem 2rem; background:linear-gradient(transparent,#0a0a0a88);
  }
  .caption {
    font-size:0.9rem; opacity:0; transform:translateY(8px);
    transition:all 0.4s; text-align:center; max-width:600px;
  }
  .caption.show { opacity:0.7; transform:translateY(0); }
  .step-dots { display:flex; gap:8px; }
  .step-dot {
    width:10px; height:10px; border-radius:50%; background:#3f3f46;
    transition:all 0.3s;
  }
  .step-dot.active { background:#f6821f; transform:scale(1.4); }
  .prompt {
    font-size:0.75rem; opacity:0.3; font-family:'JetBrains Mono',monospace;
  }

  /* ── Cross-out effect for mess lines ────────────── */
  .big-x {
    position:absolute; font-size:8rem; color:#f8717188; z-index:20;
    opacity:0; transform:scale(0.5) rotate(-10deg);
    transition:all 0.5s cubic-bezier(.34,1.56,.64,1);
    pointer-events:none;
  }
  .big-x.show { opacity:1; transform:scale(1) rotate(0deg); }

  /* ── Back link ──────────────────────────────────── */
  .back-link {
    position:fixed; top:1rem; left:1.5rem; z-index:200;
    color:#6b9fff; font-size:0.78rem; text-decoration:none; opacity:0.5;
    transition:opacity 0.2s;
  }
  .back-link:hover { opacity:1; }
</style>
</head>
<body>

<a class="back-link" href="/">← Slides</a>

<div class="headline">
  <div class="tag" id="tag">The Problem</div>
  <h2 id="title">How AI Apps Connect Today</h2>
</div>

<div class="canvas" id="canvas">
  <svg id="lines" xmlns="http://www.w3.org/2000/svg"></svg>
  <div class="col-label" id="lbl-clients" style="left:15%;top:80px;">AI Applications</div>
  <div class="col-label" id="lbl-servers" style="right:15%;top:80px;">Tools & Data Sources</div>
  <div class="hub" id="hub">MCP<div class="sub">Standard Protocol</div></div>
  <div class="big-x" id="bigX">❌</div>
</div>

<div class="bottombar">
  <div class="step-dots" id="dots"></div>
  <div class="caption" id="caption">Press Enter or → to begin</div>
  <div class="prompt">Enter / → / Click</div>
</div>

<script>
  const W = () => window.innerWidth;
  const H = () => window.innerHeight;

  const clients = [
    { emoji:'🤖', name:'Claude' },
    { emoji:'💻', name:'Cursor' },
    { emoji:'🏄', name:'Windsurf' },
    { emoji:'🧠', name:'ChatGPT' },
  ];
  const servers = [
    { emoji:'📁', name:'Files' },
    { emoji:'🐙', name:'GitHub' },
    { emoji:'💬', name:'Slack' },
    { emoji:'🗄️', name:'Database' },
    { emoji:'📧', name:'Email' },
  ];

  const svgEl = document.getElementById('lines');
  const hub = document.getElementById('hub');
  const bigX = document.getElementById('bigX');
  const tag = document.getElementById('tag');
  const title = document.getElementById('title');
  const caption = document.getElementById('caption');
  const dotsEl = document.getElementById('dots');

  let clientNodes = [];
  let serverNodes = [];
  let messLines = [];
  let cleanLines = [];

  function cx(node) { return parseFloat(node.style.left) + 45; }
  function cy(node) { return parseFloat(node.style.top) + 45; }

  // Create nodes
  function init() {
    const colL = W() * 0.16;
    const colR = W() * 0.74;
    const startY = 130;
    const gap = 105;

    clients.forEach((c, i) => {
      const n = document.createElement('div');
      n.className = 'node client';
      n.innerHTML = '<div class="emoji">' + c.emoji + '</div><div class="label">' + c.name + '</div>';
      n.style.left = colL + 'px';
      n.style.top = (startY + i * gap) + 'px';
      document.getElementById('canvas').appendChild(n);
      clientNodes.push(n);
    });

    servers.forEach((s, i) => {
      const n = document.createElement('div');
      n.className = 'node server';
      n.innerHTML = '<div class="emoji">' + s.emoji + '</div><div class="label">' + s.name + '</div>';
      n.style.left = colR + 'px';
      n.style.top = (startY + i * (gap * 0.85)) + 'px';
      document.getElementById('canvas').appendChild(n);
      serverNodes.push(n);
    });

    // MCP hub position
    hub.style.left = (W() / 2 - 65) + 'px';
    hub.style.top = (H() / 2 - 85) + 'px';

    // Big X position
    bigX.style.left = (W() / 2 - 60) + 'px';
    bigX.style.top = (H() / 2 - 80) + 'px';

    // Create mess lines (N×M)
    clientNodes.forEach(cn => {
      serverNodes.forEach(sn => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.classList.add('mess');
        svgEl.appendChild(line);
        messLines.push({ line, cn, sn });
      });
    });

    // Create clean lines (hub-spoke)
    clientNodes.forEach(cn => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.classList.add('clean');
      svgEl.appendChild(line);
      cleanLines.push({ line, from: cn, to: 'hub' });
    });
    serverNodes.forEach(sn => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.classList.add('clean');
      svgEl.appendChild(line);
      cleanLines.push({ line, from: 'hub', to: sn });
    });

    updateLinePositions();
  }

  function updateLinePositions() {
    const hx = parseFloat(hub.style.left) + 65;
    const hy = parseFloat(hub.style.top) + 65;

    messLines.forEach(m => {
      m.line.setAttribute('x1', cx(m.cn)); m.line.setAttribute('y1', cy(m.cn));
      m.line.setAttribute('x2', cx(m.sn)); m.line.setAttribute('y2', cy(m.sn));
    });

    cleanLines.forEach(c => {
      if (c.from === 'hub') {
        c.line.setAttribute('x1', hx); c.line.setAttribute('y1', hy);
        c.line.setAttribute('x2', cx(c.to)); c.line.setAttribute('y2', cy(c.to));
      } else {
        c.line.setAttribute('x1', cx(c.from)); c.line.setAttribute('y1', cy(c.from));
        c.line.setAttribute('x2', hx); c.line.setAttribute('y2', hy);
      }
    });
  }

  // ── Steps ──
  const steps = [
    {
      tag:'The Problem', title:'How AI Apps Connect Today',
      caption:'Each AI application needs a <strong>custom integration</strong> for every tool it wants to use.',
      run() {
        clientNodes.forEach((n,i) => setTimeout(() => n.classList.add('show'), i * 120));
        serverNodes.forEach((n,i) => setTimeout(() => n.classList.add('show'), i * 120));
        document.getElementById('lbl-clients').classList.add('show');
        document.getElementById('lbl-servers').classList.add('show');
      }
    },
    {
      tag:'N × M Integrations', title:'The Integration <span style="color:#f87171;">Mess</span>',
      caption:'4 clients × 5 tools = <strong style="color:#f87171;">20 custom integrations</strong>. Every new app or tool multiplies the work.',
      run() {
        messLines.forEach((m, i) => setTimeout(() => m.line.classList.add('show'), i * 30));
      }
    },
    {
      tag:'This Doesn\\'t Scale', title:'Now Imagine <span style="color:#f87171;">100 Tools…</span>',
      caption:'Different auth methods, breaking API changes, duplicated code everywhere. There has to be a better way.',
      run() {
        bigX.classList.add('show');
      }
    },
    {
      tag:'The Solution', title:'Enter <span style="color:#f6821f;">MCP</span>',
      caption:'The Model Context Protocol provides <strong>one universal standard</strong>. Build each connection once.',
      run() {
        bigX.classList.remove('show');
        messLines.forEach(m => m.line.classList.remove('show'));
        setTimeout(() => hub.classList.add('show'), 200);
        setTimeout(() => {
          cleanLines.forEach((c,i) => setTimeout(() => c.line.classList.add('show'), i * 80));
        }, 500);
      }
    },
  ];

  let step = -1;

  // Build dots
  steps.forEach((_,i) => {
    const d = document.createElement('div');
    d.className = 'step-dot';
    dotsEl.appendChild(d);
  });

  function advance() {
    if (step >= steps.length - 1) {
      // loop back
      step = -1;
      clientNodes.forEach(n => n.classList.remove('show'));
      serverNodes.forEach(n => n.classList.remove('show'));
      messLines.forEach(m => m.line.classList.remove('show'));
      cleanLines.forEach(c => c.line.classList.remove('show'));
      hub.classList.remove('show');
      bigX.classList.remove('show');
      document.getElementById('lbl-clients').classList.remove('show');
      document.getElementById('lbl-servers').classList.remove('show');
      Array.from(dotsEl.children).forEach(d => d.classList.remove('active'));
      tag.classList.remove('show');
      title.classList.remove('show');
      caption.classList.remove('show');
      setTimeout(advance, 400);
      return;
    }
    step++;
    const s = steps[step];

    // Update UI
    tag.classList.remove('show'); title.classList.remove('show'); caption.classList.remove('show');
    setTimeout(() => {
      tag.textContent = s.tag; tag.classList.add('show');
      title.innerHTML = s.title; title.classList.add('show');
      caption.innerHTML = s.caption; caption.classList.add('show');
    }, 100);

    Array.from(dotsEl.children).forEach((d,i) => d.classList.toggle('active', i <= step));
    s.run();
  }

  // Controls
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); advance(); }
    if (e.key === 'ArrowLeft' && step > 0) {
      // Go back to start and replay up to step-1
      const target = step - 1;
      step = -1;
      clientNodes.forEach(n => n.classList.remove('show'));
      serverNodes.forEach(n => n.classList.remove('show'));
      messLines.forEach(m => m.line.classList.remove('show'));
      cleanLines.forEach(c => c.line.classList.remove('show'));
      hub.classList.remove('show');
      bigX.classList.remove('show');
      document.getElementById('lbl-clients').classList.remove('show');
      document.getElementById('lbl-servers').classList.remove('show');
      Array.from(dotsEl.children).forEach(d => d.classList.remove('active'));
      setTimeout(() => { for (let i = 0; i <= target; i++) advance(); }, 100);
    }
  });
  document.addEventListener('click', advance);

  init();
  // Auto-start with the caption visible
  caption.classList.add('show');
</script>

</body>
</html>`;
