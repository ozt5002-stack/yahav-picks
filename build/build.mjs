// Builds the static site into dist/.
//   node build/build.mjs                      live data, published products only
//   node build/build.mjs --fixture data/x.json --drafts   local preview incl. drafts
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { parseArgs } from 'node:util';
import { loadRecords, toProduct, missingFields, fingerprint } from './airtable.mjs';
import { processPhoto, processLocal } from './images.mjs';
import { indexPage, productPage, privacyPage, accessibilityPage, notFoundPage, productPath } from './templates.mjs';
import { SITE_URL, NEW_DAYS } from './config.mjs';

const { values: args } = parseArgs({
  options: {
    fixture: { type: 'string' },
    drafts: { type: 'boolean', default: false },
    out: { type: 'string', default: 'dist' },
  },
});
const OUT = args.out;
const preview = args.drafts;

async function write(rel, content) {
  const file = path.join(OUT, rel);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content);
}

async function assets() {
  await fs.cp('src/fonts', path.join(OUT, 'assets/fonts'), { recursive: true, filter: (f) => !f.endsWith('.css') });
  const fonts = (await fs.readFile('src/fonts/fonts.css', 'utf8')).replaceAll('url(/fonts/', 'url(fonts/');
  const css = fonts + '\n' + (await fs.readFile('src/styles.css', 'utf8'));
  const js = (await fs.readFile('src/app.js', 'utf8')).replace('__NEW_DAYS__', String(NEW_DAYS));
  await write('assets/styles.css', css);
  await write('assets/app.js', js);
  await fs.copyFile('src/icon.svg', path.join(OUT, 'assets/icon.svg'));
  return crypto.createHash('sha1').update(css + js).digest('hex').slice(0, 8);
}

const records = await loadRecords({ fixture: args.fixture });
const all = records.map(toProduct).filter((p) => p.name && p.code);
for (const p of all) p.missing = missingFields(p);

let products = all.filter((p) => preview || p.published);
for (const p of products.filter((x) => x.published && x.missing.length)) {
  console.warn(`skip #${p.code} ${p.name}: missing ${p.missing.join(', ')}`);
}
if (!preview) products = products.filter((p) => !p.missing.length);

products.sort((a, b) =>
  (b.featured - a.featured) || (b.created || '').localeCompare(a.created || '') || a.code - b.code);

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });
const assetVersion = await assets();

for (const p of products) {
  if (!p.photo) continue;
  try {
    p.img = await processPhoto(p.photo, `p${p.code}`, OUT);
  } catch (err) {
    console.warn(`photo failed for #${p.code}: ${err.message}`);
    if (!preview) p.missing.push('תמונה');
  }
}
if (!preview) products = products.filter((p) => p.img);

const local = await processLocal('src/img/yahav-src.jpg', 'yahav', OUT);
const updated = new Intl.DateTimeFormat('he-IL', { month: 'long', year: 'numeric', timeZone: 'Asia/Jerusalem' }).format(new Date());
const ctx = { preview, assetVersion, portrait: local.portrait, siteOg: local.og, updated };

await write('index.html', indexPage(products, ctx));
for (const p of products) await write(productPath(p) + 'index.html', productPage(p, ctx));
await write('privacy/index.html', privacyPage(ctx));
await write('accessibility/index.html', accessibilityPage(ctx));
await write('404.html', notFoundPage(ctx));
await write('.nojekyll', '');
await write('robots.txt', preview
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
const urls = ['', 'privacy/', 'accessibility/', ...products.map(productPath)];
await write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE_URL}/${u}</loc></url>`).join('\n')}\n</urlset>\n`);

const hash = fingerprint(products);
await write('build.json', JSON.stringify({ hash, products: products.length, builtAt: new Date().toISOString() }, null, 2));
console.log(`built ${products.length} products${preview ? ' (preview, drafts included)' : ''} into ${OUT}/`);
console.log(`data hash ${hash}`);
if (process.env.GITHUB_OUTPUT) await fs.appendFile(process.env.GITHUB_OUTPUT, `hash=${hash}\n`);
