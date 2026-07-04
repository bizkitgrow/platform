import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
//#region src/pages/api/v1/market/pulse.ts
var pulse_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async () => {
	const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY;
	if (!ALPHA_VANTAGE_KEY) return new Response(JSON.stringify({ error: "Alpha Vantage key not configured" }), {
		status: 503,
		headers: { "Content-Type": "application/json" }
	});
	try {
		const res = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=NVDA,MSFT,GOOGL,AAPL&limit=5&apikey=${ALPHA_VANTAGE_KEY}`, { signal: AbortSignal.timeout(8e3) });
		if (!res.ok) throw new Error(`Alpha Vantage returned ${res.status}`);
		const data = await res.json();
		const feed = (data.feed || []).slice(0, 5).map((item) => ({
			title: item.title,
			url: item.url,
			sentiment: item.overall_sentiment_label,
			score: item.overall_sentiment_score,
			tickers: (item.ticker_sentiment || []).map((t) => t.ticker).slice(0, 3),
			source: item.source,
			publishedAt: item.time_published
		}));
		return new Response(JSON.stringify({
			feed,
			sentiment: data.feed?.[0]?.overall_sentiment_label || "Neutral",
			lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
		}), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "public, max-age=900, s-maxage=1800"
			}
		});
	} catch (err) {
		return new Response(JSON.stringify({
			feed: [],
			sentiment: "Neutral",
			lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
			error: err.message
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/v1/market/pulse@_@ts
var page = () => pulse_exports;
//#endregion
export { page };
