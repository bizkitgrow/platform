import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY;

  if (!ALPHA_VANTAGE_KEY) {
    return new Response(JSON.stringify({ error: 'Alpha Vantage key not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=NVDA,MSFT,GOOGL,AAPL&limit=5&apikey=${ALPHA_VANTAGE_KEY}`,
      { signal: AbortSignal.timeout(8000) },
    );

    if (!res.ok) throw new Error(`Alpha Vantage returned ${res.status}`);

    const data: any = await res.json();
    const feed = (data.feed || []).slice(0, 5).map((item: any) => ({
      title: item.title,
      url: item.url,
      sentiment: item.overall_sentiment_label,
      score: item.overall_sentiment_score,
      tickers: (item.ticker_sentiment || []).map((t: any) => t.ticker).slice(0, 3),
      source: item.source,
      publishedAt: item.time_published,
    }));

    return new Response(
      JSON.stringify({
        feed,
        sentiment: data.feed?.[0]?.overall_sentiment_label || 'Neutral',
        lastUpdated: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=900, s-maxage=1800',
        },
      },
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        feed: [],
        sentiment: 'Neutral',
        lastUpdated: new Date().toISOString(),
        error: err.message,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
