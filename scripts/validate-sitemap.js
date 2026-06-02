// scripts/validate-sitemap.js
// This script reads public/sitemap.xml, checks each URL for HTTP 200, removes any that return 404 or are the sitemap itself, and writes a cleaned sitemap.
import fs from 'fs';
import path from 'path';
import https from 'https';
import { URL } from 'url';

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
  const urlRegex = /<loc>([^<]+)<\/loc>/g;
  const urls = [];
  let match;
  while ((match = urlRegex.exec(raw)) !== null) {
    urls.push(match[1]);
  }
  const keepUrls = [];
  for (const u of urls) {
    if (u === 'https://www.calculatorverse.in/sitemap.xml') {
      console.log('Removing self-reference sitemap URL');
      continue;
    }
    const status = await fetchStatus(u);
    console.log(`${u} -> ${status}`);
    if (status === 200) {
      keepUrls.push(u);
    } else {
      console.log(`Removing URL ${u} (status ${status})`);
    }
  }
  // Build new sitemap XML
  const header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const footer = '</urlset>\n';
  const entries = keepUrls.map((u) => `  <url>\n    <loc>${u}</loc>\n  </url>`).join('\n');
  const newContent = header + entries + '\n' + footer;
  fs.writeFileSync(outputPath, newContent, 'utf8');
  console.log('Cleaned sitemap written to', outputPath);
}

main();
