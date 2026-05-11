# MCP Explained — Presenter Script

*15 slides · ~15–20 minutes · press → to advance*

---

## Slide 1 — Title


Today we're going to look at the Model Context Protocol, or MCP.

Okay, a quick overview of the structure of today's talk

---

## Slide 2 — Breaking Down M · C · P (Interactive, 5 steps)

Let's break down the name — each word matters.

**[Step 1]** The M stands for **Model**.

**[Step 2]** Now of course when we think Model, what's the first image that comes to mind?

**[Step 3]** Okay, the *real* model. That's the LLM — ChatGPT, Claude, Gemini. Brilliant at conversation and strategy, but on its own it cannot act.

**[Step 4]** **Protocol** — When I meet the King, simply a set of rules. HTTP defines how browsers talk to servers. MCP defines how AI applications talk to external tools. An agreed-upon industry standard.

**[Step 5]** And **Context** — context changes everything. You tell a doctor "I have a headache" and they hand you paracetamol. Add "I fell off a ladder an hour ago" and suddenly you're getting a CT scan. Same question, completely different answer. 
An LLM without context is that doctor without a patient history. 
Connect that LLM to *your* data — your CRM, your databases, your emails — and the answers transform. Put them together: Model Context Protocol.

---

## Slide 3 — The LLM On Its Own

LLMs by themselves cannot take action. You tell gemini to send an email — it says "Sorry, I can't do that." All it can do is predict the next text. 
"My Big Fat Greek..." — "Wedding." That's the ceiling.

---

## Slide 4 — With Tools, AI Models Gain New Capabilities (Interactive)

**Step 1:** The next evolution: combining LLMs with tools. Perplexity lets you chat with an LLM that can search the web. The LLM itself can't do that — they gave it access to an external service.

**Step 2:** Connect the LLM to Salesforce, Gmail, your Wiki — it becomes much more powerful. Any tool becomes accessible.

**Step 3:** Two thinew superpowers . 
First, the LLM can pull in **context** — ask it to analyse your customer data and it queries Salesforce directly. 
Second, it moves from knowledge to **action** — it can draft and send emails, not just write them. 
But here's the problem: puttinmg multiple tools together is complex. 

---

## Slide 5 — The N×M Problem, MCP Standard & Reuse (Interactive)

Without a standard, every connection is bespoke. Let's see this at scale.

**Step 1:** LLM vendors on the left — Anthropic, DeepSeek, OpenAI. Tools on the right — Slack, Google Drive, GitHub.

**Step 2:** N LLMs times M tools = N times M custom integrations. This is only three by three and it's already a mess.

**Step 3:** Now Slack updates their API. Different auth, breaking changes, duplicated code. One service changes and your integrations break.

**Step 4:** MCP is a layer between LLM and services. One unified language. Instead of N times M, you get N plus M. That's the magic.

**Step 5:** Anthropic developed one protocol. The MCP hub becomes a Google Drive MCP Server. Build it once, works everywhere.

**Step 6:** Every MCP server is reusable by any compatible application — AI assistants, agents, IDEs. Build once, reuse everywhere.

---

## Slide 6 — The Evolution of LLMs

Quick recap of the journey. 
Stage 1: LLM alone — can answer questions but can't act. Stage 2: LLMs plus tools — more powerful but fragile, one API change breaks everything. 
Stage 3: LLMs plus MCP — one protocol, all tools, plug and play.

---

## Slide 7 — What is the Model Context Protocol?

The MCP ecosystem has three components: 

**Hosts** are LLM applications — OpenCode, Windsurf, Cursor 
The host contains an **MCP client** that maintains a connection to one or more **MCP servers**.

MCP servers are lightweight programs that expose capabilities — a Google Drive server for file access, a Postgres server for database queries. There are now over 20,000 pre-built servers available.

And the good part: the MCP server is in the hands of the **service provider**. 
Anthropic said "We'll define the standard, you build the servers." That's why every major service provider is now building MCP servers. 
All Anthropic did was create a standard — and the entire industry is building on it.

---

## Slide 8 — Five Building Blocks of MCP

