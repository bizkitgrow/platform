import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import pg from "pg";
//#region src/pages/api/v1/admin/digest.ts
var digest_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async (context) => {
	try {
		const authHeader = context.request.headers.get("Authorization");
		if (!authHeader || !authHeader.startsWith("Basic ")) return new Response("Unauthorized Access", {
			status: 401,
			headers: { "WWW-Authenticate": "Basic realm=\"Bizkitgrow Admin Perimeter\"" }
		});
		const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64").toString("ascii").split(":");
		if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) return new Response("Unauthorized Access", {
			status: 401,
			headers: { "WWW-Authenticate": "Basic realm=\"Bizkitgrow Admin Perimeter\"" }
		});
		const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
		const posts = (await pool.query("SELECT id, title, slug, created_at FROM posts WHERE created_at >= NOW() - INTERVAL '24 hours'")).rows;
		if (posts.length === 0) {
			await pool.end();
			return new Response(JSON.stringify({
				success: true,
				message: "No articles generated in the last 24 hours. Daily digest build skipped.",
				digest: null
			}), {
				status: 200,
				headers: { "Content-Type": "application/json" }
			});
		}
		const digestText = posts.map((p) => `- ${p.title} (https://bizkitgrow.com/blog/${p.slug})`).join("\n");
		const digestPayload = {
			title: `Daily Digest Briefing - ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-US")}`,
			body: `Here are the latest B2B operational briefings generated today:\n\n${digestText}\n\nAll perimeters secured.`,
			generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			itemCount: posts.length
		};
		await pool.query("INSERT INTO automation_logs (items_fetched, status, execution_duration_ms, error_details) VALUES ($1, 'SUCCESS', 0, $2)", [posts.length, `Daily digest created successfully for ${posts.length} articles.`]);
		await pool.end();
		return new Response(JSON.stringify({
			success: true,
			message: "Daily digest built and logged successfully.",
			digest: digestPayload
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (err) {
		return new Response(JSON.stringify({
			success: false,
			error: err.message
		}), { status: 500 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/v1/admin/digest@_@ts
var page = () => digest_exports;
//#endregion
export { page };
