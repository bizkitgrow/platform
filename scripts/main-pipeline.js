const RSSParser = require('rss-parser');
const { createClient } = require('@supabase/supabase-js');
const { executeAgnosticAiRefinement } = require('./universal-ai-adapter');
const { getProductAndRoute } = require('./agc-engine-classifier');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const path = require('path');
const createDOMPurify = require('dompurify');
const crypto = require('crypto');

const rssParser = new RSSParser();
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
);
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

async function scrapeFullContent(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    if (!res.ok) {
      console.warn(`[Pipeline] Scraper: Fetch failed for ${url} with status ${res.status}`);
      return null;
    }
    const html = await res.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    if (!article || !article.textContent) {
      console.warn(`[Pipeline] Scraper: Readability failed to parse content from ${url}`);
      return null;
    }
    return {
      textContent: article.textContent.trim(),
      contentHtml: article.content,
    };
  } catch (err) {
    console.warn(`[Pipeline] Scraper: Error scraping ${url}:`, err.message);
    return null;
  }
}

function localParaphrase(text, lang = 'en') {
  try {
    const child = require('child_process').spawnSync(
      'python3',
      [path.join(__dirname, 'paraphrase.py')],
      {
        input: JSON.stringify({ text, lang }),
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024, // 10MB limit
      },
    );
    if (child.status !== 0) {
      console.warn('[Pipeline] Paraphrase script error output:', child.stderr);
      return text;
    }
    const res = JSON.parse(child.stdout);
    if (res.success) {
      return res.text;
    } else {
      console.warn('[Pipeline] Paraphrase script returned error:', res.error);
      return text;
    }
  } catch (err) {
    console.warn('[Pipeline] Failed to execute paraphrase script:', err.message);
    return text;
  }
}

async function fetchGoogleNews() {
  try {
    console.log('[Pipeline] Fetching Google News RSS...');
    const feed = await rssParser.parseURL(
      'https://news.google.com/rss/search?q=digital+nomad+remote+work+SaaS&hl=en-US',
    );
    return (feed.items || []).map((item) => ({
      title: item.title || '',
      link: item.link || '',
      content: item.contentSnippet || item.content || item.title || '',
      snippet: item.contentSnippet || item.title || '',
      source: 'GoogleNewsRSS',
    }));
  } catch (err) {
    console.warn('[Pipeline] Google News RSS fetch failed:', err.message);
    return [];
  }
}

async function fetchNewsApi() {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) {
    console.warn('[Pipeline] NEWSAPI_KEY is missing in environment. Skipping NewsAPI fetch.');
    return [];
  }
  try {
    console.log('[Pipeline] Fetching NewsAPI.org...');
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=digital+nomad+OR+remote+work+OR+SaaS&apiKey=${apiKey}&pageSize=5&language=en`,
    );
    if (!res.ok) {
      console.warn(`[Pipeline] NewsAPI responded with status ${res.status}`);
      return [];
    }
    const data = await res.json();
    if (data.status !== 'ok') {
      console.warn(`[Pipeline] NewsAPI error: ${data.message}`);
      return [];
    }
    return (data.articles || []).map((art) => ({
      title: art.title || '',
      link: art.url || '',
      content: art.content || art.description || art.title || '',
      snippet: art.description || art.title || '',
      source: 'NewsAPI',
    }));
  } catch (err) {
    console.warn('[Pipeline] NewsAPI fetch failed:', err.message);
    return [];
  }
}

async function fetchNewsData() {
  const apiKey = process.env.NEWSDATA_KEY;
  if (!apiKey) {
    console.warn('[Pipeline] NEWSDATA_KEY is missing in environment. Skipping NewsData.io fetch.');
    return [];
  }
  try {
    console.log('[Pipeline] Fetching NewsData.io...');
    const res = await fetch(
      `https://newsdata.io/api/1/news?apikey=${apiKey}&q=digital%20nomad%20OR%20remote%20work%20OR%20SaaS&language=en`,
    );
    if (!res.ok) {
      console.warn(`[Pipeline] NewsData.io responded with status ${res.status}`);
      return [];
    }
    const data = await res.json();
    if (data.status !== 'success') {
      console.warn(`[Pipeline] NewsData.io error: ${JSON.stringify(data)}`);
      return [];
    }
    return (data.results || []).map((art) => ({
      title: art.title || '',
      link: art.link || '',
      content: art.content || art.description || art.title || '',
      snippet: art.description || art.title || '',
      source: 'NewsData.io',
    }));
  } catch (err) {
    console.warn('[Pipeline] NewsData.io fetch failed:', err.message);
    return [];
  }
}

