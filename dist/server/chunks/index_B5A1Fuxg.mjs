import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { D as addAttribute, O as unescapeHTML, S as renderTemplate, T as maybeRenderHead, b as renderComponent, j as createComponent } from "./render_BR5mh6eO.mjs";
import "./compiler_CL20D8r2.mjs";
import "./global_Ddww2hr7.mjs";
import { n as posts, t as db } from "./client_BYvXqxuP.mjs";
import { t as $$BaseLayout } from "./BaseLayout_CL6qQfsL.mjs";
import { desc } from "drizzle-orm";
//#region src/pages/blog/index.astro
var blog_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const currentUrl = "https://bizkitgrow.vercel.app/blog";
	let dbPosts = [];
	try {
		dbPosts = await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(24);
	} catch (err) {
		console.error("Database query failed, using fallback:", err.message);
	}
	const fallbackPosts = [{
		title: "The Future of Global Connectivity for Remote Teams",
		slug: "the-future-of-connectivity-and-mobility",
		excerpt: "Enterprise eSIM infrastructure is replacing legacy SIM provisioning — here is what B2B operators need to know in 2026.",
		readingTime: "3 min read",
		createdAt: "Jul 4, 2026",
		pillar: "esim_data_plans"
	}, {
		title: "Google Rewrites the Search Interface",
		slug: "google-rewrites-search-2026",
		excerpt: "The largest upgrade to Google Search in 25 years is reshaping local SEO authority. What every B2B operator must act on now.",
		readingTime: "5 min read",
		createdAt: "Jul 4, 2026",
		pillar: "ai_business_tools_suite"
	}];
	const pillarColors = {
		esim_data_plans: "#00ff66",
		reputation_management: "#f59e0b",
		ai_business_tools_suite: "#60a5fa",
		default: "#71717a"
	};
	const pillarLabels = {
		esim_data_plans: "CONNECTIVITY",
		reputation_management: "SEARCH AUTHORITY",
		ai_business_tools_suite: "AI TOOLS",
		default: "INTELLIGENCE"
	};
	const posts$1 = dbPosts.length > 0 ? dbPosts.map((p) => ({
		title: p.title,
		slug: p.slug,
		excerpt: p.metaDesc || "Read the complete analysis from the Bizkitgrow intelligence feed.",
		readingTime: `${Math.max(2, Math.ceil((p.content?.length || 1e3) / 1500))} min read`,
		createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric"
		}) : "Jul 4, 2026",
		pillar: p.targetProductKey || "ai_business_tools_suite"
	})) : fallbackPosts;
	const filters = [
		{
			key: "all",
			label: "ALL BRIEFINGS"
		},
		{
			key: "esim_data_plans",
			label: "CONNECTIVITY"
		},
		{
			key: "reputation_management",
			label: "AUTHORITY"
		},
		{
			key: "ai_business_tools_suite",
			label: "AI TOOLS"
		}
	];
	const blogListSchema = {
		"@context": "https://schema.org",
		"@type": "Blog",
		name: "Bizkitgrow Intelligence Feed",
		url: currentUrl,
		description: "Sovereign B2B operational intelligence: eSIM, reputation gating, and AI automation briefings.",
		blogPost: posts$1.slice(0, 5).map((p) => ({
			"@type": "BlogPosting",
			headline: p.title,
			url: `https://bizkitgrow.vercel.app/blog/${p.slug}`,
			datePublished: p.createdAt
		}))
	};
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": "Intelligence Briefings",
		"description": "Sovereign operational intelligence: eSIM network updates, local search authority shifts, and AI automation tools for B2B operators.",
		"canonicalUrl": currentUrl
	}, {
		"default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main class="max-w-7xl mx-auto px-6 py-20"><!-- Header --><header class="mb-16 border-b border-[#1c1c1e] pb-12"><div class="font-['JetBrains_Mono'] text-[10px] text-[#52525b] uppercase tracking-widest mb-4">[ INTELLIGENCE FEED // LIVE ]</div><h1 class="font-['Outfit'] text-5xl md:text-7xl font-black text-white uppercase tracking-tight">Intelligence<br>Briefings.</h1><p class="mt-4 text-sm text-[#71717a] max-w-xl leading-relaxed">Curated B2B intelligence on global connectivity shifts, local search algorithm changes, and operational automation tools. Updated autonomously.</p><!-- Filters --><div class="flex flex-wrap gap-2 mt-8" role="group" aria-label="Filter by category">${filters.map((f, i) => renderTemplate`<button${addAttribute(f.key, "data-filter")}${addAttribute(`filter-btn font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest px-4 py-2 border transition-colors ${i === 0 ? "border-white text-white" : "border-[#1c1c1e] text-[#71717a] hover:border-[#3f3f46] hover:text-white"}`, "class")}>${f.label}</button>`)}</div></header><!-- Posts Grid --><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y md:divide-y-0" id="posts-grid">${posts$1.map((post, i) => {
			const color = pillarColors[post.pillar] || pillarColors.default;
			const pillarLabel = pillarLabels[post.pillar] || pillarLabels.default;
			return renderTemplate`<article${addAttribute(post.pillar, "data-category")} class="post-card border border-[#1c1c1e] -mt-px -ml-px group hover:border-[#3f3f46] transition-colors"><div class="p-8 flex flex-col h-full"><div class="flex items-center gap-3 mb-4"><span class="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest"${addAttribute(`color: ${color}`, "style")}>${pillarLabel}</span><span class="text-[#3f3f46]">//</span><span class="font-['JetBrains_Mono'] text-[9px] text-[#52525b] uppercase tracking-wider">${post.readingTime}</span></div><h2 class="font-['Outfit'] text-xl font-black text-white uppercase tracking-tight leading-snug mb-3 group-hover:text-[#a1a1aa] transition-colors"><a${addAttribute(`/blog/${post.slug}`, "href")} class="stretched-link">${post.title}</a></h2><p class="text-sm text-[#71717a] leading-relaxed mb-6 flex-grow">${post.excerpt}</p><div class="flex items-center justify-between"><span class="font-['JetBrains_Mono'] text-[9px] text-[#3f3f46] uppercase tracking-wider">${post.createdAt}</span><span class="font-['JetBrains_Mono'] text-[10px] text-[#00ff66] uppercase tracking-wider group-hover:text-white transition-colors">READ →</span></div></div></article>`;
		})}</div>${posts$1.length === 0 && renderTemplate`<div class="border border-[#1c1c1e] p-16 text-center"><div class="font-['JetBrains_Mono'] text-[10px] text-[#52525b] uppercase tracking-widest mb-3">FEED INITIALIZING</div><p class="text-sm text-[#71717a]">Intelligence pipeline is warming up. New briefings will appear automatically after the next ingestion cycle.</p></div>`}</main><script>
    var btns = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.post-card');

    btns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var filter = btn.getAttribute('data-filter');

        btns.forEach(function(b) {
          b.classList.remove('border-white', 'text-white');
          b.classList.add('border-[#1c1c1e]', 'text-[#71717a]');
        });
        btn.classList.add('border-white', 'text-white');
        btn.classList.remove('border-[#1c1c1e]', 'text-[#71717a]');

        cards.forEach(function(card) {
          var cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  <\/script>`,
		"schema": ($$result) => renderTemplate`<script type="application/ld+json">${unescapeHTML(JSON.stringify(blogListSchema))}<\/script>`
	})}`;
}, "/Users/mac/Downloads/PROYEK/BIZKITDEV/src/pages/blog/index.astro", void 0);
var $$file = "/Users/mac/Downloads/PROYEK/BIZKITDEV/src/pages/blog/index.astro";
var $$url = "/blog";
//#endregion
//#region \0virtual:astro:page:src/pages/blog/index@_@astro
var page = () => blog_exports;
//#endregion
export { page };
