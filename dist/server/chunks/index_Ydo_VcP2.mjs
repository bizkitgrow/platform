import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as createAstro, D as addAttribute, S as renderTemplate, T as maybeRenderHead, b as renderComponent, j as createComponent } from "./render_BR5mh6eO.mjs";
import "./compiler_CL20D8r2.mjs";
import "./global_Ddww2hr7.mjs";
import { n as posts, t as db } from "./client_BYvXqxuP.mjs";
import { t as $$AdminLayout } from "./AdminLayout_C3iOjgVF.mjs";
import { count } from "drizzle-orm";
//#region src/pages/admin/index.astro
var admin_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://bizkitgrow.vercel.app");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$Index;
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
	let totalWaitlistCount = 0;
	let totalPosts = 0;
	let successfulShares = 0;
	let feeds = [];
	let logs = [];
	try {
		totalPosts = (await db.select({ value: count() }).from(posts))[0]?.value || 0;
		totalWaitlistCount = 0;
		successfulShares = 0;
		feeds = [];
		logs = [];
	} catch (err) {
		console.error("Dashboard DB query error:", err.message);
	}
	const activeRssFeeds = feeds.length > 0 ? feeds : [{
		url: "https://news.ycombinator.com/rss",
		targetPillar: "connectivity",
		isActive: true,
		lastFetchedAt: "Seeding pending"
	}];
	const systemLogs = logs.length > 0 ? logs.map((l) => ({
		timestamp: l.createdAt ? new Date(l.createdAt).toLocaleTimeString() : "N/A",
		level: l.status,
		message: l.errorDetails || `Miner fetched ${l.itemsFetched} new items.`
	})) : [{
		timestamp: "09:22:43",
		level: "INFO",
		message: "Master Dashboard telemetry wire initialized."
	}];
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Operations Dashboard" }, { "default": async ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-gray-900 p-6 rounded-sm border border-gray-800"><div><h1 class="text-2xl font-heading font-black text-white tracking-tight uppercase">Operations Console</h1><p class="text-sm font-mono text-gray-400 mt-1 uppercase tracking-widest">Telemetry, content ingestion engines, and security hardening control panel.</p></div><div class="flex items-center gap-3"><button id="trigger-pipeline-btn" class="text-black bg-brand_cta hover:bg-brand_cta_hover font-mono font-bold rounded-sm text-xs px-5 py-2.5 transition-all uppercase tracking-widest">Run Ingestion</button><button id="trigger-digest-btn" class="py-2.5 px-5 text-xs font-mono font-bold text-gray-300 bg-gray-800 rounded-sm border border-gray-700 hover:text-white hover:bg-gray-700 transition-all uppercase tracking-widest">Generate Daily Digest</button></div></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"><div class="p-6 bg-gray-900 border border-gray-800 rounded-sm shadow-sm hover:border-gray-600 transition-colors"><div class="flex items-center justify-between mb-4"><span class="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">Total Subscribers</span><span class="bg-blue-900 text-blue-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest border border-blue-800">Waitlist</span></div><p class="text-4xl font-heading font-black text-white">${totalWaitlistCount}</p></div><div class="p-6 bg-gray-900 border border-gray-800 rounded-sm shadow-sm hover:border-gray-600 transition-colors"><div class="flex items-center justify-between mb-4"><span class="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">Ingested Posts</span><span class="bg-purple-900 text-purple-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest border border-purple-800">Articles</span></div><p class="text-4xl font-heading font-black text-white">${totalPosts}</p></div><div class="p-6 bg-gray-900 border border-gray-800 rounded-sm shadow-sm hover:border-gray-600 transition-colors"><div class="flex items-center justify-between mb-4"><span class="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">Social Shares</span><span class="bg-brand_cta/20 text-brand_cta font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest border border-brand_cta/50">Active</span></div><p class="text-4xl font-heading font-black text-brand_cta">${successfulShares}</p></div><div class="p-6 bg-gray-900 border border-gray-800 rounded-sm shadow-sm hover:border-gray-600 transition-colors"><div class="flex items-center justify-between mb-4"><span class="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">System Health</span><span class="bg-brand_cta/20 text-brand_cta font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest border border-brand_cta/50">Secure</span></div><p class="text-4xl font-heading font-black text-brand_cta">100%</p></div></div><div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><section class="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-sm p-6 sm:p-8"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"><h2 class="text-lg font-heading font-bold text-white uppercase tracking-tight">Active Content Feeds</h2><a href="/admin/rss" class="text-brand_cta hover:text-white font-mono text-xs uppercase font-bold tracking-widest transition-colors">Manage All →</a></div><div class="overflow-x-auto"><table class="w-full text-sm text-left text-gray-400 font-mono"><thead class="text-xs text-gray-500 uppercase bg-gray-800 border-b border-gray-700"><tr><th scope="col" class="px-6 py-3">Feed Source</th><th scope="col" class="px-6 py-3">Pillar</th><th scope="col" class="px-6 py-3">Status</th><th scope="col" class="px-6 py-3 text-right">Last Sync</th></tr></thead><tbody>${activeRssFeeds.map((feed) => renderTemplate`<tr class="bg-gray-900 border-b border-gray-800 hover:bg-gray-800 transition-colors"><td class="px-6 py-4 font-bold text-white max-w-xs truncate">${feed.url}</td><td class="px-6 py-4 capitalize">${feed.targetPillar || feed.pillar}</td><td class="px-6 py-4"><span class="inline-flex items-center gap-1 bg-green-900/20 text-brand_cta text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest border border-brand_cta/30"><span class="w-1.5 h-1.5 rounded-full bg-brand_cta"></span>${feed.isActive ? "ACTIVE" : "INACTIVE"}</span></td><td class="px-6 py-4 text-right">${feed.lastFetchedAt ? new Date(feed.lastFetchedAt).toLocaleTimeString() : "Never"}</td></tr>`)}</tbody></table></div><!-- Flowbite-inspired Hardening Panel --><div class="mt-8 pt-8 border-t border-gray-800"><h3 class="text-lg font-heading font-black text-white mb-4 uppercase tracking-tight">Hardening & Security Verification</h3><div id="hardening-audit-card" class="p-5 bg-gray-900 border border-gray-800 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"><div><p class="text-sm font-mono font-bold text-white uppercase tracking-widest">Supabase DB & API Security Gate</p><p id="hardening-status-desc" class="text-xs text-gray-400 mt-1 font-mono uppercase tracking-widest">Run security checklist parameters (RLS policies, key sanitization).</p></div><button id="run-audit-btn" class="py-2 px-4 rounded-sm bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 text-xs font-mono font-bold uppercase tracking-widest transition-all hover:text-white">Run Audit</button></div></div></section><!-- Automation Logs --><section class="bg-gray-900 border border-gray-800 rounded-sm p-6 sm:p-8"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"><h2 class="text-lg font-heading font-bold text-white uppercase tracking-tight">Automation Logs</h2><a href="/admin/logs" class="text-brand_cta hover:text-white font-mono text-xs uppercase font-bold tracking-widest transition-colors">View All →</a></div><div class="space-y-4">${systemLogs.map((log) => renderTemplate`<div class="text-xs border-b border-gray-800 pb-3 last:border-0 last:pb-0"><div class="flex items-center justify-between mb-1.5"><span class="text-gray-500 font-mono font-bold">${log.timestamp}</span><span${addAttribute(`px-1.5 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest border ${log.level === "SUCCESS" ? "bg-green-900/20 text-brand_cta border-brand_cta/30" : "bg-blue-900/20 text-blue-300 border-blue-800/50"}`, "class")}>${log.level}</span></div><p class="text-gray-300 font-mono">${log.message}</p></div>`)}</div></section></div><script>
    // Ingestion pipeline triggers
    const triggerBtn = document.getElementById('trigger-pipeline-btn');
    if (triggerBtn) {
      triggerBtn.addEventListener('click', async () => {
        triggerBtn.disabled = true;
        triggerBtn.textContent = 'INGESTING...';
        try {
          const res = await fetch('/api/v1/social/syndicate', { method: 'POST' });
          const data = await res.json();
          if (res.ok) {
            alert('Ingestion pipeline triggered successfully!');
            window.location.reload();
          } else {
            alert(\`Execution failed: \${data.error}\`);
          }
        } catch (err) {
          alert('Network timeout. Connection logged.');
        } finally {
          triggerBtn.disabled = false;
          triggerBtn.textContent = 'RUN INGESTION';
        }
      });
    }

    // Daily digest triggers
    const digestBtn = document.getElementById('trigger-digest-btn');
    if (digestBtn) {
      digestBtn.addEventListener('click', async () => {
        digestBtn.disabled = true;
        digestBtn.textContent = 'BUILDING...';
        try {
          const res = await fetch('/api/v1/admin/digest', { method: 'POST' });
          const data = await res.json();
          if (res.ok && data.success) {
            alert(data.message);
            window.location.reload();
          } else {
            alert(\`Digest failure: \${data.error || 'Failed'}\`);
          }
        } catch (err) {
          alert('Error generating daily digest.');
        } finally {
          digestBtn.disabled = false;
          digestBtn.textContent = 'GENERATE DAILY DIGEST';
        }
      });
    }

    // Hardening check triggers
    const auditBtn = document.getElementById('run-audit-btn');
    const hardeningDesc = document.getElementById('hardening-status-desc');
    const hardeningCard = document.getElementById('hardening-audit-card');
    
    if (auditBtn && hardeningDesc) {
      auditBtn.addEventListener('click', async () => {
        auditBtn.disabled = true;
        hardeningDesc.textContent = 'AUDITING DATABASE RLS RULES...';
        try {
          const res = await fetch('/api/v1/admin/audit');
          const data = await res.json();
          if (res.ok && data.success) {
            const { databaseConnection, rlsEnabled, apiTokenSecurity } = data.checks;
            const statusStr = \`DB CONNECTED: \${databaseConnection ? 'YES' : 'NO'} | RLS SECURE: \${rlsEnabled ? 'YES' : 'NO'} | KEY SANITIZED: \${apiTokenSecurity ? 'YES' : 'NO'}\`;
            hardeningDesc.textContent = statusStr;
            hardeningCard.classList.remove('bg-gray-900', 'border-gray-800');
            
            if (databaseConnection && rlsEnabled && apiTokenSecurity) {
              hardeningCard.classList.add('bg-green-900/20', 'border-brand_cta/50');
            } else {
              hardeningCard.classList.add('bg-rose-900/20', 'border-rose-500/50');
            }
          } else {
            hardeningDesc.textContent = 'AUDIT FAILED TO RESOLVE CHECK CRITERIA.';
          }
        } catch (err) {
          hardeningDesc.textContent = 'HARDENING CHECK OFFLINE.';
        } finally {
          auditBtn.disabled = false;
        }
      });
    }
  <\/script>` })}`;
}, "/Users/mac/Downloads/PROYEK/BIZKITDEV/src/pages/admin/index.astro", void 0);
var $$file = "/Users/mac/Downloads/PROYEK/BIZKITDEV/src/pages/admin/index.astro";
var $$url = "/admin";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/index@_@astro
var page = () => admin_exports;
//#endregion
export { page };
