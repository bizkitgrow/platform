const fs = require('node:fs');
const path = require('node:path');

const functionsDir = path.join(process.cwd(), '.vercel', 'output', 'functions');

function fixRuntime(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixRuntime(fullPath);
    } else if (file === '.vc-config.json') {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const json = JSON.parse(content);
        if (json.runtime && json.runtime !== 'nodejs24.x') {
          console.log(
            `[fix-vercel-runtime] Overriding runtime ${json.runtime} -> nodejs24.x in ${fullPath}`,
          );
          json.runtime = 'nodejs24.x';
          fs.writeFileSync(fullPath, JSON.stringify(json, null, 2), 'utf8');
        }
      } catch (err) {
        console.error(`[fix-vercel-runtime] Error processing ${fullPath}:`, err);
      }
    }
  }
}

fixRuntime(functionsDir);
console.log('[fix-vercel-runtime] Done.');
