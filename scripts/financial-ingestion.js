require('dotenv').config();
const crypto = require('crypto');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const ALPHA_VANTAGE_BASE = 'https://www.alphavantage.co/query';
const TARGET_TICKERS = ['NVDA', 'MSFT', 'GOOGL', 'AAPL', 'AVGO'];

const PILLAR_MAP = {
  NVDA: 'ai_business_tools_suite',
  MSFT: 'ai_business_tools_suite',
  GOOGL: 'ai_business_tools_suite',
  AAPL: 'ai_business_tools_suite',
  AVGO: 'esim_data_plans',
};

async function runFinancialIngestion() {
  const isDryRun = process.argv.includes('--dry-run');
  console.log(`[FINANCIAL ENGINE] Executing ingestion. Dry-Run: ${isDryRun}`);

  if (!process.env.ALPHA_VANTAGE_KEY) {
    console.error('[FINANCIAL ENGINE] ALPHA_VANTAGE_KEY not set. Aborting.');
    process.exit(1);
  }

  try {
    const url = `${ALPHA_VANTAGE_BASE}?function=NEWS_SENTIMENT&tickers=${TARGET_TICKERS.join(',')}&limit=15&apikey=${process.env.ALPHA_VANTAGE_KEY}`;
    console.log('[FINANCIAL ENGINE] Fetching Alpha Vantage NEWS_SENTIMENT feed...');
    const response = await fetch(url, { signal: AbortSignal.timeout(12000) });

    if (!response.ok) throw new Error(`Alpha Vantage returned ${response.status}`);

    const data = await response.json();

    if (data.Information) {
      console.warn('[FINANCIAL ENGINE] Alpha Vantage rate limit hit:', data.Information);
      process.exit(0);
    }

    const feeds = data.feed || [];
    console.log(`[FINANCIAL ENGINE] ${feeds.length} items in feed. Processing top 10...`);

    let ingested = 0;

    for (const item of feeds.slice(0, 10)) {
      // Strict dedup hash: title + canonical URL (no query strings)
      const cleanUrl = (item.url || '').split('?')[0].split('#')[0].toLowerCase().trim();
      const cleanTitle = (item.title || '').toLowerCase().replace(/[\s\W]+/g, '');
      const contentHash = crypto.createHash('md5').update(`${cleanTitle}:${cleanUrl}`).digest('hex');

      // Keyword guard: must be relevant
      const text = `${item.title} ${item.summary}`.toLowerCase();
      const relevantKeywords = ['ai', 'tech', 'cloud', 'chip', 'data', 'software', 'enterprise', 'connectivity', 'esim', 'network', 'automation', 'saas'];
      const matchCount = relevantKeywords.filter((k) => text.includes(k)).length;
      if (matchCount < 2) {
        console.log(`[FINANCIAL ENGINE] Skipping low-relevance item: "${item.title.slice(0, 60)}"`);
        continue;
      }

      // Determine pillar from ticker references
      const referencedTickers = (item.ticker_sentiment || []).map((t) => t.ticker);
      const pillar = referencedTickers.find((t) => PILLAR_MAP[t])
        ? PILLAR_MAP[referencedTickers.find((t) => PILLAR_MAP[t])]
        : 'ai_business_tools_suite';

      const payload = {
        title: item.title,
        slug: `market-${contentHash.slice(0, 12)}-${Date.now()}`,
        content: `<h2>Market Intelligence Brief</h2><p>${item.summary}</p><p><a href="${item.url}" rel="noopener noreferrer">Read full source</a></p>`,
        metaDesc: item.summary?.slice(0, 155) || item.title.slice(0, 155),
        hash: contentHash,
        sourceUrl: cleanUrl,
        targetPillar: pillar,
        tickerSymbol: referencedTickers[0] || null,
        sentimentLabel: item.overall_sentiment_label || 'Neutral',
        sentimentScore: item.overall_sentiment_score || 0,
      };

      console.log(`[FINANCIAL ENGINE] Staged: [${payload.sentimentLabel}] ${payload.title.slice(0, 70)}`);

      if (isDryRun) {
        console.log('--- DRY RUN OUTPUT ---');
        console.log(JSON.stringify(payload, null, 2));
        console.log('----------------------');
        continue;
      }

      // DB insert with dedup check
      try {
        const dupCheck = await pool.query('SELECT id FROM posts WHERE hash = $1', [contentHash]);
        if (dupCheck.rows.length > 0) {
          console.log(`[FINANCIAL ENGINE] Duplicate hash ${contentHash} — skipping.`);
          continue;
        }

        const result = await pool.query(
          `INSERT INTO posts (title, slug, content, meta_desc, hash, source_url, target_product_key)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
          [payload.title, payload.slug, payload.content, payload.metaDesc, payload.hash, payload.sourceUrl, payload.targetPillar]
        );
        console.log(`[FINANCIAL ENGINE] Inserted post ID ${result.rows[0].id}`);
        ingested++;
      } catch (dbErr) {
        console.error(`[FINANCIAL ENGINE] DB insert failed:`, dbErr.message);
      }
    }

    if (!isDryRun) {
      await pool.query(
        'INSERT INTO automation_logs (items_fetched, status) VALUES ($1, $2)',
        [ingested, 'SUCCESS']
      );
    }

    console.log(`[FINANCIAL ENGINE] Ingestion complete. ${ingested} articles stored.`);
  } catch (err) {
    console.error('[FINANCIAL ENGINE] CRITICAL FAILURE:', err.message);
    if (!process.argv.includes('--dry-run')) {
      try {
        await pool.query(
          'INSERT INTO automation_logs (items_fetched, status) VALUES ($1, $2)',
          [0, 'FAILED']
        );
      } catch {}
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runFinancialIngestion();
