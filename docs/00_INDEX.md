# BIZKITDEV — Master Documentation Index

> **Vibe Coding Knowledge Base** · Terakhir diperbarui: 2026-07-03  
> Stack: Astro v4 · Next.js 14 · Supabase · Vercel · Cloudflare · GitHub Actions

Dokumen ini adalah titik masuk utama (*entry point*) seluruh dokumentasi sistem. Setiap AI IDE Agent **wajib** membaca file ini terlebih dahulu sebelum mengerjakan task apapun di repositori ini.

---

## Peta Dokumen

| File | Konten | Prioritas Baca |
|---|---|---|
| [01_RULES_AND_AI_AGENT.md](./01_RULES_AND_AI_AGENT.md) | Cursor Rules, DOD, AI constraints, zero-hardcode policy | 🔴 Wajib Pertama |
| [02_ARCHITECTURE.md](./02_ARCHITECTURE.md) | Tech stack, monorepo structure, API spec, PRD, product catalog | 🔴 Wajib |
| [03_DATABASE_SCHEMA.md](./03_DATABASE_SCHEMA.md) | SQL DDL, Drizzle ORM schema, ERD, indexing | 🟡 Sebelum DB task |
| [04_PIPELINE_AND_SCRIPTS.md](./04_PIPELINE_AND_SCRIPTS.md) | GitHub Actions, LLM Adapter, AGC Parser, classifier | 🟡 Sebelum pipeline task |
| [05_SEO_AND_UX.md](./05_SEO_AND_UX.md) | SEO/AEO/GEO config, Design Tokens, UX Strategy | 🟡 Sebelum frontend task |
| [06_DEPLOYMENT_AND_OPS.md](./06_DEPLOYMENT_AND_OPS.md) | Env vars, security, testing, sprint backlog, SOP | 🟢 Sebelum deploy |

---

## Stack Ringkas

```
Frontend    : Astro v4 (ISR) + Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
Database    : Supabase PostgreSQL + Drizzle ORM
AI Layer    : Gemini Flash 1.5 → OpenRouter → xAI Grok (failover chain)
Automation  : GitHub Actions (cron 48h) + Vercel ISR webhook
Security    : Cloudflare Turnstile + Arcjet
Checkout    : ResellPortal (CNAME subdomain)
Linting     : Biome.js v1.8+ (Rust-powered)
```

---

## Referensi Dokumentasi Resmi