Three things on the **server side**, two on the **client side**.

Client:
- **Roots** — secure, scoped file access without exposing the full filesystem.
- **Sampling** — the server can ask the LLM for help, making MCP bidirectional.


Server:
- **Tools** — functions the client can invoke. Query a database, send a message, search files.
- **Resources** — read-only data exposed by the server. Logs, database records, files the client can query but not change.
- **Prompt Templates** — structured blueprints so users don't have to engineer their own prompts. The server provides best-practice templates.


---

## Slide 9 — What MCP Servers Expose (Server Deep Dive)

Every MCP server exposes Tools, Resources, and Prompt Templates. The key: the LLM discovers these **dynamically** at connection time.

A tool definition is just JSON — name, description, arguments. The LLM reads it and knows exactly what it can do. Add a new tool and the AI picks it up automatically — no redeployment needed. This is **Dynamic Discovery**.

---

## Slide 10 — Practical Example: OpenCode + Google Workspace

We use Google Workspace at Cloudflare every day. With MCP, no custom integration needed — an MCP server for Google Workspace exposes Gmail, Drive, and Calendar. Paste a few lines of JSON config into OpenCode and you can say "draft a reply to the product team's email" or "find the Q3 planning doc." It just works.

---

## Slide 11 — Ecosystem & Summary

Over 20,000 pre-built MCP servers. Google Drive, Slack, GitHub, Postgres, and many more.

Three things: **One Standard** — USB-C for AI. **Build Once** — every compatible client can use it. **Open Source** — anyone can contribute.

MCP doesn't replace APIs — it's an AI-friendly layer on top. Now let's build one on Cloudflare.

---

## Slide 12 — Connected Council: Smart Borough MCP Server

A real project: **Connected Council** — an MCP server for the fictional London Borough of Thornbridge. I do have a Raspberry Pi and physical sensors for this project, but I haven't connected them yet — so today we're working with seeded data in D1. Over 29,000 readings across 5 wards and 23 sensors — air quality, temperature, flood levels, bin fill, parking, noise, energy. The end goal is the Pi feeds real sensor data into D1, but the MCP server and tools are the same either way.

The MCP server exposes 8 tools. The AI discovers them at connection time and picks the right one based on your question. No special prompting needed.

---

## Slide 13 — Live Demo

This is the fun part. I'm running the MCP server locally with `wrangler dev` — same code that deploys to Workers, same D1 database, same MCP protocol. The URL is just `localhost:8790/sse`. I've already added it to my IDE's MCP config.

I'm going to switch to my terminal and ask it some real questions — "What's the air quality in Riverside Ward?", "Compare flood levels between Parklands and Industrial", "Which bins need collecting?" Watch how the LLM reads the tool descriptions, picks the right tool and parameters, the MCP server queries D1, and you get the answer in plain English.

This is the whole point of MCP in action — I built this server once and any AI host can query this borough data. When I'm ready to go live, it's just `wrangler deploy`.

---

## Slide 14 — How MCP Talks

Quick look at how MCP communicates. The current transport is **Streamable HTTP** — the client sends JSON-RPC requests over a standard HTTP POST to a single endpoint. The server can respond inline or upgrade to SSE (Server-Sent Events) for streaming long-running results.

The key point: it's just HTTP. No WebSockets required, no proprietary protocols. Works through firewalls, uses standard OAuth for auth, you can debug it with curl. That's what makes remote MCP servers practical — deploy behind any CDN or load balancer and it just works.

---

## Slide 15 — Deploy & Connect

One command: `npx wrangler deploy`. Live globally on Workers, D1 bound, Durable Objects backing each session. 300+ cities, zero cold starts.

Connect with a few lines of JSON — paste the SSE endpoint URL into any MCP host. Built-in OAuth support for scoped permissions. No local installs needed — it's a remote server on the internet.

Anything with an API can become an MCP server. With Cloudflare you get the global edge, the serverless runtime, and the data layer all in one. Check out the Cloudflare MCP docs to get started. Thanks everyone.

---

*Total time: approximately 15–20 minutes at conversational pace.*
