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
<title>MCP Demo — Cloudflare</title>
<style>
  /* ── Reset & Base ───────────────────────────────────── */
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body { height:100%; overflow:hidden; font-family:'Inter',system-ui,-apple-system,sans-serif; background:#0a0a0a; color:#e4e4e7; }

  /* ── Google Fonts ───────────────────────────────────── */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  /* ── Slide Container ────────────────────────────────── */
  .deck { position:relative; width:100vw; height:100vh; }
  .slide {
    position:absolute; inset:0;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    padding:3rem 4rem;
    opacity:0; transform:translateY(30px) scale(0.97);
    transition: opacity 0.6s cubic-bezier(.4,0,.2,1), transform 0.6s cubic-bezier(.4,0,.2,1);
    pointer-events:none;
  }
  .slide.active {
    opacity:1; transform:translateY(0) scale(1);
    pointer-events:auto;
  }

  /* ── Typography ─────────────────────────────────────── */
  h1 { font-size:3.2rem; font-weight:800; line-height:1.15; text-align:center; }
  h2 { font-size:2.2rem; font-weight:700; line-height:1.25; text-align:center; margin-bottom:1.5rem; }
  h3 { font-size:1.4rem; font-weight:600; margin-bottom:0.75rem; }
  p, li { font-size:1.15rem; line-height:1.7; max-width:52rem; }
  .subtitle { font-size:1.35rem; font-weight:300; opacity:0.7; margin-top:0.75rem; text-align:center; }
  .tag { display:inline-block; background:#f6821f22; color:#f6821f; border:1px solid #f6821f44; border-radius:999px; padding:0.25rem 0.85rem; font-size:0.8rem; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:1rem; }

  /* ── Accent colours ─────────────────────────────────── */
  .orange { color:#f6821f; }
  .blue   { color:#6b9fff; }
  .green  { color:#34d399; }
  .purple { color:#a78bfa; }

  /* ── Diagram / visual blocks ────────────────────────── */
  .diagram {
    display:flex; align-items:center; gap:1rem; margin:2rem 0;
    flex-wrap:wrap; justify-content:center;
  }
  .box {
    background:#18181b; border:1px solid #27272a; border-radius:12px;
    padding:1.1rem 1.6rem; text-align:center; font-weight:500;
    position:relative; min-width:140px;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .box:hover { border-color:#f6821f; box-shadow:0 0 20px #f6821f22; }
  .box .icon { font-size:2rem; margin-bottom:0.4rem; }
  .arrow { font-size:1.8rem; color:#f6821f; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.15)} }

  /* ── Animated flow lines (canvas-like) ──────────────── */
  .flow-grid {
    display:grid; grid-template-columns: repeat(3,1fr); gap:1.5rem;
    margin:2rem 0; max-width:56rem; width:100%;
  }
  .flow-card {
    background:linear-gradient(135deg,#18181b 0%,#1e1e22 100%);
    border:1px solid #27272a; border-radius:14px;
    padding:1.5rem; position:relative; overflow:hidden;
    transition: transform 0.3s, border-color 0.3s;
  }
  .flow-card:hover { transform:translateY(-4px); border-color:#f6821f; }
  .flow-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background:linear-gradient(90deg,#f6821f,#fbad41);
    transform:scaleX(0); transform-origin:left;
    transition:transform 0.4s ease;
  }
  .flow-card:hover::before { transform:scaleX(1); }
  .flow-card h3 { font-size:1.1rem; }
  .flow-card p  { font-size:0.95rem; opacity:0.7; }

  /* ── Product cards ──────────────────────────────────── */
  .products {
    display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
    gap:1.2rem; margin:1.5rem 0; max-width:60rem; width:100%;
  }
  .product {
    background:#18181b; border:1px solid #27272a; border-radius:12px;
    padding:1.2rem; transition: border-color 0.3s, box-shadow 0.3s;
  }
  .product:hover { border-color:#6b9fff; box-shadow:0 0 24px #6b9fff18; }
  .product h3 { color:#6b9fff; font-size:1rem; margin-bottom:0.3rem; }
  .product p  { font-size:0.88rem; opacity:0.65; line-height:1.5; }

  /* ── Code snippet ───────────────────────────────────── */
  pre {
    background:#18181b; border:1px solid #27272a; border-radius:12px;
    padding:1.5rem 2rem; font-family:'JetBrains Mono',monospace;
    font-size:0.88rem; overflow-x:auto; max-width:52rem; width:100%;
    margin:1.5rem 0; line-height:1.7;
  }
  .kw  { color:#f6821f; }
  .str { color:#34d399; }
  .cm  { color:#52525b; }
  .fn  { color:#6b9fff; }

  /* ── Navigation ─────────────────────────────────────── */
  .nav {
    position:fixed; bottom:2rem; left:50%; transform:translateX(-50%);
    display:flex; align-items:center; gap:1rem;
    background:#18181bdd; backdrop-filter:blur(12px);
    border:1px solid #27272a; border-radius:999px;
    padding:0.6rem 1.5rem; z-index:100;
  }
  .nav button {
    background:none; border:none; color:#e4e4e7; font-size:1.4rem;
    cursor:pointer; padding:0.3rem 0.6rem; border-radius:8px;
    transition: background 0.2s;
  }
  .nav button:hover { background:#27272a; }
  .nav button:disabled { opacity:0.25; cursor:default; }
  .nav .counter { font-family:'JetBrains Mono',monospace; font-size:0.85rem; opacity:0.5; min-width:3.5rem; text-align:center; }

  /* ── Dots ────────────────────────────────────────────── */
  .dots { display:flex; gap:6px; }
  .dot {
    width:8px; height:8px; border-radius:50%; background:#3f3f46;
    transition: background 0.3s, transform 0.3s; cursor:pointer;
  }
  .dot.active { background:#f6821f; transform:scale(1.35); }

  /* ── Background decoration ──────────────────────────── */
  .bg-glow {
    position:fixed; width:600px; height:600px; border-radius:50%;
    background:radial-gradient(circle,#f6821f0c 0%,transparent 70%);
    pointer-events:none; z-index:0;
    top:50%; left:50%; transform:translate(-50%,-50%);
  }

  /* ── Bullet list ────────────────────────────────────── */
  ul.bullets { list-style:none; max-width:48rem; width:100%; }
  ul.bullets li { padding:0.65rem 0; padding-left:1.6rem; position:relative; font-size:1.05rem; }
  ul.bullets li::before { content:''; position:absolute; left:0; top:1rem; width:8px; height:8px; border-radius:50%; background:#f6821f; }

  /* ── Animated particles (slide 1 hero) ──────────────── */
  .particles { position:absolute; inset:0; overflow:hidden; z-index:0; }
  .particle {
    position:absolute; width:4px; height:4px; background:#f6821f;
    border-radius:50%; opacity:0;
    animation:float linear infinite;
  }
  @keyframes float {
    0%  { opacity:0; transform:translateY(100vh) scale(0); }
    10% { opacity:0.6; }
    90% { opacity:0.6; }
    100%{ opacity:0; transform:translateY(-10vh) scale(1); }
  }

  /* ── Security callout ───────────────────────────────── */
  .callout {
    background:#f6821f0a; border:1px solid #f6821f33; border-radius:12px;
    padding:1.5rem 2rem; max-width:48rem; width:100%; margin:1.5rem 0;
  }
  .callout h3 { color:#f6821f; }

  /* ── Responsive ─────────────────────────────────────── */
  @media (max-width:768px) {
    h1 { font-size:2rem; }
    h2 { font-size:1.5rem; }
    .slide { padding:2rem 1.5rem; }
    .flow-grid { grid-template-columns:1fr; }
    .products { grid-template-columns:1fr 1fr; }
    pre { font-size:0.78rem; padding:1rem; }
  }
</style>
</head>
<body>

<div class="bg-glow"></div>

<div class="deck" id="deck">

<!-- ══════════ SLIDE 1 — Title ══════════ -->
<div class="slide active" data-slide="0">
  <div class="particles" id="particles"></div>
  <div style="position:relative;z-index:1;text-align:center;">
    <span class="tag">Cloudflare Solutions Engineering</span>
    <h1>The <span class="orange">Model Context Protocol</span></h1>
    <p class="subtitle">How AI agents connect to the real world — and why Cloudflare is the best place to run them.</p>
    <div style="margin-top:2.5rem;opacity:0.4;font-size:0.9rem;">Press <kbd style="background:#27272a;padding:2px 8px;border-radius:4px;">→</kbd> or click <strong>Next</strong> to begin</div>
  </div>
</div>

<!-- ══════════ SLIDE 2 — What is MCP? ══════════ -->
<div class="slide" data-slide="1">
  <span class="tag">Foundations</span>
  <h2>What is the <span class="orange">Model Context Protocol</span>?</h2>
  <p style="text-align:center;opacity:0.7;margin-bottom:2rem;">An open standard that defines how AI agents discover and use external tools, data, and services — like a <strong>universal USB-C port for AI</strong>.</p>
  <div class="diagram">
    <div class="box"><div class="icon">🤖</div>AI Agent<br><small style="opacity:0.5">(Claude, Copilot, Windsurf)</small></div>
    <div class="arrow">→</div>
    <div class="box" style="border-color:#f6821f55;"><div class="icon">🔌</div><span class="orange">MCP Client</span><br><small style="opacity:0.5">Speaks the protocol</small></div>
    <div class="arrow">→</div>
    <div class="box"><div class="icon">⚙️</div>MCP Server<br><small style="opacity:0.5">Exposes tools & data</small></div>
    <div class="arrow">→</div>
    <div class="box"><div class="icon">🌐</div>APIs & Services<br><small style="opacity:0.5">DNS, R2, GitHub…</small></div>
  </div>
</div>

<!-- ══════════ SLIDE 3 — Client-Server Architecture ══════════ -->
<div class="slide" data-slide="2">
  <span class="tag">Architecture</span>
  <h2>Client ↔ Server Architecture</h2>
  <div class="flow-grid">
    <div class="flow-card">
      <h3>🖥️ MCP Client</h3>
      <p>The AI tool the user works in: Cursor, Claude Desktop, Windsurf, Codex. It discovers and calls tools.</p>
    </div>
    <div class="flow-card">
      <h3>📡 Transport</h3>
      <p><strong>Streamable HTTP</strong> (recommended) or legacy SSE. Remote servers use HTTPS; local uses stdio.</p>
    </div>
    <div class="flow-card">
      <h3>🔧 MCP Server</h3>
      <p>Exposes <em>tools</em> (actions), <em>resources</em> (data), and <em>prompts</em> (templates). Can run locally or remotely.</p>
    </div>
  </div>
  <p style="text-align:center;opacity:0.6;margin-top:1rem;">One client can connect to <strong>many servers simultaneously</strong> — each server is a capability boundary.</p>
</div>

<!-- ══════════ SLIDE 4 — Why Not Just APIs? ══════════ -->
<div class="slide" data-slide="3">
  <span class="tag">Comparison</span>
  <h2>Why not just call <span class="blue">REST APIs</span> directly?</h2>
  <ul class="bullets">
    <li><strong class="orange">Discovery</strong> — MCP servers self-describe their capabilities; agents don't need hard-coded schemas.</li>
    <li><strong class="orange">Standardisation</strong> — One protocol for thousands of integrations, instead of bespoke glue code per API.</li>
    <li><strong class="orange">Auth & Governance</strong> — OAuth-based auth, audit logging, and policy enforcement built into the protocol layer.</li>
    <li><strong class="orange">Composability</strong> — An agent can combine tools from 10 different MCP servers in a single workflow.</li>
    <li><strong class="orange">Context Window Efficiency</strong> — Tool descriptions are compact; Cloudflare's Code Mode covers 2,500+ API endpoints in ~1,000 tokens.</li>
  </ul>
</div>

<!-- ══════════ SLIDE 5 — Local vs Remote ══════════ -->
<div class="slide" data-slide="4">
  <span class="tag">Deployment Models</span>
  <h2><span class="green">Local</span> vs <span class="orange">Remote</span> MCP Servers</h2>
  <div class="flow-grid" style="grid-template-columns:1fr 1fr;">
    <div class="flow-card">
      <h3>💻 Local (stdio)</h3>
      <p>Runs on the developer's machine. Fast for personal tooling but hard to audit, version, or share.</p>
      <p style="margin-top:0.5rem;color:#ef4444;font-size:0.9rem;">⚠ Shadow-IT risk — Cloudflare recommends remote servers for production.</p>
    </div>
    <div class="flow-card" style="border-color:#f6821f55;">
      <h3>☁️ Remote (Streamable HTTP)</h3>
      <p>Hosted on Cloudflare Workers. Centrally managed, secured with OAuth, auditable, and globally low-latency.</p>
      <p style="margin-top:0.5rem;color:#34d399;font-size:0.9rem;">✓ Recommended — runs on the same network as your Cloudflare services.</p>
    </div>
  </div>
</div>

<!-- ══════════ SLIDE 6 — Building an MCP Server on Workers ══════════ -->
<div class="slide" data-slide="5">
  <span class="tag">Code</span>
  <h2>Build an MCP Server on <span class="orange">Workers</span></h2>
  <pre><span class="cm">// src/index.ts — A remote MCP server on Cloudflare Workers</span>
<span class="kw">import</span> { <span class="fn">createMcpHandler</span> } <span class="kw">from</span> <span class="str">"agents/mcp"</span>;
<span class="kw">import</span> { z } <span class="kw">from</span> <span class="str">"zod"</span>;

<span class="kw">export default</span> <span class="fn">createMcpHandler</span>({
  <span class="fn">tools</span>: {
    <span class="str">"lookup-zone"</span>: {
      description: <span class="str">"Get zone details by domain name"</span>,
      input: z.object({ domain: z.string() }),
      <span class="kw">async</span> <span class="fn">handler</span>({ domain }, env) {
        <span class="kw">const</span> resp = <span class="kw">await</span> fetch(
          <span class="str">\`https://api.cloudflare.com/client/v4/zones?name=\${domain}\`</span>,
          { headers: { Authorization: <span class="str">\`Bearer \${env.CF_API_TOKEN}\`</span> } }
        );
        <span class="kw">return</span> resp.json();
      }
    }
  }
});</pre>
  <p style="text-align:center;opacity:0.6;">Deploy with <code style="background:#27272a;padding:2px 6px;border-radius:4px;">npx wrangler deploy</code> — your server is live at <code style="background:#27272a;padding:2px 6px;border-radius:4px;">worker.workers.dev/mcp</code></p>
</div>

<!-- ══════════ SLIDE 7 — Cloudflare MCP Products ══════════ -->
<div class="slide" data-slide="6">
  <span class="tag">Product Ecosystem</span>
  <h2>Cloudflare's <span class="blue">MCP Product Stack</span></h2>
  <div class="products">
    <div class="product"><h3>Agents SDK</h3><p>Build stateful AI agents with scheduling, RPC, email, and streaming chat on Workers.</p></div>
    <div class="product"><h3>Code Mode MCP</h3><p>Single server covering the entire Cloudflare API — 2,500+ endpoints in ~1,000 tokens.</p></div>
    <div class="product"><h3>Workers AI</h3><p>Run open-source LLMs, embedding models, and image models at the edge — serverless GPU inference.</p></div>
    <div class="product"><h3>AI Gateway</h3><p>Observe and control AI apps with caching, rate limiting, analytics, and prompt logging.</p></div>
    <div class="product"><h3>Vectorize</h3><p>Managed vector database for AI embeddings. Pairs with Workers AI for RAG pipelines.</p></div>
    <div class="product"><h3>AI Search</h3><p>Fully managed RAG pipelines — ingest, chunk, embed, and search your data automatically.</p></div>
    <div class="product"><h3>MCP Server Portal</h3><p>Cloudflare One gateway consolidating access to multiple MCP servers with OAuth & logging.</p></div>
    <div class="product"><h3>Browser Rendering</h3><p>Headless browser instances for AI data extraction, screenshots, and web automation.</p></div>
  </div>
</div>

<!-- ══════════ SLIDE 8 — Security & Governance ══════════ -->
<div class="slide" data-slide="7">
  <span class="tag">Security</span>
  <h2>MCP <span class="purple">Security & Governance</span></h2>
  <div class="callout">
    <h3>Key Principles</h3>
    <ul class="bullets" style="margin-top:0.75rem;">
      <li><strong>OAuth 2.1</strong> — Every remote MCP server authenticates users before tool access.</li>
      <li><strong>Cloudflare Access</strong> — Use as your OAuth provider; enforce identity-aware policies per tool.</li>
      <li><strong>DLP Integration</strong> — Block sensitive data from being shared with AI apps via Gateway policies.</li>
      <li><strong>Prompt Logging</strong> — Capture and audit AI prompts for compliance visibility.</li>
      <li><strong>Tool-level Authorization</strong> — Grant or restrict specific tools based on user groups or roles.</li>
    </ul>
  </div>
  <p style="text-align:center;opacity:0.5;margin-top:1rem;">Cloudflare recommends remote MCP servers to eliminate shadow-IT risks from local installations.</p>
</div>

<!-- ══════════ SLIDE 9 — Customer Use Cases ══════════ -->
<div class="slide" data-slide="8">
  <span class="tag">Use Cases</span>
  <h2>What Customers Are Building</h2>
  <div class="flow-grid">
    <div class="flow-card">
      <h3>🛡️ SOC Automation</h3>
      <p>AI agents query firewall logs, suggest WAF rules, and apply them — all through MCP tools backed by Workers.</p>
    </div>
    <div class="flow-card">
      <h3>📦 DevOps Copilot</h3>
      <p>Agents manage DNS records, deploy Workers, and configure R2 buckets via a single Code Mode MCP server.</p>
    </div>
    <div class="flow-card">
      <h3>📝 Content Pipelines</h3>
      <p>AI Search + Workers AI + MCP: ingest docs, generate embeddings, and expose them as searchable tools.</p>
    </div>
  </div>
</div>

<!-- ══════════ SLIDE 10 — Call to Action ══════════ -->
<div class="slide" data-slide="9">
  <span class="tag">Next Steps</span>
  <h2>Get Started <span class="orange">Today</span></h2>
  <ul class="bullets" style="margin-bottom:2rem;">
    <li><strong>Try Code Mode</strong> — Connect your IDE to <code style="background:#27272a;padding:2px 6px;border-radius:4px;">https://mcp.cloudflare.com/mcp</code> and manage 2,500+ endpoints.</li>
    <li><strong>Build a Remote MCP Server</strong> — <code style="background:#27272a;padding:2px 6px;border-radius:4px;">npm create cloudflare -- --template=cloudflare/agents/examples/mcp-worker</code></li>
    <li><strong>Explore the Agents SDK</strong> — <a href="https://developers.cloudflare.com/agents/" style="color:#6b9fff;">developers.cloudflare.com/agents</a></li>
    <li><strong>Secure with Access</strong> — Add OAuth + DLP policies via Cloudflare One.</li>
    <li><strong>AI Playground</strong> — Test any MCP server at <a href="https://playground.ai.cloudflare.com" style="color:#6b9fff;">playground.ai.cloudflare.com</a></li>
  </ul>
  <div style="text-align:center;">
    <p style="font-size:1.5rem;font-weight:700;">The future of AI is <span class="orange">agentic</span>.</p>
    <p style="opacity:0.5;margin-top:0.5rem;">And the best place to build it is on Cloudflare's global network.</p>
  </div>
</div>

</div><!-- /deck -->

<!-- ── Navigation ─────────────────────────────────── -->
<nav class="nav">
  <button id="prev" onclick="go(-1)" disabled>◀</button>
  <div class="dots" id="dots"></div>
  <span class="counter" id="counter">1 / 10</span>
  <button id="next" onclick="go(1)">▶</button>
</nav>

<script>
  // ── Slide engine ──
  let current = 0;
  const slides = document.querySelectorAll('.slide');
  const total = slides.length;
  const dots = document.getElementById('dots');
  const counter = document.getElementById('counter');

  // Build dots
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
    document.getElementById('prev').disabled = current === 0;
    document.getElementById('next').disabled = current === total - 1;
  }
  function go(dir) { goTo(current + dir); }

  // Keyboard nav
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });

  // Touch/swipe support
  let touchStartX = 0;
  document.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
  document.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
  });

  // Particles for slide 1
  const pc = document.getElementById('particles');
  if (pc) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (4 + Math.random() * 6) + 's';
      p.style.animationDelay = Math.random() * 8 + 's';
      p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
      pc.appendChild(p);
    }
  }
</script>

</body>
</html>`;
