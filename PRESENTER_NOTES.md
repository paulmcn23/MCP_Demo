# MCP Explained — Presenter Script

*11 slides · ~6 minutes · press → to advance*

---

## Slide 1 — Title

Today we're going to look at the Model Context Protocol, or MCP. It's one of the most significant advancements in LLM integration, released by Anthropic in late 2024, and it's quickly becoming the standard that the entire industry is rallying behind.

---

## Slide 2 — Breaking Down M · C · P

Before we dive into the details, let's break down the name itself — because each word matters.

**Model** — that's just the LLM. A large language model like ChatGPT, Claude, or Gemini. Billions of parameters trained on vast amounts of data. You all use these every day. They're brilliant at conversation, strategising, pulling historical facts. But here's the limitation — on its own, a model can *write* an email for you, but then you need to copy it into Gmail and hit send yourself. It can't actually *do* anything in the real world.

**Context** — this is the key ingredient. Think about it: the answers to most questions in life are very different depending on the context. "What should I prioritise this week?" — that answer is completely different depending on whether you're a sales engineer or a backend developer, and whether you're mid-incident or in a quiet sprint. An LLM on its own only has its training data and whatever you type into the prompt. Context means connecting the model to *your* data — your CRM, your codebase, your databases, your emails. If you ask "what are the most common job titles of new customers this quarter?" — that's impossible without context from Salesforce.

**Protocol** — simply a set of rules. We all know protocols. The protocol when meeting the King is to bow. HTTP defines how a browser should talk to a web server. TCP/IP defines how packets travel across the internet. MCP defines how AI applications should talk to external tools. It's an agreed-upon industry standard — so that Salesforce, Google, Notion, and every other tool provider don't each have to invent their own method of connecting to AI.

---

## Slide 3 — The Problem: Why Do We Need MCP?

So why does this matter? When you connect an LLM directly to the tools we use every day, two powerful things happen.

First — **context**. The model can pull in real data from external tools. Connect it to Salesforce and it can run that customer analysis. Connect it to your Postgres database and it can query your actual metrics. Connect it to your codebase and it understands your architecture.

Second — and this is especially important in the agentic world — **action**. We move beyond just knowledge towards actually doing things. Rather than just writing the email for you, the AI can create the draft directly in your Gmail account, or even send it. Rather than just suggesting a SQL query, it can execute it. This shift from knowledge to action is what makes AI truly useful in day-to-day workflows.

The problem was: before MCP, every single one of these connections required a custom integration. Salesforce built their own method, Google built their own, Notion built their own. An AI agent needing a calculator, a web browser, and a spreadsheet required three completely different adapters — like learning a new language for every tool. That gets expensive fast.

MCP solves this with one universal standard — like USB-C for AI. Your laptop has one port that connects to monitors, drives, and chargers. MCP gives AI apps one standard connection for files, databases, GitHub, Slack, and everything else.

---

## Slide 4 — Architecture: Three Key Components

Let's break down the architecture. MCP follows a client-server model with three key components.

**Hosts** are LLM applications — like Claude Desktop, or tools we use at Cloudflare like Cursor and Windsurf — that provide the environment for connections.

**Clients** are components within the host that establish and maintain one-to-one connections with external servers.

**Servers** are separate processes that provide context, tools, and prompts to these clients, exposing specific capabilities through the standardised protocol.

---

## Slide 5 — Inside an MCP Host

Here's what this looks like in practice. Take Claude as the host. Inside it, you have multiple MCP clients, and each client maintains a dedicated connection to an MCP server.

One client might connect to a Google Drive server, another to a Postgres database, another to GitHub and Slack. The host orchestrates everything — but each connection is independent and follows the same protocol.

At Cloudflare, we're seeing this pattern everywhere. Our engineering teams use Cursor and Windsurf as MCP hosts, connecting to internal tools, Git repos, and observability platforms — all through MCP.

---

## Slide 6 — Five Core Primitives

Now let's look at the five core primitives — the building blocks that make MCP work.

On the **server side**, there are three:

- **Prompts** — instructions or templates injected into the LLM's context. They guide how the model approaches certain tasks.
- **Resources** — structured data objects included in the context window. Files, images, API responses, database records — anything the model needs to reference.
- **Tools** — executable functions the LLM can call. This is where the *action* happens — querying a database, modifying a file, calling an API.

