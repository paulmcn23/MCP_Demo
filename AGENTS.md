# AGENTS.md — MCP_Demo

> Last verified: 2026-05-02

## Overview
Interactive slide deck presentation explaining the Model Context Protocol (MCP) to Cloudflare Solutions Engineers. Deployed as a Cloudflare Worker serving a single-page HTML app.

## Commands
- `npm install` — Install dependencies
- `npm run dev` — Start local dev server (port 8787)
- `npm run deploy` — Deploy to Cloudflare Workers via Wrangler

## Structure
- `src/index.ts` — Single Worker entry point; exports HTML slide deck inline
- `wrangler.jsonc` — Wrangler configuration (Worker name, compatibility date)
- `package.json` — Dependencies (wrangler, @cloudflare/workers-types)

## Conventions
- All presentation content is inline HTML/CSS/JS within the Worker response
- No external build step — Wrangler bundles TypeScript directly
- Use Cloudflare Workers runtime APIs only (no Node.js built-ins)

## Boundaries
**Always:**
- Keep the Worker name in `wrangler.jsonc` matching the Cloudflare dashboard
- Test locally with `npm run dev` before deploying

**Never:**
- Import from `node:*` (Workers runtime)
- Add external frontend frameworks — keep it vanilla HTML/CSS/JS for zero dependencies
- Hard-code API tokens in source
