# MCP Explained — Presenter Script

*17 slides · ~20–25 minutes · press → to advance*

---

## Slide 1 — Title

Today we're going to look at the Model Context Protocol, or MCP.

Okay, a quick overview of the structure of today's talk

---

## Slide 2 — Breaking Down M · C · P (Interactive, 5 steps)

Before we dive in, let's break down the name itself — because each word matters.

**[Step 1]** The M stands for **Model**.

**[Step 2]** noew of course when we think Model, whats the first image that comes to mind?


**[Step 3]** Okay, the *real* model. That's the LLM — a large language model like ChatGPT, Claude, or Gemini. Billions of parameters trained on vast amounts of data. You all use these every day. They're brilliant at conversation, strategising, pulling historical facts. But on its own it cannot act.

**[Step 4]** **Protocol** — 
When I meet the King
simply a set of rules. 
HTTP defines how browsers talk to servers. 
TCP/IP defines how packets travel the internet. 
MCP defines how AI applications talk to external tools. 
An agreed-upon industry standard.

**[Step 5]** And **Context** — context changes everything. Think about it in human terms: you tell a doctor "I have a headache" and they hand you paracetamol. But add "I fell off a ladder an hour ago" and suddenly you're getting a CT scan. Same question, completely different answer — because the context changed. An LLM without context is that doctor without a patient history. Connect it to *your* data — your CRM, your codebase, your emails, your databases — and the answers transform. Put them together: Model Context Protocol.

---

## Slide 3 — The LLM On Its Own

So let's start with the current state.
 LLMs by themselves are incapable of taking action. What do I mean? If you remember the first ChatGPT — you open up any chatbot and you tell it to send you an email, it won't know how to do that. It'll just say "Sorry, I can't send emails." The most you can do with an LLM is ask it questions — ask it about some historical figure, ask it to strategise, ask it to write something. But it can't actually *do* anything. The only thing an LLM in its current state is good at is predicting the next text. So if I say "My Big Fat Greek…" — the LLM, with all its training data, will determine the next word is "Wedding." That's the most an LLM by itself can do.

---

## Slide 4 — With Tools, AI Models Gain New Capabilities (Interactive)

**Step 1:** The next evolution was developers figuring out how to take LLMs and combine them with tools. Think of a tool like an API — an external service. Most of us are aware that ChatGPT and these other chatbots are now able to search the internet. Perplexity, for example, lets you chat with an LLM that has the ability to fetch information from the web. The LLM itself can't do that — but they've given it access to an external service.

**Step 2:** By connecting the LLM directly to the tools we use every day — Salesforce, Gmail, our internal Wiki — they become a lot more powerful. Any tool becomes accessible. So every time you get an email, you want there to be an entry in a spreadsheet. If you connect that automation to your LLM, it just became a lot more meaningful.

**Step 3:** Two things happen when we connect LLMs to tools. First, they can actually pull in **context**. If you ask it to analyse the most common job titles of new customers, and it's connected to Salesforce, it can pull in that data directly. Second — and this is the really exciting part — it moves us from just knowledge towards **action**. Rather than just writing the email, it can create the draft in Gmail or even send it outright. But here's the frustration: when you want to build an assistant that does multiple things — search the internet, read your emails, summarise documents — you start to become someone who glues a bunch of different tools together. It gets very cumbersome. If you're wondering why we don't have a Jarvis-level assistant yet, this is why.

---

## Slide 5 — The N×M Problem, MCP Standard & Reuse (Interactive)

But here's the catch. Without a standard, every connection is bespoke — custom implementation, custom prompts, custom tool calls, custom data access. Now let's see this at scale — the N-by-M problem.

**Step 1:** Here we have LLM vendors on the left — Anthropic, DeepSeek, OpenAI — and tools on the right — Slack, Google Drive, GitHub. Each one exists independently, and every connection between them requires bespoke work.

