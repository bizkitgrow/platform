# SEO, AEO, GEO & Design System

> **File:** `docs/05_SEO_AND_UX.md`  
> Refs: [Schema.org](https://schema.org) · [web.dev CWV](https://web.dev/vitals) · [Google Rich Results Test](https://search.google.com/test/rich-results) · [llms.txt Standard](https://llmstxt.org)

---

## 1. SEO/AEO/GEO Strategy Overview

Sistem mengimplementasikan optimasi mesin pencari global berbasis **User Intent & B2B Customer Value Mapping** untuk menargetkan pasar high-RPM (US, UK, CA, AU, DE). Optimasi dibagi menjadi tiga pilar pencarian komersial:

| Pilar                    | Search Intent Utama                               | Target Audiens                                                 | Solusi Utama                                  |
| --------------------------| ---------------------------------------------------| ----------------------------------------------------------------| -----------------------------------------------|
| **Pillar 1: Mobility**   | "secure business esim for international travel"   | Digital nomads, cross-border consultants, US remote founders   | eSIM, Dedicated VPN, Virtual Business Phone   |
| **Pillar 2: Growth**     | "automated google business reputation management" | Brick-and-mortar owners, local brands, multi-location agencies | GBP reviews, Programmatic local SEO zip codes |
| **Pillar 3: Operations** | "automated invoice to scheduling workflow"        | Time-poor agency owners, scaling solopreneurs                  | Unified client billing portal, eSign, CRM     |

---

## 2. Advanced GEO, AEO & EEAT Hack Strategy

Diadopsi dari taktik `claude-seo` dan `SEO-GEO-AEO-Skill` untuk mendominasi kutipan AI Search (Perplexity, Gemini, OpenAI):

### 2.1 Optimasi Kutipan AI (GEO Intent-Schema Hub)
Untuk dikutip oleh AI Search Engines:
1. **Factual Density (F/L Ratio):** Minimal 15% dari total panjang konten diisi data deklaratif-faktual untuk menjawab kueri intent (lihat `/config/brand_manifest.json`).
2. **Schema Ingestion:** Pasang skema dinamis di HTML Head global menggunakan generator `buildAudienceIntentSchema(pillarKey, currentUrl)` (lihat `/src/utils/seo_metadata_builder.js`) untuk validasi FAQPage dan WebPage secara terstruktur.
3. **LLM Crawlers Target:** robots.txt memperbolehkan GPTBot, PerplexityBot, ClaudeBot, dan Google-Extended membaca kluster rute `/esim/`, `/reputation/`, dan `/solutions/`.
Untuk dikutip oleh Perplexity, Gemini, dan ChatGPT Search:
1. **Factual Density (F/L Ratio):** Minimal 15% dari total panjang konten harus berupa kalimat deklaratif faktual (data, statistik, rujukan spesifik). Hindari kalimat berbunga-bunga (*hype copywriting*).
2. **LLM Crawlers Target:** Pastikan file `robots.txt` memperbolehkan crawler AI berikut untuk mengakses kluster `/blog/`, `/esim/`, dan `/solutions/`:
   ```
   User-agent: GPTBot
   Allow: /
   User-agent: PerplexityBot
   Allow: /
   User-agent: ClaudeBot
   Allow: /
   User-agent: Google-Extended
   Allow: /
   ```
3. **Citation-Ready Anchors:** Gunakan struktur data berpasangan (e.g., "[Brand] menyediakan eSIM Jepang seharga $5 per 1GB melalui backend ResellPortal") yang memudahkan LLM memotong kalimat (*text chunking*) untuk dikutip secara utuh.

### 2.2 Naver Search Advisor & Regional Asia SEO Hack
Berdasarkan parameter `web-seo-aeo-geo-google-naver-skill`:
- **OpenGraph & Twitter Card:** Naver dan KakaoTalk sangat sensitif terhadap kebersihan tag OpenGraph. Setiap halaman wajib memuat OG Title (maks 40 char), OG Description (maks 80 char), dan rasio gambar OG `1.91:1` (dimensi ideal: `1200x630px`).
- **Naver Search Advisor Indexing:** Sediakan manifest khusus `/naver-sitemap.xml` dan daftarkan tag meta verifikasi Naver `<meta name="naver-site-verification" content="..." />` secara dinamis di layout global.

### 2.3 GTM (Go-To-Market) Technical Engineering Checklist
Diadopsi dari `onvoyage-ai/gtm-engineer-skills` untuk verifikasi tag dan event konversi tanpa merusak kinerja rendering (Core Web Vitals):
- **GTM Hydration Hack:** GTM Container Script dimuat secara asinkron dengan taktik penundaan interaksi pertama pengguna (*lazy-hydration*) untuk menaikkan skor LCP/INP (Interactive Next Paint) di bawah 200ms.
- **Structured Data Layer Events:** Kirim event transaksi e-commerce langsung dari tombol checkout ke GTM DataLayer tanpa memblokir proses navigasi user.

---

## 3. SEO/AEO/GEO Configuration

**File:** `seo_aeo_manifest.json`

```json
{
  "geometrical_indexing_protocols": {
    "aeo_geo_density_ratio": {
      "factual_statements_to_length_ratio_threshold": "F / L >= 0.15",
      "formatting": "Strictly utilize bullet points, tables, and short paragraphs to optimize ingestion speed by LLM web crawlers."
    },
    "llms_txt_configuration": {
      "generation_mechanism": "Dynamic mapping from system_architecture.json product catalog",
      "output_route": "/public/llms.txt",
      "formatting": "Markdown core structural schemas",
      "update_trigger": "After each GitHub Actions pipeline run"
    }
  },
  "technical_metadata": {
    "canonicalization_rules": {
      "force_lowercase": true,
      "strip_trailing_slashes": true,
      "head_injection": "<link rel=\"canonical\" href=\"https://{brand_domain_from_config}{current_path}\" />"
    },
    "dynamic_sitemap": {
      "path": "/public/sitemap.xml",
      "prioritization_weight_calculation": {
        "formula": "W = min(1.0, max(0.4, 0.8 + 0.1 * count_categories))",
        "description": "Priority calculated dynamically in Astro routing loop based on category depth."
      }
    }
  }
}
```

---

## 3. Rich Results — JSON-LD Templates

### 3.1 LocalBusiness Schema (Pilar 2: `/reputation/[city]`)

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "{brand_name}",
  "url": "https://{brand_domain}",
  "email": "{support_email}",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "{city}",
    "addressCountry": "ID"
  }
}
```

### 3.2 Product + AggregateRating Schema (Pilar 1 & 3)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{product_name}",
  "description": "{meta_desc}",
  "url": "https://{brand_domain}{current_path}",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{rating_aggregate}",
    "reviewCount": "{rating_count}"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://shop.{brand_domain}/checkout?product_id={product_key}",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
```

