# Cursor Rules & AI Agent Boundaries

> **File:** `docs/01_RULES_AND_AI_AGENT.md`  
> **Berlaku untuk:** Semua AI IDE Agent yang bekerja di repositori ini  
> **Sumber:** `.cursorrules`, `definition_of_done.md`, runtime abstract  

---

## 1. Master Runtime Abstract — Instruksi Wajib Agen

Instruksi ini adalah **peraturan mutlak** yang harus dipatuhi sebelum menulis satu baris kode pun.

### 1.1 Global System Constants — Zero-Hardcode Compliance

```
❌ DILARANG KERAS:
  - Menulis domain statis di dalam komponen/halaman
  - Menulis nama brand secara hardcode di UI
  - Menulis static checkout path di kode sumber
  - Menyimpan kredensial (API key, secret) di dalam kode atau .env produksi

✅ WAJIB:
  - Semua domain, nama brand, support email → baca dari /system_architecture.json
  - Semua transactional URL → generate runtime dari routing_architecture.fulfillment_subdomain
  - Semua API key → baca dari environment variables
```

### 1.2 Urutan Pembacaan Konteks AI

Setiap sesi baru, AI Agent **wajib** membaca file berikut secara berurutan sebelum mengerjakan apapun:

1. `/.context` (atau `.cursorrules`) — batasan workspace & sistem
2. `/system_architecture.json` — DNS & rute checkout
3. `/config/brand_manifest.json` — Target customer-first value mapping & search intent
4. `/docs/00_INDEX.md` — peta dokumentasi
5. File `docs/` yang relevan dengan task aktif

**Prompt pembuka yang direkomendasikan untuk AI Agent:**

```
Hello AI Agent. We are working under a strict Zero-Cost Hybrid Monorepo architecture.
You must adhere completely to:
1. "/.context" for workspace boundaries and system constraints.
2. "/system_architecture.json" for dns records.
3. "/config/brand_manifest.json" for core search intent clusters and copy tokens.
4. "/.github/definition_of_done.md" for validation standards.

Do not write raw code implementations in pages; load intent matrices from the config JSON systems first.
```

---

## 2. Core Technical Constraints

### 2.1 Security Limits (Non-Negotiable)

| Aturan | Deskripsi |
|---|---|
| **Zero Hardcode** | Tidak ada domain, brand name, atau static path di dalam kode UI |
| **No Raw SDK Init** | AI tidak boleh menginstansiasi SDK model secara langsung (`new GoogleGenAI()` dilarang langsung di pages/components) |
| **Adapter Pattern** | Semua panggilan AI harus melalui `/scripts/ai-provider-adapter.js` |
| **Serverless Timeout** | Max timeout Vercel Hobby: **10 detik**. Proses berat → GitHub Actions |
| **DB Activity** | Wajib write ke `automation_logs` setiap 48 jam (Supabase free tier anti-pause) |

### 2.2 AI Provider Compliance

```
❌ DILARANG:
  const ai = new GoogleGenAI({ apiKey: '...' }); // Langsung di script page/component

✅ WAJIB:
  const { AIProviderAdapter } = require('./ai-provider-adapter');
  const ai = new AIProviderAdapter();
  const result = await ai.polishContent(title, content);
```

---

## 3. Definition of Done (DOD)

Sebelum menandai task sebagai **selesai**, semua kriteria ini **wajib** terpenuhi:

### 3.1 Modularitas & Abstraksi Arsitektur

- [ ] **Dynamic Environment Resolve:** Tidak ada file di `/pages` atau `/components` yang memuat domain statis, nama agensi, atau copyright. Semua parameter ditarik dari `system_architecture.json` atau runtime variables.
- [ ] **AI Provider Compliance:** Tidak ada pemanggilan SDK model secara langsung. Semua panggilan didelegasikan ke `/scripts/ai-provider-adapter.js`.
- [ ] **Silo Structure Integrity:** Semua rute dinamis (Astro/Next.js) memvalidasi kedalaman parameter dan memiliki error handling (`fallback/404`) jika URL parameter salah.
- [ ] **GTM & Analytics Hydration (GTM Hack):** Verifikasi bahwa pemuatan skrip tag manager menggunakan skema *lazy-hydration* untuk menjaga metrik INP tetap di bawah 200ms.

