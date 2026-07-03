import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_Ct1D8fTo.mjs';
import { manifest } from './manifest_CIkdOFVk.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/payment/duitku-callback.astro.mjs');
const _page2 = () => import('./pages/api/revalidate.astro.mjs');
const _page3 = () => import('./pages/api/waiting-list.astro.mjs');
const _page4 = () => import('./pages/blog/_slug_.astro.mjs');
const _page5 = () => import('./pages/esim/_country_.astro.mjs');
const _page6 = () => import('./pages/reputation/_city_.astro.mjs');
const _page7 = () => import('./pages/solutions/_service_slug_.astro.mjs');
const _page8 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/payment/duitku-callback.ts", _page1],
    ["src/pages/api/revalidate.ts", _page2],
    ["src/pages/api/waiting-list.ts", _page3],
    ["src/pages/blog/[slug].astro", _page4],
    ["src/pages/esim/[country].astro", _page5],
    ["src/pages/reputation/[city].astro", _page6],
    ["src/pages/solutions/[service_slug].astro", _page7],
    ["src/pages/index.astro", _page8]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "f8580622-e866-44da-a7a5-196bf6e503c6",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
