// generate-sitemap.js
// Node script (ESM) to generate a static sitemap.xml for the calculator website.
// It reads the calculator registry and creates entries for each calculator, category, homepage, and sitemap itself.
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the registry file (relative to this script)
const registryPath = path.join(__dirname, '..', 'src', 'data', 'registry.js');

(async () => {
  try {
    const registryModule = await import(pathToFileURL(registryPath).href);
    const { calculatorsRegistry } = registryModule;
    const baseUrl = 'https://www.calculatorverse.in';
    const urls = new Set();
    // Home page
    urls.add(`${baseUrl}/`);
    // Collect calculator URLs and categories
    const categories = new Set();
    for (const key in calculatorsRegistry) {
      const calc = calculatorsRegistry[key];
      if (calc.slug) {
        urls.add(`${baseUrl}/${calc.slug}`);
      }
      if (calc.category) {
        categories.add(calc.category);
      }
    }
    // Category pages (lower‑case, hyphen‑separated)
    for (const cat of categories) {
      const catSlug = cat.toLowerCase().replace(/\s+/g, '-');
      urls.add(`${baseUrl}/category/${catSlug}`);
    }
    // Include the sitemap itself (so Google can discover it if needed)
    urls.add(`${baseUrl}/sitemap.xml`);

    // Build XML content
    const sitemapLines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ];
    for (const u of urls) {
      sitemapLines.push('  <url>', `    <loc>${u}</loc>`, '  </url>');
    }
    sitemapLines.push('</urlset>');
    const sitemapContent = sitemapLines.join('\n');

    // Write to the public folder
    const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(outPath, sitemapContent, 'utf8');
    console.log('✅ Sitemap generated at', outPath);
  } catch (err) {
    console.error('❌ Failed to generate sitemap:', err);
    process.exit(1);
  }
})();