### 3.2 Kepatuhan SEO, AEO, & GEO

- [ ] **Rich Snippet Validation:** Semua halaman dinamis menghasilkan JSON-LD yang valid (lulus [Rich Results Test](https://search.google.com/test/rich-results)).
- [ ] **Naver SEO OG Compliance:** Tag Meta OpenGraph terverifikasi sesuai standar (OG Description maks 80 char, OG Title maks 40 char).
- [ ] **GEO Factual Density (F/L Ratio):** Konten terbitan AGC memiliki rasio fakta-terhadap-panjang (F/L) minimal 15% untuk memudahkan ekstraksi kutipan oleh LLM.
- [ ] **Sitemap & llms.txt Sync:** Rute baru otomatis terdaftar di XML sitemap dinamis dan `/public/llms.txt`.
- [ ] **Canonical Tag:** Layout template menyuntikkan `<link rel="canonical">` yang bersih ke `<head>`.

### 3.3 Batas Performa (Core Web Vitals)

- [ ] **Lighthouse Score:** Minimal **95/100** untuk Performance, Accessibility, Best Practices, dan SEO.
- [ ] **Serverless Execution:** Alur yang memakan > 2.5 detik **wajib** dialihkan ke GitHub Actions runner.
- [ ] **Biome Linting:** Jalankan `biome lint` dan `biome format` — tidak ada error, warning style, atau unused imports.

### 3.4 Tautan Validasi DOD

| Tool | URL |
|---|---|
| Rich Results Test | [search.google.com/test/rich-results](https://search.google.com/test/rich-results) |
| web.dev CWV | [web.dev/vitals](https://web.dev/vitals) |
| Schema.org | [schema.org](https://schema.org) |
| Biome Rules | [biomejs.dev/linter/rules](https://biomejs.dev/linter/rules/) |
| PageSpeed Insights | [pagespeed.web.dev](https://pagespeed.web.dev) |

---

## 4. Coding Standards

### 4.1 Silo Directory Architecture

Rute konten wajib mengikuti pola silo deterministik untuk memperkuat *topical authority*:

```
/esim/[country]           → Target: "e-SIM roaming", "digital nomad connection"
/reputation/[city]        → Target: "SEO service in [city]", "Google Maps review"
/solutions/[service_slug] → Target: "automated invoicing", "CRM tools B2B"
/blog/[slug]              → AGC articles (auto-generated via pipeline)
/alternatives/[name]      → SaaS alternatives hub
```

### 4.2 Schema Wajib per Rute

| Rute | JSON-LD Schema |
|---|---|
| `/esim/[country]` | `Product` + `FAQPage` |
| `/reputation/[city]` | `LocalBusiness` + `Review` |
| `/solutions/[service_slug]` | `SoftwareApplication` + `FAQPage` |
| `/blog/[slug]` | `Article` + `BreadcrumbList` |

### 4.3 Permalink & Canonical Rules

```
✅ Force lowercase URLs
✅ Strip trailing slashes
✅ Inject self-referencing canonical: <link rel="canonical" href="https://{domain}{path}" />
```

---

## 5. AI IDE Handoff SOP (Vibe Coding Loop)

### 5.1 Alur Serah Terima Sesi Pengembangan

```
1. Buka sesi baru
2. Berikan prompt pembuka (lihat Section 1.2)
3. Tunjuk file task aktif: "Kerjakan task X dari /docs/02_ARCHITECTURE.md"
4. AI membaca context, mengidentifikasi constraints, mulai kerja
5. Setelah selesai, validasi DOD (Section 3)
6. Commit dengan message format: "feat(pillar-1): implementasi [fitur] per DOD"
```

### 5.2 Kapan Harus Stop & Minta Review

AI Agent **wajib berhenti** dan meminta review manusia jika:
- Akan memodifikasi `system_architecture.json`
- Akan menambah/mengubah tabel database tanpa file migration
- Akan mengubah logika routing checkout ResellPortal
- Error rate API eksternal melebihi **15% dalam 30 detik** (circuit breaker trigger)