**Step 2:** Previously, integrating N different LLMs with M different tools required N times M custom integrations. Every vendor had to build a separate connector for every tool. You can see the mess of connections — and this is only three by three.

**Step 3:** Now imagine Slack updates their API. Or the text service makes a change. If that service is connected to other services in some step-by-step automation you've planned — it becomes a nightmare. Different auth, breaking changes, duplicated code. One service changes and your fragile integrations break. This is why even in the age of LLMs, good engineers will still get paid — because stuff like this exists.

**Step 4:** MCP you can consider it to be a layer between your LLM and the services. This layer translates all those different languages into a unified language that makes complete sense to the LLM. It makes it very simple for the LLM to connect to and access different outside resources. Instead of N times M integrations, you get N plus M. That's the magic.

**Step 5:** And this is what the Model Context Protocol specifically is — an agreed-upon standard. Rather than Salesforce creating their own method, Google their own, Notion their own — Anthropic developed one protocol. Look — the MCP hub becomes a Google Drive MCP Server. Build that server once, and it works everywhere.

**Step 6:** And here's the real power: every time you build an MCP server, it's reusable by any MCP-compatible application. An AI assistant, an AI agent, a desktop IDE — they all just plug in. Build once, reuse everywhere. MCP servers are even more powerful than just tools — people build and sell them.

At Cloudflare, we have dozens of internal tools and services. The idea that each AI integration only needs to implement MCP once, rather than custom connectors for each tool, is transformative for our engineering velocity.

---

## Slide 6 — The Evolution of LLMs

Let's take a step back and look at the whole journey we've just walked through.

Stage 1: just the LLM by itself. It can answer questions and predict text, but it cannot take action. Ask it to send an email — it simply can't.

Stage 2: LLMs plus tools. Developers figured out how to connect LLMs to external services — search engines, email APIs, databases. More powerful, but stacking tools together is fragile and cumbersome. One API change and everything breaks.

Stage 3: LLMs plus MCP. This is the evolution. MCP creates a unified layer between the LLM and the services. It makes it very simple for the LLM to connect to and access different outside resources. One protocol, all tools, plug and play. This is why even in the age of LLMs, good engineers will still get paid — because building robust, standardised integrations like this is what makes systems work at scale.

Now let's dive into the foundations of MCP so you'll understand exactly how to build your own MCP servers.

---

## Slide 7 — What is the Model Context Protocol?

Now let's get into some practicality. You can think of the MCP ecosystem as follows: you have an MCP client, you have the protocol, you have an MCP server, and you have a service.

An **MCP client** is something like OpenCode, Windsurf, Cursor — they are basically the client-facing side, the LLM-facing side of this ecosystem. The **protocol** again is that two-way connection between the client and the server. And the **server** is what translates that external service — its capabilities and what it can do — to the client. That's why between the MCP client and the MCP server there's the MCP protocol.

Now, the next important concept to understand is the client-server architecture. Within the components that make up MCP, there are three different components: the **Host**, the **Client**, and the **Server** — HCS for short. The way they relate to each other is: the host houses the MCP client, which goes through the MCP protocol in order to have access to the MCP server.

**Hosts** are LLM applications that want access to certain data or tools through MCP. OpenCode is an example of a host. Windsurf is an example of a host. You can also have IDEs, AI agents — really any large language model application can be a host.

Now the host wants to use the **MCP servers**, which are the lightweight programs that expose different capabilities. Like a Google Drive server that gives you file access. A Postgres SQL server that provides read-only access to databases, allowing schema inspection and execution of read-only queries. GitLab, Redis, etc. There is a lot. There are now over 20,000 pre-built MCP servers available.

In order for the host to actually have access to these MCP servers, they need to maintain what is called an **MCP client**, which lives inside the host and invokes the MCP protocol to maintain that one-on-one connection with the server. Got it? MCP client lives in MCP host, to invoke the MCP protocol, in order to have access to the MCP servers. The players being HCS — Host, Client, and Server.

