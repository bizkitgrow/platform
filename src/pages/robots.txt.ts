import type { APIRoute } from 'astro';
import { siteConfig } from '~/config/site';

export const prerender = true;

export const GET: APIRoute = async () => {
  const robotsTxt = `# Bizkitgrow Robots Directive
# Authority: ${siteConfig.url}

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Crawl-delay: 1

# LLM Crawlers — explicitly permitted for GEO/AEO
User-agent: GPTBot
Allow: /
Allow: /llms.txt
Allow: /blog/

User-agent: ClaudeBot
Allow: /
Allow: /llms.txt
Allow: /blog/

User-agent: PerplexityBot
Allow: /
Allow: /llms.txt

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Amazonbot
Allow: /

# Block known bad scrapers
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

Sitemap: ${new URL('/sitemap-index.xml', siteConfig.url).toString()}
`.trim();

  return new Response(robotsTxt, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
