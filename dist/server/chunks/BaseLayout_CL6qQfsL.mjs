import { A as createAstro, D as addAttribute, E as renderHead, O as unescapeHTML, S as renderTemplate, b as renderComponent, j as createComponent, v as renderScript, x as renderSlot } from "./render_BR5mh6eO.mjs";
import "./compiler_CL20D8r2.mjs";
import { n as $$SEO, t as system_architecture_default } from "./global_Ddww2hr7.mjs";
//#region src/components/RichSnippet.astro
createAstro("https://bizkitgrow.vercel.app");
var $$RichSnippet = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$RichSnippet;
	const { pageTitle, pageDesc } = Astro.props;
	const currentUrl = Astro.url.href;
	const graph = [
		{
			"@context": "https://schema.org",
			"@type": "Organization",
			"@id": "#organization",
			name: "Bizkitgrow",
			url: "https://bizkitgrow.vercel.app",
			logo: "https://bizkitgrow.vercel.app/logo.png"
		},
		{
			"@context": "https://schema.org",
			"@type": "WebSite",
			"@id": "#website",
			name: "Bizkitgrow",
			url: "https://bizkitgrow.vercel.app",
			description: "Zero-latency B2B distribution systems."
		},
		{
			"@context": "https://schema.org",
			"@type": "WebPage",
			"@id": `${currentUrl}/#page`,
			isPartOf: { "@id": "#website" },
			name: pageTitle,
			description: pageDesc,
			mainEntityOfPage: `${currentUrl}/#page`
		}
	];
	return renderTemplate`<script type="application/ld+json">${unescapeHTML(JSON.stringify(graph))}<\/script>`;
}, "/Users/mac/Downloads/PROYEK/BIZKITDEV/src/components/RichSnippet.astro", void 0);
//#endregion
//#region src/utils/navigation.ts
var navigationLinks = [
	{
		href: "/",
		label: "HOME"
	},
	{
		href: "/esim/united-states",
		label: "eSIM CONNECTIVITY"
	},
	{
		href: "/reputation/new-york",
		label: "LOCAL AUTHORITY"
	},
	{
		href: "/solutions/crm-system",
		label: "SAAS SUITE"
	},
	{
		href: "/blog",
		label: "INTELLIGENCE"
	}
];
var footerLinks = {
	product: [
		{
			href: "/esim/united-states",
			label: "Global eSIM Plans"
		},
		{
			href: "/reputation/new-york",
			label: "Reputation Gating"
		},
		{
			href: "/solutions/crm-system",
			label: "CRM & Automation"
		},
		{
			href: "/blog",
			label: "Intelligence Feed"
		}
	],
	company: [{
		href: "/privacy",
		label: "Privacy Perimeter"
	}, {
		href: "/terms",
		label: "Terms of Authority"
	}]
};
//#endregion
//#region src/layouts/BaseLayout.astro
createAstro("https://bizkitgrow.vercel.app");
var $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BaseLayout;
	const { title, description, canonicalUrl, schemaType = "WebSite", ogImage, articleMeta } = Astro.props;
	const brandName = system_architecture_default.tenant_settings.brand_name;
	system_architecture_default.tenant_settings.support_email;
	const safeCanonical = canonicalUrl || Astro.url.href;
	const safeOgImage = ogImage || new URL("/og-image.webp", safeCanonical).href;
	const safeTitle = `${title} | ${brandName}`;
	const structuredData = {
		"@context": "https://schema.org",
		"@type": schemaType,
		name: brandName,
		url: safeCanonical,
		description
	};
	if (schemaType === "Article" && articleMeta) Object.assign(structuredData, {
		"@type": "Article",
		headline: title,
		datePublished: articleMeta.datePublished || (/* @__PURE__ */ new Date()).toISOString(),
		dateModified: articleMeta.dateModified || (/* @__PURE__ */ new Date()).toISOString(),
		keywords: (articleMeta.keywords || []).join(", "),
		speakable: {
			"@type": "SpeakableSpecification",
			cssSelector: [
				"h1",
				"h2",
				".article-summary"
			]
		},
		publisher: {
			"@type": "Organization",
			name: brandName,
			url: "https://bizkitgrow.vercel.app"
		}
	});
	const websiteSchema = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: brandName,
		url: "https://bizkitgrow.vercel.app",
		potentialAction: {
			"@type": "SearchAction",
			target: "https://bizkitgrow.vercel.app/blog?q={search_term_string}",
			"query-input": "required name=search_term_string"
		}
	};
	return renderTemplate`<html lang="en" class="scroll-smooth" data-astro-cid-z4jru4n3><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge">${renderComponent($$result, "SEO", $$SEO, {
		"title": safeTitle,
		"description": description.slice(0, 160),
		"canonical": safeCanonical,
		"openGraph": { basic: {
			title: title.slice(0, 60),
			type: schemaType === "Article" ? "article" : "website",
			image: safeOgImage
		} },
		"twitter": {
			card: "summary_large_image",
			image: safeOgImage,
			title: title.slice(0, 60),
			description: description.slice(0, 160)
		},
		"data-astro-cid-z4jru4n3": true
	})}<link rel="icon" type="image/png" href="/favicon.png"><meta name="naver-site-verification" content="verified_bizkitgrow"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Outfit:wght@800;900&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet"><!-- Structured Data: WebSite (always) --><script type="application/ld+json">${unescapeHTML(JSON.stringify(websiteSchema))}<\/script>${renderComponent($$result, "RichSnippet", $$RichSnippet, {
		"pageTitle": safeTitle,
		"pageDesc": description,
		"data-astro-cid-z4jru4n3": true
	})}<!-- Structured Data: Page-specific -->${schemaType !== "WebSite" && renderTemplate`<script type="application/ld+json">${unescapeHTML(JSON.stringify(structuredData))}<\/script>`}${renderSlot($$result, $$slots["schema"])}<!-- OneSignal Web SDK v16 --><script>
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    OneSignalDeferred.push(async function(OneSignal) {
      await OneSignal.init({
        appId: "498d3a2b-c642-41a3-b70c-c4b1185c958c",
        safari_web_id: "web.onesignal.auto.3437296f-1581-4c9c-99a7-ef947df2b18c",
        allowLocalhostAsSecureOrigin: true,
        serviceWorkerPath: "/OneSignalSDKWorker.js",
        notifyButton: { 
          enable: true,
          theme: "inverse"
        },
      });
    });
  <\/script><script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer><\/script>${renderHead($$result)}</head><body class="bg-canvas dark:bg-canvas text-text_primary antialiased" data-astro-cid-z4jru4n3><nav class="bg-white border-b border-borders_subtle w-full z-50 top-0 start-0" data-astro-cid-z4jru4n3><div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4" data-astro-cid-z4jru4n3><a href="/" class="flex items-center space-x-3 rtl:space-x-reverse" data-astro-cid-z4jru4n3><span class="font-heading text-xl font-extrabold tracking-widest text-text_primary uppercase" data-astro-cid-z4jru4n3>BIZKITGROW<span class="text-brand_cta" data-astro-cid-z4jru4n3>_</span></span></a><div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse" data-astro-cid-z4jru4n3><button type="button" class="text-white bg-brand_cta hover:bg-brand_cta_hover focus:ring-4 focus:outline-none focus:ring-teal-300 font-mono font-bold tracking-widest text-xs px-4 py-2 text-center" data-astro-cid-z4jru4n3>ACQUIRE ACCESS</button><button data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-sticky" aria-expanded="false" data-astro-cid-z4jru4n3><span class="sr-only" data-astro-cid-z4jru4n3>Open main menu</span><svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14" data-astro-cid-z4jru4n3><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" data-astro-cid-z4jru4n3></path></svg></button></div><div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky" data-astro-cid-z4jru4n3><ul class="flex flex-col p-4 md:p-0 mt-4 font-mono font-bold tracking-widest text-xs border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white" data-astro-cid-z4jru4n3>${navigationLinks.map((link) => renderTemplate`<li data-astro-cid-z4jru4n3><a${addAttribute(link.href, "href")}${addAttribute(`block py-2 px-3 rounded md:bg-transparent ${Astro.url.pathname === link.href ? "text-brand_cta" : "text-text_secondary"} md:hover:text-brand_cta md:p-0`, "class")} aria-current="page" data-astro-cid-z4jru4n3>${link.label}</a></li>`)}</ul></div></div></nav><main class="flex-grow pt-8" data-astro-cid-z4jru4n3>${renderSlot($$result, $$slots["default"])}</main><footer class="bg-canvas_accent border-t border-borders_subtle mt-20" data-astro-cid-z4jru4n3><div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8" data-astro-cid-z4jru4n3><div class="md:flex md:justify-between" data-astro-cid-z4jru4n3><div class="mb-6 md:mb-0" data-astro-cid-z4jru4n3><a href="/" class="flex items-center" data-astro-cid-z4jru4n3><span class="self-center font-heading text-2xl font-extrabold tracking-widest whitespace-nowrap text-text_primary uppercase" data-astro-cid-z4jru4n3>BIZKITGROW<span class="text-brand_cta" data-astro-cid-z4jru4n3>_</span></span></a><p class="mt-4 text-sm text-text_secondary max-w-sm" data-astro-cid-z4jru4n3>Autonomous B2B infrastructure for global remote operators: sovereign connectivity, reputation gating, and back-office automation.</p></div><div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3" data-astro-cid-z4jru4n3><div data-astro-cid-z4jru4n3><h2 class="mb-6 text-sm font-mono tracking-widest font-bold text-text_primary uppercase" data-astro-cid-z4jru4n3>Product</h2><ul class="text-text_secondary font-medium" data-astro-cid-z4jru4n3>${footerLinks.product.map((link) => renderTemplate`<li class="mb-4" data-astro-cid-z4jru4n3><a${addAttribute(link.href, "href")} class="hover:underline" data-astro-cid-z4jru4n3>${link.label}</a></li>`)}</ul></div><div data-astro-cid-z4jru4n3><h2 class="mb-6 text-sm font-mono tracking-widest font-bold text-text_primary uppercase" data-astro-cid-z4jru4n3>Legal</h2><ul class="text-text_secondary font-medium" data-astro-cid-z4jru4n3>${footerLinks.company.map((link) => renderTemplate`<li class="mb-4" data-astro-cid-z4jru4n3><a${addAttribute(link.href, "href")} class="hover:underline" data-astro-cid-z4jru4n3>${link.label}</a></li>`)}</ul></div></div></div><hr class="my-6 border-borders_subtle sm:mx-auto lg:my-8" data-astro-cid-z4jru4n3><div class="sm:flex sm:items-center sm:justify-between" data-astro-cid-z4jru4n3><span class="font-mono text-sm text-text_secondary sm:text-center tracking-wider" data-astro-cid-z4jru4n3>© ${(/* @__PURE__ */ new Date()).getFullYear()} ${system_architecture_default.tenant_settings.parent_company_copyright}. All operational assets secure.</span></div></div></footer>${renderScript($$result, "/Users/mac/Downloads/PROYEK/BIZKITDEV/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts")}</body></html>`;
}, "/Users/mac/Downloads/PROYEK/BIZKITDEV/src/layouts/BaseLayout.astro", void 0);
//#endregion
export { $$BaseLayout as t };