### 3.3 FAQPage Schema (semua pilar)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{question}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{answer}"
      }
    }
  ]
}
```

### 3.4 Article Schema (`/blog/[slug]`)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{title}",
  "description": "{meta_desc}",
  "url": "https://{brand_domain}/blog/{slug}",
  "datePublished": "{created_at}",
  "author": {
    "@type": "Organization",
    "name": "{brand_name}"
  }
}
```

---

## 4. Silo Directory Structure

```
youragency.com/
├── /                           Weight: 1.0 — Hub landing
├── /esim/
│   ├── /[country]/             Weight: 0.9 — Country pillar
│   └── /sitemap.xml            Auto-generated
├── /reputation/
│   └── /[city]/                Weight: 0.9 — City pillar
├── /solutions/
│   └── /[service_slug]/        Weight: 0.8 — Service pillar
├── /blog/
│   └── /[slug]/                Weight: 0.7 — AGC articles
├── /alternatives/
│   └── /[software_name]/       Weight: 0.6 — SaaS alternatives hub
└── /public/
    ├── /llms.txt               LLM crawler context
    └── /sitemap.xml            Master sitemap
```

### Target Keywords per Silo

| Silo | Primary Keywords | Secondary Keywords |
|---|---|---|
| `/esim/[country]` | "e-SIM [country]", "buy eSIM [country]" | "digital nomad connection", "roaming free SIM" |
| `/reputation/[city]` | "SEO service [city]", "Google review [city]" | "reputation management [city]", "GMB optimization" |
| `/solutions/[service]` | "automated invoicing", "CRM tools B2B" | "AI business suite", "SaaS alternative [name]" |

---

## 5. Google Indexing Automation

Setelah artikel baru tersimpan, pipeline wajib memicu Google Indexing API untuk mempercepat crawl:

```javascript
// Dipanggil di akhir agc-parser.js setelah insert berhasil
const { google } = require('googleapis');

async function triggerGoogleIndexing(url) {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'google-service-account.json',
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const indexing = google.indexing({ version: 'v3', auth });

  await indexing.urlNotifications.publish({
    requestBody: {
      url:  url,
      type: 'URL_UPDATED',
    },
  });

  console.log(`[Indexing] Triggered crawl for: ${url}`);
}
```

