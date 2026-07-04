# GitHub Actions Pipeline & Script Layer

> **File:** `docs/04_PIPELINE_AND_SCRIPTS.md`  
> Refs: [GitHub Actions Docs](https://docs.github.com/en/actions) · [Gemini API Docs](https://ai.google.dev/docs) · [OpenRouter Docs](https://openrouter.ai/docs) · [xAI Grok Docs](https://docs.x.ai)

---

## 1. Pipeline Overview

```
┌─────────────────────────────────────────────────────────────┐
│              GitHub Actions Runner (cron 48h)               │
│                                                             │
│  RSS/News API → [main-pipeline.js]                          │
│                      │                                      │
│                       ├─ Classify product → [classifier.js] │
│                       ├─ Polish content  → [ai-adapter.js]  │
│                       └─ Insert to Supabase PostgreSQL       │
│                                │                            │
│                                └─ Trigger Vercel ISR Webhook │
└─────────────────────────────────────────────────────────────┘
```

**Frekuensi:** Setiap 48 jam (cron `0 0 */2 * *`)  
**Tujuan ganda:** Generate konten SEO + menjaga Supabase tetap aktif (anti-pause)

---

## 2. GitHub Actions Workflow

**File:** `.github/workflows/agc-pipeline-workflow.yml`

```yaml
name: AGC_Automation_Pipeline

on:
  schedule:
    # Eksekusi setiap 48 jam — memenuhi Supabase active write window
    - cron: '0 0 */2 * *'
  workflow_dispatch:
    # Memungkinkan trigger manual dari GitHub UI

jobs:
  ingest_process_revalidate:
    name: Autonomous Ingest & Process & Revalidate
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: |
          npm install rss-parser @supabase/supabase-js @google/generative-ai zod

      - name: Execute Deterministic Parsing & LLM Polishing
        env:
          SUPABASE_URL:              ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          GEMINI_API_KEY:            ${{ secrets.GEMINI_API_KEY }}
          OPENROUTER_API_KEY:        ${{ secrets.OPENROUTER_API_KEY }}
          GROK_API_KEY:              ${{ secrets.GROK_API_KEY }}
          VERCEL_REVALIDATE_SECRET:  ${{ secrets.VERCEL_REVALIDATE_SECRET }}
          VERCEL_REVALIDATE_URL:     ${{ secrets.VERCEL_REVALIDATE_URL }}
          ALPHA_VANTAGE_KEY:         ${{ secrets.ALPHA_VANTAGE_KEY }}
          RAPIDAPI_KEY:              ${{ secrets.RAPIDAPI_KEY }}
        run: |
          node scripts/main-pipeline.js
```

---

## 3. Universal AI Adapter — `scripts/universal-ai-adapter.js`

Lapisan abstraksi tunggal dengan failover dinamis berbasis HTTP Fetch mandiri tanpa dependensi SDK berat. Memastikan efisiensi eksekusi di bawah 2 detik dan format JSON yang kokoh.

```javascript
// scripts/universal-ai-adapter.js
// Agnostic AI Refinement with Failover Routing: Gemini → OpenRouter → Grok
// (Lihat file asli untuk detail payload dan metode parsing regex objek JSON)
```

  // (Proses pemanggilan dinamis dilakukan via executeAgnosticAiRefinement)
```

---

## 4. Product Classifier — `scripts/agc-engine-classifier.js`

Mengklasifikasikan artikel ke salah satu dari 20 produk berdasarkan keyword matching.

```javascript
// scripts/agc-engine-classifier.js
// Deterministic keyword-based product classification

/**
 * Classify article into one of 20 product + route combinations.
 * @param {string} title
 * @param {string} content
 * @returns {{ key: string, category_slug: string }}
 */
function getProductAndRoute(title, content) {
  const text = `${title} ${content}`.toLowerCase();

  // --- PILLAR 1: Connectivity & Mobility ---
  if (text.includes('esim') || text.includes('sim card') || text.includes('roaming'))
    return { key: 'esim_data_plans', category_slug: 'connectivity-mobility' };

  if (text.includes('vpn') || text.includes('proxy') || text.includes('cybersecurity'))
    return { key: 'vpn_service', category_slug: 'connectivity-mobility' };

  if (text.includes('phone number') || text.includes('virtual number') || text.includes('voip'))
    return { key: 'business_phone_number', category_slug: 'connectivity-mobility' };

  if (text.includes('cloud storage') || text.includes('backup') || text.includes('drive'))
    return { key: 'cloud_storage', category_slug: 'connectivity-mobility' };

  // --- PILLAR 2: Growth & Marketing ---
  if (text.includes('gmb') || text.includes('google maps') || text.includes('review') || text.includes('reputation'))
    return { key: 'reputation_management', category_slug: 'local-authority' };

  if (text.includes('seo') || text.includes('backlink') || text.includes('serp'))
    return { key: 'monthly_seo_service', category_slug: 'local-authority' };

  if (text.includes('website builder') || text.includes('landing page'))
    return { key: 'ai_website_builder', category_slug: 'local-authority' };

  if (text.includes('domain') || text.includes('tld'))
    return { key: 'domain_registration', category_slug: 'local-authority' };

  if (text.includes('hosting') || text.includes('vps') || text.includes('cpanel'))
    return { key: 'web_hosting', category_slug: 'local-authority' };

  if (text.includes('web design') || text.includes('ui ux'))
    return { key: 'web_design_service', category_slug: 'local-authority' };

  if (text.includes('social media automation') || text.includes('buffer'))
    return { key: 'social_media_automation', category_slug: 'local-authority' };

  if (text.includes('followers') || text.includes('likes') || text.includes('smm'))
    return { key: 'smm_services', category_slug: 'local-authority' };

  if (text.includes('link in bio') || text.includes('linktree'))
    return { key: 'link_in_bio', category_slug: 'local-authority' };

  // --- PILLAR 3: Operational Automation ---
  if (text.includes('crm') || text.includes('customer relationship'))
    return { key: 'crm_system', category_slug: 'operational-automation' };

  if (text.includes('invoice') || text.includes('billing') || text.includes('payment'))
    return { key: 'invoicing_with_ai', category_slug: 'operational-automation' };

  if (text.includes('booking') || text.includes('appointment') || text.includes('calendar'))
    return { key: 'appointment_booking', category_slug: 'operational-automation' };

  if (text.includes('esign') || text.includes('signature') || text.includes('contract'))
    return { key: 'document_signing_software', category_slug: 'operational-automation' };

  if (text.includes('wordpress') || text.includes('wp plugin'))
    return { key: 'wordpress_plugin_installer_pack', category_slug: 'operational-automation' };

  if (text.includes('email marketing') || text.includes('newsletter'))
    return { key: 'email_marketing', category_slug: 'operational-automation' };

  // Default fallback
  return { key: 'ai_business_tools_suite', category_slug: 'operational-automation' };
}

module.exports = { getProductAndRoute };
```

---

## 5. AGC Parser — `scripts/main-pipeline.js`

Main ingestion pipeline. Membaca RSS, mengklasifikasikan, memoles dengan AI, menyimpan ke Supabase.

```javascript
// scripts/main-pipeline.js
// Main Ingestion & Parser Pipeline utilizing the AI Abstraction Adapter

const RSSParser           = require('rss-parser');
const { createClient }    = require('@supabase/supabase-js');
const { executeAgnosticAiRefinement } = require('./universal-ai-adapter');
const { getProductAndRoute } = require('./agc-engine-classifier');
const fs                  = require('fs');
const path                = require('path');

const rssParser = new RSSParser();
const supabase  = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Load config dari file — no hardcoding
const sysArch = JSON.parse(fs.readFileSync(path.join(__dirname, '../system_architecture.json'), 'utf8'));

async function runPipeline() {
  const startTime    = Date.now();
  let   itemsFetched = 0;

  try {
    // Fetch RSS feed (dapat diganti dengan crawl4ai untuk konten lebih kaya)
    const feed = await rssParser.parseURL(
      'https://news.google.com/rss/search?q=digital+nomad+remote+work+SaaS&hl=en-US'
    );

    // Ambil kategori dari DB untuk mapping slug → id
    const { data: dbCategories } = await supabase.from('categories').select('*');
    const categoryMap = new Map(dbCategories.map(c => [c.slug, c.id]));

    // Proses max 3 artikel per run (rate limit AI)
    for (const item of feed.items.slice(0, 3)) {
      const slug = item.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Skip jika sudah ada
      const { data: existing } = await supabase
        .from('posts')
        .select('id')
        .eq('slug', slug)
        .single();

      if (existing) continue;

      // Klasifikasi produk
      const meta  = getProductAndRoute(item.title, item.content || item.contentSnippet);
      const catId = categoryMap.get(meta.category_slug);

      // AI polishing
      const polished = await executeAgnosticAiRefinement(
        `Refine content...`
      );

      // Insert ke Supabase
      await supabase.from('posts').insert([{
        title:             polished.polishedTitle,
        slug:              slug,
        content:           polished.summary,
        meta_desc:         polished.metaDescription,
        category_id:       catId,
        target_product_key: meta.key,
        source_url:        item.link,
      }]);

      itemsFetched++;
    }

    // Log health state (anti-pause ping)
    await supabase.from('automation_logs').insert([{
      items_fetched:        itemsFetched,
      status:               itemsFetched > 0 ? 'SUCCESS' : 'HEARTBEAT_Preservation_Active',
      execution_duration_ms: Date.now() - startTime,
    }]);

    // Trigger Vercel ISR revalidation
    if (process.env.VERCEL_REVALIDATE_URL) {
      await fetch(
        `${process.env.VERCEL_REVALIDATE_URL}?secret=${process.env.VERCEL_REVALIDATE_SECRET}`
      );
      console.log('[Pipeline] Vercel ISR revalidation triggered.');
    }

    console.log(`[Pipeline] Done. Items fetched: ${itemsFetched}`);

  } catch (error) {
    await supabase.from('automation_logs').insert([{
      items_fetched:        0,
      status:               'ERROR',
      execution_duration_ms: Date.now() - startTime,
      error_details:        error.message,
    }]);
    console.error('[Pipeline] FATAL ERROR:', error.message);
    process.exit(1);
  }
}

runPipeline();
```

---

## 6. Supabase Active Preservation Script

Script standalone untuk mencegah Supabase pause jika tidak ada konten baru dalam 48 jam.

```javascript
// Dijalankan di akhir GitHub Actions jika items_fetched === 0
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

supabase
  .from('automation_logs')
  .insert([{ status: 'HEARTBEAT_Preservation_Active' }])
  .then(() => console.log('[Heartbeat] Database ping successful.'))
  .catch(err => console.error('[Heartbeat] Ping failed:', err.message));
```