But here's the fascinating part, and this is why I think Anthropic is playing 3D chess when they built this: the way this is architected, the MCP server is now in the hands of the **service provider**. So if let's say me and you run a dev tool company — maybe we're doing a database, we're like "Listen, we're going to build the best database company in the world and we want people's LLMs to have access to this database" — it is now on us to construct this MCP server so that the client can fully access it. Anthropic in a way sort of said "Listen, we want our LLMs to be more powerful, more capable, but it's your job to figure this out." And this is why you've noticed all the external service providers are now building different MCP servers, they're building out repos and all this stuff. So this is a big deal in a sense where LLMs are going to be more capable, but from a technological perspective all they did was create a standard — a standard that it seems like all companies and all engineers are going to build upon.

---

## Slide 8 — Five Building Blocks of MCP

Okay, let's now talk about what are the things that are actually contained within an MCP server. Well, there are three major things on the server side. These are **Tools**, **Resources**, and **Prompt Templates** — TRP. And on the client side there are two more: **Roots** and **Sampling**. Five building blocks total.

On the **server side**:

- **Tools** — these are the things we've kind of seen the most of. These are functions and tools that can be invoked by the client. Things like time series intraday, time series daily, symbol search, global quote. Also stuff like sending a message in Gmail, calculator, retrieval and search, sending a message, updating database records. All of these are tools.

- **Resources** — but that is actually not all. You can also have what are called resources, which are read-only data that is exposed by the server. This is data that the client is able to query but cannot change. For example, there are certain files like markdown notes contained within the server that you might want to read. Maybe it's tracking logs. Say every time you're calling a weather app tool and getting that data, you might want to save a record of all the different weather data you've collected. At some point you might want to compile that together and make a visualisation. It would not be very efficient if every single time you had to go collect a weather data point — you'd have to spam the tool over and over again. Resources let you just expose that data directly. They could also contain database records — contracts, meeting recordings, notes.

- **Prompt Templates** — these are structured prompt blueprints so that you don't have to force your user to have to come up with their own prompts. For example, if you are someone who's trying to use an MCP server that's able to summarise a certain transcript from a meeting and then generate a report, you could just write something like "summarise this transcript into key action items, then generate a report." But that probably won't yield the best results. So instead, the people that actually built the MCP server can put within their MCP server a prompt template that is much more fleshed out, that's able to actually extract the insights and generate the report in a much better fashion — so that all the user has to do is input some specifics into that template. This takes the burden of the prompt engineering from the user.

On the **client side**:

- **Roots** — secure file access. The AI can open documents, read code, analyse data — without unrestricted access to your entire filesystem.
- **Sampling** — lets the server ask the LLM for help. If an MCP server is processing a database schema and needs to generate a SQL query, it asks the LLM through sampling. This is what makes MCP bidirectional.

---

## Slide 9 — Client Primitives: Roots & Sampling

On the client side, Roots and Sampling are what make MCP secure and bidirectional.

Roots create a controlled sandbox. Your AI assistant can open documents, read your code, analyse data files — but only within the boundaries you've defined. At Cloudflare, this is critical. We need AI tools to have access to project files without exposing sensitive infrastructure.

Sampling is the really interesting one. It flips the direction — instead of the AI always asking the server for data, the server can ask the AI for help. If an MCP server is processing your database schema and needs to generate a SQL query, it asks the LLM through sampling. This two-way flow is what makes MCP fundamentally different from a traditional API.

---

## Slide 10 — What MCP Servers Expose (Server Deep Dive)

Let's zoom in on the server side. Every MCP server exposes its capabilities — Tools, Resources, and Prompt Templates — and here's the key: the LLM discovers these **dynamically** at connection time.

Here's what a tool definition looks like. It's just a JSON structure with a name, a description, and the arguments it accepts. The LLM reads this and understands exactly what it can do and what parameters it needs.