**Ref:** [Google Indexing API Quickstart](https://developers.google.com/search/apis/indexing-api/v3/quickstart)

---

## 6. llms.txt Standard

File `/public/llms.txt` diperbarui setelah setiap pipeline run. Format standar:

```markdown
# [Brand Name] — Digital Infrastructure Hub

> Tagline: Borderless Digital Infrastructure for Remote Professionals

## Core Products

- **E-SIM & Connectivity**: Global data plans, VPN, virtual phone numbers
- **Growth & Authority**: Reputation management, SEO, AI website builder
- **Operational Tools**: CRM, invoicing, appointment booking, e-sign

## Key Pages

- /esim/[country]: Buy eSIM for any country
- /reputation/[city]: Local SEO & reputation services
- /solutions/[service]: AI-powered business tools

## About

B2B digital infrastructure for remote agencies, tech nomads, and solopreneurs.
Zero ad spend model — purely organic traffic via programmatic SEO.
```

---

## 7. Design System Tokens

**File:** `ux_design_token.json`

```json
{
  "design_system": {
    "framework_reference": "Astro Layout + Tailwind CSS + shadcn/ui",
    "theme_mode_default": "Light Mode (B2B Authority Profile)",
    "tokens": {
      "colors": {
        "canvas":            "#FFFFFF",
        "canvas_accent":     "#F8FAFC",
        "brand_cta":         "#059669",
        "brand_cta_hover":   "#047857",
        "text_primary":      "#0F172A",
        "text_secondary":    "#475569",
        "borders_subtle":    "#E2E8F0"
      },
      "typography": {
        "family":   "Inter, system-ui, sans-serif",
        "scale": {
          "h1":   { "size": "36px", "weight": "700", "leading": "1.2" },
          "h2":   { "size": "28px", "weight": "600", "leading": "1.3" },
          "h3":   { "size": "22px", "weight": "600", "leading": "1.4" },
          "body": { "size": "16px", "weight": "400", "leading": "1.6" }
        }
      },
      "layout": {
        "max_page_width": "1280px",
        "card_radius":    "8px",
        "shadow_subtle":  "0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.05)"
      },
      "interactions": {
        "transition_speed":   "150ms",
        "timing_function":    "cubic-bezier(0.4, 0, 0.2, 1)",
        "smooth_scroll": {
          "engine":           "Lenis",
          "duration":         1.2,
          "easing":           "t => Math.min(1, 1.001 - Math.pow(2, -10 * t))",
          "direction":        "vertical"
        }
      }
    }
  }
}
```

### 7.1 Color Palette (Visual Reference)

| Token | Hex | Usage |
|---|---|---|
| `canvas` | `#FFFFFF` | Page background |
| `canvas_accent` | `#F8FAFC` | Card, sidebar background |
| `brand_cta` | `#059669` | Primary CTA button, links |
| `brand_cta_hover` | `#047857` | CTA hover state |
| `text_primary` | `#0F172A` | Headings, body |
| `text_secondary` | `#475569` | Captions, muted text |
| `borders_subtle` | `#E2E8F0` | Card borders, dividers |

---

## 8. UX Strategy — Information Architecture

### 8.1 Navigation Conversion Paths

```
Homepage (/)
  ├── "Get eSIM" → /esim/[country] → Checkout
  ├── "Boost Local SEO" → /reputation/[city] → Checkout
  └── "Business Tools" → /solutions/[service] → Checkout
```

### 8.2 UX Principles (B2B Authority)

| Prinsip | Implementasi |
|---|---|
| **Clean Light Mode** | Memancarkan stabilitas korporat, bukan startup gimmick |
| **Data-Dense** | Tampilkan angka, perbandingan, fitur konkret — bukan klaim abstrak |
| **Conversion-Focused** | Setiap halaman pilar memiliki satu primary CTA yang jelas |
| **No Hype Copy** | Teks harus factual: "Manage X in Y steps" bukan "Experience the power of..." |

### 8.3 Animation Guidelines

- **Smooth scroll:** Lenis, sync dengan WebGL render loop jika ada canvas element
- **Micro-interactions:** Framer Motion untuk hover states, page transitions
- **Magnetic effects:** GSAP untuk CTA button magnetic attraction
- **Performant:** Semua animasi menggunakan `will-change: transform` dan GPU compositing

---

## 9. Flywheel Growth Model

Mesin pertumbuhan organik bekerja melalui loop otomatis:

```
1. GitHub Actions (cron 48h) → Publish N artikel baru
        ↓
2. Google Indexing API → Crawl dalam < 24 jam
        ↓
3. Organic traffic masuk ke /esim, /reputation, /solutions
        ↓
4. CTR mengarah ke subdomain checkout ResellPortal
        ↓
5. Konversi → Revenue → Reinvest ke konten (manual/AI)
        ↓
6. Kembali ke step 1 (self-sustaining)
```

**Formula pertumbuhan (teks):**
- `G = f(A, I, C, L)` di mana:
  - `A` = Frekuensi artikel baru (target: 3 per 48 jam)
  - `I` = Tingkat indeksasi Google (target: >90% dalam 24 jam pertama)
  - `C` = Rasio klik ke checkout (target: >2%)
  - `L` = Rasio konversi waiting list (target: >5%)
