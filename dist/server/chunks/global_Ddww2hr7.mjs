import { A as createAstro, D as addAttribute, O as unescapeHTML, S as renderTemplate, _ as spreadAttributes, b as renderComponent, j as createComponent } from "./render_BR5mh6eO.mjs";
import "./compiler_CL20D8r2.mjs";
//#region node_modules/astro-seo/src/components/OpenGraphArticleTags.astro
createAstro("https://bizkitgrow.vercel.app");
var $$OpenGraphArticleTags = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$OpenGraphArticleTags;
	const { publishedTime, modifiedTime, expirationTime, authors, section, tags } = Astro.props.openGraph.article;
	return renderTemplate`${publishedTime ? renderTemplate`<meta property="article:published_time"${addAttribute(publishedTime, "content")}>` : null}${modifiedTime ? renderTemplate`<meta property="article:modified_time"${addAttribute(modifiedTime, "content")}>` : null}${expirationTime ? renderTemplate`<meta property="article:expiration_time"${addAttribute(expirationTime, "content")}>` : null}${authors ? authors.map((author) => renderTemplate`<meta property="article:author"${addAttribute(author, "content")}>`) : null}${section ? renderTemplate`<meta property="article:section"${addAttribute(section, "content")}>` : null}${tags ? tags.map((tag) => renderTemplate`<meta property="article:tag"${addAttribute(tag, "content")}>`) : null}`;
}, "/Users/mac/Downloads/PROYEK/BIZKITDEV/node_modules/astro-seo/src/components/OpenGraphArticleTags.astro", void 0);
//#endregion
//#region node_modules/astro-seo/src/components/OpenGraphBasicTags.astro
createAstro("https://bizkitgrow.vercel.app");
var $$OpenGraphBasicTags = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$OpenGraphBasicTags;
	const { openGraph } = Astro.props;
	return renderTemplate`<meta property="og:title"${addAttribute(openGraph.basic.title, "content")}><meta property="og:type"${addAttribute(openGraph.basic.type, "content")}><meta property="og:image"${addAttribute(openGraph.basic.image, "content")}><meta property="og:url"${addAttribute(openGraph.basic.url || Astro.url.href, "content")}>`;
}, "/Users/mac/Downloads/PROYEK/BIZKITDEV/node_modules/astro-seo/src/components/OpenGraphBasicTags.astro", void 0);
//#endregion
//#region node_modules/astro-seo/src/components/OpenGraphImageTags.astro
createAstro("https://bizkitgrow.vercel.app");
var $$OpenGraphImageTags = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$OpenGraphImageTags;
	const { image } = Astro.props.openGraph.basic;
	const { secureUrl, type, width, height, alt } = Astro.props.openGraph.image;
	return renderTemplate`<meta property="og:image:url"${addAttribute(image, "content")}>${secureUrl ? renderTemplate`<meta property="og:image:secure_url"${addAttribute(secureUrl, "content")}>` : null}${type ? renderTemplate`<meta property="og:image:type"${addAttribute(type, "content")}>` : null}${width ? renderTemplate`<meta property="og:image:width"${addAttribute(width, "content")}>` : null}${height ? renderTemplate`<meta property="og:image:height"${addAttribute(height, "content")}>` : null}${alt ? renderTemplate`<meta property="og:image:alt"${addAttribute(alt, "content")}>` : null}`;
}, "/Users/mac/Downloads/PROYEK/BIZKITDEV/node_modules/astro-seo/src/components/OpenGraphImageTags.astro", void 0);
//#endregion
//#region node_modules/astro-seo/src/components/OpenGraphOptionalTags.astro
createAstro("https://bizkitgrow.vercel.app");
var $$OpenGraphOptionalTags = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$OpenGraphOptionalTags;
	const { optional } = Astro.props.openGraph;
	return renderTemplate`${optional.audio ? renderTemplate`<meta property="og:audio"${addAttribute(optional.audio, "content")}>` : null}${optional.description ? renderTemplate`<meta property="og:description"${addAttribute(optional.description, "content")}>` : null}${optional.determiner ? renderTemplate`<meta property="og:determiner"${addAttribute(optional.determiner, "content")}>` : null}${optional.locale ? renderTemplate`<meta property="og:locale"${addAttribute(optional.locale, "content")}>` : null}${optional.localeAlternate?.map((locale) => renderTemplate`<meta property="og:locale:alternate"${addAttribute(locale, "content")}>`)}${optional.siteName ? renderTemplate`<meta property="og:site_name"${addAttribute(optional.siteName, "content")}>` : null}${optional.video ? renderTemplate`<meta property="og:video"${addAttribute(optional.video, "content")}>` : null}`;
}, "/Users/mac/Downloads/PROYEK/BIZKITDEV/node_modules/astro-seo/src/components/OpenGraphOptionalTags.astro", void 0);
//#endregion
//#region node_modules/astro-seo/src/components/ExtendedTags.astro
createAstro("https://bizkitgrow.vercel.app");
var $$ExtendedTags = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ExtendedTags;
	const { props } = Astro;
	return renderTemplate`${props.extend.link?.map((attributes) => renderTemplate`<link${spreadAttributes(attributes)}>`)}${props.extend.meta?.map(({ content, httpEquiv, media, name, property }) => renderTemplate`<meta${addAttribute(name, "name")}${addAttribute(property, "property")}${addAttribute(content, "content")}${addAttribute(httpEquiv, "http-equiv")}${addAttribute(media, "media")}>`)}`;
}, "/Users/mac/Downloads/PROYEK/BIZKITDEV/node_modules/astro-seo/src/components/ExtendedTags.astro", void 0);
//#endregion
//#region node_modules/astro-seo/src/components/TwitterTags.astro
createAstro("https://bizkitgrow.vercel.app");
var $$TwitterTags = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$TwitterTags;
	const { card, site, title, creator, description, image, imageAlt } = Astro.props.twitter;
	return renderTemplate`${card ? renderTemplate`<meta name="twitter:card"${addAttribute(card, "content")}>` : null}${site ? renderTemplate`<meta name="twitter:site"${addAttribute(site, "content")}>` : null}${title ? renderTemplate`<meta name="twitter:title"${addAttribute(title, "content")}>` : null}${image ? renderTemplate`<meta name="twitter:image"${addAttribute(image, "content")}>` : null}${imageAlt ? renderTemplate`<meta name="twitter:image:alt"${addAttribute(imageAlt, "content")}>` : null}${description ? renderTemplate`<meta name="twitter:description"${addAttribute(description, "content")}>` : null}${creator ? renderTemplate`<meta name="twitter:creator"${addAttribute(creator, "content")}>` : null}`;
}, "/Users/mac/Downloads/PROYEK/BIZKITDEV/node_modules/astro-seo/src/components/TwitterTags.astro", void 0);
//#endregion
//#region node_modules/astro-seo/src/components/LanguageAlternatesTags.astro
createAstro("https://bizkitgrow.vercel.app");
var $$LanguageAlternatesTags = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$LanguageAlternatesTags;
	const { languageAlternates } = Astro.props;
	return renderTemplate`${languageAlternates.map((alternate) => renderTemplate`<link rel="alternate"${addAttribute(alternate.hrefLang, "hreflang")}${addAttribute(alternate.href, "href")}>`)}`;
}, "/Users/mac/Downloads/PROYEK/BIZKITDEV/node_modules/astro-seo/src/components/LanguageAlternatesTags.astro", void 0);
//#endregion
//#region node_modules/astro-seo/src/SEO.astro
createAstro("https://bizkitgrow.vercel.app");
var $$SEO = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$SEO;
	Astro.props.surpressWarnings = true;
	function validateProps(props) {
		if (props.openGraph) {
			if (!props.openGraph.basic || (props.openGraph.basic.title ?? void 0) == void 0 || (props.openGraph.basic.type ?? void 0) == void 0 || (props.openGraph.basic.image ?? void 0) == void 0) throw new Error("If you pass the openGraph prop, you have to at least define the title, type, and image basic properties!");
		}
		if (props.title && props.openGraph?.basic.title) {
			if (props.title == props.openGraph.basic.title && !props.surpressWarnings) console.warn("WARNING(astro-seo): You passed the same value to `title` and `openGraph.optional.title`. This is most likely not what you want. See docs for more.");
		}
		if (props.openGraph?.basic?.image && !props.openGraph?.image?.alt && !props.surpressWarnings) console.warn("WARNING(astro-seo): You defined `openGraph.basic.image`, but didn't define `openGraph.image.alt`. This is strongly discouraged.'");
	}
	validateProps(Astro.props);
	let updatedTitle = "";
	if (Astro.props.title) {
		updatedTitle = Astro.props.title;
		if (Astro.props.titleTemplate) updatedTitle = Astro.props.titleTemplate.replace(/%s/g, updatedTitle);
	} else if (Astro.props.titleDefault) updatedTitle = Astro.props.titleDefault;
	const baseUrl = Astro.site ?? Astro.url;
	const defaultCanonicalUrl = new URL(Astro.url.pathname + Astro.url.search, baseUrl);
	const canonicalHref = Astro.props.removeTrailingSlashForRoot && Astro.url.pathname === "/" ? defaultCanonicalUrl.origin + defaultCanonicalUrl.search : defaultCanonicalUrl.href;
	return renderTemplate`${updatedTitle ? renderTemplate`<title>${unescapeHTML(updatedTitle)}</title>` : null}${Astro.props.charset ? renderTemplate`<meta${addAttribute(Astro.props.charset, "charset")}>` : null}<link rel="canonical"${addAttribute(Astro.props.canonical || canonicalHref, "href")}>${Astro.props.description ? renderTemplate`<meta name="description"${addAttribute(Astro.props.description, "content")}>` : null}<meta name="robots"${addAttribute(`${Astro.props.noindex ? "noindex" : "index"}, ${Astro.props.nofollow ? "nofollow" : "follow"}${Astro.props.noarchive ? ", noarchive" : ""}${Astro.props.nocache ? ", nocache" : ""}${Astro.props.robotsExtras ? `, ${Astro.props.robotsExtras}` : ""}`, "content")}>${Astro.props.openGraph && renderTemplate`${renderComponent($$result, "OpenGraphBasicTags", $$OpenGraphBasicTags, { ...Astro.props })}`}${Astro.props.openGraph?.optional && renderTemplate`${renderComponent($$result, "OpenGraphOptionalTags", $$OpenGraphOptionalTags, { ...Astro.props })}`}${Astro.props.openGraph?.image && renderTemplate`${renderComponent($$result, "OpenGraphImageTags", $$OpenGraphImageTags, { ...Astro.props })}`}${Astro.props.openGraph?.article && renderTemplate`${renderComponent($$result, "OpenGraphArticleTags", $$OpenGraphArticleTags, { ...Astro.props })}`}${Astro.props.twitter && renderTemplate`${renderComponent($$result, "TwitterTags", $$TwitterTags, { ...Astro.props })}`}${Astro.props.extend && renderTemplate`${renderComponent($$result, "ExtendedTags", $$ExtendedTags, { ...Astro.props })}`}${Astro.props.languageAlternates && renderTemplate`${renderComponent($$result, "LanguageAlternatesTags", $$LanguageAlternatesTags, { ...Astro.props })}`}`;
}, "/Users/mac/Downloads/PROYEK/BIZKITDEV/node_modules/astro-seo/src/SEO.astro", void 0);
var system_architecture_default = {
	tenant_settings: {
		"brand_name": "bizkitgrow",
		"support_email": "support@bizkitgrow.com",
		"parent_company_copyright": "bizkitgrow Operations Global Ltd.",
		"primary_niche": "Global Digital Infrastructure & Automation"
	},
	routing_architecture: {
		"root_domain": {
			"host": "Vercel",
			"framework": "Astro v4 (ISR Mode)",
			"paths": {
				"/": "Ecosystem Hub Landing Page",
				"/esim/[country]": "Pillar 1: Programmatic Connectivity Router",
				"/reputation/[city]": "Pillar 2: Programmatic Local SEO Hub",
				"/solutions/[service_slug]": "Pillar 3: AI Business Suite Dashboard",
				"/alternatives/[software_name]": "Cross-Pillar SaaS Alternatives Hub",
				"/blog/[slug]": "AGC Article View"
			}
		},
		"fulfillment_subdomain": {
			"host": "ResellPortal_Edge",
			"dns_record": "CNAME shop.bizkitgrow.com → panel.resellportal.com",
			"base_checkout_url": "https://shop.bizkitgrow.com/checkout",
			"global_flags": {
				"test_mode": true,
				"skip_client_email": false
			}
		}
	}
};
//#endregion
export { $$SEO as n, system_architecture_default as t };