This is called **Dynamic Discovery**. The AI client simply asks a server "what can you do?" at runtime. If you add a new tool to your MCP server, the AI picks it up automatically — no redeployment, no config changes.

As a full example, you could have a SQLite MCP server. It gives access to a database. You'd have tools that allow you to read, insert, change, and delete information. In addition, there's a resource logging all the changes — so you have a historical track record. And there are prompt templates that incorporate best practices for interacting with that database.

---

## Slide 11 — Practical Example: OpenCode + Google Workspace

Let's see this in action with something we actually use at Cloudflare. We use Google Workspace every day — Gmail, Drive, Calendar.

With MCP, we don't need to build a custom integration. We use an MCP server for Google Workspace that exposes these services through the protocol's primitives. OpenCode, through an MCP client, sends a request. The MCP server calls the appropriate Google API — Gmail, Drive, Calendar — and the results flow back into OpenCode's context.

Using an MCP server is surprisingly easy. You grab the server config — usually just a few lines of JSON — paste it into your host application, and you're connected. You can then ask OpenCode things like "draft a reply to the latest email from the product team" or "find the Q3 planning doc in Drive" and it just works.

---

## Slide 12 — Ecosystem & Summary

The ecosystem has exploded. There are now over 20,000 pre-built MCP servers available. Developers have built integrations for Google Drive, Slack, GitHub, Git, Postgres, and many more. SDKs are available in TypeScript and Python, and anybody can write, publish, and use them.

Three things to remember:

1. **One Standard** — MCP replaces the N-by-M integration problem with a single, universal protocol. Like USB-C for AI.
2. **Build Once** — create an MCP server and every compatible AI client can use it immediately. It's plug-and-play. And remember — the server is in the hands of the service provider.
3. **Open Source** — the spec, the SDKs, and the community are all open. Anyone can contribute.

MCP doesn't replace APIs — it's an AI-friendly layer on top. Under the hood, MCP servers are often wrappers around existing REST APIs. Your existing infrastructure stays exactly the same.

Now let's build one ourselves — on Cloudflare.

---

## Slide 13 — Let's Build an MCP Server on Cloudflare

So we've covered what MCP is, how it works under the hood. Now I want to show you how to actually build one — and we're going to do it on Cloudflare.

When you build MCP servers on Cloudflare, you extend the **McpAgent** class from the Agents SDK. This is really powerful because each instance of your MCP server is backed by a Durable Object — it has its own persistent state and its own SQL database. Your server isn't just stateless request-response; it maintains context across the session.

You pair that with **D1**, which is Cloudflare's serverless SQLite database at the edge. You bind D1 to your Worker and your MCP tools can query it directly — no external database calls, no connection strings, it's all within the Cloudflare network.

And the deployment story is amazing. You run `wrangler deploy` and your MCP server is live globally on Workers. No containers to manage, no cold starts, it just runs at the edge close to your users. The code itself is minimal — you import McpAgent, create a class, define your tools in the `init()` method, and you're done.

---

## Slide 14 — Connected Council: Smart Borough MCP Server

Let me show you a real project I've built called **Connected Council**. It's a smart local authority IoT platform for a fictional London borough called Thornbridge. Think of it as the kind of thing a council would use to monitor their infrastructure.

We have **23 IoT sensors across 5 wards** — Riverside, High Street, Parklands, Industrial Estate, and St Mary's. These sensors measure air quality, temperature, flood levels, bin fill, parking occupancy, street lighting, noise levels, and energy consumption. All that data flows into a **D1 database** — and we've seeded it with over 29,000 readings across 14 days of history.

The MCP server exposes **8 tools**. You can get live readings from any ward, query historical data with hourly or daily aggregation, list active alerts, get a ward status overview, compare two wards on any metric, check sensor health, and list all wards and sensors. The AI discovers all of these automatically through MCP's dynamic discovery.

So you can ask the AI things like "What's the air quality in Riverside Ward?" or "Compare flood levels between Parklands and Industrial over the last 48 hours" — and it picks the right tool, queries D1, and returns the answer. No special prompting needed.

