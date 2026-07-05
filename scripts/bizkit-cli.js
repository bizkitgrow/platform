#!/usr/bin/env node

const readline = require('readline');
const { createClient } = require('@supabase/supabase-js');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const createDOMPurify = require('dompurify');
const crypto = require('crypto');
const { executeAgnosticAiRefinement } = require('./universal-ai-adapter');
const { getProductAndRoute } = require('./agc-engine-classifier');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || '',
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function scrapeFullContent(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    if (!article || !article.textContent) return null;
    return {
      title: article.title,
      textContent: article.textContent.trim(),
      contentHtml: article.content,
    };
  } catch (err) {
    console.error('Error scraping:', err.message);
    return null;
  }
}

async function forceIngestUrl() {
  console.log('\n--- FORCE INGEST URL ---');
  const url = await question('Enter the article URL: ');
  if (!url) return console.log('Operation cancelled.');

  let sku = await question('Target Product SKU (leave blank for auto-detect): ');

  console.log(`\n[+] Scraping ${url}...`);
  const scraped = await scrapeFullContent(url);
  
  if (!scraped) {
    console.log('[-] Failed to scrape the URL. It might be protected by Cloudflare/Bot management.');
    return;
  }

  console.log(`[+] Title extracted: ${scraped.title}`);
  
  const window = new JSDOM('').window;
  const DOMPurify = createDOMPurify(window);
  
  const articleHtml = DOMPurify.sanitize(scraped.contentHtml, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'img', 'br'],
  });

  const classified = getProductAndRoute(scraped.title, scraped.textContent);
  if (!sku) sku = classified.key;

  console.log(`[+] Target SKU: ${sku}`);
  console.log('[+] Generating AI Summary and B2B Polish (this may take a moment)...');

  let polished;
  try {
    const prompt = `You are a B2B SaaS Content Strategist. Analyze the following article and generate B2B marketing metadata.
Title: ${scraped.title}
Content: ${scraped.textContent.substring(0, 4000)}

IMPORTANT: Map the core topic to one of our underlying B2B infrastructure categories (e.g., Secure Connectivity/VPN, Reputation Gating, CRM, or AI Business Suite). 
Do NOT mention third-party vendor names. Focus on the educational value of the infrastructure.

Format response STRICTLY as a raw JSON object (no markdown code fences or markdown blocks):
{
  "polishedTitle": "A professional B2B SaaS focused title (max 70 chars)",
  "metaDescription": "Action-oriented meta description under 160 characters",
  "hook": "A compelling 1-2 sentence B2B introduction hook connecting the topic to infrastructure needs",
  "tags": ["Tag1", "Tag2"],
  "socialWidget": "An engaging LinkedIn/Twitter post copy",
  "internalLinkHTML": "<div class=\\\"my-6 border-4 border-black p-6 bg-canvas_accent shadow-brutal font-mono text-xs uppercase\\\"><p class=\\\"font-bold mb-2\\\">Educational Insight:</p><p class=\\\"mb-4\\\">[Insert a 2-sentence educational insight on why ${sku} infrastructure is critical for modern B2B growth based on the article's theme.]</p><a href=\\\"/solutions/${sku === 'ai_business_tools_suite' ? 'crm-system' : sku}\\\" class=\\\"inline-block bg-brand_cta text-white font-bold px-4 py-2 hover:bg-brand_cta_hover\\\">ACCESS SOLUTION &rarr;</a></div>"
}`;
    polished = await executeAgnosticAiRefinement(prompt);
  } catch(err) {
    console.error('[-] AI Polish failed:', err.message);
    return;
  }

  const finalContentHtml = articleHtml + '\n\n' + (polished.internalLinkHTML || '');
  const slug = (polished.polishedTitle || scraped.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const hash = crypto.createHash('sha256').update(slug).digest('hex');

  // Fetch category
  const { data: dbCategories } = await supabase.from('categories').select('*').eq('slug', classified.category_slug).single();

  const aiSummary = {
    hook: polished.hook,
    tags: polished.tags || [sku],
    metaDesc: polished.metaDescription,
    socialWidget: polished.socialWidget,
  };

  console.log('[+] Inserting into database...');
  const { error } = await supabase.from('posts').insert([{
    title: polished.polishedTitle || scraped.title,
    slug: slug,
    content: finalContentHtml,
    meta_desc: polished.metaDescription || scraped.textContent.slice(0, 160),
    category_id: dbCategories ? dbCategories.id : null,
    target_product_sku: sku,
    source_url: url,
    ai_summary: aiSummary,
    hash: hash,
  }]);

  if (error) {
    console.error('[-] Database Error:', error.message);
  } else {
    console.log(`[+] SUCCESS! Article inserted with slug: /blog/${slug}`);
  }
}

