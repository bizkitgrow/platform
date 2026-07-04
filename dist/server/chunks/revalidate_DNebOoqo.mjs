import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
//#region src/pages/api/revalidate.ts
var revalidate_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	dynamic: () => dynamic,
	prerender: () => false
});
var dynamic = "force-dynamic";
var POST = async ({ request }) => {
	try {
		const { path } = await request.json();
		return new Response(JSON.stringify({
			revalidated: true,
			targeted: path
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (e) {
		return new Response(JSON.stringify({ error: e.message }), { status: 400 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/revalidate@_@ts
var page = () => revalidate_exports;
//#endregion
export { page };
