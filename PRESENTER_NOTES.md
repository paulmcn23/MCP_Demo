# MCP Explained — Presenter Script

*11 slides · ~6 minutes · press → to advance*

---

## Slide 1 — Title

Today we're going to look at the Model Context Protocol, or MCP. In the past six to eight months, you've probably heard a lot of people say MCP is a game changer — and they're right. It's one of the most significant advancements in LLM integration, released by Anthropic in late 2024, and it's quickly becoming the standard that the entire industry is rallying behind.

Let me walk you through what it is, why it matters, and how we're using it at Cloudflare.

---

## Slide 2 — Breaking Down M · C · P

Before we dive in, let's break down the name itself — because each word matters.

**Model** — that's just the LLM. A large language model like ChatGPT, Claude, or Gemini. Billions of parameters trained on vast amounts of data. You all use these every day. They're brilliant at conversation, strategising, pulling historical facts. But here's the key limitation — on its own, a model can *write* an email for you, but it can't *send* it. You'd have to copy that email, open Gmail, paste it in, and hit send yourself. The model can't actually *do* anything in the real world.

**Context** — this is the missing ingredient. Think about it: the answers to most questions in life are very different depending on the context. "What should I prioritise this week?" — that answer is completely different depending on whether you're a sales engineer or a backend developer, and whether you're mid-incident or in a quiet sprint. An LLM on its own only knows its training data and whatever you type into the prompt. Context means connecting the model to *your* data — your CRM, your codebase, your databases, your emails. If you ask "what are the most common job titles of new customers this quarter?" — that's impossible without context from Salesforce. Two things happen when you give a model context: first, it can pull in real data to inform its answers. Second — and this is the really exciting part — it moves us from just knowledge towards **action**. Rather than just writing the email, it can create a draft in your Gmail, or even send it outright. That shift from knowledge to action is what makes AI truly useful.

**Protocol** — simply a set of rules. We all know protocols. The protocol when meeting the King is to bow. HTTP defines how a browser talks to a web server. TCP/IP defines how packets travel the internet. MCP defines how AI applications talk to external tools. It's an agreed-upon industry standard — so that Salesforce, Google, Notion, and every other tool provider don't each have to invent their own method of connecting to AI. Think of it like USB — before USB, connecting your computer to a microphone, a webcam, or an external drive was a nightmare. Different ports, different cables, different software for each. USB standardised all of that, and the result was a massive explosion of innovation. MCP is doing the same thing for AI.

---

## Slide 3 — The Problem: Why Do We Need MCP? (Interactive)

*[Press Enter to step through each stage]*

So let's look at what life was like before MCP.

**Step 1:** You have an AI application — let's say AI App 2. Maybe it's an internal agent, or Claude Desktop, or Cursor. It exists on its own.

**Step 2:** Now you want that app to connect to an external tool — say your CRM, or a database. What do you need? A custom implementation for that specific tool. Custom prompt logic to format the requests. Custom tool calls to interact with the API. Custom data access to pull and push information. Every single piece is bespoke. Each external system has its own specific API — its own special definition of how you interact with it. You have to custom-write the code for each one. It's a pain.

**Step 3:** And here's where it really breaks down. You don't just have one AI app — you have three, or ten, or a hundred. And every single one of them needs to rebuild that entire custom chain independently. Three apps means three times the work. A hundred apps? Chaos. This is exactly the problem Anthropic saw, which is why they proposed the Model Context Protocol.

---

## Slide 4 — Architecture: Three Key Components

Let's break down how MCP actually works. Within the components that make up MCP, there are three — the Host, the Client, and the Server. HCS for short.

**Hosts** are LLM applications that want access to tools and data through MCP. Claude Desktop is a host. Cursor is a host. Windsurf is a host. Really, any large language model application can be a host.

**Servers** are lightweight programs that expose different capabilities. A Postgres MCP server gives you read-only database access. An Alpha Vantage MCP server gives you stock market data. A Google Drive server gives you file access. There are now over 20,000 pre-built MCP servers available — and anybody can write them, publish them, and use them.

**Clients** live inside the host and invoke the MCP protocol to maintain a one-to-one connection with each server. The client is what actually speaks the protocol. So: the MCP client lives in the MCP host, invokes the MCP protocol, in order to access MCP servers.

---

## Slide 5 — Inside an MCP Host

Here's what this looks like in practice. Take Claude as the host. Inside it, you have multiple MCP clients, and each client maintains a dedicated connection to an MCP server.

One client might connect to a Google Drive server, another to a Postgres database, another to GitHub and Slack. The host orchestrates everything — but each connection is independent and follows the same protocol. And here's the beauty: you can easily switch the host. If something works with Claude Desktop, it works with Cursor, or with your own custom AI app. The servers don't care who's calling — they just speak MCP.

