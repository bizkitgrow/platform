const crypto = require('node:crypto');
const { Pool } = require('pg');
const cheerio = require('cheerio');
const llmPolisher = require('./llm-polisher');
const assetGenerator = require('./asset-generator');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function fetchActiveRssSources() {
  console.log('[MINER] Fetching active RSS sources from database...');
  const res = await pool.query('SELECT * FROM rss_sources WHERE is_active = true');
  if (res.rows.length === 0) {
    console.log('[MINER] No feeds found. Seeding high-margin RSS targets...');
    const seedRes = await pool.query(`
      INSERT INTO rss_sources (url, target_pillar) VALUES 
      ('https://www.rcrwireless.com/feed', 'esim_data_plans'),
      ('https://searchengineland.com/feed', 'reputation_management'),
      ('https://venturebeat.com/category/ai/feed', 'ai_business_tools_suite')
      RETURNING *
    `);
    return seedRes.rows;
  }
  return res.rows;
}

const Parser = require('rss-parser');
const parser = new Parser({
  customFields: {
    item: [
      ['content:encoded', 'contentEncoded'],
      ['media:content', 'mediaContent', { keepArray: true }],
    ],
  },
});

async function scrapeContent(url) {
  console.log(`[MINER] Scraping content from ${url}...`);
  try {
    const feed = await parser.parseURL(url);
    if (!feed.items || feed.items.length === 0) {
      console.log(`[MINER] No items found in feed ${url}`);
      return null;
    }
    const item = feed.items[0];

    const originalHtml = item.contentEncoded || item.content || item.description || '';
    let originalImage = null;
    if (item.mediaContent && item.mediaContent.length > 0) {
      originalImage = item.mediaContent[0]['$']?.url;
    } else if (
      item.enclosure &&
      item.enclosure.url &&
      item.enclosure.type &&
      item.enclosure.type.startsWith('image/')
    ) {
      originalImage = item.enclosure.url;
    } else {
      const $ = cheerio.load(originalHtml);
      originalImage = $('img').first().attr('src');
    }

    let rawText = `Title: ${item.title}\n`;
    rawText += `Link: ${item.link}\n`;
    rawText += `Published: ${item.pubDate || ''}\n`;
    rawText += `Content: ${originalHtml}\n`;

    return {
      rawText,
      originalHtml,
      originalTitle: item.title,
      originalLink: item.link,
      originalImage,
    };
  } catch (err) {
    console.error(`[MINER] Failed to parse RSS feed ${url}:`, err.message);
    return null;
  }
}

async function runMiner() {
  const isDryRun = process.argv.includes('--dry-run');
  const startTime = Date.now();
  console.log('[MINER] Starting production miner...');
  let itemsFetched = 0;

  try {
    const sources = await fetchActiveRssSources();
    for (const source of sources) {
      const scraped = await scrapeContent(source.url);
      if (!scraped) continue;

      const { rawText, originalHtml, originalTitle, originalLink, originalImage } = scraped;
      const extractedTitle = originalTitle.trim();
      let extractedLink = originalLink.trim();
      if (extractedLink.includes('?')) {
        extractedLink = extractedLink.split('?')[0];
      }

      const dedupString = `${extractedTitle}-${extractedLink}`;
      const hash = crypto.createHash('md5').update(dedupString).digest('hex');
      const dupCheck = await pool.query('SELECT id FROM posts WHERE hash = $1', [hash]);
      if (dupCheck.rows.length > 0) {
        console.log(`[MINER] Skipping duplicate post with hash ${hash}.`);
        continue;
      }

      // Generate Tactical JSON via LLM
      const polishedResult = await llmPolisher.polishText(rawText, source.target_pillar);

      // Asset Fallback Guard
      let finalImage = originalImage;
      if (!finalImage) {
        console.log('[MINER] No original image found. Using AI fallback.');
        finalImage = assetGenerator.generateImage(
          `Professional corporate header for: ${extractedTitle}`,
        );
      }

      const slug = `${extractedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

      if (isDryRun) {
        console.log('--- DRY RUN OUTPUT ---', { slug, hash, finalImage, polishedResult });
        continue;
      }

      const postInsert = await pool.query(
        `INSERT INTO posts (
          title, slug, content, ai_summary, original_image, 
          hash, meta_desc, target_product_sku, resellportal_status, source_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [
          extractedTitle,
          slug,
          originalHtml,
          polishedResult,
          finalImage,
          hash,
          polishedResult.metaDesc || polishedResult.meta_desc || '',
          'ai-blog-generator',
          'pending',
          extractedLink,
        ],
      );
      const newPostId = postInsert.rows[0].id;

      // Trigger ISR Revalidation
      if (process.env.VERCEL_REVALIDATE_URL && process.env.VERCEL_REVALIDATE_SECRET) {
        try {
          await fetch(
            `${process.env.VERCEL_REVALIDATE_URL}?secret=${process.env.VERCEL_REVALIDATE_SECRET}&path=/blog`,
            { method: 'POST' },
          );
        } catch (revErr) {}
      }

      await pool.query('UPDATE rss_sources SET last_fetched_at = NOW() WHERE id = $1', [source.id]);
      itemsFetched++;
      console.log(`[MINER] Successfully logged post ID ${newPostId} into DB.`);
    }

    if (!isDryRun) {
      console.log(
        `[MINER] Completed successfully. Items fetched: ${itemsFetched}, Duration: ${Date.now() - startTime}ms`,
      );
    }
  } catch (error) {
    console.error('[MINER] [ERROR]', error.message);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMiner();
}

module.exports = { runMiner };
