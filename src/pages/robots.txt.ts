import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = async () => {
  const robotsTxt = `# Bizkitgrow Robots Directive
# Authority: https://bizkitgrow.vercel.app

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

Sitemap: https://bizkitgrow.vercel.app/sitemap.xml
`.trim();

  return new Response(robotsTxt, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
