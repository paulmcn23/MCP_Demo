# MCP Demo — Interactive Slide Deck

An interactive presentation explaining the **Model Context Protocol (MCP)** to a Cloudflare technical audience (Solutions Engineers). Built as a Cloudflare Worker.

## 10 Slides

1. **Title** — Hero with animated particles
2. **What is MCP?** — Definition with client→server→API flow diagram
3. **Client-Server Architecture** — Transport, clients, servers explained
4. **Why Not REST APIs?** — Discovery, standardisation, governance advantages
5. **Local vs Remote** — Shadow-IT risks vs Cloudflare-hosted servers
6. **Build on Workers** — Code example of a remote MCP server
7. **Cloudflare MCP Products** — Agents SDK, Code Mode, Workers AI, AI Gateway, Vectorize, AI Search, MCP Portal, Browser Rendering
8. **Security & Governance** — OAuth, Access, DLP, prompt logging
9. **Customer Use Cases** — SOC automation, DevOps copilot, content pipelines
10. **Call to Action** — Links and next steps

## Local Development

```bash
npm install
npm run dev
# Opens at http://localhost:8787
```

## Deploy to Cloudflare

```bash
npm run deploy
# or: npx wrangler deploy
```

## Navigation

- **Arrow keys** / **Space** — navigate slides
- **Click dots** — jump to any slide
- **Swipe** — mobile touch support

---

## Deploying via Git Integration (GitHub or GitLab)

Cloudflare Workers Builds supports both **GitHub** and **GitLab** (cloud-hosted instances).

### Option A: GitHub

1. Push this project to a GitHub repo:
   ```bash
   cd /Users/pmcnamara/Documents/Sites/MCP_Demo
   git init
   git add .
   git commit -m "Initial MCP Demo"
   gh repo create MCP_Demo --private --push
   ```
2. In the [Cloudflare dashboard](https://dash.cloudflare.com) → **Workers & Pages** → select your Worker → **Settings** → **Builds** → **Connect** → choose your GitHub repo.
3. Every push to `main` will auto-build and deploy.

### Option B: GitLab

1. Push this project to a GitLab repo:
   ```bash
   cd /Users/pmcnamara/Documents/Sites/MCP_Demo
   git init
   git add .
   git commit -m "Initial MCP Demo"
   git remote add origin git@gitlab.com:YOUR_USERNAME/MCP_Demo.git
   git push -u origin main
   ```
2. In the [Cloudflare dashboard](https://dash.cloudflare.com) → **Workers & Pages** → select your Worker → **Settings** → **Builds** → **Connect** → select **GitLab** → authorize → choose your repo.
3. Every push to `main` will auto-build and deploy.

### Option C: GitLab CI/CD (self-hosted or advanced)

If using a **self-hosted GitLab instance** (not supported by Workers Builds natively), use GitLab CI/CD:

Create a `.gitlab-ci.yml`:

```yaml
deploy:
  image: node:20
  script:
    - npm install
    - npx wrangler deploy
  variables:
    CLOUDFLARE_API_TOKEN: $CLOUDFLARE_API_TOKEN
    CLOUDFLARE_ACCOUNT_ID: $CLOUDFLARE_ACCOUNT_ID
  only:
    - main
```

Set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as CI/CD variables in GitLab → Settings → CI/CD → Variables.

---

## Important Notes

- The Worker name in `wrangler.jsonc` (`mcp-demo`) must match the Worker name in the Cloudflare dashboard when using Git integration.
- Both GitHub and GitLab get the same features: auto-build on push, preview deployments, and status checks.
