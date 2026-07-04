# System Architecture, Integrations & API Specification

> **File:** `docs/02_ARCHITECTURE.md`  
> Refs: [Astro Docs](https://docs.astro.build) · [Next.js Docs](https://nextjs.org/docs) · [Vercel Docs](https://vercel.com/docs) · [Supabase Docs](https://supabase.com/docs)

---

## 1. Core Technical Stack

| Layer | Teknologi | Versi | Keterangan |
|---|---|---|---|
| **Root Framework** | Astro | v4.x+ (ISR Mode) | Static site + programmatic pages |
| **Dashboard** | Next.js | v14+ App Router | BFF layer + admin |
| **Checkout** | ResellPortal | CNAME Subdomain | `shop.bizkitgrow.com` |
| **Database Client** | @supabase/supabase-js | v2.x | PostgreSQL managed |
| **ORM** | Drizzle ORM | latest | Pure TypeScript schema |
| **Linting** | Biome.js | v1.8+ | Rust-powered, wajib `check & apply` |
| **AI Primary** | Gemini Flash 1.5 | via Google AI SDK | Free tier primary |
| **AI Fallback 1** | OpenRouter | multi-model | Fallback router |
| **AI Fallback 2** | xAI Grok | grok-beta | Realtime news extraction |

### 1.1 Universal LLM Adapter Architecture

Seluruh pemrosesan teks AI **wajib** melalui satu lapisan abstraksi. Tidak ada SDK model yang diinstansiasi langsung di scripts page/component.

```
scripts/
└── universal-ai-adapter.js    ← SATU-SATUNYA entry point AI
    └── executeAgnosticAiRefinement()  (Gemini -> OpenRouter -> Grok failover chain)
```

**Failover chain:** Grok → Gemini → OpenRouter → Deterministic hardcoded fallback

**Response schema (wajib):** JSON Schema Draft 2020 via Zod/BAML validation

```typescript
// Expected output dari semua provider
interface AIResponse {
  polishedTitle: string;       // Max 70 char, SEO-optimized
  metaDescription: string;     // Max 160 char
  summary: string;             // 2-sentence plain text
}
```

---

## 2. System Architecture Hybrid Pattern

```
┌─────────────────────────────────────────────────────────┐
│                    TRAFFIC ACQUISITION                   │
│            Astro v4 ISR (youragency.com)                 │
│  /esim/[country] · /reputation/[city] · /solutions/[slug]│
└───────────────────────┬─────────────────────────────────┘
                        │ SEO Traffic
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   FULFILLMENT ENGINE                     │
│         ResellPortal (shop.youragency.com)               │
│    CNAME → panel.resellportal.com (3rd party managed)    │
└─────────────────────────────────────────────────────────┘
                        ▲
                        │ GitHub Actions (cron 48h)
┌─────────────────────────────────────────────────────────┐
│                   CONTENT PIPELINE                       │
│  RSS/News API → AGC Parser → Supabase → Vercel ISR Hook │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Monorepo Directory Structure

```
your-agency-monorepo/
├── .github/
│   ├── workflows/
│   │   └── agc-pipeline-workflow.yml   # Pipeline otomasi konten harian
│   └── definition_of_done.md           # Validasi kualitas commit
├── .context                             # AI Agent rules & references (ROOT)
├── public/
│   ├── llms.txt                        # Standar agregasi konteks LLM
│   ├── sitemap.xml                     # Dynamic sitemap
│   └── favicon.ico
├── src/
│   ├── pages/                          # Rute dinamis Astro (ISR)
│   │   ├── index.astro                 # Landing page utama
│   │   ├── esim/
│   │   │   └── [country].astro        # Pilar 1: Connectivity
│   │   ├── reputation/
│   │   │   └── [city].astro           # Pilar 2: Local SEO
│   │   ├── solutions/
│   │   │   └── [service_slug].astro   # Pilar 3: AI Business
│   │   ├── blog/
│   │   │   └── [slug].astro           # AGC articles
│   │   └── api/
│   │       ├── revalidate.ts          # ISR webhook
│   │       └── waiting-list.ts        # Lead capture
│   ├── components/                     # Komponen primitif
│   │   └── ui/                        # shadcn/ui components
│   └── layouts/
├── scripts/
│   ├── main-pipeline.js               # Main ingestion pipeline
│   ├── agc-engine-classifier.js       # Product classification
│   └── universal-ai-adapter.js        # LLM abstraction layer
├── docs/                              # Dokumentasi sistem (folder ini)
├── system_architecture.json           # Config global: DNS, products, routing
├── ux_design_token.json               # Design system tokens
├── seo_aeo_manifest.json              # SEO/AEO/GEO configuration
├── package.json
└── biome.json                         # Biome linting & formatting
```

---

## 4. Product Constitution, Global Targeting & Vision

```yaml
Positioning  : "Borderless Digital Infrastructure Hub for Remote Professionals"
Market       : "Global B2B (US Primary Target, UK, CA, AU, EU) & ID local fallback"
Architecture : "Hybrid Ingestion & Multicurrency Stripe/Duitku Checkout"
Core Values  : "Connectivity, Automated Authority, Scale-on-Demand Tools"
```

### 4.1 Target Market & Multi-Regional (hreflang) Routing
Untuk memaksimalkan CPM iklan dan konversi profitabilitas, sistem dikonfigurasi untuk memprioritaskan pasar dengan RPM/CPM tinggi secara global:
1. **Target Utama (US - United States):** Seluruh rute statis diprioritaskan menggunakan format markup bahasa Inggris US (`hreflang="en-us"`).
2. **Target Sekunder (High RPM English Spheres):** Termasuk UK, Canada, Australia, dan Uni Eropa menggunakan `hreflang` regional yang sesuai.
3. **Mata Uang Hibrida (Multicurrency):**
   - **USD (Stripe Connect):** Default pembayaran global untuk pasar luar negeri (Kartu Kredit, Apple Pay, Google Pay).
   - **IDR (Duitku):** Opsi pembayaran lokal Indonesia untuk menjaring pasar domestik.

### 4.2 Tiga Pilar Produk

#### Pilar 1 — Connectivity & Mobility
Route: `/esim/[country]`
- E-SIM Global Data Plans (one-time package)
- VPN Service (recurring monthly)
- Business Phone Number / Virtual Number (recurring monthly)
- Cloud Storage (recurring monthly)

#### Pilar 2 — Visibility & Google Authority
Route: `/reputation/[city]`
- Reputation Management / GMB (recurring monthly)
- AI Website Builder (recurring monthly)
- Domain Registration (recurring yearly)
- Web Hosting (recurring monthly)
- Web Design Service (fixed project)
- Monthly SEO Service (recurring monthly)
- SMM Services — Likes, Followers (metered usage)
- Social Media Automation (recurring monthly)
- Link in Bio (recurring monthly)

#### Pilar 3 — Operational Automation
Route: `/solutions/[service_slug]`
- AI Business Tools Suite (recurring monthly)
- Invoicing with AI (recurring monthly)
- Appointment Booking (recurring monthly)
- Document Signing Software / eSign (recurring monthly)
- CRM System (recurring monthly)
- WordPress Plugin Installer Pack (recurring monthly)
- Email Marketing (recurring monthly)

---

## 5. Product Requirements (PRD) — User Stories

| ID | User Story | Route | Acceptance Criteria |
|---|---|---|---|
| **US-01** | Sebagai traveler bisnis, saya ingin mencari dan membeli E-SIM instan | `/esim/[country]` | URL checkout membawa `product_id=esim_data_plans` ke subdomain |
| **US-02** | Sebagai pemilik bisnis lokal, saya ingin mencoba demo balasan ulasan AI | `/reputation/[city]` | Widget demo interaktif merespons tanpa menguras kuota AI berbayar |
| **US-03** | Sebagai solopreneur, saya ingin membuat tagihan otomatis berbasis AI | `/solutions/[service_slug]` | Simulasi dashboard dengan tombol konversi terikat SSL subdomain |

---

## 6. Integration Catalog

### 6.1 Open Source Dependencies

| Library | Penggunaan | Repo |
|---|---|---|
| **crawl4ai** | Scraping web → Markdown bersih untuk LLM input | [github.com/unclecode/crawl4ai](https://github.com/unclecode/crawl4ai) |
| **Scrapy** | Parallel scraping skala besar | [github.com/scrapy/scrapy](https://github.com/scrapy/scrapy) |
| **BAML (Boundary-ML)** | Structured LLM output validation dengan Zod schema | [github.com/BoundaryML/baml](https://github.com/BoundaryML/baml) |
| **Meilisearch** | Search-as-you-type untuk direktori SaaS alternatif | [github.com/meilisearch/meilisearch](https://github.com/meilisearch/meilisearch) |
| **Arcjet** | Rate limiting, bot protection, signup shielding | [github.com/arcjet/arcjet-js](https://github.com/arcjet/arcjet-js) |
| **DOMPurify** | Sanitasi HTML input eksternal (anti-XSS) | [github.com/cure53/DOMPurify](https://github.com/cure53/DOMPurify) |
| **Lenis** | Smooth scroll engine (sync dengan WebGL loop) | [github.com/darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) |
| **Framer Motion** | Micro-interactions & animasi | [github.com/framer/motion](https://github.com/framer/motion) |
| **GSAP** | Magnetic effects & complex animations | [greensock.com/gsap](https://greensock.com/gsap) |

### 6.2 Duitku Payment Gateway (Indonesia Direct Local Payments)

Untuk pasar lokal Indonesia, platform menggunakan **Duitku** sebagai gateway pembayaran lokal dengan sistem *Pay-as-you-go* (Zero-Cost Monthly Fee) melalui Sandbox testing environment gratis.

```
Pelanggan Lokal (IDR) ──> Form Checkout Duitku (Next.js) ──> Proses Duitku
                                                                │
    Order Aktif & Notifikasi <── Callbacks Webhook (POST) <─────┘
```

Mendukung e-wallet lokal (OVO, GoPay, Dana, LinkAja, ShopeePay), QRIS, Virtual Account bank transfer, serta retail outlet counter.

### 6.3 RSS Input & Public API Feeds (Zero-Cost Ingestion)

Alih-alih menggunakan API berita komersial berbayar, sistem memanfaatkan feed RSS gratis yang bersumber dari repositori publik dan platform komunitas:
- **Reddit RSS Feed:** Ingest konten dari `/r/digitalnomad/.rss` dan `/r/saas/.rss` untuk melacak tren industri nomad.
- **HeadlineFeed / NewsMesh Free Tier:** Mendukung 25 request/hari untuk asupan artikel terpoles.
- **Affiliate Tactic Integration (`Affitor/affiliate-skills`):** Kumpulan taktik terdistilasi untuk mengidentifikasi program afiliasi ber-margin tinggi dan mengotomatisasi riset kata kunci produk.

### 6.4 Trigger.dev v3 & Pipedream (Durable Workflow Engine)

Menjalankan asinkronisasi antrean pasca-pembayaran dari Stripe/Duitku dan memicu API provisioning ResellPortal secara andal tanpa menyentuh batas timeout serverless:
- **Trigger.dev:** 10.000 run gratis/bulan menggunakan workflow berbasis TypeScript.
- **Resend:** 3.000 email transaksional gratis/bulan untuk pengiriman akun & QR Code.
- **Fonnte:** WhatsApp transaksional gateway untuk notifikasi otomatis langsung ke ponsel user.

---

## 7. API Specification

### 7.1 Webhook Revalidasi Vercel — `POST /api/revalidate`

Dipanggil oleh GitHub Actions setelah konten baru tersimpan di Supabase, untuk memicu ISR Astro.

**Headers:**
```
Authorization: Bearer <VERCEL_REVALIDATE_SECRET>
Content-Type: application/json
```

**Request body:**
```json
{
  "path": "/blog/[slug]",
  "tag": "posts"
}
```

**Response (200 OK):**
```json
{
  "revalidated": true,
  "timestamp": "2026-07-03T21:01:50Z"
}
```

### 7.2 Waiting List Endpoint — `POST /api/waiting-list`

Lead capture dari landing page utama.

**Request body:**
```json
{
  "email": "user@domain.com",
  "business_name": "Acme Corp Ltd",
  "targeted_service": "reputation_management"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Registration completed",
  "lead_id": "uuid-v4-token"
}
```

---

## 8. Frontend Performance Boundaries

| Constraint | Value | Penanganan |
|---|---|---|
| Vercel Hobby timeout | 10 detik max | Proses berat → GitHub Actions |
| Heavy process threshold | > 2.5 detik | Pindah ke runner, Vercel hanya sebagai webhook |
| Lighthouse minimum | 95/100 semua kategori | Astro Islands Architecture = JS minimal |
| LCP target | < 2.5 detik | Preload, `fetchpriority="high"`, no `loading="lazy"` on hero |

### 8.1 Frontend Stack Optimasi

- **Astro Islands Architecture:** JS dikirim ke browser hanya untuk komponen interaktif
- **WebGL/Three.js (opsional):** Jika elemen imersif aktif, gunakan `InstancedMesh` single draw call
- **Smooth Scroll:** Lenis diinisialisasi global, sync dengan canvas render loop

---

## 9. System Architecture JSON (Template)

File ini disimpan di root repo sebagai `system_architecture.json`. **Jangan hardcode nilai ini di kode.**

```json
{
  "tenant_settings": {
    "brand_name": "bizkitgrow",
    "support_email": "support@bizkitgrow.com",
    "parent_company_copyright": "bizkitgrow Operations Global Ltd.",
    "primary_niche": "Global Digital Infrastructure & Automation"
  },
  "routing_architecture": {
    "root_domain": {
      "host": "Vercel",
      "framework": "Astro v4 (ISR Mode)",
      "paths": {
        "/": "Ecosystem Hub Landing Page",
        "/esim/[country]": "Pillar 1: Programmatic Connectivity Router",
        "/reputation/[city]": "Pillar 2: Programmatic Local SEO Hub",
        "/solutions/[service_slug]": "Pillar 3: AI Business Suite Dashboard",
        "/alternatives/[software_name]": "Cross-Pillar SaaS Alternatives Hub",
        "/blog/[slug]": "AGC Article View"
      }
    },
    "fulfillment_subdomain": {
      "host": "ResellPortal_Edge",
      "dns_record": "CNAME shop.bizkitgrow.com → panel.resellportal.com",
      "base_checkout_url": "https://shop.bizkitgrow.com/checkout",
      "global_flags": {
        "test_mode": true,
        "skip_client_email": true
      }
    }
  }
}
```
