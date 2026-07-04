# Bizkitgrow Platform (CMS & Edge Orchestrator)

> **Status:** Production-Ready (Astro 5 + Vercel Serverless)

Bizkitgrow is an enterprise B2B SaaS authority platform built on a Brutalist Swiss aesthetic. It functions as a headless CMS, programmatic SEO intelligence feed, and global digital infrastructure hub.

## 🏗 System Architecture
The platform is built on a high-performance stack:
- **Framework**: Astro 5 (Server-side rendering enabled via `@astrojs/vercel/serverless`)
- **Database**: PostgreSQL (hosted on Supabase) via Drizzle ORM
- **Styling**: Tailwind CSS with Flowbite integration
- **Design System**: Brutalist Swiss (Monochromatic `#000000` canvas, `Plus Jakarta Sans`, `JetBrains Mono` for data displays, high-density telemetry matrix)
- **Deployment**: Vercel (Edge Distribution)

### Core Pillars
1. **Connectivity**: Global eSIM infrastructure routing across 190+ sovereign networks (`/esim/[country]`).
2. **Search Authority**: Automated Google Business Profile optimization and local semantic indexation (`/reputation/[city]`).
3. **Flow Automation**: Operational CRM suite, AI-powered scheduling, and secure e-signature workflows (`/solutions/[service_slug]`).

## 🎨 Frontend & UI/UX Guidelines
The platform strictly adheres to a "Zero Padding Fluff, Signal-Only" Brutalist UI:
- **Canvas/Background**: Strict `#000000` dark mode.
- **Typography**: 
  - `Outfit` (Headings & Impact Text)
  - `JetBrains Mono` (Telemetry, Data Grids, Tags)
  - `Plus Jakarta Sans` (Body Prose)
- **Components**: Flowbite component structure, overriding default styles to remove soft curves or low-contrast aesthetics.
- **Layout**: High-density information architecture, similar to a Bloomberg terminal or a hacker telemetry matrix but modernized for B2B executives.

### Important Pages
- `src/pages/index.astro`: Main Ecosystem Hub Landing Page.
- `src/pages/admin/*`: Internal CMS Dashboard (Protected).
- `src/pages/blog/[slug].astro`: Content Generation (AGC) Article View with integrated AI paraphraser hooks.

## 🚀 Setup & Development

### Local Environment
1. Copy `.env.example` to `.env` and fill in the required keys.
2. Ensure you have the corresponding Supabase PostgreSQL instance running.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

### Database Management
To apply schema changes to your database:
```bash
npx drizzle-kit push
```

## 🔐 Security Notice
This repository is sanitized for public access. 
- Do not commit `.env` or `mcp.json` files.
- The `docs/` folder containing private operational playbooks has been intentionally untracked.
