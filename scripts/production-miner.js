const crypto = require('node:crypto');
const { Pool } = require('pg');
const cheerio = require('cheerio');
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

  // If database is empty, seed fallback RSS feeds targeting highest-margin ResellPortal buckets
  if (res.rows.length === 0) {
    console.log('[MINER] No feeds found. Seeding high-margin RSS targets...');
    const seedRes = await pool.query(`
      INSERT INTO rss_sources (url, target_pillar) VALUES 
      ('https://news.ycombinator.com/rss', 'esim_data_plans'),
      ('https://techcrunch.com/feed/', 'ai_business_tools_suite'),
      ('https://www.theverge.com/rss/index.xml', 'reputation_management')
      RETURNING *
    `);
    return seedRes.rows;
  }

  return res.rows;
}

const Parser = require('rss-parser');
const parser = new Parser();

async function scrapeContent(url) {
  console.log(`[MINER] Scraping content from ${url}...`);
  try {
    const feed = await parser.parseURL(url);
    if (!feed.items || feed.items.length === 0) {
      console.log(`[MINER] No items found in feed ${url}`);
      return null;
    }

    // Pick the latest item or a random one, let's just take the first one
    const item = feed.items[0];

    console.log(`[MINER] Fetching full article body from: ${item.link}`);
    let fullArticleText = item.content || item.contentSnippet || item.description || '';

    try {
      const articleRes = await fetch(item.link);
      if (articleRes.ok) {
        const html = await articleRes.text();
        const $ = cheerio.load(html);

        // Strip out noisy elements
        $('script, style, nav, footer, header, aside, .ad, .advertisement, iframe, svg').remove();

        // Extract meaningful text
        const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
        // Take a substantial chunk (up to 6000 chars) for LLM context, ensuring it doesn't overload tokens
        fullArticleText = bodyText.substring(0, 6000);
      }
    } catch (fetchErr) {
      console.warn(
        `[MINER] Full HTML fetch failed for ${item.link}, falling back to RSS snippet. Error: ${fetchErr.message}`,
      );
    }

    // Construct a raw text representation
    let rawText = `Title: ${item.title}\n`;
    rawText += `Link: ${item.link}\n`;
    rawText += `Published: ${item.pubDate || ''}\n`;
    rawText += `Content: ${fullArticleText}\n`;

    return rawText;
  } catch (err) {
    console.error(`[MINER] Failed to parse RSS feed ${url}:`, err.message);
    return null;
  }
}

async function runMiner() {
  const startTime = Date.now();
  console.log('[MINER] Starting production miner...');
  let itemsFetched = 0;

  try {
    const sources = await fetchActiveRssSources();

    for (const source of sources) {
      const rawText = await scrapeContent(source.url);

      if (!rawText) {
        console.log(`[MINER] Skipping source ${source.url} due to missing content.`);
        continue;
      }

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
          source.target_pillar, // This now correctly dynamically stores the prioritized pillar bucket
          source.url,
        ],
      );
      const newPostId = postInsert.rows[0].id;

      // Insert Media Asset
      await pool.query(
        'INSERT INTO media_assets (post_id, prompt_string, pollinations_url) VALUES ($1, $2, $3)',
        [newPostId, polishedResult.image_prompt, imageUrl],
      );

      // Insert 4 platform-specific share tickets
      const platforms = ['instagram', 'facebook', 'x_twitter', 'pinterest'];
      for (const platform of platforms) {
        await pool.query(
          "INSERT INTO social_shares (post_id, status, platform) VALUES ($1, 'PENDING', $2)",
          [newPostId, platform],
        );
      }

      // Update RSS source last fetched
      await pool.query('UPDATE rss_sources SET last_fetched_at = NOW() WHERE id = $1', [source.id]);

      itemsFetched++;
      console.log(`[MINER] Successfully logged post ID ${newPostId} into DB.`);

      // Trigger ISR Revalidation for the blog listing page
      if (process.env.VERCEL_REVALIDATE_URL && process.env.VERCEL_REVALIDATE_SECRET) {
        try {
          console.log('[MINER] Triggering ISR revalidation...');
          const revRes = await fetch(
            `${process.env.VERCEL_REVALIDATE_URL}?secret=${process.env.VERCEL_REVALIDATE_SECRET}&path=/blog`,
            {
              method: 'POST',
            },
          );
          if (revRes.ok) {
            console.log('[MINER] Revalidation successful.');
          } else {
            console.error('[MINER] Revalidation failed:', await revRes.text());
          }
        } catch (revErr) {
          console.error('[MINER] Revalidation network error:', revErr.message);
        }
      }
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
