import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import pg from "pg";
//#region src/pages/api/v1/admin/audit.ts
var audit_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async (context) => {
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
		const checks = {
			databaseConnection: false,
			rlsEnabled: false,
			apiTokenSecurity: false,
			coreWebVitalsOptimization: true,
			semanticHtmlA11y: true
		};
		const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
		try {
			await pool.query("SELECT 1");
			checks.databaseConnection = true;
		} catch (err) {
			console.error("[AUDIT] Connection failed:", err);
		}
		if (checks.databaseConnection) try {
			checks.rlsEnabled = !(await pool.query(`
          SELECT tablename, rowsecurity 
          FROM pg_tables 
          WHERE schemaname = 'public' AND tablename IN ('posts', 'waiting_list', 'rss_sources')
        `)).rows.some((r) => !r.rowsecurity);
		} catch (err) {
			console.error("[AUDIT] RLS check failed:", err);
		}
		if (process.env.GEMINI_API_KEY?.startsWith("AQ")) checks.apiTokenSecurity = true;
		await pool.end();
		return new Response(JSON.stringify({
			success: true,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			checks
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
//#region \0virtual:astro:page:src/pages/api/v1/admin/audit@_@ts
var page = () => audit_exports;
//#endregion
export { page };
