// generate-sitemap.js
// Node script (ESM) to generate a static sitemap.xml for the calculator website.
// Includes lastmod, changefreq, and priority per official sitemap protocol.
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const registryPath = path.join(__dirname, '..', 'src', 'data', 'registry.js');

(async () => {
  try {
    const registryModule = await import(pathToFileURL(registryPath).href);
    const { calculatorsRegistry } = registryModule;
    const baseUrl = 'https://www.calculatorverse.in';
    const urls = [];
    const today = new Date().toISOString().split('T')[0];

    // Homepage
    urls.push({
      loc: `${baseUrl}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: '1.0'
    });

    const categories = new Set();
    
    // Calculators
    for (const key in calculatorsRegistry) {
      const calc = calculatorsRegistry[key];
      if (calc.slug) {
        urls.push({
          loc: `${baseUrl}/${calc.slug}`,
          lastmod: today,
          changefreq: 'weekly',
          priority: '0.8'
        });
      }
      if (calc.category) {
        categories.add(calc.category);
      }
    }

    // Category Pages
    for (const cat of categories) {
      const catSlug = cat.toLowerCase().replace(/\s+/g, '-');
      urls.push({
        loc: `${baseUrl}/category/${catSlug}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: '0.9'
      });
    }

    // Include any other static pages if needed
    // sitemap.xml itself is EXCLUDED by requirement.

    // Build XML content
    const sitemapLines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ];
    
    for (const u of urls) {
      sitemapLines.push('  <url>');
      sitemapLines.push(`    <loc>${u.loc}</loc>`);
      sitemapLines.push(`    <lastmod>${u.lastmod}</lastmod>`);
      sitemapLines.push(`    <changefreq>${u.changefreq}</changefreq>`);
      sitemapLines.push(`    <priority>${u.priority}</priority>`);
      sitemapLines.push('  </url>');
    }
    
    sitemapLines.push('</urlset>');
    const sitemapContent = sitemapLines.join('\n');

    // Write to public folder
    const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(outPath, sitemapContent, 'utf8');
    console.log('✅ Sitemap generated successfully at', outPath);
    console.log(`Included ${urls.length} valid URLs.`);
  } catch (err) {
    console.error('❌ Failed to generate sitemap:', err);
    process.exit(1);
  }
})();
