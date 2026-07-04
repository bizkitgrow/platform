const RSSParser = require('rss-parser');
const { createClient } = require('@supabase/supabase-js');
const { executeAgnosticAiRefinement } = require('./universal-ai-adapter');
const { getProductAndRoute } = require('./agc-engine-classifier');
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');

const rssParser = new RSSParser();
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
);
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

async function runPipeline() {
  const startTime = Date.now();
  let itemsFetched = 0;

  try {
    console.log('Initializing Main Ingestion Pipeline...');

    // 1. Ingest Alpha Vantage Financial Feed (Pillar 1/3 Cross-sell)
    if (process.env.ALPHA_VANTAGE_KEY) {
      try {
        const financialResponse = await fetch(
          `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=EUR&apikey=${process.env.ALPHA_VANTAGE_KEY}`,
        );
        if (financialResponse.ok) {
          const finData = await financialResponse.json();
          const rate = finData['Realtime Currency Exchange Rate']?.['5. Exchange Rate'];

          if (rate) {
            const titleSpec = 'Automated USD to EUR Financial Intelligence Optimization Updates';
            const slugSpec = 'usd-to-eur-exchange-rate-secure-mobility-guide';
            const rawContent = `Global asset routing metrics report exchange parameters at stable rates of ${rate}. For enterprise financial operators managing foreign ledgers remotely, protecting communications data with a Dedicated Business VPN remains a critical infrastructure priority.`;

            const cleanContent = DOMPurify.sanitize(rawContent, { ALLOWED_TAGS: [] });
            const classified = getProductAndRoute(titleSpec, cleanContent);

            await supabase.from('posts').upsert(
              {
                title: titleSpec,
                slug: slugSpec,
                content: cleanContent,
                meta_desc:
                  'Live international corporate trading tracking data points and asset security parameters.',
                target_product_key: classified.key,
              },
              { onConflict: 'slug' },
            );
            itemsFetched++;
          }
        }
      } catch (err) {
        console.warn('Alpha Vantage Ingestion failed:', err.message);
      }
    }

    // 2. Ingest API Football Feed (Pillar 1 Entry-Level Cross-sell)
    if (process.env.RAPIDAPI_KEY) {
      try {
        const footballResponse = await fetch(
          'https://v3.football.api-sports.io/fixtures?live=all',
          {
            headers: {
              'x-rapidapi-key': process.env.RAPIDAPI_KEY,
              'x-rapidapi-host': 'v3.football.api-sports.io',
            },
          },
        );

        if (footballResponse.ok) {
          const sportsData = await footballResponse.json();
          const activeMatches = sportsData.response?.slice(0, 2) || [];

          for (const match of activeMatches) {
            const matchTitle = `Streaming Operations Integrity: ${match.teams.home.name} vs ${match.teams.away.name}`;
            const matchSlug = `${match.teams.home.name.toLowerCase()}-vs-${match.teams.away.name.toLowerCase()}-live-stream-connectivity`;
            const rawSportsContent = `The dynamic data array shows live activities between ${match.teams.home.name} and ${match.teams.away.name}. High-frequency travelers and remote sports media consultants require unthrottled global E-SIM access profiles to monitor latency-critical parameters during high-load match transfers.`;

            const cleanContent = DOMPurify.sanitize(rawSportsContent, { ALLOWED_TAGS: [] });
            const classified = getProductAndRoute(matchTitle, cleanContent);

            await supabase.from('posts').upsert(
              {
                title: matchTitle,
                slug: matchSlug,
                content: cleanContent,
                meta_desc:
                  'Real-time grid routing data optimization rules for international coverage maps.',
                target_product_key: classified.key,
              },
              { onConflict: 'slug' },
            );
            itemsFetched++;
          }
        }
      } catch (err) {
        console.warn('API Football Ingestion failed:', err.message);
      }
    }

    // 3. RSS News Parser + AI Polishing
    try {
      const feed = await rssParser.parseURL(
        'https://news.google.com/rss/search?q=digital+nomad+remote+work+SaaS&hl=en-US',
      );

      // Get categories to resolve ID mapping
      const { data: dbCategories } = await supabase.from('categories').select('*');
      const categoryMap = new Map(dbCategories ? dbCategories.map((c) => [c.slug, c.id]) : []);

      // Limit to 3 RSS items per run to preserve AI quotas
      const targetItems = feed.items.slice(0, 3);
      for (const item of targetItems) {
        const slug = item.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        if (!slug) continue;

        // Skip if already in DB
        const { data: existing } = await supabase
          .from('posts')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();

        if (existing) continue;

        const cleanRawContent = DOMPurify.sanitize(
          item.contentSnippet || item.content || item.title,
          { ALLOWED_TAGS: [] },
        );
        const classified = getProductAndRoute(item.title, cleanRawContent);
        const catId = categoryMap.get(classified.category_slug) || null;

        // Execute Agnostic AI Refinement
        const prompt = `Refine this content for B2B search authority.
Title: ${item.title}
Content: ${cleanRawContent}
Format response STRICTLY as a raw JSON object (no markdown code fences):
{
  "polishedTitle": "Professional Title (max 70 chars)",
  "metaDescription": "Action-oriented meta desc (max 160 chars)",
  "summary": "Clear factual outcome statement (2 sentences)"
}`;

        const polished = await executeAgnosticAiRefinement(prompt);

        await supabase.from('posts').insert([
          {
            title: polished.polishedTitle || item.title,
            slug: slug,
            content: polished.summary || cleanRawContent,
            meta_desc: polished.metaDescription || 'Authorized operational connectivity update.',
            category_id: catId,
            target_product_key: classified.key,
            source_url: item.link,
          },
        ]);

        itemsFetched++;
      }
    } catch (err) {
      console.warn('RSS & AI processing failed:', err.message);
    }

    // 4. Ingest and parse trends from Gemini CLI file if available
    const fs = require('node:fs');
    const path = require('node:path');
    const trendsFilePath = path.join(__dirname, 'ingested_trends.json');
    if (fs.existsSync(trendsFilePath)) {
      try {
        console.log('[Pipeline] Processing trends ingested from Gemini CLI...');
        const rawTrends = fs.readFileSync(trendsFilePath, 'utf8');
        const parsedTrends = JSON.parse(rawTrends);

        // Map categories for ID lookup
        const { data: dbCategories } = await supabase.from('categories').select('*');
        const categoryMap = new Map(dbCategories ? dbCategories.map((c) => [c.slug, c.id]) : []);

        const trendsList = Array.isArray(parsedTrends) ? parsedTrends : [parsedTrends];
        for (const trend of trendsList.slice(0, 3)) {
          const title = trend.polishedTitle || trend.title;
          const content = trend.summary || trend.content;
          if (!title || !content) continue;

          const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

          // Check if already in DB
          const { data: existing } = await supabase
            .from('posts')
            .select('id')
            .eq('slug', slug)
            .maybeSingle();

          if (existing) continue;

          const classified = getProductAndRoute(title, content);
          const catId = categoryMap.get(classified.category_slug) || null;

          await supabase.from('posts').insert([
            {
              title,
              slug,
              content,
              meta_desc: trend.metaDescription || 'Gemini CLI Grounded search trend update.',
              category_id: catId,
              target_product_key: classified.key,
              source_url: 'https://github.com/google/gemini-cli',
            },
          ]);
          itemsFetched++;
        }
      } catch (trendErr) {
        console.warn('Grounded trends processing failed:', trendErr.message);
      }
    }

    // Write health logs to DB to preserve Supabase from pausing (heartbeat)
    await supabase.from('automation_logs').insert([
      {
        items_fetched: itemsFetched,
        status: itemsFetched > 0 ? 'SUCCESS' : 'HEARTBEAT_Preservation_Active',
        execution_duration_ms: Date.now() - startTime,
      },
    ]);

    // Trigger Vercel ISR Revalidation
    if (process.env.VERCEL_REVALIDATE_URL && process.env.VERCEL_REVALIDATE_SECRET) {
      try {
        await fetch(
          `${process.env.VERCEL_REVALIDATE_URL}?secret=${process.env.VERCEL_REVALIDATE_SECRET}`,
        );
        console.log('[Pipeline] Vercel ISR revalidation triggered.');
      } catch (revalErr) {
        console.error('ISR Revalidation trigger failure:', revalErr.message);
      }
    }

    console.log(
      `[Pipeline] Completed successfully. Total items upserted/inserted: ${itemsFetched}`,
    );
  } catch (error) {
    console.error('Pipeline FATAL error:', error.message);
    try {
      await supabase.from('automation_logs').insert([
        {
          items_fetched: 0,
          status: 'ERROR',
          execution_duration_ms: Date.now() - startTime,
          error_details: error.message,
        },
      ]);
    } catch (dbErr) {
      console.error('Could not write error logs to database:', dbErr.message);
    }
    process.exit(1);
  }
}

runPipeline();
