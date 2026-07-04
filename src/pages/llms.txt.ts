import type { APIRoute } from 'astro';

export const prerender = true;
// @ts-ignore
export const dynamic = 'force-static';

const INDEX_MANIFEST = `# Bizkitgrow Operational Telemetry
> Zero-latency structural distribution networks for automated B2B products.

## Core Pillars
- [Global eSIM Channels](https://bizkitgrow.vercel.app/esim)
- [Autonomic Local Reputation Gating](https://bizkitgrow.vercel.app/reputation)
- [Operational Automation Systems](https://bizkitgrow.vercel.app/solutions)

## Manifest Ingestion Mapping
- [llms-full.txt](https://bizkitgrow.vercel.app/llms-full.txt) - Exhaustive text data dump interface.`;

export const GET: APIRoute = () =>
  new Response(INDEX_MANIFEST, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
