# MCP Explained — Presenter Script

*10 slides · ~5 minutes · press → to advance*

---

## Slide 1 — Title

Today we're going to look at the Model Context Protocol, or MCP. It's one of the most significant advancements in LLM integration, released by Anthropic in late 2024, and it's quickly becoming the standard that the entire industry is rallying behind.

---

## Slide 2 — The Problem

So what exactly is MCP, and why do we need it?

At its core, the Model Context Protocol is an open standard that enables seamless integration between AI models — like Claude — and external data sources or tools. It's addressing a fundamental limitation that has held back AI assistants from reaching their full potential.

Before MCP, connecting a model to each new data source required custom implementations. Imagine an AI agent that needs to use a calculator, then a web browser, then a spreadsheet. Each of those connections required a unique, custom-built adapter. It was like teaching the AI a new language for every single tool. And that gets expensive, fast.

MCP solves this by providing a universal, open standard for connecting AI systems with data sources — replacing fragmented integrations with a single protocol. This means we can give AI systems access to databases, file systems, APIs, and other tools in a completely standardised way.

Think of it like USB-C for AI. Your laptop has one port that connects to monitors, drives, and chargers — MCP gives AI apps one standard connection for files, databases, GitHub, Slack, and everything else.

---

## Slide 3 — Architecture: Three Key Components

Let's break down the architecture. MCP follows a client-server model with three key components.

**Hosts** are LLM applications — like Claude Desktop, or tools we use at Cloudflare like Cursor and Windsurf — that provide the environment for connections.

**Clients** are components within the host that establish and maintain one-to-one connections with external servers.

**Servers** are separate processes that provide context, tools, and prompts to these clients, exposing specific capabilities through the standardised protocol.

---

## Slide 4 — Inside an MCP Host

Here's what this looks like in practice. Take Claude as the host. Inside it, you have multiple MCP clients, and each client maintains a dedicated connection to an MCP server.

One client might connect to a Google Drive server, another to a Postgres database, another to GitHub and Slack. The host orchestrates everything — but each connection is independent and follows the same protocol.

At Cloudflare, we're seeing this pattern everywhere. Our engineering teams use Cursor and Windsurf as MCP hosts, connecting to internal tools, Git repos, and observability platforms — all through MCP.

---

## Slide 5 — Five Core Primitives

Now let's dive deeper into the five core primitives that power MCP. These are the building blocks that enable standardised communication between AI models and external systems.

On the **server side**, there are three primitives:

- **Prompts** — instructions or templates that can be injected into the LLM's context. They guide how the model should approach certain tasks.
- **Resources** — structured data objects that can be included in the context window. Files, images, API responses, database records — anything the model needs to reference.
- **Tools** — executable functions that the LLM can call to retrieve information or perform actions. Querying a database, modifying a file, calling an API.

On the **client side**, there are two equally important primitives:

- **Roots** — think of it as creating a secure channel for file access. The AI can open documents, read code, and analyse data files — without giving unrestricted access to your entire file system.
- **Sampling** — this enables a server to request the LLM's help when needed. For example, if an MCP server is analysing your database schema and needs to generate a relevant query, it can ask the LLM through sampling.

This creates a two-way interaction where both the AI and the external tools can initiate requests to each other, making the whole system much more flexible and powerful.

---

## Slide 6 — Server Capabilities Deep Dive

Let's zoom in on the server side. Every MCP server exposes its capabilities — Prompts, Resources, and Tools — and the LLM discovers these dynamically at connection time.

Here's what a tool definition looks like in practice. It's just a JSON structure with a name, a description, and the arguments it accepts. The LLM reads this and understands exactly what it can do and what parameters it needs.

This is what makes MCP so powerful compared to traditional API integrations. The AI doesn't need hardcoded knowledge of each tool — it discovers capabilities on the fly.

This is called **Dynamic Discovery**. The AI client can simply ask a server "what can you do?" at runtime. If you add a new tool to your MCP server, the AI picks it up automatically — no redeployment, no config changes.

---

## Slide 7 — Client Primitives: Roots & Sampling

On the client side, Roots and Sampling are what make MCP secure and bidirectional.

Roots create a controlled sandbox. Your AI assistant can open documents, read your code, analyse data files — but only within the boundaries you've defined. At Cloudflare, this is critical. We need AI tools to have access to project files without exposing sensitive infrastructure.

Sampling is the really interesting one. It flips the direction — instead of the AI always asking the server for data, the server can ask the AI for help. If an MCP server is processing your database schema and needs to generate a SQL query, it asks the LLM through sampling. This two-way flow is what makes MCP fundamentally different from a traditional API.

---

## Slide 8 — The N×M Problem (Interactive)

*[Press Enter to step through each stage]*

Now, the real power of MCP becomes clear when we consider the N-by-M problem it solves.

**Step 1:** Here we have LLM vendors on the left — Anthropic, DeepSeek, OpenAI — and tools on the right — Postgres, Google Drive, GitHub.

**Step 2:** Previously, integrating N different LLMs with M different tools required N times M custom integrations. Every vendor had to build a separate connector for every tool. You can see the mess of connections — and this is only three by three.

**Step 3:** Now imagine scaling this to a hundred tools. Different authentication methods, breaking API changes, duplicated code everywhere. It simply doesn't scale.

**Step 4:** With MCP, tool builders implement one protocol, and LLM vendors implement the same protocol. Instead of N times M integrations, you get N plus M. That's the magic. Build the connection once, and it works everywhere.

At Cloudflare, we have dozens of internal tools and services. The idea that each AI integration only needs to implement MCP once, rather than custom connectors for each tool, is transformative for our engineering velocity.

---

## Slide 9 — Practical Example: Claude + Postgres

Let's look at a practical example. Say we need Claude to analyse data from our Postgres database. We don't need to build a custom integration.

Instead, we use an MCP server for Postgres that exposes the database through the protocol's primitives. Claude, through an MCP client, sends a request. The MCP server translates it into a safe SQL query, executes it, and the results flow back into Claude's context.

All of this happens while maintaining security — read-only access by default, no direct database credentials exposed to the LLM.

At Cloudflare, we're exploring patterns like this for our analytics and observability data. Imagine asking your AI assistant "what was the p99 latency for this Worker last week?" and getting an answer pulled directly from our metrics stores.

---

## Slide 10 — Ecosystem & Summary

The ecosystem is growing rapidly. Developers have already built MCP integrations for Google Drive, Slack, GitHub, Git, Postgres, and many more. There are SDKs available in TypeScript and Python, making it accessible to developers of all backgrounds.

Three things to remember:

1. **One Standard** — MCP replaces the N-by-M integration problem with a single, universal protocol.
2. **Build Once** — create an MCP server and every compatible AI client can use it immediately.
3. **Open Source** — the spec, the SDKs, and the community are all open. Anyone can contribute.

MCP is positioned to become a foundational technology in the AI landscape — particularly for building sophisticated applications that interact with diverse data sources and tools. And at Cloudflare, we're actively building on it.

One important thing to note — MCP doesn't replace APIs. It's an AI-friendly layer on top. Under the hood, MCP servers are often just wrappers around existing REST APIs. So your existing infrastructure stays exactly the same.

If you want to learn more, check out modelcontextprotocol.io, the GitHub repo, or the full specification.

Thanks everyone.

---

*Total time: approximately 5 minutes at conversational pace.*
