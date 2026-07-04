import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as createAstro, D as addAttribute, S as renderTemplate, T as maybeRenderHead, b as renderComponent, j as createComponent } from "./render_BR5mh6eO.mjs";
import "./compiler_CL20D8r2.mjs";
import "./global_Ddww2hr7.mjs";
import { n as posts, t as db } from "./client_BYvXqxuP.mjs";
import { t as $$AdminLayout } from "./AdminLayout_C3iOjgVF.mjs";
import { desc } from "drizzle-orm";
//#region src/pages/admin/posts.astro
var posts_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Posts,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://bizkitgrow.vercel.app");
var $$Posts = createComponent(async ($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$Posts;
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
	let posts$1 = [];
	try {
		posts$1 = await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(50);
	} catch (err) {
		console.error("Posts DB query error:", err.message);
	}
	const activePosts = posts$1.map((p) => {
		let aiStatus = "NONE";
		if (p.aiSummary && typeof p.aiSummary === "object") {
			if (p.aiSummary.metaDesc) aiStatus = "POLISHED";
		}
		return {
			...p,
			aiStatus
		};
	});
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Content Operations" }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-gray-900 p-6 rounded-sm border border-gray-800"><div><h1 class="text-2xl font-heading font-black text-white tracking-tight uppercase">Content Operations</h1><p class="text-sm font-mono text-gray-400 mt-1 uppercase tracking-widest">Manage ingested articles, AI polishing status, and SEO metadata.</p></div></div><section class="bg-gray-900 border border-gray-800 rounded-sm p-6 sm:p-8"><div class="overflow-x-auto"><table class="w-full text-sm text-left text-gray-400 font-mono"><thead class="text-xs text-gray-500 uppercase bg-gray-800 border-b border-gray-700"><tr><th scope="col" class="px-6 py-3">Title</th><th scope="col" class="px-6 py-3">Pillar</th><th scope="col" class="px-6 py-3">Publish Status</th><th scope="col" class="px-6 py-3">AI Status</th><th scope="col" class="px-6 py-3 text-right">Actions</th></tr></thead><tbody>${activePosts.length > 0 ? activePosts.map((post) => renderTemplate`<tr class="bg-gray-900 border-b border-gray-800 hover:bg-gray-800 transition-colors"><td class="px-6 py-4 font-bold text-white max-w-[300px] truncate">${post.title}</td><td class="px-6 py-4 capitalize">${post.targetProductKey}</td><td class="px-6 py-4"><span${addAttribute(`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest border ${post.status === "PUBLISHED" ? "bg-green-900/20 text-brand_cta border-brand_cta/30" : "bg-yellow-900/20 text-yellow-500 border-yellow-500/30"}`, "class")}>${post.status}</span></td><td class="px-6 py-4"><span${addAttribute(`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest border ${post.aiStatus === "POLISHED" ? "bg-purple-900/20 text-purple-400 border-purple-500/30" : "bg-gray-800 text-gray-500 border-gray-700"}`, "class")}>${post.aiStatus}</span></td><td class="px-6 py-4 text-right"><a${addAttribute(`/blog/${post.slug}`, "href")} target="_blank" rel="noopener noreferrer" class="text-brand_cta hover:text-white font-bold text-xs transition-colors">View</a></td></tr>`) : renderTemplate`<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">No posts found. Run the ingestion pipeline.</td></tr>`}</tbody></table></div></section>` })}`;
}, "/Users/mac/Downloads/PROYEK/BIZKITDEV/src/pages/admin/posts.astro", void 0);
var $$file = "/Users/mac/Downloads/PROYEK/BIZKITDEV/src/pages/admin/posts.astro";
var $$url = "/admin/posts";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/posts@_@astro
var page = () => posts_exports;
//#endregion
export { page };