### Platform Inti
| Platform | Docs | Dashboard |
|---|---|---|
| **Vercel** | [vercel.com/docs](https://vercel.com/docs) | [vercel.com/dashboard](https://vercel.com/dashboard) |
| **Supabase** | [supabase.com/docs](https://supabase.com/docs) | [supabase.com/dashboard](https://supabase.com/dashboard) |
| **Cloudflare** | [developers.cloudflare.com](https://developers.cloudflare.com) | [dash.cloudflare.com](https://dash.cloudflare.com) |
| **GitHub** | [docs.github.com](https://docs.github.com) | [github.com](https://github.com) |

### Framework & Library
| Library | Docs | Repo |
|---|---|---|
| **Astro v4** | [docs.astro.build](https://docs.astro.build) | [github.com/withastro/astro](https://github.com/withastro/astro) |
| **Next.js 14** | [nextjs.org/docs](https://nextjs.org/docs) | [github.com/vercel/next.js](https://github.com/vercel/next.js) |
| **Drizzle ORM** | [orm.drizzle.team](https://orm.drizzle.team) | [github.com/drizzle-team/drizzle-orm](https://github.com/drizzle-team/drizzle-orm) |
| **Biome.js** | [biomejs.dev](https://biomejs.dev) | [github.com/biomejs/biome](https://github.com/biomejs/biome) |
| **shadcn/ui** | [ui.shadcn.com](https://ui.shadcn.com) | [github.com/shadcn-ui/ui](https://github.com/shadcn-ui/ui) |
| **Tailwind CSS** | [tailwindcss.com/docs](https://tailwindcss.com/docs) | — |
| **Lenis Scroll** | [lenis.darkroom.engineering](https://lenis.darkroom.engineering) | [github.com/darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) |
| **Framer Motion** | [motion.dev/docs](https://motion.dev/docs) | — |

### AI & API
| Service | Docs | API Key |
|---|---|---|
| **Gemini (Google AI)** | [ai.google.dev/docs](https://ai.google.dev/docs) | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |
| **OpenRouter** | [openrouter.ai/docs](https://openrouter.ai/docs) | [openrouter.ai/keys](https://openrouter.ai/keys) |
| **xAI Grok** | [docs.x.ai](https://docs.x.ai) | [console.x.ai](https://console.x.ai) |

### Keamanan & Tools
| Tool | Docs | Repo |
|---|---|---|
| **Cloudflare Turnstile** | [developers.cloudflare.com/turnstile](https://developers.cloudflare.com/turnstile) | — |
| **Arcjet** | [docs.arcjet.com](https://docs.arcjet.com) | [github.com/arcjet/arcjet-js](https://github.com/arcjet/arcjet-js) |
| **crawl4ai** | [docs.crawl4ai.com](https://docs.crawl4ai.com) | [github.com/unclecode/crawl4ai](https://github.com/unclecode/crawl4ai) |
| **BAML (Boundary-ML)** | [docs.boundaryml.com](https://docs.boundaryml.com) | [github.com/BoundaryML/baml](https://github.com/BoundaryML/baml) |
| **Meilisearch** | [docs.meilisearch.com](https://docs.meilisearch.com) | [github.com/meilisearch/meilisearch](https://github.com/meilisearch/meilisearch) |
| **Playwright** | [playwright.dev](https://playwright.dev) | [github.com/microsoft/playwright](https://github.com/microsoft/playwright) |
| **DOMPurify** | [github.com/cure53/DOMPurify](https://github.com/cure53/DOMPurify) | — |

### SEO & Standards
| Resource | URL |
|---|---|
| **Schema.org** | [schema.org](https://schema.org) |
| **Google Rich Results Test** | [search.google.com/test/rich-results](https://search.google.com/test/rich-results) |
| **web.dev Core Web Vitals** | [web.dev/vitals](https://web.dev/vitals) |
| **Google Indexing API** | [developers.google.com/search/apis/indexing-api/v3/quickstart](https://developers.google.com/search/apis/indexing-api/v3/quickstart) |
| **llms.txt standard** | [llmstxt.org](https://llmstxt.org) |

---

## Variabel Lingkungan (Ringkasan)

> Detail lengkap ada di [06_DEPLOYMENT_AND_OPS.md](./06_DEPLOYMENT_AND_OPS.md#environment-variables)

```bash
SUPABASE_URL                # Endpoint REST API Supabase
SUPABASE_SERVICE_ROLE_KEY   # GitHub Actions only — bypass RLS
GEMINI_API_KEY              # Google AI Studio (free tier)
OPENROUTER_API_KEY          # Fallback multi-model
GROK_API_KEY                # xAI realtime news
VERCEL_REVALIDATE_SECRET    # Webhook ISR trigger
VERCEL_REVALIDATE_URL       # Endpoint webhook Vercel
```

---

## Quick Start

```bash
# 1. Clone & install
git clone [URL_REPO]
cd [NAMA_DIR]
npm install

# 2. Setup env
cp .env.example .env
# isi nilai env di .env (lihat 06_DEPLOYMENT_AND_OPS.md)

# 3. Jalankan pipeline test manual
node scripts/funnel-aggregator.js

# 4. Dev server
npm run dev
# Astro: http://localhost:4321
```

---

*Dokumen ini dihasilkan dan dikelola oleh AI IDE Agent. Untuk perubahan, edit file sumber masing-masing di folder `docs/`.*
