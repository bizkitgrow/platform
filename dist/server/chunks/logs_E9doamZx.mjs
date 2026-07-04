import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as createAstro, D as addAttribute, S as renderTemplate, T as maybeRenderHead, b as renderComponent, j as createComponent } from "./render_BR5mh6eO.mjs";
import "./compiler_CL20D8r2.mjs";
import "./global_Ddww2hr7.mjs";
import { t as $$AdminLayout } from "./AdminLayout_C3iOjgVF.mjs";
//#region src/pages/admin/logs.astro
var logs_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Logs,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://bizkitgrow.vercel.app");
var $$Logs = createComponent(($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$Logs;
	const authHeader = Astro2.request.headers.get("Authorization");
	if (!authHeader || !authHeader.startsWith("Basic ")) {
		Astro2.response.headers.set("WWW-Authenticate", "Basic realm=\"Bizkitgrow Admin Perimeter\"");
		return new Response("Unauthorized Access", { status: 401 });
	}
	try {
		const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64").toString("ascii").split(":");
		if (username !== "bizkitgrowadmin" || password !== "@Zedworm123.") {
			Astro2.response.headers.set("WWW-Authenticate", "Basic realm=\"Bizkitgrow Admin Perimeter\"");
			return new Response("Unauthorized Access", { status: 401 });
		}
	} catch (err) {
		Astro2.response.headers.set("WWW-Authenticate", "Basic realm=\"Bizkitgrow Admin Perimeter\"");
		return new Response("Unauthorized Access", { status: 401 });
	}
	const systemLogs = [].map((l) => ({
		timestamp: l.createdAt ? new Date(l.createdAt).toLocaleString() : "N/A",
		level: l.status,
		message: l.errorDetails || `Miner fetched ${l.itemsFetched} new items.`,
		jobType: l.jobType
	}));
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Automation Logs" }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-gray-900 p-6 rounded-sm border border-gray-800"><div><h1 class="text-2xl font-heading font-black text-white tracking-tight uppercase">Automation Logs</h1><p class="text-sm font-mono text-gray-400 mt-1 uppercase tracking-widest">System telemetry, crawler errors, and ingestion history.</p></div></div><section class="bg-gray-900 border border-gray-800 rounded-sm p-6 sm:p-8"><div class="overflow-x-auto"><table class="w-full text-sm text-left text-gray-400 font-mono"><thead class="text-xs text-gray-500 uppercase bg-gray-800 border-b border-gray-700"><tr><th scope="col" class="px-6 py-3">Timestamp</th><th scope="col" class="px-6 py-3">Job Type</th><th scope="col" class="px-6 py-3">Status</th><th scope="col" class="px-6 py-3">Message</th></tr></thead><tbody>${systemLogs.length > 0 ? systemLogs.map((log) => renderTemplate`<tr class="bg-gray-900 border-b border-gray-800 hover:bg-gray-800 transition-colors"><td class="px-6 py-4 text-gray-500 whitespace-nowrap">${log.timestamp}</td><td class="px-6 py-4 uppercase font-bold text-gray-300">${log.jobType}</td><td class="px-6 py-4"><span${addAttribute(`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest border ${log.level === "SUCCESS" ? "bg-green-900/20 text-brand_cta border-brand_cta/30" : log.level === "ERROR" ? "bg-rose-900/20 text-rose-500 border-rose-500/30" : "bg-blue-900/20 text-blue-300 border-blue-800/50"}`, "class")}>${log.level}</span></td><td class="px-6 py-4 text-gray-300">${log.message}</td></tr>`) : renderTemplate`<tr><td colspan="4" class="px-6 py-8 text-center text-gray-500">No logs found.</td></tr>`}</tbody></table></div></section>` })}`;
}, "/Users/mac/Downloads/PROYEK/BIZKITDEV/src/pages/admin/logs.astro", void 0);
var $$file = "/Users/mac/Downloads/PROYEK/BIZKITDEV/src/pages/admin/logs.astro";
var $$url = "/admin/logs";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/logs@_@astro
var page = () => logs_exports;
//#endregion
export { page };
