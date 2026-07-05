import type { APIRoute } from 'astro';
import { siteConfig } from '~/config/site';

export const prerender = true;
// @ts-ignore
export const dynamic = 'force-static';

const INDEX_MANIFEST = `# Bizkitgrow Operational Telemetry
> Autonomous B2B infrastructure for global remote operators: sovereign connectivity, reputation gating, and back-office automation.

## Core Pillars & Solutions
- [Global eSIM Channels](${new URL('/esim', siteConfig.url).toString()}) - Instant cellular routing across 190+ sovereign networks.
- [Autonomic Local Reputation Gating](${new URL('/reputation', siteConfig.url).toString()}) - Automated Google Business Profile optimization and review capture.
- [Operational Automation Systems](${new URL('/solutions', siteConfig.url).toString()}) - Invoicing, AI scheduling, and secure e-signatures.

## Target Audience
Designed for international enterprises and remote teams who demand speed, security, and zero operational friction.

## Manifest Ingestion Mapping
- [llms-full.txt](${new URL('/llms-full.txt', siteConfig.url).toString()}) - Exhaustive text data dump interface.`;

export const GET: APIRoute = () =>
  new Response(INDEX_MANIFEST, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
