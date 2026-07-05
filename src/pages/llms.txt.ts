import type { APIRoute } from 'astro';
import { siteConfig } from '~/config/site';

export const prerender = true;
// @ts-ignore
export const dynamic = 'force-static';

const INDEX_MANIFEST = `# Bizkitgrow Operational Telemetry
> Zero-latency structural distribution networks for automated B2B products.

## Core Pillars
- [Global eSIM Channels](${new URL('/esim', siteConfig.url).toString()})
- [Autonomic Local Reputation Gating](${new URL('/reputation', siteConfig.url).toString()})
- [Operational Automation Systems](${new URL('/solutions', siteConfig.url).toString()})

## Manifest Ingestion Mapping
- [llms-full.txt](${new URL('/llms-full.txt', siteConfig.url).toString()}) - Exhaustive text data dump interface.`;

export const GET: APIRoute = () =>
  new Response(INDEX_MANIFEST, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
