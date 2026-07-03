# Deployment, Operations & Security

> **File:** `docs/06_DEPLOYMENT_AND_OPS.md`  
> Refs: [Vercel Docs](https://vercel.com/docs) · [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile) · [Arcjet Docs](https://docs.arcjet.com) · [Playwright Docs](https://playwright.dev)

---

## 1. Environment Variables

### 1.1 Tabel Konfigurasi Lengkap

| Variabel | Platform | Scope | Deskripsi |
|---|---|---|---|
| `SUPABASE_URL` | Vercel + GitHub | Public | Endpoint REST API Supabase PostgreSQL |
| `SUPABASE_SERVICE_ROLE_KEY` | GitHub Actions **ONLY** | Secret | Bypass RLS untuk penulisan data AGC otonom. **Jangan expose ke Vercel.** |
| `SUPABASE_ANON_KEY` | Vercel | Public | Client-side anonymous key untuk query read-only |
| `DUITKU_MERCHANT_CODE` | Vercel | Secret | Kode merchant terdaftar di Duitku |
| `DUITKU_API_KEY` | Vercel | Secret | API key Duitku untuk tanda tangan signature transaksi |
| `DUITKU_CALLBACK_URL` | Vercel | Public | Endpoint callback Duitku: `/api/payment/duitku-callback` |
| `FONNTE_TOKEN` | Vercel | Secret | Token API Fonnte untuk notifikasi WA transaksional |
| `GEMINI_API_KEY` | GitHub Actions | Secret | Token Google AI Studio (free tier) |
| `OPENROUTER_API_KEY` | GitHub Actions | Secret | Fallback multi-model AI router |
| `GROK_API_KEY` | GitHub Actions | Secret | xAI Grok realtime news extraction |
| `VERCEL_REVALIDATE_SECRET` | Vercel + GitHub | Secret | Kunci enkripsi webhook ISR trigger |
| `VERCEL_REVALIDATE_URL` | GitHub | Secret | Full URL endpoint webhook revalidasi Vercel |
| `ALPHA_VANTAGE_KEY` | GitHub Actions | Secret | API Key untuk financial exchange ingestion feed |
| `RAPIDAPI_KEY` | GitHub Actions | Secret | Master API Key untuk API Football dan provider RapidAPI lainnya |

### 1.2 Setup Duitku Webhook Endpoint — `POST /api/payment/duitku-callback`

Webhook ini bertindak sebagai penerima notifikasi real-time dari Duitku setelah pengguna lokal melakukan pembayaran.

**Request Parameters (Duitku POST):**
- `merchantCode`: Merchant Code unik merchant.
- `amount`: Nominal pembayaran transaksi.
- `merchantOrderId`: ID order invoice internal.
- `resultCode`: Status transaksi ("00" sukses).
- `signature`: Hash SHA256 (`merchantCode + amount + merchantOrderId + apiKey`) untuk verifikasi validitas request.

**Logika Verifikasi Webhook:**
```typescript
import crypto from 'crypto';

export async function POST(req: Request) {
  const body = await req.json();
  const { merchantCode, amount, merchantOrderId, resultCode, signature } = body;
  
  // Rekonstruksi signature lokal untuk pencocokan keabsahan payload
  const localSignature = crypto.createHash('sha256')
    .update(merchantCode + amount + merchantOrderId + process.env.DUITKU_API_KEY)
    .digest('hex');

  if (signature !== localSignature) {
    return new Response('Unauthorized Signature', { status: 401 });
  }

  if (resultCode === '00') {
    // 1. Update database status invoice ke PAID
    // 2. Trigger workflow penyediaan akun via Trigger.dev ke ResellPortal
    // 3. Kirim notifikasi WA pelanggan via Fonnte API
  }

  return new Response('OK', { status: 200 });
}
```

### 1.3 Setup GitHub Secrets

```
GitHub Repo → Settings → Secrets and variables → Actions → New repository secret

Tambahkan semua variabel dari tabel di atas.
```

### 1.3 Setup Vercel Environment Variables

```
Vercel Dashboard → [Project] → Settings → Environment Variables

Tambahkan:
- SUPABASE_URL        (semua environment)
- SUPABASE_ANON_KEY   (semua environment)
- VERCEL_REVALIDATE_SECRET (production only)
```

### 1.4 `.env.example` Template

```bash
# Supabase
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...   # GitHub Actions ONLY, tidak ke Vercel

# AI Providers
GEMINI_API_KEY=AIza...
OPENROUTER_API_KEY=sk-or-...
GROK_API_KEY=xai-...

# Vercel ISR
VERCEL_REVALIDATE_SECRET=my-super-secret-token
VERCEL_REVALIDATE_URL=https://[domain].vercel.app/api/revalidate

# Integrations
ALPHA_VANTAGE_KEY=your-alpha-vantage-key
RAPIDAPI_KEY=your-rapidapi-key
```

---

## 2. Security & Compliance

### 2.1 Cloudflare Turnstile Integration

Semua form submission (waiting list, contact) dilindungi Cloudflare Turnstile — CAPTCHA frictionless.

```typescript
// src/components/WaitingListForm.astro (client-side)
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

<form id="waiting-list-form">
  <input type="email" name="email" required />
  <div
    class="cf-turnstile"
    data-sitekey="YOUR_SITE_KEY"
    data-callback="onTurnstileSuccess"
  ></div>
  <button type="submit">Join Waitlist</button>
</form>

<script>
function onTurnstileSuccess(token) {
  document.getElementById('waiting-list-form').dataset.turnstileToken = token;
}
</script>
```

**Ref:** [Cloudflare Turnstile Docs](https://developers.cloudflare.com/turnstile/get-started/)

### 2.2 Arcjet — Rate Limiting & Bot Protection

```typescript
// src/pages/api/waiting-list.ts
import arcjet, { shield, detectBot, slidingWindow } from '@arcjet/next';

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: 'LIVE' }),                    // Block common attacks
    detectBot({ mode: 'LIVE', allow: ['CURL'] }), // Block bots (allow curl for testing)
    slidingWindow({ mode: 'LIVE', interval: '1m', max: 5 }), // 5 req/min per IP
  ],
});

export async function POST(req: Request) {
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
    });
  }

  // ... rest of handler
}
```

**Ref:** [Arcjet Next.js Integration](https://docs.arcjet.com/get-started/nextjs)

### 2.3 Input Sanitization (XSS Prevention)

```javascript
// Di agc-parser.js — sebelum insert ke DB
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window    = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Sanitasi konten dari feed eksternal
const cleanContent = DOMPurify.sanitize(rawContent, { ALLOWED_TAGS: [] }); // Strip all HTML
```

**Ref:** [DOMPurify GitHub](https://github.com/cure53/DOMPurify)

### 2.4 Security Checklist

- [ ] `SUPABASE_SERVICE_ROLE_KEY` tidak ada di Vercel environment
- [ ] Semua API key ada di GitHub Secrets, bukan di kode sumber
- [ ] Cloudflare Turnstile aktif di semua form yang menghadap publik
- [ ] Arcjet rate limiting aktif di semua API endpoints
- [ ] DOMPurify aktif sebelum semua data eksternal masuk ke DB
- [ ] Row Level Security (RLS) aktif di Supabase untuk tabel `posts` (public read) dan `waiting_list` (private)

---

## 3. Testing

### 3.1 Playwright E2E — Hybrid Routing Verification

```typescript
// tests/hybrid-routing.spec.ts
import { test, expect } from '@playwright/test';

test('Pillar 1: E-SIM checkout link valid', async ({ page }) => {
  await page.goto('http://localhost:4321/esim/japan');

  const checkoutBtn = page.locator('a[href*="shop."]');
  await expect(checkoutBtn).toBeVisible();

  const href = await checkoutBtn.getAttribute('href');
  expect(href).toContain('product_id=esim_data_plans');
  expect(href).toContain('test_mode=1');
});

test('Pillar 2: Reputation checkout link valid', async ({ page }) => {
  await page.goto('http://localhost:4321/reputation/jakarta');

  const checkoutBtn = page.locator('a[href*="shop."]');
  await expect(checkoutBtn).toBeVisible();

  const href = await checkoutBtn.getAttribute('href');
  expect(href).toContain('product_id=reputation_management');
});

test('Pillar 3: Solutions checkout link valid', async ({ page }) => {
  await page.goto('http://localhost:4321/solutions/crm-system');

  const checkoutBtn = page.locator('a[href*="shop."]');
  await expect(checkoutBtn).toBeVisible();
});

test('Waiting list form submits correctly', async ({ page }) => {
  await page.goto('http://localhost:4321');
  await page.fill('input[name="email"]', 'test@example.com');
  // Note: Turnstile bypass needed in test environment
});
```

**Run:**
```bash
npx playwright test
npx playwright test --ui   # Visual test runner
```

### 3.2 Biome Lint & Format

```bash
# Check semua file
npx biome check .

# Fix otomatis
npx biome check --apply .

# Format only
npx biome format --write .
```

**Ref:** [Biome CLI Docs](https://biomejs.dev/reference/cli/)

### 3.3 Lighthouse CI

```bash
# Local check
npx lighthouse http://localhost:4321 --output=json --output-path=./lh-report.json

# Parse hasil
node -e "
const r = require('./lh-report.json');
const cats = r.categories;
console.table({
  Performance:   cats.performance.score * 100,
  Accessibility: cats.accessibility.score * 100,
  BestPractices: cats['best-practices'].score * 100,
  SEO:           cats.seo.score * 100,
});
"
```

---

## 4. Sprint Backlog

### Sprint 1 — Foundation Setup

- [ ] **Task 1: DNS Setup & Verification**
  - Arahkan CNAME `@` (root) ke Vercel DNS
  - Arahkan CNAME `shop` ke `panel.resellportal.com`
  - Verifikasi propagasi: `dig CNAME shop.[domain].com`

- [ ] **Task 2: Database Initialization**
  - Buka Supabase Dashboard → SQL Editor
  - Paste dan jalankan DDL dari `docs/03_DATABASE_SCHEMA.md`
  - Verifikasi 4 tabel terbuat dan seed data tersimpan

- [ ] **Task 3: GitHub Actions & Secrets**
  - Tambahkan semua 7 secrets ke GitHub Repository Secrets
  - Jalankan workflow manual pertama kali via `workflow_dispatch`
  - Verifikasi log runner: tidak ada error, `automation_logs` terisi

- [ ] **Task 4: Astro Layout & Design Tokens**
  - Buat `tailwind.config.ts` dengan tokens dari `ux_design_token.json`
  - Implementasikan layout dasar dengan Lenis smooth scroll
  - Buat komponen reusable: `<HeroSection>`, `<PillarCard>`, `<CheckoutButton>`

### Sprint 2 — Programmatic Pages

- [ ] **Task 5:** Build `/esim/[country].astro` dengan product data + JSON-LD
- [ ] **Task 6:** Build `/reputation/[city].astro` dengan LocalBusiness schema
- [ ] **Task 7:** Build `/solutions/[service_slug].astro` + FAQ schema
- [ ] **Task 8:** Build `/blog/[slug].astro` mengambil data dari Supabase

### Sprint 3 — Pipeline & SEO

- [ ] **Task 9:** Deploy dan test GitHub Actions pipeline end-to-end
- [ ] **Task 10:** Setup Google Search Console + submit sitemap
- [ ] **Task 11:** Generate dan upload Google Service Account untuk Indexing API
- [ ] **Task 12:** Validasi semua JSON-LD di Rich Results Test

---

## 5. Deployment Checklist

### Pre-Deploy

```bash
# 1. Lint & format
npx biome check --apply .

# 2. Build check
npm run build

# 3. Lighthouse test
npx lighthouse http://localhost:4321 --output=json

# 4. E2E test
npx playwright test
```

### Vercel Deploy

```bash
# Via CLI
npx vercel --prod

# Via Git (otomatis)
git push origin main  # Vercel auto-deploy on push
```

### Post-Deploy Verification

- [ ] Semua rute `/esim`, `/reputation`, `/solutions` load dengan benar
- [ ] Checkout link mengarah ke subdomain yang benar
- [ ] JSON-LD valid di Google Rich Results Test
- [ ] Supabase dapat menerima write dari GitHub Actions
- [ ] Vercel ISR webhook dapat dipanggil dari GitHub Actions

---

## 6. Monitoring & Observability

| Metric | Tool | Threshold |
|---|---|---|
| Uptime | Vercel Analytics | > 99.9% |
| Core Web Vitals | Vercel Speed Insights | LCP < 2.5s, INP < 200ms |
| Pipeline health | `automation_logs` table | Status = SUCCESS setiap 48h |
| Error rate | Supabase logs | 0 ERROR entries dalam 24h |
| Indexing | Google Search Console | Indexed pages meningkat tiap minggu |

### Supabase Health Query

```sql
-- Check pipeline health dari 7 hari terakhir
SELECT
  DATE(run_date) as date,
  COUNT(*) as runs,
  SUM(items_fetched) as total_items,
  COUNT(*) FILTER (WHERE status = 'ERROR') as errors
FROM automation_logs
WHERE run_date > NOW() - INTERVAL '7 days'
GROUP BY DATE(run_date)
ORDER BY date DESC;
```
