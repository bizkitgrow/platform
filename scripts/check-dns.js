const dns = require('dns');
const url = require('url');
require('dotenv').config();

const checkDns = (hostname) => {
  return new Promise((resolve, reject) => {
    dns.resolve(hostname, (err, addresses) => {
      if (err) {
        reject(err);
      } else {
        resolve(addresses);
      }
    });
  });
};

async function main() {
  console.log("Checking Environment DNS Readiness...");

  // 1. Supabase DNS
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    if (!supabaseUrl) throw new Error("SUPABASE_URL is not defined in .env");
    
    const parsed = new url.URL(supabaseUrl);
    const addresses = await checkDns(parsed.hostname);
    console.log(`✅ Supabase DNS (${parsed.hostname}) resolved to: ${addresses.join(', ')}`);
  } catch (err) {
    console.error(`❌ Supabase DNS check failed: ${err.message}`);
  }

  // 2. ResellPortal DNS
  try {
    const resellDomain = process.env.RESELLPORTAL_DOMAIN || 'devhack.appserviceportal.com';
    const addresses = await checkDns(resellDomain);
    console.log(`✅ ResellPortal DNS (${resellDomain}) resolved to: ${addresses.join(', ')}`);
  } catch (err) {
    console.error(`❌ ResellPortal DNS check failed: ${err.message}`);
  }
}

main();
