const crypto = require('node:crypto');
const { Pool } = require('pg');
const llmPolisher = require('./llm-polisher');
const assetGenerator = require('./asset-generator');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Helper for GEO-SEO conversational copy tag matching geo-seo-claude repository patterns
function applyGeoSeoOptimizations(title, polishedBody, pillar) {
  // Inject conversational question anchors and geolocational keywords to align with LLM Generative Engine Optimization (GEO)
  const conversationalGeoHooks = {
    connectivity:
      'How do B2B enterprises implement secure global connectivity? Our remote network perimeter setup solves global latency issues.',
    growth:
      'Looking for local search coordinates in New York or London? We automate Google Local Search Authority building.',
    operations:
      'What is the best way to optimize agency dashboard workflows? Consolidating document routing reduces back-office friction.',
  };

  const hook = conversationalGeoHooks[pillar] || conversationalGeoHooks.connectivity;

  // Return updated body containing search-conversational content
  return `<p class="font-semibold italic text-interactive-normal text-sm mb-6">${hook}</p>${polishedBody}`;
}

async function fetchActiveRssSources() {
  console.log('[MINER] Fetching active RSS sources from database...');
  const res = await pool.query('SELECT * FROM rss_sources WHERE is_active = true');

  // If database is empty, seed a fallback RSS feed to keep pipeline running
  if (res.rows.length === 0) {
    console.log('[MINER] No feeds found. Seeding HN RSS target...');
    const seedRes = await pool.query(
      "INSERT INTO rss_sources (url, target_pillar) VALUES ('https://news.ycombinator.com/rss', 'connectivity') RETURNING *",
    );
    return seedRes.rows;
  }

  return res.rows;
}

async function scrapeContent(url) {
  console.log(`[MINER] Scraping content from ${url}...`);
  return `This is a raw extracted text from ${url} regarding connectivity solutions and mobility data trends.`;
}

async function runMiner() {
  const startTime = Date.now();
  console.log('[MINER] Starting production miner...');
  let itemsFetched = 0;

  try {
    const sources = await fetchActiveRssSources();

    for (const source of sources) {
      const rawText = await scrapeContent(source.url);

      // Enforce absolute UNIQUE index check via MD5 hash
      const hash = crypto.createHash('md5').update(rawText).digest('hex');
      console.log(`[MINER] Content hash generated: ${hash}`);

      // Check DB duplication
      const dupCheck = await pool.query('SELECT id FROM posts WHERE hash = $1', [hash]);
      if (dupCheck.rows.length > 0) {
        console.log(`[MINER] Skipping duplicate post with hash ${hash}.`);
        continue;
      }

      // Pass to Text Polishing Engine (LLM)
      const polishedResult = await llmPolisher.polishText(rawText);

      // Apply GEO-SEO Conversational Tagging
      const optimizedSeoBody = applyGeoSeoOptimizations(
        polishedResult.title,
        polishedResult.seo_body,
        source.target_pillar,
      );

      // Pass to Asset Generator
      const imageUrl = assetGenerator.generateImage(polishedResult.image_prompt);

      // Insert Post
      const slug = `${polishedResult.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
      const postInsert = await pool.query(
        `INSERT INTO posts (title, slug, content, raw_markdown, polished_content, hash, meta_desc, target_product_key, source_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [
          polishedResult.title,
          slug,
          optimizedSeoBody,
          rawText,
          optimizedSeoBody,
          hash,
          polishedResult.meta_desc,
          'esim_data_plans',
          source.url,
        ],
      );
      const newPostId = postInsert.rows[0].id;

      // Insert Media Asset
      await pool.query(
        'INSERT INTO media_assets (post_id, prompt_string, pollinations_url) VALUES ($1, $2, $3)',
        [newPostId, polishedResult.image_prompt, imageUrl],
      );

      // Insert Social Share Ticket
      await pool.query(
        "INSERT INTO social_shares (post_id, status, platform) VALUES ($1, 'PENDING', 'all')",
        [newPostId],
      );

      // Update RSS source last fetched
      await pool.query('UPDATE rss_sources SET last_fetched_at = NOW() WHERE id = $1', [source.id]);

      itemsFetched++;
      console.log(`[MINER] Successfully logged post ID ${newPostId} into DB.`);
    }

    // Success Automation Log
    const duration = Date.now() - startTime;
    await pool.query(
      'INSERT INTO automation_logs (items_fetched, status, execution_duration_ms) VALUES ($1, $2, $3)',
      [itemsFetched, 'SUCCESS', duration],
    );
  } catch (error) {
    console.error('[MINER] [ERROR]', error.message);
    const duration = Date.now() - startTime;
    await pool.query(
      'INSERT INTO automation_logs (items_fetched, status, execution_duration_ms, error_details) VALUES ($1, $2, $3, $4)',
      [itemsFetched, 'FAILED', duration, error.message],
    );
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMiner();
}

module.exports = { runMiner };