At Cloudflare, we're seeing this pattern everywhere. Our engineering teams use Cursor and Windsurf as MCP hosts, connecting to internal tools, Git repos, and observability platforms — all through MCP.

---

## Slide 6 — Five Core Primitives

Now let's dive deeper. MCP servers are actually more powerful than just giving your agents tools. There are five core primitives — the building blocks.

On the **server side**, there are three:

- **Prompts** — instructions or templates injected into the LLM's context. They guide how the model approaches certain tasks.
- **Resources** — structured data objects included in the context window. Files, images, API responses, database records — anything the model needs to reference. This is the *context* part of MCP in action.
- **Tools** — executable functions the LLM can call. This is where the *action* happens — querying a database, modifying a file, calling an API, sending that email.

On the **client side**, two more:

- **Roots** — creates a secure channel for file access. The AI can open documents, read code, and analyse data — without unrestricted access to your entire filesystem.
- **Sampling** — enables a server to request the LLM's help. If an MCP server is analysing a database schema and needs to generate a query, it asks the LLM through sampling. This is what makes MCP bidirectional.

---

## Slide 7 — Server Capabilities Deep Dive

Let's zoom in on the server side. Every MCP server exposes its capabilities — Prompts, Resources, and Tools — and here's the key: the LLM discovers these **dynamically** at connection time.

Here's what a tool definition looks like. It's just a JSON structure with a name, a description, and the arguments it accepts. The LLM reads this and understands exactly what it can do and what parameters it needs.

This is called **Dynamic Discovery**. The AI client simply asks a server "what can you do?" at runtime. If you add a new tool to your MCP server, the AI picks it up automatically — no redeployment, no config changes. This is what makes MCP fundamentally more powerful than traditional hardcoded API integrations. Every MCP server you build is immediately reusable by any MCP-compatible application.

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

**Step 2:** Previously, integrating N different LLMs with M different tools required N times M custom integrations. Every vendor had to build a separate connector for every tool. You can see the mess of connections — and this is only three by three.

**Step 3:** Now imagine scaling this to a hundred tools. Different authentication methods, breaking API changes, duplicated code everywhere. It simply doesn't scale.

**Step 4:** With MCP, tool builders implement one protocol, and LLM vendors implement the same protocol. Instead of N times M integrations, you get N plus M. That's the magic. Build the connection once, and it works everywhere. Every time you build an MCP server, it's reusable by any MCP-compatible AI application — whether that's an AI assistant, an AI agent, or a desktop IDE.

At Cloudflare, we have dozens of internal tools and services. The idea that each AI integration only needs to implement MCP once, rather than custom connectors for each tool, is transformative for our engineering velocity.

---

## Slide 10 — Practical Example: Claude + Postgres

Let's see this in action. Say we need Claude to analyse data from a Postgres database. We don't need to build a custom integration.

We use an MCP server for Postgres that exposes the database through the protocol's primitives. Claude, through an MCP client, sends a request. The MCP server translates it into a safe SQL query, executes it, and the results flow back into Claude's context.

All while maintaining security — read-only access by default, no direct database credentials exposed to the LLM.

Using an MCP server is surprisingly easy. You grab the server config — usually just a few lines of JSON — paste it into your host application, and you're connected. You can then ask Claude to do things like "plot the coffee stock prices for the past 10 years" and it will use the tool, pull the data, and create the visualisation for you.

At Cloudflare, we're exploring patterns like this for analytics and observability data. Imagine asking your AI assistant "what was the p99 latency for this Worker last week?" and getting the answer pulled directly from our metrics stores.

---

## Slide 11 — Ecosystem & Summary

The ecosystem has exploded. There are now over 20,000 pre-built MCP servers available. Developers have built integrations for Google Drive, Slack, GitHub, Git, Postgres, and many more. SDKs are available in TypeScript and Python, and anybody can write, publish, and use them.

Three things to remember:

1. **One Standard** — MCP replaces the N-by-M integration problem with a single, universal protocol. Like USB-C for AI.
2. **Build Once** — create an MCP server and every compatible AI client can use it immediately. It's plug-and-play.
3. **Open Source** — the spec, the SDKs, and the community are all open. Anyone can contribute.

MCP is positioned to become a foundational technology in the AI landscape — particularly for building sophisticated agentic applications that interact with diverse data sources and tools. And at Cloudflare, we're actively building on it.

One important note — MCP doesn't replace APIs. It's an AI-friendly layer on top. Under the hood, MCP servers are often just wrappers around existing REST APIs. Your existing infrastructure stays exactly the same.

If you want to learn more, check out modelcontextprotocol.io, the GitHub repo, or the full specification.

Thanks everyone.

---

*Total time: approximately 6 minutes at conversational pace.*
