import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as createAstro, D as addAttribute, O as unescapeHTML, S as renderTemplate, T as maybeRenderHead, b as renderComponent, j as createComponent } from "./render_BR5mh6eO.mjs";
import "./compiler_CL20D8r2.mjs";
import "./global_Ddww2hr7.mjs";
import { n as posts, t as db } from "./client_BYvXqxuP.mjs";
import { t as $$BaseLayout } from "./BaseLayout_CL6qQfsL.mjs";
import { and, eq, ne } from "drizzle-orm";
//#region src/components/AGCParaphraser.astro
createAstro("https://bizkitgrow.vercel.app");
var $$AGCParaphraser = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$AGCParaphraser;
	const { originalText, paraphrasedHook, syntacticVariant, paraphraseSummary } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="agc-paraphraser mt-12 mb-12 border border-borders_subtle py-8 px-6 bg-canvas_accent text-text_primary rounded-sm shadow-subtle relative overflow-hidden" data-astro-cid-peqmqk5k><div class="absolute left-0 top-0 bottom-0 w-1 bg-brand_cta" data-astro-cid-peqmqk5k></div><div class="flex items-center justify-between mb-6" data-astro-cid-peqmqk5k><h3 class="text-xl font-bold uppercase tracking-wider font-heading" data-astro-cid-peqmqk5k>AI Ingestion Synapse</h3><span class="bg-brand_cta text-white text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-sm" data-astro-cid-peqmqk5k>AI Polished</span></div><div class="grid grid-cols-1 md:grid-cols-2 gap-8" data-astro-cid-peqmqk5k><div class="original-content border border-borders_subtle p-6 bg-white rounded-sm shadow-subtle" data-astro-cid-peqmqk5k><h4 class="text-xs uppercase text-text_secondary mb-4 tracking-widest font-mono" data-astro-cid-peqmqk5k>Original Source</h4><div class="prose prose-sm max-w-none opacity-80" data-astro-cid-peqmqk5k><p class="text-text_secondary" data-astro-cid-peqmqk5k>${originalText.substring(0, 300)}...</p></div></div><div class="paraphrased-content border-l-4 border-brand_cta p-6 bg-white border border-borders_subtle rounded-sm shadow-subtle" data-astro-cid-peqmqk5k><h4 class="text-xs uppercase text-text_primary mb-4 tracking-widest font-mono flex items-center gap-2" data-astro-cid-peqmqk5k><svg class="w-4 h-4 text-brand_cta" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-peqmqk5k><path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" data-astro-cid-peqmqk5k></path></svg>Tactical Refinement</h4>${paraphrasedHook && renderTemplate`<div class="mb-4" data-astro-cid-peqmqk5k><span class="text-xs uppercase text-text_secondary block mb-1" data-astro-cid-peqmqk5k>Hook</span><p class="font-bold text-lg text-text_primary" data-astro-cid-peqmqk5k>${paraphrasedHook}</p></div>`}${syntacticVariant && renderTemplate`<div class="mb-4" data-astro-cid-peqmqk5k><span class="text-xs uppercase text-text_secondary block mb-1" data-astro-cid-peqmqk5k>Syntactic Variant</span><p class="italic border-l-2 border-borders_subtle pl-3 text-text_secondary" data-astro-cid-peqmqk5k>${syntacticVariant}</p></div>`}${paraphraseSummary && renderTemplate`<div data-astro-cid-peqmqk5k><span class="text-xs uppercase text-text_secondary block mb-1" data-astro-cid-peqmqk5k>Executive Summary</span><p class="text-sm text-text_secondary" data-astro-cid-peqmqk5k>${paraphraseSummary}</p></div>`}</div></div></div>`;
}, "/Users/mac/Downloads/PROYEK/BIZKITDEV/src/components/AGCParaphraser.astro", void 0);
//#endregion
//#region src/components/ResellPortalWidget.astro
createAstro("https://bizkitgrow.vercel.app");
var $$ResellPortalWidget = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ResellPortalWidget;
	const { productSku = "ai-blog-generator", theme = "dark-brutalist", resellportalStatus = "pending" } = Astro.props;
	return renderTemplate`${resellportalStatus === "active" ? renderTemplate`${maybeRenderHead($$result)}<div class="resellportal-widget bg-black text-white p-6 border-4 border-green-500 my-8"${addAttribute(productSku, "data-product")} data-brand="bizkitgrow"${addAttribute(theme, "data-theme")} data-astro-cid-m5w7gpao><div class="flex items-center justify-between" data-astro-cid-m5w7gpao><div data-astro-cid-m5w7gpao><h3 class="text-xl font-bold uppercase tracking-widest font-mono text-green-500 flex items-center gap-2" data-astro-cid-m5w7gpao><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" data-astro-cid-m5w7gpao><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-astro-cid-m5w7gpao></path></svg>Service Activated</h3><p class="text-sm mt-2 text-gray-400" data-astro-cid-m5w7gpao>Your SaaS instance is provisioned and running successfully.</p></div><a${addAttribute(`https://panel.resellportal.com/manage/${productSku}`, "href")} class="bg-white text-black px-6 py-3 font-bold uppercase tracking-widest hover:bg-green-500 hover:text-white transition-colors duration-200" data-astro-cid-m5w7gpao>Manage Instance</a></div></div>` : renderTemplate`<div class="resellportal-widget bg-black text-white p-6 border-4 border-white my-8"${addAttribute(productSku, "data-product")} data-brand="bizkitgrow"${addAttribute(theme, "data-theme")} data-astro-cid-m5w7gpao><div class="flex flex-col md:flex-row items-center justify-between gap-6" data-astro-cid-m5w7gpao><div data-astro-cid-m5w7gpao><h3 class="text-xl font-bold uppercase tracking-widest font-mono" data-astro-cid-m5w7gpao>Unlock Full Architecture</h3><p class="text-sm mt-2 text-gray-400" data-astro-cid-m5w7gpao>Deploy your own enterprise-grade ${productSku} infrastructure instantly.</p></div><button class="bg-white text-black px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors duration-200 w-full md:w-auto"${addAttribute(`window.location.href='https://shop.bizkitgrow.com/checkout/${productSku}'`, "onclick")} data-astro-cid-m5w7gpao>Provision Now</button></div></div>`}`;
}, "/Users/mac/Downloads/PROYEK/BIZKITDEV/src/components/ResellPortalWidget.astro", void 0);
//#endregion
//#region src/pages/blog/[slug].astro
var _slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Slug,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://bizkitgrow.vercel.app");
var $$Slug = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Slug;
	Astro.response.headers.set("Cache-Control", "public, max-age=0, s-maxage=3600");
	const { slug } = Astro.params;
	let post = null;
	let relatedPosts = [];
	let aiMeta = {};
	try {
		const fetchedPosts = await db.select().from(posts).where(eq(posts.slug, slug || "")).limit(1);
		if (fetchedPosts.length > 0) {
			post = fetchedPosts[0];
			relatedPosts = await db.select().from(posts).where(and(eq(posts.targetProductSku, post.targetProductSku || "ai_business_tools_suite"), ne(posts.id, post.id))).limit(2);
			if (post.aiSummary && typeof post.aiSummary === "object") aiMeta = post.aiSummary;
		}
	} catch (err) {
		console.error("DB query failed:", err.message);
	}
	if (relatedPosts.length < 2) try {
		const skipId = post ? post.id : -1;
		const extra = await db.select().from(posts).where(ne(posts.id, skipId)).limit(2 - relatedPosts.length);
		relatedPosts = [...relatedPosts, ...extra];
	} catch {}
	const fallbackPost = {
		title: "The Future of Connectivity and Mobility",
		originalContent: "<h2>Embracing the Era of Advanced Mobility</h2><p>In today's fast-paced corporate environment, mobility and connectivity dictate market leadership. The integration of robust network infrastructures enables unprecedented growth and operational automation.</p>",
		content: "<h2>Embracing the Era of Advanced Mobility</h2><p>In today's fast-paced corporate environment, mobility and connectivity dictate market leadership. The integration of robust network infrastructures enables unprecedented growth and operational automation.</p>",
		targetProductSku: "esim_data_plans",
		metaDesc: "Enterprise eSIM infrastructure is replacing legacy SIM provisioning. Understand what B2B operators need in 2026.",
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	const activePost = post || fallbackPost;
	const mainContent = activePost.originalContent || activePost.content || "";
	const wordCount = mainContent.replace(/<[^>]*>/g, "").split(/\s+/).length;
	const readingTime = Math.max(2, Math.ceil(wordCount / 200));
	const CTA_MAP = {
		esim_data_plans: {
			headline: "Deploy Sovereign Connectivity",
			body: "Instant global eSIM provisioning across 190+ countries with enterprise-grade encryption. Sub-420ms activation, zero contracts.",
			cta: "CONFIGURE YOUR ESIM",
			href: "/esim/united-states"
		},
		reputation_management: {
			headline: "Own the Local Search Grid",
			body: "Automate Google Business Profile optimization and review capture sequences. Dominate high-value zip codes without volatile ad spend.",
			cta: "ACTIVATE REPUTATION ENGINE",
			href: "/reputation/new-york"
		},
		ai_business_tools_suite: {
			headline: "Initialize Agency Automation",
			body: "Consolidate invoicing, AI scheduling, and client communications under a single white-label portal. Zero administrative overhead.",
			cta: "ACCESS THE SUITE",
			href: "/solutions/crm-system"
		}
	};
	const cta = CTA_MAP[activePost.targetProductSku] || CTA_MAP.ai_business_tools_suite;
	const heroImageUrl = activePost.originalImage ? activePost.originalImage : `https://image.pollinations.ai/prompt/${encodeURIComponent(`${activePost.title}, brutalist dark tech, neon accents`)}?width=1200&height=630&nologo=true`;
	const toc = [...mainContent.matchAll(/<h([23])[^>]*>([^<]+)<\/h[23]>/gi)].map((m, i) => ({
		level: Number.parseInt(m[1]),
		text: m[2].trim(),
		id: `section-${i}`
	}));
	const pillarLabels = {
		esim_data_plans: "CONNECTIVITY",
		reputation_management: "SEARCH AUTHORITY",
		ai_business_tools_suite: "AI TOOLS"
	};
	const metaDesc = aiMeta.metaDesc || activePost.metaDesc || activePost.title;
	const articleSchema = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: activePost.title,
		description: metaDesc,
		image: heroImageUrl,
		url: Astro.url.href,
		datePublished: activePost.createdAt,
		dateModified: activePost.createdAt,
		keywords: pillarLabels[activePost.targetProductSku] || "B2B, Technology",
		publisher: {
			"@type": "Organization",
			name: "Bizkitgrow",
			url: "https://bizkitgrow.vercel.app"
		},
		speakable: {
			"@type": "SpeakableSpecification",
			cssSelector: [".aeo-speakable-title", ".aeo-speakable-summary"]
		}
	};
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": activePost.title,
		"description": metaDesc.slice(0, 155),
		"canonicalUrl": Astro.url.href,
		"schemaType": "Article",
		"ogImage": heroImageUrl
	}, {
		"default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="fixed top-0 left-0 w-full h-[2px] bg-canvas_accent z-50"><div id="reading-progress" class="h-full bg-brand_cta w-0 transition-none"></div></div>Logic Layer Alignment<main class="max-w-screen-xl mx-auto px-4 py-16"><div class="flex gap-16"><!-- ═══════ SIDEBAR: Table of Contents ═══════ -->${toc.length > 0 && renderTemplate`<aside class="hidden xl:block w-64 shrink-0"><div class="sticky top-24"><h4 class="font-mono text-xs uppercase tracking-widest text-text_secondary mb-4 font-bold">CONTENTS</h4><nav aria-label="Table of contents"><ul class="space-y-3">${toc.map((item) => renderTemplate`<li${addAttribute(`padding-left: ${(item.level - 2) * 16}px`, "style")}><a${addAttribute(`#${item.id}`, "href")} class="font-mono text-[11px] text-text_secondary hover:text-brand_cta transition-colors leading-relaxed block">${item.text.slice(0, 50)}${item.text.length > 50 ? "..." : ""}</a></li>`)}</ul></nav></div></aside>`}<!-- ═══════ MAIN ARTICLE ═══════ --><article class="flex-1 min-w-0 max-w-3xl" itemscope itemtype="https://schema.org/Article"><!-- Header --><header class="mb-10 border-b border-borders_subtle pb-8"><div class="flex flex-wrap items-center gap-3 mb-5 font-mono text-xs uppercase tracking-widest text-text_secondary font-bold"><a href="/blog" class="hover:text-brand_cta transition-colors">INTELLIGENCE</a><span class="text-borders_subtle">/</span><span class="text-brand_cta">${pillarLabels[activePost.targetProductSku] || "BRIEFING"}</span></div><h1 itemprop="headline" class="aeo-speakable-title font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-text_primary uppercase tracking-tight leading-[0.9] mb-6">${activePost.title}</h1>${aiMeta.hook ? renderTemplate`<p class="aeo-speakable-summary text-xl text-text_secondary leading-relaxed mb-6 font-medium italic border-l-4 border-brand_cta pl-4" itemprop="description">${aiMeta.hook}</p>` : metaDesc && renderTemplate`<p class="aeo-speakable-summary text-xl text-text_secondary leading-relaxed mb-6 font-medium" itemprop="description">${metaDesc}</p>`}<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div class="flex items-center gap-4 font-mono text-xs text-text_secondary uppercase tracking-widest font-bold"><span>${readingTime} MIN READ</span><span class="text-borders_subtle">|</span><time${addAttribute(activePost.createdAt, "datetime")} itemprop="datePublished">${activePost.createdAt ? new Date(activePost.createdAt).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric"
		}).toUpperCase() : "JUL 4, 2026"}</time></div><!-- Social Share --><div class="flex items-center gap-3" role="group" aria-label="Share this article"><span class="font-mono text-xs text-text_secondary uppercase font-bold tracking-widest">SHARE:</span><a${addAttribute(`https://twitter.com/intent/tweet?text=${encodeURIComponent(activePost.title)}&url=${encodeURIComponent(Astro.url.href)}`, "href")} target="_blank" rel="noopener noreferrer" aria-label="Share on X (Twitter)" class="w-8 h-8 flex items-center justify-center border border-borders_subtle text-text_secondary hover:border-brand_cta hover:text-brand_cta transition-colors bg-canvas_accent rounded-sm"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg></a><a${addAttribute(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(Astro.url.href)}`, "href")} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" class="w-8 h-8 flex items-center justify-center border border-borders_subtle text-text_secondary hover:border-brand_cta hover:text-brand_cta transition-colors bg-canvas_accent rounded-sm"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg></a></div></div></header><!-- Hero Image --><div class="mb-10 border border-borders_subtle overflow-hidden aspect-[16/9] rounded-sm shadow-subtle bg-canvas_accent"><img${addAttribute(heroImageUrl, "src")}${addAttribute(activePost.title, "alt")} class="w-full h-full object-cover" loading="eager" fetchpriority="high" width="1200" height="630"></div><!-- OneSignal Subscribe CTA --><div class="mb-10 p-5 border border-borders_subtle flex items-center gap-4 bg-canvas_accent rounded-sm shadow-subtle hover:border-brand_cta transition-colors"><div class="w-8 h-8 bg-teal-50 flex items-center justify-center shrink-0 border border-brand_cta/20 rounded-sm"><span class="w-2 h-2 rounded-full bg-brand_cta animate-pulse"></span></div><div class="flex-1 min-w-0"><p class="font-mono text-xs text-text_primary uppercase tracking-widest font-bold">Get real-time intelligence drops. No newsletters. Only signal.</p></div><button id="subscribe-push-btn" class="font-mono text-[10px] uppercase tracking-widest bg-brand_cta text-white px-4 py-2 hover:bg-brand_cta_hover transition-colors shrink-0 font-bold rounded-sm">SUBSCRIBE</button></div><!-- Content --><div class="format format-invert lg:format-lg max-w-none prose-brutalist" itemprop="articleBody">${unescapeHTML(mainContent)}</div>${aiMeta.paraphrasedHook && renderTemplate`${renderComponent($$result, "AGCParaphraser", $$AGCParaphraser, {
			"originalText": mainContent.replace(/<[^>]*>/g, ""),
			"paraphrasedHook": aiMeta.paraphrasedHook,
			"syntacticVariant": aiMeta.syntacticVariant,
			"paraphraseSummary": aiMeta.paraphraseSummary
		})}`}${renderComponent($$result, "ResellPortalWidget", $$ResellPortalWidget, {
			"productSku": activePost.targetProductSku,
			"resellportalStatus": activePost.resellportalStatus,
			"theme": "light"
		})}<!-- Source Credit -->${activePost.sourceCredit && renderTemplate`<div class="mt-12 p-6 border-l-4 border-brand_cta bg-canvas_accent rounded-r-sm"><p class="font-mono text-xs uppercase tracking-widest text-text_secondary font-bold mb-2">SOURCE MATERIAL &amp; ATTRIBUTION</p><p class="text-sm text-text_secondary">This intelligence briefing integrates external context sourced from:<a${addAttribute(activePost.sourceCredit, "href")} target="_blank" rel="noopener noreferrer" class="text-brand_cta hover:underline break-all">${activePost.sourceCredit}</a></p></div>`}${aiMeta.tags && Array.isArray(aiMeta.tags) && aiMeta.tags.length > 0 && renderTemplate`<div class="mt-8 flex flex-wrap gap-2">${aiMeta.tags.map((tag) => renderTemplate`<span class="bg-canvas_accent text-text_secondary text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-sm border border-borders_subtle">${tag}</span>`)}</div>`}<!-- Pillar CTA Banner --><div class="mt-16 border border-gray-800 hover:border-brand_cta transition-colors p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-black rounded-sm shadow-md"><div class="max-w-lg"><div class="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">RELATED SOLUTION</div><h3 class="font-heading text-2xl font-black text-white uppercase tracking-tight mb-2">${cta.headline}</h3><p class="text-sm text-gray-400 leading-relaxed">${cta.body}</p></div><a${addAttribute(cta.href, "href")} class="font-mono text-xs font-bold uppercase tracking-widest bg-brand_cta hover:bg-brand_cta_hover text-black px-6 py-3 transition-colors shrink-0 inline-flex items-center gap-2 rounded-sm shadow-sm">${cta.cta} <span aria-hidden="true">→</span></a></div><!-- Related Briefings -->${relatedPosts.length > 0 && renderTemplate`<div class="mt-16 pt-12 border-t border-gray-800"><div class="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6 font-bold">RELATED BRIEFINGS</div><div class="grid grid-cols-1 sm:grid-cols-2 gap-8">${relatedPosts.map((rPost) => renderTemplate`<article class="p-6 bg-gray-900 border border-gray-800 hover:border-brand_cta transition-colors rounded-sm group relative"><div class="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-bold">${pillarLabels[rPost.targetProductSku] || "INTELLIGENCE"}</div><h4 class="font-heading text-lg font-black text-white uppercase tracking-tight leading-snug mb-3 group-hover:text-brand_cta transition-colors"><a${addAttribute(`/blog/${rPost.slug}`, "href")} class="stretched-link line-clamp-2">${rPost.title}</a></h4><p class="font-mono text-[10px] text-gray-600 uppercase tracking-widest font-bold">${rPost.createdAt ? new Date(rPost.createdAt).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric"
		}).toUpperCase() : "RECENT"}</p></article>`)}</div></div>`}</article></div></main><script>
    // Reading progress
    window.addEventListener('scroll', function() {
      var winScroll = document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var progress = height > 0 ? (winScroll / height) * 100 : 0;
      var bar = document.getElementById('reading-progress');
      if (bar) bar.style.width = progress + '%';
    }, { passive: true });

    // OneSignal subscribe button
    document.getElementById('subscribe-push-btn')?.addEventListener('click', function() {
      if (window.OneSignalDeferred) {
        window.OneSignalDeferred.push(function(OneSignal) {
          OneSignal.Slidedown.promptPush();
        });
      }
    });
    
    // Automatically assign IDs to h2/h3 for TOC to work
    document.querySelectorAll('.prose-brutalist h2, .prose-brutalist h3').forEach(function(heading, index) {
       if (!heading.id) heading.id = 'section-' + index;
    });
  <\/script>`,
		"schema": ($$result) => renderTemplate`<script type="application/ld+json">${unescapeHTML(JSON.stringify(articleSchema))}<\/script>`
	})}`;
}, "/Users/mac/Downloads/PROYEK/BIZKITDEV/src/pages/blog/[slug].astro", void 0);
var $$file = "/Users/mac/Downloads/PROYEK/BIZKITDEV/src/pages/blog/[slug].astro";
var $$url = "/blog/[slug]";
//#endregion
//#region \0virtual:astro:page:src/pages/blog/[slug]@_@astro
var page = () => _slug__exports;
//#endregion
export { page };