async function ingestRssFeedUrl() {
  console.log('\n--- INGEST FROM RSS FEED ---');
  const feedUrl = await question('Enter the RSS Feed URL: ');
  if (!feedUrl) return console.log('Operation cancelled.');

  let maxItems = await question('Max items to ingest (default: 3): ');
  maxItems = parseInt(maxItems, 10);
  if (isNaN(maxItems) || maxItems <= 0) maxItems = 3;

  let sku = await question('Target Product SKU (leave blank for auto-detect per item): ');

  console.log(`\n[+] Fetching RSS feed from ${feedUrl}...`);
  const RSSParser = require('rss-parser');
  const parser = new RSSParser();
  
  let feed;
  try {
    feed = await parser.parseURL(feedUrl);
  } catch (err) {
    console.error('[-] Failed to fetch or parse RSS feed:', err.message);
    return;
  }

  const items = feed.items || [];
  console.log(`[+] Found ${items.length} items in the feed.`);
  const targetItems = items.slice(0, maxItems);

  for (let i = 0; i < targetItems.length; i++) {
    const item = targetItems[i];
    const url = item.link;
    console.log(`\n--- Processing item ${i + 1}/${targetItems.length} ---`);
    console.log(`[+] Title: ${item.title}`);
    console.log(`[+] URL: ${url}`);
    
    if (!url) {
      console.log('[-] Item has no link, skipping.');
      continue;
    }

    console.log(`[+] Scraping ${url}...`);
    const scraped = await scrapeFullContent(url);
    
    if (!scraped) {
      console.log('[-] Failed to scrape the URL. It might be protected by Cloudflare/Bot management.');
      continue;
    }
    
    const window = new JSDOM('').window;
    const DOMPurify = createDOMPurify(window);
    
    const articleHtml = DOMPurify.sanitize(scraped.contentHtml, {
      ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'img', 'br'],
    });

    const classified = getProductAndRoute(scraped.title, scraped.textContent);
    const itemSku = sku || classified.key;

    console.log(`[+] Target SKU: ${itemSku}`);
    console.log('[+] Generating AI Summary and B2B Polish (this may take a moment)...');

    let polished;
    try {
      const prompt = `You are a B2B SaaS Content Strategist. Analyze the following article and generate B2B marketing metadata.
Title: ${scraped.title}
Content: ${scraped.textContent.substring(0, 4000)}

IMPORTANT: Map the core topic to one of our underlying B2B infrastructure categories (e.g., Secure Connectivity/VPN, Reputation Gating, CRM, or AI Business Suite). 
Do NOT mention third-party vendor names. Focus on the educational value of the infrastructure.

Format response STRICTLY as a raw JSON object (no markdown code fences or markdown blocks):
{
  "polishedTitle": "A professional B2B SaaS focused title (max 70 chars)",
  "metaDescription": "Action-oriented meta description under 160 characters",
  "hook": "A compelling 1-2 sentence B2B introduction hook connecting the topic to infrastructure needs",
  "tags": ["Tag1", "Tag2"],
  "socialWidget": "An engaging LinkedIn/Twitter post copy",
  "internalLinkHTML": "<div class=\\\"my-6 border-4 border-black p-6 bg-canvas_accent shadow-brutal font-mono text-xs uppercase\\\"><p class=\\\"font-bold mb-2\\\">Educational Insight:</p><p class=\\\"mb-4\\\">[Insert a 2-sentence educational insight on why ${itemSku} infrastructure is critical for modern B2B growth based on the article's theme.]</p><a href=\\\"/solutions/${itemSku === 'ai_business_tools_suite' ? 'crm-system' : itemSku}\\\" class=\\\"inline-block bg-brand_cta text-white font-bold px-4 py-2 hover:bg-brand_cta_hover\\\">ACCESS SOLUTION &rarr;</a></div>"
}`;
      polished = await executeAgnosticAiRefinement(prompt);
    } catch(err) {
      console.error('[-] AI Polish failed:', err.message);
      continue;
    }

    const finalContentHtml = articleHtml + '\n\n' + (polished.internalLinkHTML || '');
    const slug = (polished.polishedTitle || scraped.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const hash = crypto.createHash('sha256').update(slug).digest('hex');

    // Fetch category
    const { data: dbCategories } = await supabase.from('categories').select('*').eq('slug', classified.category_slug).single();

    const aiSummary = {
      hook: polished.hook,
      tags: polished.tags || [itemSku],
      metaDesc: polished.metaDescription,
      socialWidget: polished.socialWidget,
    };

    console.log('[+] Inserting into database...');
    const { error } = await supabase.from('posts').insert([{
      title: polished.polishedTitle || scraped.title,
      slug: slug,
      content: finalContentHtml,
      meta_desc: polished.metaDescription || scraped.textContent.slice(0, 160),
      category_id: dbCategories ? dbCategories.id : null,
      target_product_sku: itemSku,
      source_url: url,
      ai_summary: aiSummary,
      hash: hash,
    }]);

    if (error) {
      console.error('[-] Database Error:', error.message);
    } else {
      console.log(`[+] SUCCESS! Article inserted with slug: /blog/${slug}`);
    }
  }
  
  console.log('\n--- RSS INGESTION COMPLETE ---');
}