---

## Slide 15 — How It Actually Works (Architecture Deep Dive)

Now let me show you what's actually happening under the hood. This is the full data flow from physical sensors to a natural language answer.

At the top you have the sensors. 23 IoT sensors across 5 wards — measuring temperature, flood levels, bin fill, air quality, parking, noise. In the real deployment, these publish data via MQTT or HTTP.

That data hits the **Cloudflare edge**. A Worker acts as the ingress point — it receives the sensor readings and writes them into **D1**, which is SQLite running at the edge. No external database, no connection strings, no round-trips to a centralised data centre. The data lives where it's processed.

The **MCP server** — also a Worker, built with the McpAgent class — sits right next to D1. When an AI assistant calls one of its tools, it queries D1 directly. Sub-millisecond data access. Alongside that, you have a dashboard on Pages for visual monitoring and an alert pipeline using Queues and Workflows for threshold breaches.

The MCP server speaks to any AI host over **SSE** — Server-Sent Events. Claude Desktop, Windsurf, Cursor, any MCP-compatible application can connect. A council facilities manager opens their AI assistant and asks "Which bins need collecting?" — the LLM calls the right MCP tool, it queries D1, and they get an answer in plain English.

Three things to notice here. First: **no origin server**. There is no VM, no container, no central data centre in this architecture. Everything runs at the Cloudflare edge. Second: this demo touches **over 15 Cloudflare products** — Workers, D1, Durable Objects, Queues, Pages, Cron Triggers, Tunnel, Access — all in one coherent platform. Third: because we built it as an MCP server, **any LLM host can query this data**. We built the server once and it works everywhere. That's the protocol at work.

Let me show you this live...

---

## Slide 16 — Defining Tools in Your MCP Server

Here's what the actual code looks like. You extend `McpAgent` with your environment type — in our case that includes the D1 binding. You create a new `McpServer` instance, and in the `init()` method, you register your tools.

Each tool gets three things: a **name**, a **description** that the LLM reads to understand what the tool does, and a **Zod schema** defining the parameters. The LLM uses the description and schema to decide when and how to call the tool — this is the dynamic discovery we talked about earlier.

Inside the tool handler, you have full access to `this.env.DB` — that's your D1 database binding. You write your SQL, bind your parameters, execute the query, and return the results as a text content block. The MCP protocol handles serialisation and transport.

The pattern is the same for every tool: `this.server.tool()` to register it, Zod for input validation, and your D1 queries inside the handler. You can add as many tools as you need — `query_history`, `list_alerts`, `compare_wards`, `get_sensor_health` — they all follow the same pattern.

---

## Slide 17 — Deploy & Connect

Deploying is one command: `npx wrangler deploy`. Your MCP server is immediately live on Workers globally. The D1 database is bound, Durable Objects back each session for state management. It's running in 300+ cities worldwide with zero cold starts.

To connect, you just need a few lines of JSON config. Every MCP host uses essentially the same format — you give it a name and a URL pointing to your server's SSE endpoint. Paste that into OpenCode, Cursor, Windsurf, Claude Desktop — it works everywhere. That's the beauty of the protocol: build once, connect from anywhere.

Cloudflare also gives you **OAuth** out of the box for MCP servers. The Agents SDK supports scoped permissions so you can control exactly what each client can access — which is a best practice from the MCP spec itself. And because it's a remote MCP server on Workers, you don't need your users to install anything locally. They just connect over the internet.

The possibilities here are enormous. You can build MCP servers for your internal APIs, for customer-facing data, for IoT infrastructure like we've shown — anything that has an API can become an MCP server. And with Cloudflare, you get the global edge, the serverless runtime, and the built-in data layer all in one platform.

Check out the Cloudflare MCP docs for the full getting-started guide. Thanks everyone.

---

*Total time: approximately 20–25 minutes at conversational pace.*
