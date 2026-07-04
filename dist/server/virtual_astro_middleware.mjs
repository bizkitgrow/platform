import { K as defineMiddleware, P as sequence } from "./chunks/render_BR5mh6eO.mjs";
//#region src/middleware/cache.mts
var CACHE_KEYS = {
	sitemap: "sitemap-astro",
	llmsIndex: "llms-index-astro",
	llmsFull: "llms-full-astro",
	page: "page-astro"
};
var onRequest$2 = defineMiddleware(async (context, next) => {
	const url = new URL(context.request.url);
	const skipCache = url.pathname.startsWith("/api/") || url.pathname === "/sitemap" || url.pathname === "/llms.txt" || url.pathname === "/llms-full.txt";
	const cache = context.cache;
	const key = CACHE_KEYS[context.url.pathname.split("/").pop()] || CACHE_KEYS.page;
	if (cache && typeof cache.get === "function" && !skipCache) {
		const cached = await cache.get(key);
		if (cached) return new Response(cached, { headers: {
			"Content-Type": url.pathname.endsWith(".xml") ? "application/xml" : url.pathname.endsWith(".txt") ? "text/plain" : "text/html",
			"Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"
		} });
	}
	const response = await next();
	const body = await response.text();
	if (cache && typeof cache.set === "function" && !skipCache && !response.headers.get("Cache-Control")?.includes("no-store")) await cache.set(key, body, { ttl: 60 });
	return new Response(body, { headers: {
		...Object.fromEntries(response.headers.entries()),
		"Cache-Control": "public, s-maxage=60, stale-while-revalidate=300, stale-if-error=300"
	} });
});
//#endregion
//#region \0virtual:astro:middleware
var onRequest = sequence(sequence(defineMiddleware(async (context, next) => {
	const requestId = crypto.randomUUID();
	try {
		return await next();
	} catch (error) {
		console.error(`[GLOBAL_ERROR] RequestId: ${requestId} - ${error.stack || error.message}`);
		if (error.message === "Rate limit exceeded") return new Response(JSON.stringify({
			error: "Too Many Requests",
			requestId
		}), {
			status: 429,
			headers: {
				"Content-Type": "application/json",
				"Retry-After": "60"
			}
		});
		if (error.message === "Invalid signature") return new Response(JSON.stringify({
			error: "Unauthorized",
			requestId
		}), {
			status: 401,
			headers: { "Content-Type": "application/json" }
		});
		return new Response(JSON.stringify({
			error: "Internal Server Error",
			requestId
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
}), onRequest$2));
//#endregion
export { onRequest };
