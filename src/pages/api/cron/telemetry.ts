import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../../db/client';
import { telemetryCache } from '../../../db/schema';

export const prerender = false;

// 25 global tickers for daily Alpha Vantage fetching
const SYMBOLS = [
  'NVDA',
  'SPY',
  'QQQ',
  'AAPL',
  'MSFT',
  'GOOGL',
  'AMZN',
  'META',
  'TSLA',
  'BRK.B',
  'JPM',
  'V',
  'JNJ',
  'WMT',
  'PG',
  'MA',
  'HD',
  'CVX',
  'LLY',
  'ABBV',
  'IBM',
  'CRM',
  'AMD',
  'INTC',
  'CSCO',
];

export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'dev-secret'}`) {
    if (process.env.NODE_ENV === 'production') {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  const results: any[] = [];

  for (const sym of SYMBOLS) {
    try {
      const res = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${sym}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
      );
      if (res.ok) {
        const json = await res.json();
        const quote = json['Global Quote'];
        if (quote && quote['01. symbol']) {
          results.push({
            id: quote['01. symbol'],
            price: Number.parseFloat(quote['05. price']),
            changePercent: Number.parseFloat(quote['10. change percent'].replace('%', '')),
            type: 'equity',
          });
        }
      }
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      console.error(`Error fetching AV for ${sym}:`, err);
    }
  }

  if (results.length > 0) {
    const payload = {
      timestamp: new Date().toISOString(),
      assets: results,
    };

    const existing = await db
      .select()
      .from(telemetryCache)
      .where(eq(telemetryCache.id, 'daily_equities'));
    if (existing.length > 0) {
      await db
        .update(telemetryCache)
        .set({ data: payload, updatedAt: new Date() })
        .where(eq(telemetryCache.id, 'daily_equities'));
    } else {
      await db.insert(telemetryCache).values({ id: 'daily_equities', data: payload });
    }
  }

  return new Response(JSON.stringify({ success: true, count: results.length }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