async function triggerRevalidation() {
  if (process.env.VERCEL_REVALIDATE_URL && process.env.VERCEL_REVALIDATE_SECRET) {
    try {
      console.log('[+] Triggering Vercel ISR revalidation...');
      const url = `${process.env.VERCEL_REVALIDATE_URL}?secret=${process.env.VERCEL_REVALIDATE_SECRET}`;
      const res = await fetch(url);
      if (res.ok) {
        console.log('[+] Vercel cache revalidated successfully.');
      } else {
        console.warn('[-] Vercel revalidation responded with status:', res.status);
      }
    } catch (revalErr) {
      console.error('[-] Vercel ISR Revalidation trigger failure:', revalErr.message);
    }
  }
}

async function showMenu() {
  console.log('\n=======================================');
  console.log('   BIZKITGROW ADMIN CLI MENU');
  console.log('=======================================');
  console.log('1. Force Ingest URL (Single Article)');
  console.log('2. Ingest from RSS Feed URL (Multiple Articles)');
  console.log('3. Trigger Main Pipeline (Default Google News / APIs)');
  console.log('0. Exit');
  
  const choice = await question('\nSelect an option: ');
  
  switch(choice) {
    case '1':
      await forceIngestUrl();
      await triggerRevalidation();
      break;
    case '2':
      await ingestRssFeedUrl();
      await triggerRevalidation();
      break;
    case '3':
      console.log('Triggering main-pipeline.js...');
      require('child_process').execSync('node main-pipeline.js', { stdio: 'inherit' });
      break;
    case '0':
      console.log('Exiting...');
      rl.close();
      return;
    default:
      console.log('Invalid option.');
  }
  
  await showMenu();
}

showMenu().catch(console.error);
