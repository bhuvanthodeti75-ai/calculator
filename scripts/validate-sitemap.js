// scripts/validate-sitemap.js
// This script reads public/sitemap.xml, checks each URL for HTTP 200, removes any that return 404, 301, 302, 500 or are the sitemap itself, and writes a cleaned sitemap.
import fs from 'fs';
import path from 'path';
import https from 'https';

const sitemapPath = path.resolve('public', 'sitemap.xml');
const outputPath = sitemapPath; // overwrite

function fetchStatus(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      // consume data to end
      res.resume();
      resolve(res.statusCode);
    });
    req.on('error', (e) => {
      resolve(null);
    });
    req.setTimeout(5000, () => {
      req.abort();
      resolve(null);
    });
  });
}

async function main() {
  const raw = fs.readFileSync(sitemapPath, 'utf8');
  
  // Match entire <url>...</url> blocks
  const urlRegex = /<url>[\s\S]*?<\/url>/g;
  const blocks = [];
  let match;
  while ((match = urlRegex.exec(raw)) !== null) {
    blocks.push(match[0]);
  }
  
  const keepBlocks = [];
  for (const block of blocks) {
    // Extract loc from block
    const locMatch = /<loc>([^<]+)<\/loc>/.exec(block);
    if (!locMatch) continue;
    
    const u = locMatch[1];
    
    if (u.includes('sitemap.xml')) {
      console.log('Removing self-reference sitemap URL');
      continue;
    }
    
    const status = await fetchStatus(u);
    console.log(`${u} -> ${status}`);
    
    if (status === 200) {
      keepBlocks.push(block);
    } else {
      console.log(`Removing URL ${u} (status ${status})`);
    }
  }
  
  // Build new sitemap XML
  const header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const footer = '</urlset>';
  const newContent = header + keepBlocks.join('\n') + '\n' + footer;
  
  fs.writeFileSync(outputPath, newContent, 'utf8');
  console.log('Cleaned sitemap written to', outputPath);
}

main();