async function runPipeline() {
  const startTime = Date.now();
  let itemsFetched = 0;

  try {
    console.log('Initializing Main Ingestion Pipeline...');

    // 1 & 2. Ingestions of Alpha Vantage and Football synthetic items are disabled.
    // They are consolidated into home page live widgets.

    // 3. Multi-source News Ingestion (RSS, NewsAPI, NewsData)
    try {
      console.log('[Pipeline] Initiating multi-source news aggregate...');
      const [googleNews, newsApi, newsData] = await Promise.all([
        fetchGoogleNews(),
        fetchNewsApi(),
        fetchNewsData(),
      ]);

      const allArticles = [...googleNews, ...newsApi, ...newsData];
      console.log(`[Pipeline] Aggregated ${allArticles.length} total articles.`);

      // Get categories to resolve ID mapping
      const { data: dbCategories, error: catError } = await supabase.from('categories').select('*');
      if (catError) {
        throw new Error(`Failed to fetch categories: ${catError.message}`);
      }
      const categoryMap = new Map(dbCategories ? dbCategories.map((c) => [c.slug, c.id]) : []);

      let processedCount = 0;
      for (const art of allArticles) {
        if (processedCount >= 3) {
          console.log(
            '[Pipeline] Limit of 3 articles processed per run reached. Stopping news loop.',
          );
          break;
        }

        const slug = art.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        if (!slug) continue;

        const hash = crypto.createHash('sha256').update(slug).digest('hex');

        // Check if slug or hash already exists
        const { data: existing, error: checkError } = await supabase
          .from('posts')
          .select('id')
          .or(`slug.eq.${slug},hash.eq.${hash}`)
          .maybeSingle();

        if (checkError) {
          console.warn(`[Pipeline] Error checking DB for duplicates: ${checkError.message}`);
          continue;
        }

        if (existing) {
          continue;
        }

        console.log(`[Pipeline] Processing new article: "${art.title}" from source: ${art.source}`);

        // Scrape full content using cheerio & readability
        console.log(`[Pipeline] Scraping original website: ${art.link}`);
        const scraped = await scrapeFullContent(art.link);
        let articleHtml = '';
        let articleTextForAi = '';

        if (scraped && scraped.contentHtml) {
          articleHtml = DOMPurify.sanitize(scraped.contentHtml, {
            ALLOWED_TAGS: [
              'p',
              'b',
              'i',
              'em',
              'strong',
              'a',
              'h2',
              'h3',
              'ul',
              'ol',
              'li',
              'blockquote',
              'img',
              'br',
            ],
          });
          articleTextForAi = scraped.textContent;
        } else {
          console.warn(
            `[Pipeline] Scraper failed for "${art.title}". Falling back to feed snippet.`,
          );
          articleHtml = `<p>${art.content}</p>`;
          articleTextForAi = art.content;
        }

        // Clean text for AI classification
        const classified = getProductAndRoute(art.title, articleTextForAi);
        const catId = categoryMap.get(classified.category_slug) || null;

        // Try AI Polish for B2B strategic components
        let polished = null;
        try {
          const prompt = `You are a B2B SaaS Content Strategist. Analyze the following article and generate B2B marketing metadata.
Title: ${art.title}
Content: ${articleTextForAi.substring(0, 4000)}

IMPORTANT: Map the core topic to one of our underlying B2B infrastructure categories (e.g., Secure Connectivity/VPN, Reputation Gating, CRM, or AI Business Suite). 
Do NOT mention "ResellPortal" or any third-party vendor names. Focus on the educational value of the infrastructure.

Format response STRICTLY as a raw JSON object (no markdown code fences or markdown blocks):
{
  "polishedTitle": "A professional B2B SaaS focused title (max 70 chars)",
  "metaDescription": "Action-oriented meta description under 160 characters",
  "hook": "A compelling 1-2 sentence B2B introduction hook connecting the topic to infrastructure needs",
  "tags": ["Tag1", "Tag2"],
  "socialWidget": "An engaging LinkedIn/Twitter post copy",
  "internalLinkHTML": "A clean HTML CTA div component linking to our category '/solutions/${classified.category_slug}' or direct product page. Format: <div class=\\\"my-6 border-4 border-black p-6 bg-canvas_accent shadow-brutal font-mono text-xs uppercase\\\"><p class=\\\"font-bold mb-2\\\">Educational Insight:</p><p class=\\\"mb-4\\\">[Insert a 2-sentence educational insight on why ${classified.key} infrastructure is critical for modern B2B growth based on the article's theme.]</p><a href=\\\"/solutions/${classified.key === 'ai_business_tools_suite' ? 'crm-system' : classified.key}\\\" class=\\\"inline-block bg-brand_cta text-white !text-white font-bold px-4 py-2 hover:bg-brand_cta_hover\\\" style=\\\"color: white !important;\\\">ACCESS SOLUTION &rarr;</a></div>"
}`;
          polished = await executeAgnosticAiRefinement(prompt);
          console.log('[Pipeline] AI Tactical Polish completed successfully.');
        } catch (aiErr) {
          console.warn(
            `[Pipeline] AI Tactical Polish failed for "${art.title}". Falling back to basic B2B values. Reason:`,
            aiErr.message,
          );
          polished = {
            polishedTitle: art.title.slice(0, 70),
            metaDescription: art.snippet.slice(0, 160),
            hook: 'Analyze this complete intelligence report on modern B2B SaaS infrastructures.',
            tags: [classified.key],
            socialWidget: `Read our latest update on B2B optimization: ${art.title}`,
            internalLinkHTML: `<div class="my-6 border-4 border-black p-6 bg-canvas_accent shadow-brutal font-mono text-xs uppercase"><p class="font-bold mb-2">Educational Insight:</p><p class="mb-4">Secure and scalable infrastructure is critical for remote operations and sustained B2B growth. Optimize your workflow today.</p><a href="/solutions/${classified.key === 'ai_business_tools_suite' ? 'crm-system' : classified.key}" class="inline-block bg-brand_cta text-white !text-white font-bold px-4 py-2 hover:bg-brand_cta_hover" style="color: white !important;">ACCESS SOLUTION &rarr;</a></div>`,
          };
        }

        // Inject the internal link CTA at the end of the article HTML
        const finalContentHtml = articleHtml + '\n\n' + (polished.internalLinkHTML || '');

        const aiSummary = {
          hook: polished.hook,
          tags: polished.tags || [classified.key],
          metaDesc: polished.metaDescription,
          socialWidget: polished.socialWidget,
        };

        const { error: insertError } = await supabase.from('posts').insert([
          {
            title: polished.polishedTitle || art.title,
            slug: slug,
            content: finalContentHtml,
            meta_desc: polished.metaDescription || art.snippet.slice(0, 160),
            category_id: catId,
            target_product_sku: classified.key,
            source_url: art.link,
            ai_summary: aiSummary,
            hash: hash,
          },
        ]);

        if (insertError) {
          console.error(
            `[Pipeline] Database insertion failed for "${art.title}":`,
            insertError.message,
          );
        } else {
          processedCount++;
          itemsFetched++;

          // Trigger n8n syndication programmatic monetization
          const n8nOracle = process.env.N8N_ORACLE_WEBHOOK_URL;
          const n8nCloud = process.env.N8N_CLOUD_WEBHOOK_URL;
          if (n8nOracle || n8nCloud) {
            const payload = {
              event: 'new_article_syndication',
              article: {
                title: polished.polishedTitle || art.title,
                slug: slug,
                meta_desc: polished.metaDescription || art.snippet.slice(0, 160),
                socialWidget: polished.socialWidget,
                tags: aiSummary.tags,
                source_url: art.link,
              },
            };
            try {
              let n8nRes = null;
              if (n8nOracle) {
                console.log(`[Pipeline] Firing N8N Oracle webhook for "${slug}"`);
                n8nRes = await fetch(n8nOracle, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                  signal: AbortSignal.timeout(5000),
                }).catch(() => null);
              }

              if ((!n8nRes || !n8nRes.ok) && n8nCloud) {
                console.log(
                  `[Pipeline] N8N Oracle failed/missing, failing over to N8N Cloud for "${slug}"`,
                );
                await fetch(n8nCloud, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                  signal: AbortSignal.timeout(5000),
                }).catch(() => null);
              }
            } catch (e) {
              console.warn(`[Pipeline] N8N syndication trigger failed:`, e.message);
            }
          }
        }
      }
    } catch (err) {
      console.warn('[Pipeline] News ingestion failed:', err.message);
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
        const { data: dbCategories, error: catError } = await supabase
          .from('categories')
          .select('*');
        if (catError) {
          throw new Error(`Failed to fetch categories: ${catError.message}`);
        }
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

          const hash = crypto.createHash('sha256').update(slug).digest('hex');

          // Check if already in DB
          const { data: existing, error: checkError } = await supabase
            .from('posts')
            .select('id')
            .or(`slug.eq.${slug},hash.eq.${hash}`)
            .maybeSingle();

          if (checkError) {
            console.warn(
              `[Pipeline] Error checking DB for trends duplicates: ${checkError.message}`,
            );
            continue;
          }

          if (existing) continue;

          const classified = getProductAndRoute(title, content);
          const catId = categoryMap.get(classified.category_slug) || null;

          const aiSummary = {
            hook: trend.summary
              ? trend.summary.split('.')[0] + '.'
              : 'Factual trend update from Gemini CLI.',
            tags: [classified.key],
            metaDesc: trend.metaDescription || 'Gemini CLI Grounded search trend update.',
            socialWidget: 'Gemini CLI trends update.',
          };

          const { error: insertError } = await supabase.from('posts').insert([
            {
              title,
              slug,
              content,
              meta_desc: trend.metaDescription || 'Gemini CLI Grounded search trend update.',
              category_id: catId,
              target_product_sku: classified.key,
              source_url: 'https://github.com/google/gemini-cli',
              ai_summary: aiSummary,
              hash: hash,
            },
          ]);

          if (insertError) {
            console.warn('[Pipeline] Trends insert failed:', insertError.message);
          } else {
            itemsFetched++;
          }
        }
      } catch (trendErr) {
        console.warn('[Pipeline] Grounded trends processing failed:', trendErr.message);
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