On the **client side**, two more:

- **Roots** — creates a secure channel for file access. The AI can open documents, read code, and analyse data — without unrestricted access to your entire filesystem.
- **Sampling** — enables a server to request the LLM's help. If an MCP server is analysing a database schema and needs to generate a query, it asks the LLM through sampling.

This creates a genuine two-way interaction — both the AI and external tools can initiate requests to each other.

---

## Slide 7 — Server Capabilities Deep Dive

Let's zoom in on the server side. Every MCP server exposes its capabilities — Prompts, Resources, and Tools — and here's the key: the LLM discovers these **dynamically** at connection time.

Here's what a tool definition looks like. It's just a JSON structure with a name, a description, and the arguments it accepts. The LLM reads this and understands exactly what it can do and what parameters it needs.

This is called **Dynamic Discovery**. The AI client simply asks a server "what can you do?" at runtime. If you add a new tool to your MCP server, the AI picks it up automatically — no redeployment, no config changes. This is what makes MCP fundamentally more powerful than traditional hardcoded API integrations.

---

## Slide 8 — Client Primitives: Roots & Sampling

On the client side, Roots and Sampling are what make MCP secure and bidirectional.

Roots create a controlled sandbox. Your AI assistant can open documents, read your code, analyse data files — but only within the boundaries you've defined. At Cloudflare, this is critical. We need AI tools to have access to project files without exposing sensitive infrastructure.

Sampling is the really interesting one. It flips the direction — instead of the AI always asking the server for data, the server can ask the AI for help. If an MCP server is processing your database schema and needs to generate a SQL query, it asks the LLM through sampling. This two-way flow is what makes MCP fundamentally different from a traditional API.

---

## Slide 9 — The N×M Problem (Interactive)

*[Press Enter to step through each stage]*

Now, the real power of MCP becomes clear when we consider the N-by-M problem.

**Step 1:** Here we have LLM vendors on the left — Anthropic, DeepSeek, OpenAI — and tools on the right — Postgres, Google Drive, GitHub.

**Step 2:** Previously, integrating N different LLMs with M different tools required N times M custom integrations. Every vendor built a separate connector for every tool. You can see the mess of connections — and this is only three by three.

**Step 3:** Now imagine scaling this to a hundred tools. Different authentication methods, breaking API changes, duplicated code everywhere. It simply doesn't scale.

**Step 4:** With MCP, tool builders implement one protocol, and LLM vendors implement the same protocol. Instead of N times M integrations, you get N plus M. Build the connection once, and it works everywhere.

At Cloudflare, we have dozens of internal tools and services. The idea that each AI integration only needs to implement MCP once, rather than custom connectors for each tool, is transformative for our engineering velocity.

---

## Slide 10 — Practical Example: Claude + Postgres

Let's see this in action. Say we need Claude to analyse data from a Postgres database. We don't need to build a custom integration.

We use an MCP server for Postgres that exposes the database through the protocol's primitives. Claude, through an MCP client, sends a request. The MCP server translates it into a safe SQL query, executes it, and the results flow back into Claude's context.

All while maintaining security — read-only access by default, no direct database credentials exposed to the LLM.

At Cloudflare, we're exploring patterns like this for analytics and observability data. Imagine asking your AI assistant "what was the p99 latency for this Worker last week?" and getting the answer pulled directly from our metrics stores.

---

## Slide 11 — Ecosystem & Summary

The ecosystem is growing rapidly. Developers have already built MCP integrations for Google Drive, Slack, GitHub, Git, Postgres, and many more. SDKs are available in TypeScript and Python.

Three things to remember:

1. **One Standard** — MCP replaces the N-by-M integration problem with a single, universal protocol.
2. **Build Once** — create an MCP server and every compatible AI client can use it immediately.
3. **Open Source** — the spec, the SDKs, and the community are all open. Anyone can contribute.

One important thing to note — MCP doesn't replace APIs. It's an AI-friendly layer on top. Under the hood, MCP servers are often just wrappers around existing REST APIs. Your existing infrastructure stays exactly the same.

If you want to learn more, check out modelcontextprotocol.io, the GitHub repo, or the full specification.

Thanks everyone.

---

*Total time: approximately 6 minutes at conversational pace.*
